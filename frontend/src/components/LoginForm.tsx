import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Box, Typography, Card, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.login.token);
      setUser(data.login.user);
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ variables: { email, password } });
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        bgcolor: 'background.default'
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Вход в систему
        </Typography>
        
        {error && (
          <Typography color="error" sx={{ mb: 2 }} align="center">
            {error.message}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
            autoFocus
          />

          <TextField
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
          />

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            size="large"
            sx={{ mt: 2 }}
          >
            {loading ? 'Вход...' : 'Войти'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link 
              to="/signup" 
              style={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              Нет аккаунта? Зарегистрироваться
            </Link>
          </Box>
        </Box>
      </Card>
    </Box>
  );
}; 