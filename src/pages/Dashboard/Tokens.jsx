import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { useQueries, useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconCalendarStats, IconAlertCircle, IconCalendarTime, IconCalendar, IconSearch } from '@tabler/icons';
import { Grid, Card, Stack, Title, Text, Alert, NumberInput, Space, Button, SegmentedControl, LoadingOverlay, createStyles, useMantineTheme, Group } from '@mantine/core';

import Layout from '../../components/Layout';
import DailyChart from '../../components/Reports/DailyReport';
import HourlyReport from '../../components/Reports/HourlyReport';
import MonthlyReport from '../../components/Reports/MonthlyReport';

import empty from '../../assets/empty.png';

import { getDailyEspeesTransactions, getHourlyEspeesTransactions, getMonthlyEspeesTransactions, getEspeesTransactionsCountByRange } from '../../services/transactions';

const useStyles = createStyles((theme, _params, _getRef) => ({
    icons: {
        width: theme.spacing.xl * 2,
        height: theme.spacing.xl * 2,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.green[0],
    },
    iconsBlue: {
        backgroundColor: theme.colors.blue[0]
    },
    iconsOrange: {
        backgroundColor: theme.colors.pink[0]
    },
    section: {
        margin: `${theme.spacing.xl * 2}px 0`,
    },
    card: {
        minHeight: 300,
        position: 'relative'
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
    }
}));

const Tokens = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useMantineTheme();
    const { classes, cx } = useStyles();

    const [days, setDays] = useState('30');
    const [hours, setHours] = useState('12');
    const [months, setMonths] = useState('3');

    const form = useForm({
        initialValues: {
            startDate: new Date('2022-08-01'),
            endDate: new Date(),
        },
        validate: {
            startDate: (value) => (value ? null : 'Start date is required'),
            endDate: (value) => (value ? null : 'End date is required'),
            amountStart: (value) => ((value || value === 0) ? null : "Start range is required"),
            amountEnd: (value) => (value ? null : "End range is required")
        }
    });

    const [dailyData, hourlyData, monthlyData] = useQueries({
        queries: [
            {
                queryKey: ['day-esps-tnx', days], 
                queryFn: () => getDailyEspeesTransactions(Number(days)),
                enabled: !!days
            },
            {
                queryKey: ['hour-esps-tnx', hours], 
                queryFn: () => getHourlyEspeesTransactions(Number(hours)),
                enabled: !!hours
            },
            {
                queryKey: ['month-esps-tnx', months], 
                queryFn: () => getMonthlyEspeesTransactions(Number(months)),
                enabled: !!months
            },
        ]
    });

    const mutation = useMutation({
        mutationFn: (payload) => getEspeesTransactionsCountByRange(payload),
        onError: (error) => {},
        onSuccess: (data) => {},
        retry: 3,
    });

    const handleFormSubmit = (values) => {
        mutation.mutate(values);
    }

    const dailyAxisData = () => {
        if(dailyData.data){
            const res = dailyData.data.data.map(item => {
                const data = {...item, TheDate: Date.parse(item.TheDate)};
                return Object.values(data);
            });
            return res;
        }
        else return []
    };

    const hourlyAxisData = (axis) => {
        if(hourlyData.data && axis === 'x'){
            const res = hourlyData.data.data.map(item => `${item.TheHour}hrs`);
            return res;
        }
        else if (hourlyData.data && axis === 'y'){
            const res = hourlyData.data.data.map(item => item.HourlyTransactions);
            return res;
        }
        else return []
    };

    const monthlyAxisData = (axis) => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        if(monthlyData.data && axis === 'x'){
            const res = monthlyData.data.data.map(item => months[item.TheMonth - 1]);
            return res;
        }
        else if (monthlyData.data && axis === 'y'){
            const res = monthlyData.data.data.map(item => item.MonthlyTransactions);
            return res;
        }
        else return []
    }

    return (
        <Layout title="Tokens activity">
            <Group mb="xl" position='right'>
                <Button onClick={() => navigate(`${location.pathname}/address`)} leftIcon={<IconSearch size={18} />} size="md" variant='outline'>
                    <Text size="sm">Search by address</Text>
                </Button>
            </Group>
            <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title="Get Distribution Data" color="gray" radius="md">
                Get access to Espees transaction data for specific dates by Espees range. Simply select the start and end dates
                you want to query as well as an amount range in Espees. We'll handle the rest. 
            </Alert>

            <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
                <Grid mt={theme.spacing.xl * 2}>
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
                        <NumberInput
                            withAsterisk
                            label={
                                <Text component="label" size="sm" color={theme.colors.gray[7]}>
                                    Amount in Espees to start 
                                </Text>
                            }  
                            size="md"
                            min={0}
                            placeholder=''
                            {...form.getInputProps('amountStart')} 
                        />
                    </Grid.Col>
                    <Grid.Col xl={3} lg={3} md={3} sm={6} xs={12}>
                        <NumberInput 
                            withAsterisk
                            label={
                                <Text component="label" size="sm" color={theme.colors.gray[7]}>
                                    Amount in Espees to end 
                                </Text>
                            }  
                            size="md"
                            placeholder=''
                            {...form.getInputProps('amountEnd')} 
                        />
                    </Grid.Col>
                </Grid>    
                <Group mt="lg" position='right'>
                    <Button type="submit" leftIcon={<IconSearch size={18} />} loading={mutation.status === 'loading'} size="md" variant='filled'>
                        <Text size="sm">Search by range</Text>
                    </Button>
                </Group>
            </form>

            {(mutation.data && mutation.status !== 'loading') ? (
                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                    <Text align="center" size="md" color={theme.colors.gray[7]}>
                        {mutation.data.message}
                    </Text>
                    <Space h={30} />

                    Espees transaction count is: <Text size={theme.fontSizes.lg * 1.8} weight={800} color={theme.colors.pink[7]}>{mutation.data.data[0].Count?.toLocaleString()}</Text>
                </Card>
            ) : (
                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                    <img className={classes.empty} src={empty} alt="empty" />
                    <Title order={4} mb="sm" color={theme.colors.gray[7]} weight={700}>No data!</Title>
                    <Text w="40%" align='center' mb="xl" size="sm" color={theme.colors.gray[6]}>
                        We could not find any data matching your results. 
                        Please check your query and try again.
                    </Text>
                </Card>
            )}

            <Alert p="lg" icon={<IconAlertCircle size={16} />} mt={theme.spacing.xl * 1.5} mb="xl" title="Realtime Tokens Updates" color="gray" radius="md">
                All tokens can be monitored from here but since Espees is the only token available, that's all you'll see here. 
                Like before all transactions listed are polled every minute per session. This keeps your 
                Toronet metrics & performance data accurate at any giving time.
            </Alert>    

            <Grid>
                <Grid.Col xl={4} lg={6} md={6} sm={12} xs={12}>
                    <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                        <Stack align="center">
                            <div className={classes.icons}>
                                <IconCalendarStats color={theme.colors.green[7]} />
                            </div>
                            <Title order={2} weight={900} color={theme.colors.green[7]}>
                                {hourlyAxisData('y').reduce((acc, curr) => acc + curr, 0)?.toLocaleString()}
                            </Title>
                            <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                hourly transactions
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                Total count of espees transactions in the past {hours} hours
                            </Text>
                        </Stack>

                        <LoadingOverlay visible={hourlyData.isLoading} overlayBlur={2} />
                    </Card>
                </Grid.Col>

                <Grid.Col xl={4} lg={6} md={6} sm={12} xs={12}>
                    <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                        <Stack align="center">
                            <div className={cx(classes.icons, {[classes.iconsBlue]: true})}>
                                <IconCalendarTime color={theme.colors.blue[7]} />
                            </div>
                            <Title order={2} weight={900} color={theme.colors.blue[7]} align="center">
                                {dailyData.data ? dailyData.data.data.reduce((acc, curr) => acc + curr.DailyTransactions, 0)?.toLocaleString() : 0}
                            </Title>
                            <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]}>
                                daily transactions
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                Total count of espees transactions in the past {days} days.
                            </Text>
                        </Stack>

                        <LoadingOverlay visible={dailyData.isLoading} overlayBlur={2} />
                    </Card>
                </Grid.Col>

                <Grid.Col xl={4} lg={12} md={12} sm={12} xs={12}>
                    <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                        <Stack align="center">
                            <div className={cx(classes.icons, {[classes.iconsOrange]: true})}>
                                <IconCalendar color={theme.colors.pink[7]} />
                            </div>
                            <Title order={2} weight={900} color={theme.colors.pink[7]} align="center">
                                {monthlyAxisData('y').reduce((acc, curr) => acc + curr, 0)?.toLocaleString()}
                            </Title>
                            <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]}>
                                monthly transactions
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                Total count of espees transactions in the past {months} months
                            </Text>
                        </Stack>

                        <LoadingOverlay visible={monthlyData.isLoading} overlayBlur={2} />
                    </Card>
                </Grid.Col>
            </Grid>

            <article className={classes.section}>
                <Group mt="xl" position='apart'>
                    <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                        Espees Hourly transactions
                    </Title>

                    <SegmentedControl
                        value={hours}
                        onChange={setHours}
                        //color="green"
                        data={[
                            { label: '12H', value: '12' },
                            { label: '24H', value: '24' },
                            { label: '96H', value: '96' },
                            { label: '168H', value: '168' },
                        ]}
                    />
                </Group>

                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                    <HourlyReport categories={hourlyAxisData('x')} data={hourlyAxisData('y')} />

                    {hourlyData.status === 'loading' && (
                        <LoadingOverlay visible overlayBlur={2} />
                    )}
                </Card>
            </article>

            <article className={classes.section}>
                <Group mt="xl" position='apart'>
                    <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                        Espees Daily transactions
                    </Title>

                    <SegmentedControl
                        value={days}
                        onChange={setDays}
                        //color="green"
                        data={[
                            { label: '7D', value: '7' },
                            { label: '30D', value: '30' },
                            { label: '180D', value: '180' },
                            { label: '365D', value: '365' },
                        ]}
                    />
                </Group>

                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                    <DailyChart series={dailyAxisData()} />

                    {dailyData.status === 'loading' && (
                        <LoadingOverlay visible overlayBlur={2} />
                    )}
                </Card>
            </article>

            <article className={classes.section}>
                <Group mt="xl" position='apart'>
                    <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                        Espees Monthly transactions
                    </Title>

                    <SegmentedControl
                        value={months}
                        onChange={setMonths}
                        //color="green"
                        data={[
                            { label: '3M', value: '3' },
                            { label: '6M', value: '6' },
                            { label: '12M', value: '12' },
                            { label: '24M', value: '24' },
                        ]}
                    />
                </Group>

                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                    <MonthlyReport categories={monthlyAxisData('x')} data={monthlyAxisData('y')} />

                    {monthlyData.status === 'loading' && (
                        <LoadingOverlay visible overlayBlur={2} />
                    )}
                </Card>
            </article>
        </Layout>
    )
}

export default Tokens;