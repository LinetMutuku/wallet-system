import React from 'react';
import { Box, Flex, Heading, Button, Container, Stack, useColorModeValue } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
    const location = useLocation();
    const bg = useColorModeValue('gray.50', 'gray.900');
    const color = useColorModeValue('gray.800', 'white');
    const activeColor = useColorModeValue('teal.600', 'teal.200');
    const hoverBg = useColorModeValue('gray.200', 'gray.700');
    const activeBg = useColorModeValue('gray.100', 'gray.800');

    const isActive = (path) => location.pathname === path;

    return (
        <Box
            bg={bg}
            py={4}
            boxShadow="sm"
            position="sticky"
            top={0}
            zIndex="sticky"
            borderBottom="1px"
            borderColor={useColorModeValue('gray.200', 'gray.700')}
        >
            <Container maxW="container.xl">
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading as="h1" size="lg" color={activeColor} fontWeight="bold">
                        Wallet System
                    </Heading>
                    <Stack direction="row" spacing={1}>
                        {['Home', 'Dashboard', 'Transactions', 'Login', 'Register'].map((item) => (
                            <Button
                                key={item}
                                as={Link}
                                to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                                variant="ghost"
                                color={isActive(item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? activeColor : color}
                                bg={isActive(item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? activeBg : 'transparent'}
                                _hover={{
                                    bg: hoverBg,
                                    color: activeColor
                                }}
                                fontWeight="medium"
                                transition="all 0.2s"
                            >
                                {item}
                            </Button>
                        ))}
                    </Stack>
                </Flex>
            </Container>
        </Box>
    );
}

export default Header;