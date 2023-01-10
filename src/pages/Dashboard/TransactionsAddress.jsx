import React, {useState} from 'react';
import { useQueries } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconCalendarStats, IconAlertCircle, IconCalendarTime, IconCalendar, IconSearch } from '@tabler/icons';
import { Grid, Card, Stack, Title, Text, TextInput, Alert, Button, SegmentedControl, LoadingOverlay, createStyles, useMantineTheme, Group } from '@mantine/core';

import Layout from '../../components/Layout';
import DailyChart from '../../components/Reports/DailyReport';
import HourlyReport from '../../components/Reports/HourlyReport';
import MonthlyReport from '../../components/Reports/MonthlyReport';

import empty from '../../assets/empty.png';

import { getDailyAddrTransactions, getHourlyAddrTransactions, getMonthlyAddrTransactions } from '../../services/transactions';

const useStyles = createStyles((theme) => ({
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

const TransactionsAddress = () => {
    const [addr, setAddr] = useState('');
    const [days, setDays] = useState('7');
    const [hours, setHours] = useState('12');
    const [months, setMonths] = useState('3');

    const { classes } = useStyles();
    const theme = useMantineTheme();

    const [dailyData, hourlyData, monthlyData] = useQueries({
        queries: [
            {
                queryKey: ['day-addr-tnx'], 
                queryFn: () => getDailyAddrTransactions({addr, count: Number(days)}),
                enabled: false
            },
            {
                queryKey: ['hour-addr-tnx'], 
                queryFn: () => getHourlyAddrTransactions({addr, count: Number(hours)}),
                enabled: false
            },
            {
                queryKey: ['month-addr-tnx'], 
                queryFn: () => getMonthlyAddrTransactions({addr, count: Number(months)}),
                enabled: false
            },
        ]
    });

    const handleSubmit = () => {
        if(!addr.length) return;
        dailyData.refetch();
        hourlyData.refetch();
        monthlyData.refetch();
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
        <Layout title="Transaction detail">
            <Group mb="xl" position='right'>
                <TextInput sx={{width: '40%'}} value={addr} onChange={e => setAddr(e.target.value)} size="md" placeholder='0x160166dbc33c0cdcd8a3898635d39c729204548d' />
                <Button onClick={handleSubmit} leftIcon={<IconSearch size={18} />} size="md">
                    <Text size="sm">Search</Text>
                </Button>
            </Group>
            <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title="Realtime Updates" color="gray" radius="md">
                All transactions listed are polled every minute per session. This keeps your 
                Toronet metrics & performance data accurate at any giving time.
            </Alert>
           
            <React.Fragment>
                <article className={classes.section}>
                    <Group mt="xl" position='apart'>
                        <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                            Hourly transactions
                        </Title>

                        <SegmentedControl
                            value={hours}
                            onChange={setHours}
                            //color="green"
                            disabled={addr ? false : true}
                            data={[
                                { label: '12H', value: '12' },
                                { label: '24H', value: '24' },
                                { label: '96H', value: '96' },
                                { label: '168H', value: '168' },
                            ]}
                        />
                    </Group>

                    {hourlyData.data && hourlyData.data.data.length ? (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                            <HourlyReport categories={hourlyAxisData('x')} data={hourlyAxisData('y')} />

                            {hourlyData.status === 'loading' && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card>
                    ) : (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                            <img className={classes.empty} src={empty} alt="empty" />
                            <Title order={4} mb="sm" color={theme.colors.gray[7]} weight={700}>No hourly data!</Title>
                            <Text size="sm" color={theme.colors.gray[7]}>
                                {addr ? 'We could not find any data matching your search at this time.' : 'Enter an address to get started'}
                            </Text>

                            {hourlyData.fetchStatus === "fetching" && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card>
                    )}
                </article>

                <article className={classes.section}>
                    <Group mt="xl" position='apart'>
                        <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                            Daily transactions
                        </Title>

                        <SegmentedControl
                            value={days}
                            onChange={setDays}
                            disabled={addr ? false : true}
                            //color="green"
                            data={[
                                { label: '7D', value: '7' },
                                { label: '30D', value: '30' },
                                { label: '180D', value: '180' },
                                { label: '365D', value: '365' },
                            ]}
                        />
                    </Group>

                    {dailyData.data && dailyData.data.data.length ? (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                            <DailyChart series={dailyAxisData()} />

                            {dailyData.status === 'loading' && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card> 
                    ) : (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                            <img className={classes.empty} src={empty} alt="empty" />
                            <Title order={4} mb="sm" color={theme.colors.gray[7]} weight={700}>No daily data!</Title>
                            <Text size="sm" color={theme.colors.gray[7]}>
                                {addr ? 'We could not find any data matching your search at this time.' : 'Enter an address to get started'}
                            </Text>

                            {dailyData.fetchStatus === 'fetching' && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card>
                    )}
                </article>

                <article className={classes.section}>
                    <Group mt="xl" position='apart'>
                        <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                            Monthly transactions
                        </Title>

                        <SegmentedControl
                            value={months}
                            onChange={setMonths}
                            disabled={addr ? false : true}
                            //color="green"
                            data={[
                                { label: '3M', value: '3' },
                                { label: '6M', value: '6' },
                                { label: '12M', value: '12' },
                                { label: '24M', value: '24' },
                            ]}
                        />
                    </Group>

                    {monthlyData.data && monthlyData.data.data.length ? (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                            <MonthlyReport categories={monthlyAxisData('x')} data={monthlyAxisData('y')} />

                            {monthlyData.status === 'loading' && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card> 
                    ) : (
                        <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                            <img className={classes.empty} src={empty} alt="empty" />
                            <Title order={4} mb="sm" color={theme.colors.gray[7]} weight={700}>No monthly data!</Title>
                            <Text size="sm" color={theme.colors.gray[7]}>
                                {addr ? 'We could not find any data matching your search at this time.' : 'Enter an address to get started'}
                            </Text>

                            {monthlyData.fetchStatus === 'fetching' && (
                                <LoadingOverlay visible overlayBlur={2} />
                            )}
                        </Card>
                    )}
                </article>
            </React.Fragment>
        </Layout>
    )
}

export default TransactionsAddress;