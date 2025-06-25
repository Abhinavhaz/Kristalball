import { useState } from 'react';
import axios from 'axios';

const SimpleLogin = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123!');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      console.log('Attempting login...');
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password
      });

      console.log('Login response:', response.data);
      
      if (response.data.success) {
        setResult(`✅ Login successful! Token: ${response.data.token.substring(0, 20)}...`);
        // Store token
        localStorage.setItem('token', response.data.token);
      } else {
        setResult('❌ Login failed: No success flag');
      }
    } catch (error) {
      console.error('Login error:', error);
      setResult(`❌ Login error: ${error.message}`);
      if (error.response) {
        setResult(prev => prev + `\nResponse: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult('');

    try {
      console.log('Attempting registration...');
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'testuser' + Date.now(),
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        rank: 'Captain',
        role: 'logistics_officer'
      });

      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        setResult(`✅ Registration successful! Token: ${response.data.token.substring(0, 20)}...`);
        localStorage.setItem('token', response.data.token);
      } else {
        setResult('❌ Registration failed: No success flag');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setResult(`❌ Registration error: ${error.message}`);
      if (error.response) {
        setResult(prev => prev + `\nResponse: ${JSON.stringify(error.response.data, null, 2)}`);
      }
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Simple Login Test</h1>
      
      <form onSubmit={handleLogin} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <button 
          type="button"
          onClick={handleRegister}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none',
            borderRadius: '4px'
          }}
        >
          {loading ? 'Registering...' : 'Test Register'}
        </button>
      </form>

      {result && (
        <div style={{ 
          padding: '10px', 
          backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          whiteSpace: 'pre-wrap'
        }}>
          {result}
        </div>
      )}
    </div>
  );
};

export default SimpleLogin;
