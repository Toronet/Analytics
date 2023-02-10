import React, {useState} from 'react';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { useQueries, useMutation } from '@tanstack/react-query';
import { IconAlertCircle, IconSearch } from '@tabler/icons';
import { Grid, Card, Title, Text, NumberInput, Space, TextInput, Alert, Button, SegmentedControl, LoadingOverlay, createStyles, useMantineTheme, Group } from '@mantine/core';

import Layout from '../../components/Layout';
import DailyChart from '../../components/Reports/DailyReport';
import HourlyReport from '../../components/Reports/HourlyReport';
import MonthlyReport from '../../components/Reports/MonthlyReport';

import empty from '../../assets/empty.png';

import { getDailyEspeesAddrTransactions, getHourlyEspeesAddrTransactions, getMonthlyEspeesAddrTransactions, getEspeesAddrTransactionsCountByRange } from '../../services/transactions';

const useStyles = createStyles((theme) => ({
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
}))

const TokensAddress = () => {
    const [addr, setAddr] = useState('');
    const [days, setDays] = useState('7');
    const [hours, setHours] = useState('12');
    const [months, setMonths] = useState('3');
    const [ready, setReady] = useState(false);

    const { classes } = useStyles();
    const theme = useMantineTheme();

    React.useEffect(() => {
        if(!addr.length) setReady(false);
    },[addr]);

    const form = useForm({
        initialValues: {
            addr: "",
            startDate: new Date('2022-08-01'),
            endDate: new Date(),
        },
        validate: {
            addr: (value) => (value ? null : 'Toronet address is required'),
            startDate: (value) => (value ? null : 'Start date is required'),
            endDate: (value) => (value ? null : 'End date is required'),
            amountStart: (value) => ((value || value === 0) ? null : "Start range is required"),
            amountEnd: (value) => (value ? null : "End range is required")
        }
    })

    const [dailyData, hourlyData, monthlyData] = useQueries({
        queries: [
            {
                queryKey: ['day-esps-addr-tnx', addr, days], 
                queryFn: () => getDailyEspeesAddrTransactions({addr, count: Number(days)}),
                enabled: !!addr && !!days && ready,
            },
            {
                queryKey: ['hour-esps-addr-tnx', addr, hours], 
                queryFn: () => getHourlyEspeesAddrTransactions({addr, count: Number(hours)}),
                enabled: !!addr && !!hours && ready,
            },
            {
                queryKey: ['month-esps-addr-tnx', addr, months], 
                queryFn: () => getMonthlyEspeesAddrTransactions({addr, count: Number(months)}),
                enabled: !!addr && !!months && ready,
            },
        ]
    });

    const mutation = useMutation({
        mutationFn: (payload) => getEspeesAddrTransactionsCountByRange(payload),
        onError: (error) => {},
        onSuccess: (data) => {},
        retry: 3,
    });

    const handleSubmit = () => {
        if(!addr.length) return;
       setReady(true)
    }

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
        <Layout title="Espees transaction detail">
            <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title="Get Distribution Data" color="gray" radius="md">
                Get access to Espees transaction data for a specific toronet address by dates and Espees range. Simply select the start and end dates
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
                            placeholder='Please select an end date'
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
                            placeholder="Start range"
                            label={
                                <Text component="label" size="sm" color={theme.colors.gray[7]}>
                                    Amount in Espees to start 
                                </Text>
                            }  
                            size="md"
                            min={0}
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
                            placeholder='End range'
                            {...form.getInputProps('amountEnd')} 
                        />
                    </Grid.Col>
                    <Grid.Col xl={9} lg={9} md={9}>
                        <TextInput 
                            size="md" 
                            placeholder='Enter a valid Toronet address'
                            {...form.getInputProps('addr')}
                        />
                    </Grid.Col>
                    <Grid.Col xl={3} lg={3} md={3}>
                        <Button fullWidth type="submit" leftIcon={<IconSearch size={18} />} loading={mutation.status === 'loading'} size="md" variant='filled'>
                            <Text size="sm">Search by range</Text>
                        </Button>
                    </Grid.Col>
                </Grid>    
            </form>

            {(mutation.data && mutation.status !== 'loading') ? (
                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                    <Text align="center" size="md" color={theme.colors.gray[7]}>
                        {mutation.data.message}
                    </Text>
                    <Space h={30} />

                    Transaction count is: <Text size={theme.fontSizes.lg * 1.8} weight={800} color={theme.colors.pink[7]}>{mutation.data.data[0].Count?.toLocaleString()}</Text>
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

            <Alert p="lg" icon={<IconAlertCircle size={16} />} mt={theme.spacing.xl * 3} mb="xl" title="Realtime Updates" color="gray" radius="md">
                All transactions listed are polled every minute per session. This keeps your 
                Toronet metrics & performance data accurate at any giving time.
            </Alert>
            <Group mb="xl" position='right'>
                <TextInput sx={{width: '40%'}} value={addr} onChange={e => setAddr(e.target.value)} size="md" placeholder='0x160166dbc33c0cdcd8a3898635d39c729204548d' />
                <Button onClick={handleSubmit} leftIcon={<IconSearch size={18} />} size="md">
                    <Text size="sm">Search</Text>
                </Button>
            </Group>
           
            <React.Fragment>
                <article className={classes.section}>
                    <Group mt="xl" position='apart'>
                        <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                            Hourly espees transactions
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
                            Daily espees transactions
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
                            Monthly espees transactions
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

export default TokensAddress;