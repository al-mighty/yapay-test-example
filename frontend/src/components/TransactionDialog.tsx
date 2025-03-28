import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($type: TransactionType!, $amount: Float!, $description: String!, $date: String!) {
    createTransaction(type: $type, amount: $amount, description: $description, date: $date) {
      id
      type
      amount
      description
      date
      status
    }
  }
`;

interface TransactionDialogProps {
  open: boolean;
  onClose: () => void;
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({ open, onClose }) => {
  const [type, setType] = useState('INCOME');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [createTransaction, { loading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: ['GetTransactions'],
    onCompleted: () => {
      onClose();
      resetForm();
    },
  });

  const resetForm = () => {
    setType('INCOME');
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createTransaction({
        variables: {
          type,
          amount: parseFloat(amount),
          description,
          date: new Date(date).getTime().toString(),
        },
      });
    } catch (err) {
      console.error('Error creating transaction:', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Новая транзакция</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Тип</InputLabel>
              <Select
                value={type}
                label="Тип"
                onChange={(e) => setType(e.target.value)}
              >
                <MenuItem value="INCOME">Доход</MenuItem>
                <MenuItem value="EXPENSE">Расход</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Сумма"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              fullWidth
            />

            <TextField
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Дата"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 