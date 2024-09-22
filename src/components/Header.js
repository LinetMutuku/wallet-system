import React from 'react';
import {
    Box,
    Flex,
    Heading,
    Button,
    Container,
    useColorModeValue,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Icon,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaHome, FaChartBar, FaExchangeAlt, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

function Header() {
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/register');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const menuItems = currentUser
        ? [
            { name: 'Home', icon: FaHome, path: '/' },
            { name: 'Dashboard', icon: FaChartBar, path: '/dashboard' },
            { name: 'Transactions', icon: FaExchangeAlt, path: '/transactions' },
        ]
        : [
            { name: 'Register', icon: FaUserPlus, path: '/register' },
            { name: 'Login', icon: FaSignInAlt, path: '/login' },
        ];

    return (
        <Box
            bg={bg}
            py={4}
            boxShadow="sm"
            position="sticky"
            top={0}
            zIndex="sticky"
            borderBottom="1px"
            borderColor={borderColor}
        >
            <Container maxW="container.xl">
                <Flex justifyContent="space-between" alignItems="center">
                    <Heading as="h1" size="lg" color={useColorModeValue('teal.600', 'teal.200')} fontWeight="bold">
                        Wallet System
                    </Heading>
                    <Menu isOpen={isOpen} onClose={onClose}>
                        <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                            onClick={onOpen}
                            variant="ghost"
                            _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                        >
                            AccountMenu
                        </MenuButton>
                        <MenuList>
                            {menuItems.map((item) => (
                                <MenuItem
                                    key={item.name}
                                    as={Link}
                                    to={item.path}
                                    icon={<Icon as={item.icon} />}
                                    onClick={onClose}
                                >
                                    {item.name}
                                </MenuItem>
                            ))}
                            {currentUser && (
                                <MenuItem
                                    icon={<Icon as={FaSignOutAlt} />}
                                    onClick={() => {
                                        onClose();
                                        handleLogout();
                                    }}
                                >
                                    Logout
                                </MenuItem>
                            )}
                        </MenuList>
                    </Menu>
                </Flex>
            </Container>
        </Box>
    );
}

export default Header;