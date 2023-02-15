import {useState} from 'react';
import { useQueries } from '@tanstack/react-query';
import { IconCalendarStats, IconAlertCircle, IconSearch } from '@tabler/icons';
import { Card, Stack, Text, Alert, NumberInput, Group, LoadingOverlay, createStyles, useMantineTheme } from '@mantine/core';

import Layout from '../../../components/Layout';
import { getToroTransactions } from '../../../services/transactions';

const useStyles = createStyles((theme, _params, _getRef) => ({
  divider: {
      width: '100%',
      height: '1px',
      background: theme.colors.gray[2],
      margin: `${theme.spacing.xl}px 0`,
  },
}));


const ToroTransactions = () => {
  const [count, setCount] = useState(12);

  const theme = useMantineTheme();
    const { classes } = useStyles();

    const [transactions] = useQueries({
        queries: [
            
            {
              queryKey: ['toro-tnx', count], 
              queryFn: () => getToroTransactions(count),
              enabled: !!count,
            },
           
        ]
    });


  return (
    <Layout title="Toro Transactions">
      <Alert p="lg" icon={<IconAlertCircle size={16} />} mb="xl" title="Most recent Toro Token Transactions" color="gray" radius="md">
        Get a breakdown on all transactions for the Toro token on Toronet today. 
      </Alert>

      {/* <Group mb="xl" position='right'>
        <NumberInput value={count} onChange={e => setCount(e.target.value)} size="md" placeholder='12' />  
      </Group> */}
      <Card mt="xl" p="xl" withBorder radius="lg">
                    {!transactions?.data?.data?.length && (
                        <Text align="center" my="xl" color={theme.colors.gray[7]}>
                          We could not find any Toro transactions at this time.
                          Please try again later. 
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
    </Layout>
  )
}

export default ToroTransactions
