import React, {useState} from 'react';
import { useQueries } from '@tanstack/react-query';
import { Card, Title, Stack, Text, Grid, Group, SegmentedControl, LoadingOverlay, createStyles, useMantineTheme } from '@mantine/core';

import Layout from '../../components/Layout';
import DailyChart from '../../components/Reports/DailyReport';

import { session } from '../../helpers/app';
import { getAddrRole } from '../../services/auth';
import { getBalance } from '../../services/balance';
import { getDailyUsers } from '../../services/users';
import { getRecentTransactions } from '../../services/transactions';

const useStyles = createStyles((theme, _params, _getRef) => ({
    section: {
        margin: `${theme.spacing.xl * 2}px 0`,
        position: "relative"
    },
    divider: {
        width: '100%',
        height: '1px',
        background: theme.colors.gray[2],
        margin: `${theme.spacing.xl}px 0`,
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

const Dashboard = () => {
    const [users, setUsers] = useState('30');
    //const [usersEsp, setUsersEsp] = useState('7');

    const userData = session;

    const theme = useMantineTheme();
    const { classes } = useStyles();

    const [dailyData, transactions, userRole, balances] = useQueries({
        queries: [
            {
                queryKey: ['daily-users', users], 
                queryFn: () => getDailyUsers(Number(users)),
                enabled: !!users
            },
            {
                queryKey: ['recent-tnx', userData], 
                queryFn: () => getRecentTransactions(userData.user),
                enabled: !!userData,
            },
            {
                queryKey: ['auth-role', userData], 
                queryFn: () => getAddrRole(userData.user),
                enabled: !!userData,
            },
            {
                queryKey: ['balances', userData], 
                queryFn: () => getBalance(userData.user),
                enabled: !!userData,
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

    return (
        <Layout title="Home">
            <Card sx={{backgroundColor: theme.colors.green[0]}} withBorder={false} p="xl" radius="lg">
                <Title order={2} mb="lg" color={theme.colors.green[7]}>
                    Welcome back,
                </Title>
                <Text>
                    You are logged in as a {userRole?.data?.role}: <Text span color={theme.colors.gray[8]} weight={600}>{session.user}</Text>
                </Text>
            </Card>

            <div className={classes.section}>
                <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                    Token Balances
                </Title>
                <Grid mt="xl">
                    <Grid.Col xl={4}>
                        <Card p="xl" withBorder radius="lg">
                            <Text tt="uppercase" weight={400} size="xs">Toro</Text>
                            <Title mt="xs" order={2} color={theme.colors.gray[8]}>
                                {Number(balances?.data?.bal_toro)?.toFixed(2) || ''}
                            </Title>
                        </Card>
                    </Grid.Col>
                    <Grid.Col xl={4}>
                        <Card p="xl" withBorder radius="lg">
                            <Text tt="uppercase" weight={400} size="xs">Espees</Text>
                            <Title mt="xs" order={2} color={theme.colors.gray[8]}>
                                {Number(balances?.data?.bal_espees)?.toFixed(2) || ''}
                            </Title>
                        </Card>
                    </Grid.Col>
                    <Grid.Col xl={4}>
                        <Card p="xl" withBorder radius="lg">
                            <Text tt="uppercase" weight={400} size="xs">Plast</Text>
                            <Title mt="xs" order={2} color={theme.colors.gray[8]}>
                                {Number(balances?.data?.bal_plast)?.toFixed(2) || ''}
                            </Title>
                        </Card>
                    </Grid.Col>
                </Grid>

                {balances.status === 'loading' && (
                    <LoadingOverlay visible overlayBlur={2} />
                )} 
            </div>

            <div className={classes.section}>
                <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                    Most recent transactions
                </Title>

                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.card}>
                    {!transactions?.data?.data?.length && (
                        <Text align="center" my="xl" color={theme.colors.gray[7]}>
                            We could not find any transactions for the queried address. 
                            ({userData.user})
                        </Text>
                    )}

                    {transactions?.data?.data?.map(item => (
                        <div key={item.EV_Hash}>
                            <Stack>
                                <Group position="apart">
                                    <Text color={theme.colors.gray[8]}>
                                        Contract: {item.EV_Contract}
                                    </Text>
                                    <Text size="sm" color={theme.colors.gray[8]}>
                                        Date: {new Date(item.EV_Time).toDateString()}
                                    </Text>
                                </Group>
                                <Group position="apart">
                                    <Text size="sm" color={theme.colors.gray[8]}>
                                        Event: {item.EV_Event}
                                    </Text>
                                    <Text size="sm" color={theme.colors.gray[8]} weight={600}>
                                        Amount: {item.EV_Value?.toLocaleString()}
                                    </Text>
                                </Group>
                                <Group position="apart">
                                    <Text size="sm" color={theme.colors.gray[8]}>
                                        From: <Text span weight={600} color={theme.colors.red[7]}>{item.EV_From}</Text>
                                    </Text>
                                    <Text size="sm" color={theme.colors.gray[8]}>
                                        To: <Text span weight={600} color={theme.colors.green[7]}>{item.EV_To}</Text>
                                    </Text>
                                </Group>
                            </Stack>
                            <div className={classes.divider} />
                        </div>
                    ))}
 
                    {transactions.status === 'loading' && (
                        <LoadingOverlay visible overlayBlur={2} />
                    )} 
                </Card>
            </div>
            
            <div className={classes.section}>
                <Group mt="xl" position='apart'>
                    <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                        Daily active users
                    </Title>

                    <SegmentedControl
                        value={users}
                        onChange={setUsers}
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
            </div>
        </Layout>
    )
}

export default Dashboard;