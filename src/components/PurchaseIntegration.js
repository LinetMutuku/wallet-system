import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, VStack, Heading, Text, Button, Input, Select, useToast,
    HStack, StackDivider, useColorModeValue, Fade
} from '@chakra-ui/react';
import { withdrawFunds, updateBalance, addTransaction } from '../redux/actions/walletActions';

const PurchaseIntegration = () => {
    const [amount, setAmount] = useState('');
    const [item, setItem] = useState('');
    const balance = useSelector(state => state.wallet.balance);
    const dispatch = useDispatch();
    const toast = useToast();

    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    const handlePurchase = async () => {
        if (amount && Number(amount) > 0 && Number(amount) <= balance && item) {
            try {
                await dispatch(withdrawFunds(Number(amount)));
                dispatch(updateBalance(balance - Number(amount)));
                dispatch(addTransaction({
                    type: 'purchase',
                    amount: Number(amount),
                    item: item,
                    date: new Date().toISOString()
                }));
                setAmount('');
                setItem('');
                toast({
                    title: 'Purchase successful',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                });
            } catch (error) {
                toast({
                    title: error.message || 'Error occurred during purchase',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        } else {
            toast({
                title: 'Invalid purchase',
                description: 'Please make sure all fields are filled and you have enough balance.',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="lg" maxW="lg" mx="auto">
            <VStack spacing={8} align="stretch" divider={<StackDivider borderColor="gray.200" />}>
                <Heading as="h2" size="lg" textAlign="center" color={textColor}>Make a Purchase</Heading>
                <Fade in={true}>
                    <Text fontSize="xl" textAlign="center" color={textColor}>
                        Available Balance: <Text as="span" fontWeight="bold">Kshs {balance.toFixed(2)}</Text>
                    </Text>
                </Fade>
                <VStack spacing={4}>
                    <Select
                        placeholder="Select item"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        bg={useColorModeValue('white', 'gray.600')}
                    >
                        <option value="Item 1">Item 1 - Kshs 10</option>
                        <option value="Item 2">Item 2 - Kshs 20</option>
                        <option value="Item 3">Item 3 - Kshs 30</option>
                    </Select>
                    <Input
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        type="number"
                        bg={useColorModeValue('white', 'gray.600')}
                    />
                </VStack>
                <HStack justifyContent="center" pt={4}>
                    <Button
                        colorScheme="blue"
                        onClick={handlePurchase}
                        size="lg"
                        isDisabled={!amount || !item || Number(amount) > balance}
                    >
                        Complete Purchase
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default PurchaseIntegration;