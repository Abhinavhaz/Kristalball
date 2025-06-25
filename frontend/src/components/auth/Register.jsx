import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../layout/AuthLayout';
import AuthForm from './AuthForm';

const Register = () => {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const handleRegister = async (formData) => {
    const { confirmPassword, ...registrationData } = formData;
    const result = await register(registrationData);
    if (result && result.success) {
      navigate('/login');
    }
  };

  return (
    <AuthLayout>
      <AuthForm
        type="register"
        loading={loading}
        error={error}
        onSubmit={handleRegister}
        onClearError={clearError}
      />
    </AuthLayout>
  );
};

export default Register;
