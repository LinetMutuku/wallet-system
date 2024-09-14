import React, { useState } from 'react';
import {
    Box,
    VStack,
    Heading,
    Input,
    Button,
    useToast,
    FormControl,
    FormLabel,
    Container,
    Text,
    Link as ChakraLink,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
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
                title: 'Login failed',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Container maxW="md" mt={8}>
            <Box bg="white" p={8} borderRadius="lg" boxShadow="md">
                <VStack spacing={6} as="form" onSubmit={handleLogin}>
                    <Heading as="h2" size="xl">
                        Login
                    </Heading>
                    <FormControl id="email" isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </FormControl>
                    <FormControl id="password" isRequired>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </FormControl>
                    <Button type="submit" colorScheme="blue" width="full">
                        Login
                    </Button>
                </VStack>
                <Text mt={4} textAlign="center">
                    Don't have an account?{' '}
                    <ChakraLink as={RouterLink} to="/register" color="blue.500">
                        Register here
                    </ChakraLink>
                </Text>
            </Box>
        </Container>
    );
};

export default Login;