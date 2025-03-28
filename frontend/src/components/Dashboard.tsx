import React, { useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { TransactionDialog } from './TransactionDialog';

const GET_TRANSACTIONS = gql`
  query GetTransactions($type: TransactionType, $status: TransactionStatus) {
    transactions(type: $type, status: $status) {
      id
      date
      type
      amount
      status
      description
    }
  }
`;

const UPDATE_TRANSACTION_STATUS = gql`
  mutation UpdateTransactionStatus($id: ID!, $status: TransactionStatus!) {
    updateTransactionStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

export const Dashboard: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, loading, error } = useQuery(GET_TRANSACTIONS, {
    variables: {
      type: typeFilter || undefined,
      status: statusFilter || undefined,
    },
  });

  const [updateStatus] = useMutation(UPDATE_TRANSACTION_STATUS, {
    refetchQueries: ['GetTransactions'],
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({
        variables: { id, status: newStatus },
      });
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;
  if (error) return <Typography color="error">Ошибка: {error.message}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Транзакции</Typography>
        <IconButton 
          color="primary" 
          onClick={() => setIsDialogOpen(true)}
          sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Тип</InputLabel>
          <Select
            value={typeFilter}
            label="Тип"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="INCOME">Доход</MenuItem>
            <MenuItem value="EXPENSE">Расход</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Статус</InputLabel>
          <Select
            value={statusFilter}
            label="Статус"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Все</MenuItem>
            <MenuItem value="COMPLETED">Выполнено</MenuItem>
            <MenuItem value="PENDING">В обработке</MenuItem>
            <MenuItem value="FAILED">Ошибка</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>Тип</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Описание</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.transactions.map((transaction: any) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {transaction.date ? new Date(parseInt(transaction.date)).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell>{transaction.type === 'INCOME' ? 'Доход' : 'Расход'}</TableCell>
                <TableCell>{transaction.amount.toLocaleString()} ₽</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <Select
                    value={transaction.status}
                    onChange={(e) => handleStatusChange(transaction.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="COMPLETED">Выполнено</MenuItem>
                    <MenuItem value="PENDING">В обработке</MenuItem>
                    <MenuItem value="FAILED">Ошибка</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleStatusChange(transaction.id, 'COMPLETED')}
                  >
                    Завершить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TransactionDialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Box>
  );
}; 