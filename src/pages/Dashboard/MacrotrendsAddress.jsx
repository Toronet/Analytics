import React, {useEffect, useState} from 'react';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { useQueries } from '@tanstack/react-query';
import { IconCalendarStats, IconAlertCircle, IconSearch } from '@tabler/icons';
import { Alert, Title, Stack, Card, Text, Button, TextInput, LoadingOverlay, createStyles, useMantineTheme, Grid } from '@mantine/core';

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
        width: theme.spacing.xl * 8,
        height: theme.spacing.xl * 8,
        objectFit: 'contain',
        filter: 'grayscale(1)',
        opacity: '.5'
    },
    divider: {
        width: '80%',
        height: '1px',
        backgroundColor: theme.colors.gray[1]
    }
}))

const MacrotrendsAddress = () => { 
    const [trigger, setTrigger] = useState(false);
    
    const { classes } = useStyles();
    const theme = useMantineTheme();

    const form = useForm({
        initialValues: {
            addr: '',
            startDate: new Date('2022-08-01'),
            endDate: new Date(),
        },
        validate: {
            addr: (value) => (value ? null : 'Address is required'),
            startDate: (value) => (value ? null : 'Start date is required'),
            endDate: (value) => (value ? null : 'End date is required'),
        }
    });

    const { startDate, endDate, addr }  = form.values;

    const [totalCountSums, deposits, withdrawals] = useQueries({
        queries: [
            {
                queryKey: ['macrotrends-count-sum'], 
                queryFn: () => getTransactionCountSumsAddrEspees({
                    startDate: new Date(startDate).toLocaleDateString('fr-CA'), 
                    endDate: new Date(endDate).toLocaleDateString('fr-CA'),
                    addr: addr 
                }),
                enabled: false,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['macrotrends-deposits'], 
                queryFn: () => getTransactionCountSumsAddrInEspees({
                    startDate: new Date(startDate).toLocaleDateString('fr-CA'), 
                    endDate: new Date(endDate).toLocaleDateString('fr-CA'),
                    addr: addr
                }),
                enabled: false,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: ['macrotrends-withdrawals'], 
                queryFn: () => getTransactionCountSumsAddrOutEspees({
                    startDate: new Date(startDate).toLocaleDateString('fr-CA'), 
                    endDate: new Date(endDate).toLocaleDateString('fr-CA'),
                    addr: addr
                }),
                enabled: false,
                refetchOnWindowFocus: false,
            },
        ]
    });

    const handleSubmit = (_values) => {
        totalCountSums.refetch();
        deposits.refetch();
        withdrawals.refetch();
    };

    const isLoading = (totalCountSums.fetchStatus === 'fetching' || deposits.fetchStatus === 'fetching' || withdrawals.fetchStatus === 'fetching');

    return (
        <Layout title="Macrotrends detail">
            <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title="Realtime Updates" color="gray" radius="md">
                All transactions listed are polled every minute per session. This keeps your 
                Toronet metrics & performance data accurate at any giving time.
            </Alert>

            <div className={classes.formWrapper}>
                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                    <Grid>
                        <Grid.Col span={3}>
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
                        <Grid.Col span={3}>
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
                        <Grid.Col span={3}>
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
                        <Grid.Col span={3}>
                            <Button 
                                variant='filled' 
                                type="submit" 
                                size="md" 
                                fullWidth
                                mt="xl" 
                                loading={isLoading}
                                leftIcon={<IconSearch size={18} />}
                            >
                                <Text size="sm" span>Query address</Text>
                            </Button>
                        </Grid.Col>
                    </Grid>
                </form>
            </div>

            <Grid mt="xl">
                <Grid.Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    {(totalCountSums.data && totalCountSums.data.data) ? (
                        <div style={{position: 'relative'}}>
                            <Grid>
                                <Grid.Col span={6}>
                                    <Card p="xl" withBorder radius="lg">
                                        <Stack align="center">
                                            <div className={classes.icons}>
                                                <IconCalendarStats color={theme.colors.green[7]} />
                                            </div>
                                            <div>
                                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                                    Transaction Count
                                                </Title>
                                                <Title mt="sm" order={2} weight={900} color={theme.colors.green[7]} align="center">
                                                    {totalCountSums.data.data[0]?.Count?.toLocaleString()}
                                                </Title>
                                            </div>
                                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                                Total count of transactions.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>

                                <Grid.Col span={6}>
                                    <Card p="xl" withBorder radius="lg">
                                        <Stack align="center">
                                            <div className={classes.icons}>
                                                <IconCalendarStats color={theme.colors.green[7]} />
                                            </div>
                                            <div>
                                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                                    Transaction Sum
                                                </Title>
                                                <Title mt="sm" order={2} weight={900} color={theme.colors.green[7]} align="center">
                                                    {totalCountSums.data.data[0]?.Sum?.toLocaleString()} <Text span tt="uppercase" size="md">Espees</Text>
                                                </Title>
                                            </div>
                                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                                Total sum of transactions
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            </Grid>

                            <LoadingOverlay visible={totalCountSums.status === 'loading'} overlayBlur={2} />
                        </div>
                    ) : (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                            <img className={classes.empty} src={empty} alt="empty" />
                            <Title order={4} mb="sm" color={theme.colors.red[7]} weight={700}>
                                {!addr ? 'Address is required' : 'Transaction data not found.'}
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]}>
                                We could not retrive the data needed for this page. Please
                                check your request and try again.
                            </Text>

                            {totalCountSums.fetchStatus === 'fetching' && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card> 
                    )}
                </Grid.Col>

                <Grid.Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    {deposits.data && deposits.data.data ? (
                        <div style={{position: 'relative'}}>
                            <Grid>
                                <Grid.Col span={6}>
                                    <Card p="xl" withBorder radius="lg">
                                        <Stack align="center">
                                            <div className={classes.icons}>
                                                <IconCalendarStats color={theme.colors.green[7]} />
                                            </div>
                                            <div>
                                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                                    Deposit count
                                                </Title>
                                                <Title mt="sm" order={2} weight={900} color={theme.colors.green[7]} align="center">
                                                    {deposits.data.data[0]?.Count?.toLocaleString()}
                                                </Title>
                                            </div>
                                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                                Total count of deposits made.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Card p="xl" withBorder radius="lg">    
                                        <Stack align="center">
                                            <div className={classes.icons}>
                                                <IconCalendarStats color={theme.colors.green[7]} />
                                            </div>
                                            <div>
                                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                                    Deposit sum
                                                </Title>
                                                <Title mt="sm" order={2} weight={900} color={theme.colors.green[7]} align="center">
                                                    {deposits.data.data[0]?.Sum?.toLocaleString() ?? 0} <Text span tt="uppercase" size="md">Espees</Text>
                                                </Title>
                                            </div>
                                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                                Total sum of deposits made.
                                            </Text>
                                        </Stack>
                                    </Card>
                                </Grid.Col>
                            </Grid>

                            <LoadingOverlay visible={deposits.status === 'loading'} overlayBlur={2} />
                        </div>
                    ) : (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                            <img className={classes.empty} src={empty} alt="empty" />
                            <Title order={4} mb="sm" color={theme.colors.red[7]} weight={700}>
                                {!addr ? 'Address is required' : 'Deposits data not found.'}
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]}>
                                We could not retrive the data needed for this page. Please
                                check your request and try again.
                            </Text>

                            {deposits.fetchStatus === 'fetching' && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card> 
                    )}
                </Grid.Col>

                <Grid.Col xl={12} lg={12} md={12} sm={12} xs={12}>
                    {withdrawals.data && withdrawals.data.data ? (
                        <div style={{position: 'relative'}}>
                            <Grid>
                                <Grid.Col span={6}>
                                    <Card p="xl" withBorder radius="lg">
                                        <Stack align="center">
                                            <div className={classes.icons}>
                                                <IconCalendarStats color={theme.colors.green[7]} />
                                            </div>
                                            <div>
                                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                                    Withdrawal count
                                                </Title>
                                                <Title mt="sm" order={2} weight={900} color={theme.colors.green[7]} align="center">
                                                    {withdrawals.data.data[0]?.Count?.toLocaleString()}
                                                </Title>
                                            </div>
                                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                                Total withdrawal count.
                                            </Text>
                                        </Stack>
                                    </Card>  
                                </Grid.Col>
                                <Grid.Col span={6}>
                                    <Card p="xl" withBorder radius="lg">
                                        <Stack align="center">
                                            <div className={classes.icons}>
                                                <IconCalendarStats color={theme.colors.green[7]} />
                                            </div>
                                            <div>
                                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                                    Withdrawal sum
                                                </Title>
                                                <Title mt="sm" order={2} weight={900} color={theme.colors.green[7]} align="center">
                                                    {withdrawals.data.data[0]?.Sum?.toLocaleString()} <Text span tt="uppercase" size="md">Espees</Text>
                                                </Title>
                                            </div>
                                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                                Total withdrawal sum.
                                            </Text>
                                        </Stack>
                                    </Card>  
                                </Grid.Col>
                            </Grid>

                            <LoadingOverlay visible={withdrawals.status === 'loading'} overlayBlur={2} />
                        </div>
                    ) : (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                            <img className={classes.empty} src={empty} alt="empty" />
                            <Title order={4} mb="sm" color={theme.colors.red[7]} weight={700}>
                                {!addr ? 'Address is required' : 'Withdrawal data not found.'}
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]}>
                                We could not retrive the data needed for this page. Please
                                check your request and try again.
                            </Text>

                            {withdrawals.fetchStatus === 'fetching' && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card> 
                    )}
                </Grid.Col>
            </Grid>
        </Layout>
    )
}

export default MacrotrendsAddress