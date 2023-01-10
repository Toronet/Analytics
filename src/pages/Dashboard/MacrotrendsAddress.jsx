import React, {useState} from 'react';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { useQueries } from '@tanstack/react-query';
import { IconCalendarStats, IconAlertCircle, IconSearch } from '@tabler/icons';
import { Alert, Title, Stack, Card, Text, TextInput, Button, LoadingOverlay, createStyles, useMantineTheme, Grid } from '@mantine/core';

import empty from '../../assets/empty.png';
import Layout from '../../components/Layout';

import { getTransactionCountSumsAddrEspees, getTransactionCountSumsAddrInEspees, getTransactionCountSumsAddrOutEspees } from '../../services/macrotrends';

const useStyles = createStyles((theme) => ({
    formWrapper: {
        marginBottom: '2rem'
    },
    icons: {
        width: theme.spacing.xl * 2,
        height: theme.spacing.xl * 2,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.green[0],
    },
    emptyWrapper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    empty: {
        width: theme.spacing.xl * 15,
        height: theme.spacing.xl * 10,
        objectFit: 'contain',
        filter: 'grayscale(1)',
        opacity: '.5'
    }
}))

const MacrotrendsAddress = () => { 
    const [trigger, setTrigger] = useState(false);
    
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const form = useForm({
        initialValues: {
            addr: '',
            startDate: '',
            endDate: new Date(),
        },
        validate: {
            addr: (value) => (value ? null : 'Address is required'),
            startDate: (value) => (value ? null : 'Start date is required'),
            endDate: (value) => (value ? null : 'End date is required'),
        }
    });

    const [totalCountSums, deposits, withdrawals] = useQueries({
        queries: [
            {
                queryKey: ['macrotrends-count-sum', trigger], 
                queryFn: () => getTransactionCountSumsAddrEspees({
                    startDate: new Date(form.values.startDate).toLocaleDateString('fr-CA'), 
                    endDate: new Date(form.values.endDate).toLocaleDateString('fr-CA'),
                    addr: form.values.addr
                }),
                enabled: trigger
            },
            {
                queryKey: ['macrotrends-deposits', trigger], 
                queryFn: () => getTransactionCountSumsAddrInEspees({
                    startDate: new Date(form.values.startDate).toLocaleDateString('fr-CA'), 
                    endDate: new Date(form.values.endDate).toLocaleDateString('fr-CA'),
                    addr: form.values.addr
                }),
                enabled: trigger
            },
            {
                queryKey: ['macrotrends-withdrawals', trigger], 
                queryFn: () => getTransactionCountSumsAddrOutEspees({
                    startDate: new Date(form.values.startDate).toLocaleDateString('fr-CA'), 
                    endDate: new Date(form.values.endDate).toLocaleDateString('fr-CA'),
                    addr: form.values.addr
                }),
                enabled: trigger
            },
        ]
    });

    const handleSubmit = (_values) => {
        setTrigger(true);
    };

    return (
        <Layout title="Macrotrends detail">
            <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title="Realtime Updates" color="gray" radius="md">
                All transactions listed are polled every minute per session. This keeps your 
                Toronet metrics & performance data accurate at any giving time.
            </Alert>

            <div className={classes.formWrapper}>
                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                    <Grid>
                        <Grid.Col xl={3} lg={3} md={3} sm={6} xs={12}>
                            <TextInput
                                withAsterisk
                                label={
                                    <Text component="label" size="sm" color={theme.colors.gray[7]}>
                                        Address
                                    </Text>
                                }
                                size='md'
                                placeholder="0x160166dbc33c0cdcd8a3898635d39c729204548d"
                                {...form.getInputProps('addr')}
                            />
                        </Grid.Col>
                        <Grid.Col xl={3} lg={3} md={3} sm={6} xs={12}>
                            <DatePicker 
                                withAsterisk 
                                dropdownPosition="bottom-start"
                                placeholder='Please select a start date'
                                label={
                                    <Text component="label" size="sm" color={theme.colors.gray[7]}>
                                        Start date
                                    </Text>
                                } 
                                size="md" 
                                {...form.getInputProps('startDate')} 
                            />
                        </Grid.Col>
                        <Grid.Col xl={3} lg={3} md={3} sm={6} xs={12}>
                            <DatePicker 
                                withAsterisk 
                                dropdownPosition="bottom-start"
                                label={
                                    <Text component="label" size="sm" color={theme.colors.gray[7]}>
                                        End date
                                    </Text>
                                } 
                                size="md" 
                                {...form.getInputProps('endDate')} 
                            />
                        </Grid.Col>
                        <Grid.Col xl={3} lg={3} md={3} sm={6} xs={12}>
                            <Button 
                                variant='filled' 
                                type="submit" 
                                size="md" 
                                fullWidth
                                mt="xl" 
                                leftIcon={<IconSearch size={18} />}
                            >
                                <Text size="sm" span>Query address</Text>
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </div>

            {(totalCountSums.data || deposits.data || withdrawals.data) ? (
                <Grid mt="xl">
                    <Grid.Col xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                            <Stack align="center">
                                <div className={classes.icons}>
                                    <IconCalendarStats color={theme.colors.green[7]} />
                                </div>
                                <Title order={2} weight={900} color={theme.colors.green[7]}>
                                    {totalCountSums.data && totalCountSums.data.data[0].Count?.toLocaleString()}
                                </Title>
                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                    Count & Sum
                                </Title>
                                <Text size="sm" color={theme.colors.gray[7]} align="center">
                                    Total count of transactions for the selected date range.
                                </Text>
                            </Stack>

                            <LoadingOverlay visible={totalCountSums.status === 'loading'} overlayBlur={2} />
                        </Card>
                    </Grid.Col>
                    <Grid.Col xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                            <Stack align="center">
                                <div className={classes.icons}>
                                    <IconCalendarStats color={theme.colors.green[7]} />
                                </div>
                                <Title order={2} weight={900} color={theme.colors.green[7]}>
                                    {deposits.data && deposits.data.data[0].Count?.toLocaleString()}
                                </Title>
                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                    Deposits
                                </Title>
                                <Text size="sm" color={theme.colors.gray[7]} align="center">
                                    Total count of transactions for the selected date range.
                                </Text>
                            </Stack>

                            <LoadingOverlay visible={deposits.status === 'loading'} overlayBlur={2} />
                        </Card>
                    </Grid.Col>
                    <Grid.Col xl={4} lg={4} md={4} sm={12} xs={12}>
                        <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                            <Stack align="center">
                                <div className={classes.icons}>
                                    <IconCalendarStats color={theme.colors.green[7]} />
                                </div>
                                <Title order={2} weight={900} color={theme.colors.green[7]}>
                                    {withdrawals.data && withdrawals.data.data[0].Count?.toLocaleString()}
                                </Title>
                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                    Withdrawals
                                </Title>
                                <Text size="sm" color={theme.colors.gray[7]} align="center">
                                    Total count of transactions for the selected date range.
                                </Text>
                            </Stack>

                            <LoadingOverlay visible={withdrawals.status === 'loading'} overlayBlur={2} />
                        </Card>
                    </Grid.Col>
                </Grid>
            ) : (
                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                    <img className={classes.empty} src={empty} alt="empty" />
                    <Title order={4} mb="sm" color={theme.colors.gray[7]} weight={700}>No search results!</Title>
                    <Text size="sm" color={theme.colors.gray[7]}>
                        Provide the requested details to begin your query.
                    </Text>
                </Card>
            )}
        </Layout>
    )
}

export default MacrotrendsAddress