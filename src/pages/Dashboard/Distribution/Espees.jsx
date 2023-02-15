import {useEffect} from 'react';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { useMutation } from '@tanstack/react-query';
import { IconAlertCircle, IconSearch } from '@tabler/icons';
import { Grid, Card, Title, Space, Text, NumberInput, LoadingOverlay, Alert, Button, Group, createStyles, useMantineTheme } from '@mantine/core';

import Layout from '../../../components/Layout';
import empty from '../../../assets/empty.png';

import { getEspeesTransactionsCountByRange } from '../../../services/transactions';

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

const EspeesDistribution = () => {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  const form = useForm({
    initialValues: {
      startDate: new Date('2022-08-01'),
      endDate: new Date(),
      amountStart: 0,
      amountEnd: 5,
    },
    validate: {
      startDate: (value) => (value ? null : 'Start date is required'),
      endDate: (value) => (value ? null : 'End date is required'),
      amountStart: (value) => ((value || value === 0) ? null : "Start range is required"),
      amountEnd: (value) => (value ? null : "End range is required")
    }
  });

  useEffect(() => {
    mutation.mutate(form.values)
  },[]);

  const mutation = useMutation({
    mutationFn: (payload) => getEspeesTransactionsCountByRange(payload),
    onError: (error) => {},
    onSuccess: (data) => {},
    retry: 3,
  });

  const handleFormSubmit = (values) => {
    mutation.mutate(values);
  }

  return (
    <Layout title="Espees Distribution">
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
          <Text mt="xl" align="center" size="md" color={theme.colors.gray[7]}>
            {mutation.data.message}
          </Text>
          <Space h={30} />

          <Text mb="xl" align="center">
            Espees transaction count is: <br/>
            <Text size={theme.fontSizes.lg * 1.8} align="Center" weight={800} color={theme.colors.pink[7]}>
              {mutation.data.data[0].Count?.toLocaleString()}
            </Text>
          </Text>

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

export default EspeesDistribution;
