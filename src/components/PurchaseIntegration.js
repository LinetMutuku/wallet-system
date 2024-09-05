import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box, VStack, Heading, Text, Button, Input, useToast,
    HStack, StackDivider, useColorModeValue, Fade
} from '@chakra-ui/react';
import { makePurchase } from '../redux/actions/walletActions';

const PurchaseIntegration = () => {
    // State for amount and item name
    const [amount, setAmount] = useState('');
    const [itemName, setItemName] = useState('');

    // Get balance from Redux store
    const balance = useSelector(state => state.wallet.balance);
    const dispatch = useDispatch();
    const toast = useToast();

    // Color mode values
    const bgColor = useColorModeValue('gray.100', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    // Handle purchase function
    const handlePurchase = async () => {
        if (amount && Number(amount) > 0 && Number(amount) <= balance && itemName) {
            try {
                // Dispatch makePurchase action
                await dispatch(makePurchase(Number(amount), itemName));

                // Reset form fields
                setAmount('');
                setItemName('');

                // Show success toast
                toast({
                    title: 'Purchase successful',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                });
            } catch (error) {
                // Show error toast
                toast({
                    title: error.message || 'Error occurred during purchase',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: 'top-right',
                });
            }
        } else {
            // Show invalid purchase toast
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
                    <Input
                        placeholder="Enter item name"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        bg={useColorModeValue('white', 'gray.600')}
                    />
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
                        isDisabled={!amount || !itemName || Number(amount) > balance}
                    >
                        Complete Purchase
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default PurchaseIntegration;