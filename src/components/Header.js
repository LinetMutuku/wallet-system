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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FaHome, FaChartBar, FaExchangeAlt, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

function Header() {
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const bg = useColorModeValue('white', 'gray.800');
    const color = useColorModeValue('gray.800', 'white');
    const borderColor = useColorModeValue('gray.200', 'gray.700');

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    const menuItems = [
        { name: 'Home', icon: FaHome, path: '/' },
        { name: 'Dashboard', icon: FaChartBar, path: '/dashboard' },
        { name: 'Transactions', icon: FaExchangeAlt, path: '/transactions' },
    ];

    const authItems = currentUser
        ? [{ name: 'Logout', icon: FaSignOutAlt, onClick: handleLogout }]
        : [
            { name: 'Login', icon: FaSignInAlt, path: '/login' },
            { name: 'Register', icon: FaUserPlus, path: '/register' },
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
                            Menu
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
                            <MenuItem key="divider" borderTop="1px" borderColor={borderColor} my={2} />
                            {authItems.map((item) => (
                                <MenuItem
                                    key={item.name}
                                    as={item.path ? Link : undefined}
                                    to={item.path}
                                    icon={<Icon as={item.icon} />}
                                    onClick={() => {
                                        onClose();
                                        item.onClick && item.onClick();
                                    }}
                                >
                                    {item.name}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                </Flex>
            </Container>
        </Box>
    );
}

export default Header;