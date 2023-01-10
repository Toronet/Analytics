import React from 'react';
import { useForm } from '@mantine/form';
//import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Title, Text, Card, Stack, Button, TextInput, PasswordInput, createStyles, useMantineTheme } from '@mantine/core';

import brand from '../assets/toronet-alt.png';

import { loginUser, verifyUser } from '../services/auth';
import { showError, storage_key } from '../helpers/app';

//@: 0x160166dbc33c0cdcd8a3898635d39c729204548d

const useStyles = createStyles((theme, _params, _getRef) => ({
    container: {
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '50vh',
        zIndex: -1,
        backgroundColor: theme.colors.gray[0],
    },
    wrapper: {
        width: 'min(28rem, 80%)',
    },
    brand: {
        display: 'block',
        width: '10rem',
        height: '4rem',
        objectFit: 'contain',
        margin: '0 auto',
        //filter: 'grayscale(1)',
    }
}));

const Login = () => {
    const { classes } = useStyles();
    const theme = useMantineTheme();
    //const navigate = useNavigate();

    // React.useEffect(() => {
    //     if(session){
    //         navigate('/dashboard');
    //     }
    // },[session]);

    const form = useForm({
        initialValues: {
            address: '',
            password: '',
        },
        validate: {
            address: (value) => (value ? null : 'Toronet address is required'),
            password: (value) => (value ? null : 'Toronet password is required')
        }
    });

    const addrMutation = useMutation({
        mutationFn: (address) => loginUser(address),
        onError: (error, _variables, _context) => {
            showError(error, 'An error occurred processing this request.');
        },
        onSuccess: async (data, _variables, _context) => {
            const payload = {
                address: form.values.address, 
                password: form.values.password
            };
            if(data.result){
                pwdMutation.mutate(payload);
            }
            else showError(data.error, 'Invalid address. Check your address and try again.');
        },
    });

    const pwdMutation = useMutation({
        mutationFn: (payload) => verifyUser(payload),
        onError: (error, _variables, _context) => {
            showError(error, 'An error occurred processing this request.')
        },
        onSuccess: async (data, _variables, _context) => {
            if(data.result){
                const session = JSON.stringify({
                    user: form.values.address,
                    timestamp: new Date().toDateString()
                });
                localStorage.setItem(storage_key, session);
                window.location.reload();
            }
            else showError(data.error, 'Invalid address or password.');
        },
    })

    const handleSubmit = (values) => {
        addrMutation.mutate(values.address);
    }

    return (
        <section className={classes.container}>
            <div className={classes.wrapper}>
                <img className={classes.brand} src={brand} alt="toronet" />
 
                <Card p="xl" mt="xl" shadow="md">
                    <Title order={3} weight={800} align="center" my="xl" color={theme.colors.gray[7]}>
                        Analytics.
                    </Title>

                    <Text size="sm" color={theme.colors.gray[6]} align="center" mb="xl">
                        Sign in using your Toronet address to get useful 
                        analytic metrics and performance reports on your account.
                    </Text>

                    <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                        <Stack spacing="lg">
                            <TextInput
                                withAsterisk
                                label={
                                    <Text component="label" size="sm" color={theme.colors.gray[7]}>
                                        Address
                                    </Text>
                                }
                                size='md'
                                placeholder="0x160166dbc33c0cdcd8a3898635d39c729204548d"
                                {...form.getInputProps('address')}
                            />

                            <PasswordInput
                                withAsterisk
                                placeholder='********'
                                size="md"
                                label={
                                    <Text component='label' size="sm" color={theme.colors.gray[7]}>
                                        Password
                                    </Text>
                                }
                                {...form.getInputProps('password')}
                            />

                            <Button 
                                variant='filled' 
                                type="submit" 
                                size="md" 
                                my="xl" 
                                fullWidth 
                                loading={addrMutation.isLoading || pwdMutation.isLoading}
                            >
                                <Text size="sm" span>Continue</Text>
                            </Button>
                        </Stack>
                    </form>
                </Card>
            </div>

            <div className={classes.bg} />
        </section>
    )
}

export default Login;