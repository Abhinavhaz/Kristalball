import { useState } from 'react';
import axios from 'axios';

const DebugAuth = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        username: 'admin',
        password: 'Admin123!'
      });
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username: 'testuser' + Date.now(),
        email: 'test@example.com',
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User',
        rank: 'Captain',
        role: 'logistics_officer'
      });
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}\n${JSON.stringify(error.response?.data, null, 2)}`);
    }
    setLoading(false);
  };

  const testBackend = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/health');
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Authentication</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testBackend} disabled={loading} style={{ marginRight: '10px' }}>
          Test Backend Health
        </button>
        <button onClick={testLogin} disabled={loading} style={{ marginRight: '10px' }}>
          Test Login
        </button>
        <button onClick={testRegister} disabled={loading}>
          Test Register
        </button>
      </div>

      {loading && <p>Loading...</p>}
      
      <pre style={{ 
        background: '#f5f5f5', 
        padding: '10px', 
        border: '1px solid #ccc',
        whiteSpace: 'pre-wrap',
        maxHeight: '400px',
        overflow: 'auto'
      }}>
        {result || 'Click a button to test...'}
      </pre>
    </div>
  );
};

export default DebugAuth;
