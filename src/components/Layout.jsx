import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { IconHome2, IconCash, IconChartAreaLine, IconCoin } from '@tabler/icons';
import { AppShell, Navbar, Group, Title, Text, ScrollArea, createStyles, useMantineTheme } from '@mantine/core';

import brand from '../assets/toronet-alt.png';

const useStyles = createStyles((theme, _params, _getRef) => ({
    section: {
        marginTop: theme.spacing.xl,
        marginBottom: theme.spacing.xl + 2,
    },
    link: {
        padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,
        display: 'block',
        textDecoration: 'none',
        marginLeft: 25,
        marginRight: 25,
        fontSize: theme.fontSizes.sm,
        borderRadius: theme.radius.md,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[6],

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        },

        '&:not(:last-of-type)': {
            marginBottom: theme.spacing.xs,
        }
    },
    linkActive: {
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.green[8],
    },
    icon: {
        width: theme.spacing.xl * 1.4,
        height: theme.spacing.xl * 1.4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: theme.radius.md,
        backgroundColor: theme.colors.gray[1],
    },
    iconActive: {
        backgroundColor: theme.colors.green[0]
    },
    header: {
        marginBottom: theme.spacing.xl * 2
    },
    brand: {
        display: 'block',
        width: '8rem',
        height: '3rem',
        objectFit: 'contain',
        marginLeft: '1rem'
    }
}))

const Layout = ({children, title}) => {
    const { classes, cx } = useStyles();
    const theme = useMantineTheme();
    const location = useLocation();

    const currentRoute = location.pathname

    return (
        <AppShell
            padding="xl"
            navbarOffsetBreakpoint="lg"
            navbar={
                <Navbar width={{ base: 300 }} hiddenBreakpoint="lg" hidden>
                    <Navbar.Section p="md">
                        <img className={classes.brand} src={brand} alt="toronet" />
                    </Navbar.Section>

                    <Navbar.Section grow className={classes.section} component={ScrollArea}>
                        <Link to="/dashboard" className={cx(classes.link, {[classes.linkActive]: '/dashboard' === currentRoute})}>
                            <Group align="center">
                                <div className={cx(classes.icon, {[classes.iconActive]: '/dashboard' === currentRoute})}>
                                    <IconHome2 size={theme.spacing.lg} /> 
                                </div>
                                <Text weight={'/dashboard' === currentRoute ? 600 : 500}>
                                    Home
                                </Text>  
                            </Group> 
                        </Link> 
                        <Link to="/dashboard/transactions" className={cx(classes.link, {[classes.linkActive]: '/dashboard/transactions' === currentRoute})}>
                            <Group align="center">
                                <div className={cx(classes.icon, {[classes.iconActive]: '/dashboard/transactions' === currentRoute})}>
                                    <IconCash size={theme.spacing.lg} /> 
                                </div>
                                <Text weight={'/dashboard/transactions' === currentRoute ? 600 : 500}>
                                    Transactions
                                </Text>  
                            </Group> 
                        </Link> 
                        <Link to="/dashboard/tokens" className={cx(classes.link, {[classes.linkActive]: '/dashboard/tokens' === currentRoute})}>
                            <Group align="center">
                                <div className={cx(classes.icon, {[classes.iconActive]: '/dashboard/tokens' === currentRoute})}>
                                    <IconCoin size={theme.spacing.lg} /> 
                                </div>
                                <Text weight={'/dashboard/tokens' === currentRoute ? 600 : 500}>
                                    Tokens activity
                                </Text>  
                            </Group> 
                        </Link> 
                        <Link to="/dashboard/macrotrends" className={cx(classes.link, {[classes.linkActive]: '/dashboard/macrotrends' === currentRoute})}>
                            <Group align="center">
                                <div className={cx(classes.icon, {[classes.iconActive]: '/dashboard/macrotrends' === currentRoute})}>
                                    <IconChartAreaLine size={theme.spacing.lg} /> 
                                </div>
                                <Text weight={'/dashboard/macrotrends' === currentRoute ? 600 : 500}>
                                    Macrotrends
                                </Text>  
                            </Group> 
                        </Link> 
                    </Navbar.Section>
                </Navbar>
            }
            styles={(theme) => ({
                main: { 
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
                },
                body: {
                    padding: `${theme.spacing.md}px ${theme.spacing.xl}px`
                }
            })}
        >
            <header className={classes.header}>
                <Title order={2} color={theme.colors.gray[8]}>{title}</Title>
            </header>

            {children}
        </AppShell>
    )
}

export default Layout;