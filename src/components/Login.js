import React, { useState } from 'react';
import { Box, VStack, Heading, Input, Button, useToast, FormControl, FormLabel, useColorModeValue } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
    const bgColor = useColorModeValue('gray.50', 'gray.700');
    const textColor = useColorModeValue('gray.800', 'white');

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({
                title: 'Login successful',
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
            navigate('/'); // Navigate to home page after successful login
        } catch (error) {
            toast({
                title: error.message || 'Error during login',
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Box bg={bgColor} p={8} borderRadius="lg" boxShadow="xl" maxW="md" mx="auto" mt={10}>
            <VStack spacing={6}>
                <Heading as="h2" size="xl" color={textColor}>Login</Heading>
                <FormControl id="email">
                    <FormLabel color={textColor}>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        bg={useColorModeValue('white', 'gray.800')}
                    />
                </FormControl>
                <FormControl id="password">
                    <FormLabel color={textColor}>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        bg={useColorModeValue('white', 'gray.800')}
                    />
                </FormControl>
                <Button colorScheme="teal" onClick={handleLogin} width="full" size="lg">
                    Login
                </Button>
            </VStack>
        </Box>
    );
};

export default Login;