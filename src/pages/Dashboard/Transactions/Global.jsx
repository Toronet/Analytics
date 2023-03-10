import React, { useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconCalendarStats, IconAlertCircle, IconCalendarTime, IconCalendar, IconSearch } from '@tabler/icons';
import { Grid, Card, Stack, Title, Text, Alert, Button, SegmentedControl, LoadingOverlay, createStyles, useMantineTheme, Group } from '@mantine/core';

import Layout from '../../../components/Layout';
import DailyChart from '../../../components/Reports/DailyReport';
import HourlyReport from '../../../components/Reports/HourlyReport';
import MonthlyReport from '../../../components/Reports/MonthlyReport';

import { getDailyTransactions, getDailyTransactionsVol, getHourlyTransactions, getMonthlyTransactions } from '../../../services/transactions';

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

const GlobalTransactions = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useMantineTheme();
    const { classes, cx } = useStyles();

    const [days, setDays] = useState('30');
    const [hours, setHours] = useState('12');
    const [months, setMonths] = useState('3');



    const [dailyData, dailyVolData, hourlyData, monthlyData] = useQueries({
        queries: [
            {
                queryKey: ['day-tnx', days], 
                queryFn: () => getDailyTransactions(Number(days)),
                enabled: !!days
            },
            {
                queryKey: ['day-tnx-vol', days], 
                queryFn: () => getDailyTransactionsVol(Number(days)),
                enabled: !!days
            },
            {
                queryKey: ['hour-tnx', hours], 
                queryFn: () => getHourlyTransactions(Number(hours)),
                enabled: !!hours
            },
            {
                queryKey: ['month-tnx', months], 
                queryFn: () => getMonthlyTransactions(Number(months)),
                enabled: !!months
            },
        ]
    });


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

    // const dailyVolAxisData = () => {
    //     if(dailyVolData.data){
    //         const res = dailyVolData.data.data.map(item => {
    //             const data = {...item, TheDate: Date.parse(item.TheDate)};
    //             return Object.values(data);
    //         });
    //         return res;
    //     }
    //     else return []
    // };

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
            return res.reverse();
        }
        else if (monthlyData.data && axis === 'y'){
            const res = monthlyData.data.data.map(item => item.MonthlyTransactions);
            return res.reverse();
        }
        else return []
    }

    return (
        <Layout title="Global Transactions">
            <Group mb="xl" position='right'>
                <Button onClick={() => navigate(`${location.pathname}/address`)} leftIcon={<IconSearch size={18} />} size="md" variant='outline'>
                    <Text size="sm">Search by address</Text>
                </Button>
            </Group>
            

            <Alert p="lg" icon={<IconAlertCircle size={16} />} mt={theme.spacing.xl * 1.5} mb="xl" title="Realtime Updates" color="gray" radius="md">
                All transactions listed are polled every minute per session. This keeps your 
                Toronet metrics & performance data accurate at any giving time.
            </Alert>

            <article className={classes.section}>
                <Group mt="xl" position='apart'>
                    <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                        Hourly transactions
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

                <Card mt="xl" p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                    <Stack align="center">
                        <div className={classes.icons}>
                            <IconCalendarStats color={theme.colors.green[7]} />
                        </div>
                        <Title order={2} weight={900} color={theme.colors.green[7]}>
                            {hourlyAxisData('y').reduce((acc, curr) => acc + curr, 0)?.toLocaleString()}
                        </Title>
                        <Text transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                            Total transaction count in the past {hours} hours
                        </Text>
                        {/* <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                            hourly transactions
                        </Title> */}
                    </Stack>

                    <LoadingOverlay visible={hourlyData.isLoading} overlayBlur={2} />
                </Card>

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
                        Daily transactions
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

                <Grid>
                    <Grid.Col span={6}>
                        <Card p="xl" mt="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                            <Stack align="center">
                                <div className={cx(classes.icons, {[classes.iconsBlue]: true})}>
                                    <IconCalendarTime color={theme.colors.blue[7]} />
                                </div>
                                <Text size="sm" color={theme.colors.gray[7]} align="center">
                                    Total transaction count in the past {days} days.
                                </Text>
                                <Title order={2} weight={900} color={theme.colors.blue[7]} align="center">
                                    {dailyData.data ? dailyData.data.data.reduce((acc, curr) => acc + curr.DailyTransactions, 0)?.toLocaleString() : 0}
                                </Title>
                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]}>
                                    daily transactions count
                                </Title>
                            </Stack>

                            <LoadingOverlay visible={dailyData.isLoading} overlayBlur={2} />
                        </Card>
                    </Grid.Col>

                    <Grid.Col span={6}>
                        <Card p="xl" mt="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                            <Stack align="center">
                                <div className={cx(classes.icons, {[classes.iconsBlue]: true})}>
                                    <IconCalendarTime color={theme.colors.blue[7]} />
                                </div>
                                <Title order={2} weight={900} color={theme.colors.blue[7]} align="center">
                                    {dailyVolData.data ? dailyVolData.data.data.reduce((acc, curr) => acc + curr.DailyTransactions, 0)?.toLocaleString() : 0}
                                </Title>
                                <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]}>
                                    daily transactions volume
                                </Title>
                                <Text size="sm" color={theme.colors.gray[7]} align="center">
                                    Total transaction volume in the past {days} days.
                                </Text>
                            </Stack>

                            <LoadingOverlay visible={dailyVolData.isLoading} overlayBlur={2} />
                        </Card>
                    </Grid.Col>
                </Grid>

                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                    <DailyChart series={dailyAxisData()} />

                    {dailyData.status === 'loading' && (
                        <LoadingOverlay visible overlayBlur={2} />
                    )}
                </Card>

                {/* <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                    <DailyChart series={dailyVolAxisData()} />

                    {dailyData.status === 'loading' && (
                        <LoadingOverlay visible overlayBlur={2} />
                    )}
                </Card> */}
            </article>

            <article className={classes.section}>
                <Group mt="xl" position='apart'>
                    <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                        Monthly transactions
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

                <Card p="xl" mt="xl" withBorder radius="lg" sx={{position: 'relative'}}>
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
                            Total transaction count in the past {months} months
                        </Text>
                    </Stack>

                    <LoadingOverlay visible={monthlyData.isLoading} overlayBlur={2} />
                </Card>

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

export default GlobalTransactions;