import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Box, Typography, Card, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { theme } from '../theme';

const SIGNUP_MUTATION = gql`
  mutation Signup($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const SignupForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem('token', data.signup.token);
      setUser(data.signup.user);
      navigate('/');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup({ variables: { email, password, name } });
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Card 
        sx={{ 
          p: 4, 
          width: '100%',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          borderRadius: 2,
          bgcolor: 'background.paper'
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          align="center" 
          sx={{ 
            mb: 4,
            fontWeight: 600,
            color: 'text.primary'
          }}
        >
          Регистрация
        </Typography>
        
        {error && (
          <Typography 
            color="error" 
            sx={{ mb: 2 }} 
            align="center"
            variant="body2"
          >
            {error.message}
          </Typography>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2.5 
          }}
        >
          <TextField
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
            size="medium"
          />

          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="email"
            size="medium"
          />

          <TextField
            label="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="new-password"
            size="medium"
          />

          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            size="large"
            sx={{ 
              mt: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600
            }}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link 
              to="/login" 
              style={{
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontSize: '0.875rem'
              }}
            >
              Уже есть аккаунт? Войти
            </Link>
          </Box>
        </Box>
      </Card>
    </Container>
  );
}; 