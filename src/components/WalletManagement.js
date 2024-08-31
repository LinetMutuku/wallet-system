import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, VStack, Heading, Button, Input, useToast, HStack, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
import { addFunds, withdrawFunds, initializeWallet } from '../redux/actions/walletActions';

const WalletManagement = () => {
    const [amount, setAmount] = useState('');
    const balance = useSelector(state => state.wallet.balance);
    const dispatch = useDispatch();
    const toast = useToast();

    useEffect(() => {
        dispatch(initializeWallet());
    }, [dispatch]);

    const handleAddFunds = () => {
        if (amount && Number(amount) > 0) {
            dispatch(addFunds(Number(amount)))
                .then(() => {
                    setAmount('');
                    toast({
                        title: 'Funds added successfully',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                })
                .catch(error => {
                    toast({
                        title: 'Error adding funds',
                        description: error.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                    });
                });
        }
    };

    const handleWithdrawFunds = () => {
        if (amount && Number(amount) > 0) {
            dispatch(withdrawFunds(Number(amount)))
                .then(() => {
                    setAmount('');
                    toast({
                        title: 'Funds withdrawn successfully',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                })
                .catch(error => {
                    toast({
                        title: 'Error withdrawing funds',
                        description: error.message,
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                    });
                });
        }
    };

    return (
        <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
            <VStack spacing={8} align="stretch">
                <Heading as="h2" size="xl" textAlign="center">Wallet Management</Heading>
                <Stat>
                    <StatLabel fontSize="xl">Current Balance</StatLabel>
                    <StatNumber fontSize="4xl"> Kshs {balance.toFixed(2)}</StatNumber>
                    <StatHelpText>
                        <StatArrow type={balance > 0 ? 'increase' : 'decrease'} />
                        {balance > 0 ? 'Positive' : 'Negative'} balance
                    </StatHelpText>
                </Stat>
                <Input
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    type="number"
                    size="lg"
                />
                <HStack spacing={4}>
                    <Button colorScheme="teal" onClick={handleAddFunds} size="lg" flex={1}>Add Funds</Button>
                    <Button colorScheme="orange" onClick={handleWithdrawFunds} size="lg" flex={1}>Withdraw Funds</Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default WalletManagement;