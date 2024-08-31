import React from 'react';
import { Grid, GridItem } from '@chakra-ui/react';
import WalletManagement from '../components/WalletManagement';
import TransactionHistory from '../components/TransactionHistory';
import PurchaseIntegration from '../components/PurchaseIntegration';

const Dashboard = () => {
    return (
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem colSpan={2}>
                <WalletManagement />
            </GridItem>
            <GridItem>
                <PurchaseIntegration />
            </GridItem>
            <GridItem>
                <TransactionHistory />
            </GridItem>
        </Grid>
    );
};

export default Dashboard;