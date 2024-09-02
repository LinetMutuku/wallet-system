import React from 'react';
import { Box, Flex, Heading, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <Box bg="teal.500" px={4} py={3}>
            <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h1" size="lg" color="white">
                    Wallet System
                </Heading>
                <Flex>
                    <Button as={Link} to="/" variant="ghost" color="white">
                        Home
                    </Button>
                    <Button as={Link} to="/dashboard" variant="ghost" color="white">
                        Dashboard
                    </Button>
                    <Button as={Link} to="/transactions" variant="ghost" color="white">
                        Transactions
                    </Button>
                    <Button as={Link} to="/login" variant="ghost" color="white">
                        Login
                    </Button>
                    <Button as={Link} to="/register" variant="ghost" color="white">
                        Register
                    </Button>
                </Flex>
            </Flex>
        </Box>
    );
}

export default Header;