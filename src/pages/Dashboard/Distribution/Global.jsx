import {useEffect, useState} from 'react';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { useMutation } from '@tanstack/react-query';
import { IconAlertCircle, IconSearch } from '@tabler/icons';
import { Grid, Card, Title, Space, Text, LoadingOverlay, NumberInput, Alert, Button, Group, createStyles, useMantineTheme } from '@mantine/core';

import empty from '../../../assets/empty.png';
import Layout from '../../../components/Layout';
import MonthlyReport from '../../../components/Reports/MonthlyReport';

import { getTransactionsCountByRange } from '../../../services/transactions';

const useStyles = createStyles((theme, _params, _getRef) => ({
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

const GlobalDistribution = () => {
    const [rangeStart] = useState(0);
    const [rangeEnd] = useState(500);
    const [result, setResult] = useState([]);

    const { classes } = useStyles();
    const theme = useMantineTheme();

    const form = useForm({
        initialValues: {
            startDate: new Date('2022-08-01'),
            endDate: new Date(),
            amountStart: rangeStart,
            amountEnd: rangeEnd,
        },
        validate: {
            startDate: (value) => (value ? null : 'Start date is required'),
            endDate: (value) => (value ? null : 'End date is required'),
            amountStart: (value) => ((value || value === 0) ? null : "Start range is required"),
            amountEnd: (value) => (value ? null : "End range is required")
        }
    });

    useEffect(() => {
        const multiplier = ( rangeEnd / 100 )
        //const res = generateIntervalsOf(multiplier, rangeStart, rangeEnd);
        const res = [
            {
                start: rangeStart,
                end: multiplier,
            },
            {
                start: rangeStart * multiplier,
                end: multiplier * multiplier,
            },
            {
                start: 25,
                end: 100
            },
            {
                start: 100,
                end: 250,
            },
            {
                start: 250,
                end: 500,
            },
            {
                start: 500,
                end: 1000000000000000
            }
        ];
        res.forEach((item) => {
            return fetchDistributionData({rangeStart: item.start, rangeEnd: item.end})
        });

        mutation.mutate(form.values)
    },[]);

    const fetchDistributionData = async (payload) => {
        const res = await mutation.mutateAsync({
            startDate: form.values.startDate,
            endDate: form.values.endDate,
            amountStart: payload.rangeStart,
            amountEnd: payload.rangeEnd
        });
        const data = res.data[0].Count;
        setResult(prevState => [...prevState, {...payload, data}].sort((a,b) => a.rangeEnd - b.rangeEnd))
    }

    // const generateIntervalsOf = (multiplier, start, end) => {
    //     const res = [];
    //     let current = start;
    //     while(current < end){
    //         res.push(current);
    //         if(current === 0) current = current + multiplier;
    //         else current = current * multiplier;
    //     }
    //     return res;
    // }

    const mutation = useMutation({
        mutationFn: (payload) => getTransactionsCountByRange(payload),
        onError: (_error) => {},
        onSuccess: (_data) => {},
        retry: 3,
    });

    const monthlyAxisData = (axis) => {
        if(result.length && axis === 'x'){
            const res = result.map(item => (`${item.rangeStart} - ${item.rangeEnd}`));
            return res;
        }
        else if (result.length && axis === 'y'){
            const res = result.map(item => item.data);
            return res;
        }
        else return []
    }

    const handleFormSubmit = (values) => {
        mutation.mutate(values);
    }

    return (
        <Layout title="Global Distribution">
            <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title="Get Distribution Data " color="gray" radius="md">
                Get access to transaction data for all tokens by date and a predefined range in tokens.
            </Alert>
            {/* <form onSubmit={form.onSubmit((values) => handleFormSubmit(values))}>
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
                                    Start range (Toro's)
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
                                    End range (Toro's)
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
            </form> */}

            {(mutation.data && mutation.status !== 'loading') ? (
                <Card mt="xl" p="xl" withBorder radius="lg">
                    <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title={`Global Distribution from ${rangeStart} - ${rangeEnd}`} radius="md">
                        <Text size="md" color={theme.colors.gray[7]}>
                            Transaction count has been queried from {new Date(form.values.startDate).toDateString()} to {" "}
                            {new Date(form.values.endDate).toDateString()} for the ranges: {rangeStart} to {rangeEnd};
                        </Text>
                    </Alert>

                    <Space h={30} />

                    {/* <Text mb="xl" align="center">
                        Toro transaction count is: <br/>
                        <Text size={theme.fontSizes.lg * 1.8} align="Center" weight={800} color={theme.colors.pink[7]}>
                            {mutation.data.data[0].Count?.toLocaleString()}
                        </Text>
                    </Text> */}

                    <MonthlyReport adjustLabel categories={monthlyAxisData('x')} data={monthlyAxisData('y')} />

                    <LoadingOverlay visible={mutation.isLoading} overlayBlur={2} />
                </Card>
            ) : (
                <Card mt="xl" p="xl" withBorder radius="lg" className={classes.emptyWrapper}>
                    <img className={classes.empty} src={empty} alt="empty" />
                    <Title order={4} mb="sm" color={theme.colors.gray[7]} weight={700}>
                        No distribution data found
                    </Title>
                    <Text w="40%" align='center' mb="xl" size="sm" color={theme.colors.gray[6]}>
                        We could not find any data matching your results. 
                        Please check your query and try again.
                    </Text>

                    <LoadingOverlay visible={mutation.isLoading} overlayBlur={2} />
                </Card>
            )}
        </Layout>
    )
}

export default GlobalDistribution
