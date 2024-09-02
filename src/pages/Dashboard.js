import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
    Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow,
    Text, VStack, HStack, Progress, Select
} from '@chakra-ui/react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const { transactions, balance } = useSelector(state => state.wallet);
    const [timeRange, setTimeRange] = React.useState('7d');

    const graphData = useMemo(() => {
        const now = new Date();
        const filteredTransactions = transactions.filter(t => {
            const transactionDate = new Date(t.date);
            const diffTime = Math.abs(now - transactionDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= (timeRange === '7d' ? 7 : 30);
        });

        const data = { deposits: 0, withdrawals: 0, purchases: 0 };
        filteredTransactions.forEach(transaction => {
            if (transaction.type === 'deposit') {
                data.deposits += transaction.amount;
            } else if (transaction.type === 'withdrawal') {
                data.withdrawals += transaction.amount;
            } else if (transaction.type === 'purchase') {
                data.purchases += transaction.amount;
            }
        });
        return [
            { name: 'Deposits', value: data.deposits },
            { name: 'Withdrawals', value: data.withdrawals },
            { name: 'Purchases', value: data.purchases },
        ];
    }, [transactions, timeRange]);

    const balanceHistory = useMemo(() => {
        let runningBalance = 0;
        return transactions.map(t => {
            if (t.type === 'deposit') runningBalance += t.amount;
            else runningBalance -= t.amount;
            return { date: new Date(t.date).toLocaleDateString(), balance: runningBalance };
        });
    }, [transactions]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    return (
        <Box>
            <HStack justify="space-between" mb={6}>
                <Heading as="h2" size="xl">Dashboard</Heading>
                <Select width="200px" value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                </Select>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
                <Stat>
                    <StatLabel>Current Balance</StatLabel>
                    <StatNumber>Kshs {balance.toFixed(2)}</StatNumber>
                    <StatHelpText>
                        <StatArrow type={balance > 0 ? 'increase' : 'decrease'} />
                        {Math.abs(balance).toFixed(2)}
                    </StatHelpText>
                </Stat>
                <Stat>
                    <StatLabel>Total Deposits</StatLabel>
                    <StatNumber>Kshs {graphData[0].value.toFixed(2)}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Total Withdrawals</StatLabel>
                    <StatNumber>Kshs {graphData[1].value.toFixed(2)}</StatNumber>
                </Stat>
                <Stat>
                    <StatLabel>Total Purchases</StatLabel>
                    <StatNumber>Kshs {graphData[2].value.toFixed(2)}</StatNumber>
                </Stat>
            </SimpleGrid>

            <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
                    <Heading size="md" mb={4}>Wallet Activity</Heading>
                    <Box height="300px">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>

                <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
                    <Heading size="md" mb={4}>Transaction Distribution</Heading>
                    <Box height="300px">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={graphData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {graphData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>

                <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
                    <Heading size="md" mb={4}>Balance History</Heading>
                    <Box height="300px">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={balanceHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                </Box>

                <Box bg="white" p={6} borderRadius="lg" boxShadow="xl">
                    <Heading size="md" mb={4}>Spending Analysis</Heading>
                    <VStack align="stretch" spacing={4}>
                        <Box>
                            <Text mb={2}>Deposits vs Withdrawals</Text>
                            <Progress value={(graphData[0].value / (graphData[0].value + graphData[1].value)) * 100} colorScheme="green" />
                        </Box>
                        <Box>
                            <Text mb={2}>Purchases vs Total Transactions</Text>
                            <Progress value={(graphData[2].value / graphData.reduce((acc, curr) => acc + curr.value, 0)) * 100} colorScheme="blue" />
                        </Box>
                    </VStack>
                </Box>
            </SimpleGrid>
        </Box>
    );
};

export default Dashboard;