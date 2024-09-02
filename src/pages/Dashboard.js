import React from 'react';
import { Grid, GridItem, useBreakpointValue, Box } from '@chakra-ui/react';
import WalletManagement from '../components/WalletManagement';
import TransactionHistory from '../components/TransactionHistory';
import PurchaseIntegration from '../components/PurchaseIntegration';
import WalletGraphs from '../components/WalletGraphs';

const Dashboard = () => {
    const columns = useBreakpointValue({ base: 1, md: 2 });

    return (
        <Box p={4}>
            <Grid templateColumns={`repeat(${columns}, 1fr)`} gap={6}>
                <GridItem colSpan={columns}>
                    <WalletManagement />
                </GridItem>
                <GridItem colSpan={columns}>
                    <WalletGraphs />
                </GridItem>
                <GridItem colSpan={columns === 1 ? 1 : 2}>
                    <PurchaseIntegration />
                </GridItem>
                <GridItem colSpan={columns}>
                    <TransactionHistory />
                </GridItem>
            </Grid>
        </Box>
    );
};

export default Dashboard;