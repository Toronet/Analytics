import React, {useState} from 'react';
import { useQueries } from '@tanstack/react-query';
import { Card, Title, Text, Group, SegmentedControl, LoadingOverlay, createStyles, useMantineTheme } from '@mantine/core';

import Layout from '../../components/Layout';
import DailyChart from '../../components/Reports/DailyReport';

import { session } from '../../helpers/app';
import { getDailyUsers } from '../../services/users';

const useStyles = createStyles((theme, _params, _getRef) => ({
    section: {
        margin: `${theme.spacing.xl * 2}px 0`,
    },
}));

const Dashboard = () => {
    const [users, setUsers] = useState('30');
    //const [usersEsp, setUsersEsp] = useState('7');

    const theme = useMantineTheme();
    const { classes } = useStyles();

    const [dailyData] = useQueries({
        queries: [
            {
                queryKey: ['day-users', users], 
                queryFn: () => getDailyUsers(Number(users)),
                enabled: !!users
            },
            // {
            //     queryKey: ['day-esps-users', usersEsp], 
            //     queryFn: () => getDailyEspeesUsers(Number(usersEsp)),
            //     enabled: !!usersEsp
            // },
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
            <Card sx={{backgroundColor: theme.colors.gray[0]}} withBorder={false} p="xl" radius="lg">
                <Title order={2} mb="lg" color={theme.colors.gray[7]}>
                    Welcome back,
                </Title>
                <Text>{session.user}</Text>
            </Card>

            <article className={classes.section}>
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
            </article>
        </Layout>
    )
}

export default Dashboard;