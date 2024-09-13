import React, { useState } from 'react';
import { Box, VStack, Heading, Input, Button, useToast, FormControl, FormLabel } from '@chakra-ui/react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

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
            navigate('/');
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
        <Box bg="gray.100" p={8} borderRadius="lg" boxShadow="lg" maxW="lg" mx="auto" mt={10}>
            <VStack spacing={6}>
                <Heading as="h2" size="lg">Login</Heading>
                <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                </FormControl>
                <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                    />
                </FormControl>
                <Button colorScheme="blue" onClick={handleLogin} width="full">Login</Button>
            </VStack>
        </Box>
    );
};

export default Login;