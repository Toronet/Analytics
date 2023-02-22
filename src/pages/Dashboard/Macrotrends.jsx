import React, {useState} from 'react';
import { DateRangePicker } from '@mantine/dates';
import { useQueries } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { IconCalendarStats, IconAlertCircle, IconSearch } from '@tabler/icons';
import { Grid, Card, Stack, Title, Table, Text, Alert, Button, LoadingOverlay, createStyles, useMantineTheme, Group } from '@mantine/core';

import Layout from '../../components/Layout';

import { getTransactionCount, getTransactionCountEspees, getTransactionCountSumsEspees, getActiveAddresses, getRichListAddresses } from '../../services/macrotrends';

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
    iconsPink: {
        backgroundColor: theme.colors.pink[0]
    },
    card: {
        minHeight: 300,
        position: 'relative'
    },
    section: {
        margin: `${theme.spacing.xl * 2}px 0`,
    },
}));

const Macrotrends = () => {
    const [currDate, setCurrDate] = useState([new Date('2022-08-01'), new Date()]);
    const [currDateEsps, setCurrDateEsps] = useState([new Date('2022-08-01'), new Date()]);
    const [currDateSumEsps, setCurrDateSumEsps] = useState([new Date('2022-08-01'), new Date()]);

    const { classes, cx } = useStyles();
    const theme = useMantineTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const [totalCount, totalCountEsps, totalSumEsps, activeAddr, richListAddr] = useQueries({
        queries: [
            {
                queryKey: ['macrotrends-tns', currDate], 
                queryFn: () => getTransactionCount({
                    startDate: new Date(currDate[0]).toLocaleDateString('fr-CA'), 
                    endDate: new Date(currDate[1]).toLocaleDateString('fr-CA')
                }),
                enabled: !!currDate
            },
            {
                queryKey: ['macrotrends-tns-esps', currDateEsps], 
                queryFn: () => getTransactionCountEspees({
                    startDate: new Date(currDateEsps[0]).toLocaleDateString('fr-CA'), 
                    endDate: new Date(currDateEsps[1]).toLocaleDateString('fr-CA')
                }),
                enabled: !!currDateEsps
            },
            {
                queryKey: ['macrotrends-tns-sum-esps', currDateSumEsps], 
                queryFn: () => getTransactionCountSumsEspees({
                    startDate: new Date(currDateSumEsps[0]).toLocaleDateString('fr-CA'), 
                    endDate: new Date(currDateSumEsps[1]).toLocaleDateString('fr-CA')
                }),
                enabled: !!currDateSumEsps
            },
            {
                queryKey: ['macrotrends-addr'], 
                queryFn: () => getActiveAddresses(12),
            },
            {
                queryKey: ['macrotrends-rich-list'], 
                queryFn: () => getRichListAddresses(12),
            },
        ]
    });

    const rows = activeAddr.data?.data.sort((a, b) => b.TransactionCount - a.TransactionCount).map((item, index) => (
        <tr key={`${item.TheAddress}-${index}`}>
            <td>{index+1}</td>
            <td>{item.TheAddress}</td>
            <td>{item.TransactionCount}</td>
        </tr>
    ));

    const richListRows = richListAddr.data?.data.sort((a, b) => b.TotalBalance - a.TotalBalance).map((item, index) => (
        <tr key={`${item.TheAddress}-${index}`}>
            <td>{index+1}</td>
            <td>{item.TheAddress}</td>
            <td>{item.TotalBalance.toLocaleString()}</td>
        </tr>
    ));

    return (
        <Layout title="Macrotrends">
            <Group mb="xl" position='right'>
                <Button onClick={() => navigate(`${location.pathname}/address`)} leftIcon={<IconSearch size={18} />} size="md" variant='outline'>
                    <Text size="sm">Search by address</Text>
                </Button>
            </Group>
            <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title="Macrotrends ? What are they ?" color="gray" radius="md">
                Get information on a variety of macrotrends specific to your 
                Toronet address. From user activity to global and Espees 
                transactions.
            </Alert>

            <Grid>
                <Grid.Col xl={4} lg={6} md={4}>
                    <DateRangePicker
                        placeholder="Select a range"
                        value={currDate}
                        onChange={setCurrDate}
                        radius="md"
                        mb="sm"
                        disabled={totalCount.isLoading}
                    />
                    <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                        <Stack align="center">
                            <div className={classes.icons}>
                                <IconCalendarStats color={theme.colors.green[7]} />
                            </div>
                            <Title order={2} weight={900} color={theme.colors.green[7]}>
                                {totalCount.data && totalCount.data.data && totalCount.data.data[0].Count?.toLocaleString()}
                            </Title>
                            <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                transaction count
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                Total count of transactions for the selected date range.
                            </Text>
                        </Stack>

                        <LoadingOverlay visible={totalCount.isLoading} overlayBlur={2} />
                    </Card>
                </Grid.Col>

                <Grid.Col xl={4} lg={6} md={4}>
                    <DateRangePicker
                        placeholder="Select a range"
                        value={currDateEsps}
                        onChange={setCurrDateEsps}
                        radius="md"
                        mb="sm"
                        disabled={totalCountEsps.isLoading}
                    />
                    <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                        <Stack align="center">
                            <div className={cx(classes.icons, {[classes.iconsPink]: true})}>
                                <IconCalendarStats color={theme.colors.pink[7]} />
                            </div>
                            <Title order={2} weight={900} color={theme.colors.pink[7]}>
                                {totalCountEsps.data && totalCountEsps.data.data && totalCountEsps.data.data[0].Count?.toLocaleString()}
                            </Title>
                            <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                espees transaction count
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                Total count of espees transactions for the selected date range.
                            </Text>
                        </Stack>

                        <LoadingOverlay visible={totalCountEsps.isLoading} overlayBlur={2} />
                    </Card>
                </Grid.Col>

                <Grid.Col xl={4} lg={6} md={4}>
                    <DateRangePicker
                        placeholder="Select a range"
                        value={currDateSumEsps}
                        onChange={setCurrDateSumEsps}
                        radius="md"
                        mb="sm"
                        disabled={totalSumEsps.isLoading}
                    />
                    <Card p="xl" withBorder radius="lg" sx={{position: 'relative'}}>
                        <Stack align="center">
                            <div className={cx(classes.icons, {[classes.iconsPink]: true})}>
                                <IconCalendarStats color={theme.colors.pink[7]} />
                            </div>
                            <Title order={2} weight={900} color={theme.colors.pink[7]}>
                                {totalSumEsps.data && totalSumEsps.data.data && totalSumEsps.data.data[0].Sum?.toLocaleString()}
                            </Title>
                            <Title transform='uppercase' order={5} weight={900} color={theme.colors.gray[7]} align="center">
                                espees transaction sum
                            </Title>
                            <Text size="sm" color={theme.colors.gray[7]} align="center">
                                Total sum of espees transactions for the selected date range.
                            </Text>
                        </Stack>

                        <LoadingOverlay visible={totalSumEsps.isLoading} overlayBlur={2} />
                    </Card>
                </Grid.Col>
            </Grid>

            <article className={classes.section}>
                <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                    Most recent active addresses
                </Title>
                <Card p="xl" mt="xl" withBorder radius="lg" className={classes.card} sx={{minHeight: '15rem'}}>
                        <Table fontSize="sm" striped highlightOnHover horizontalSpacing="xl" verticalSpacing="sm">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Active Address</th>
                                    <th>Transaction Count</th>
                                </tr>
                            </thead>
                            <tbody>{rows}</tbody>
                        </Table>

                        <LoadingOverlay visible={activeAddr.isLoading} overlayBlur={2} />
                </Card>
            </article>

            <article className={classes.section}>
                <Title order={5} weight={800} color={theme.colors.gray[7]} transform="uppercase">
                    Top rich list addresses
                </Title>
                <Card p="xl" mt="xl" withBorder radius="lg" className={classes.card} sx={{minHeight: '15rem'}}>
                        <Table fontSize="sm" striped highlightOnHover horizontalSpacing="xl" verticalSpacing="sm">
                            <thead>
                                <tr>
                                    <th>S/N</th>
                                    <th>Active Address</th>
                                    <th>Transaction Count</th>
                                </tr>
                            </thead>
                            <tbody>{richListRows}</tbody>
                        </Table>

                        <LoadingOverlay visible={activeAddr.isLoading} overlayBlur={2} />
                </Card>
            </article>
        </Layout>
    )
}

export default Macrotrends;