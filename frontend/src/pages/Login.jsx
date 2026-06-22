import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HeartPulse, AlertCircle } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError('');
    try {
      const user = await login(data.email, data.password);
      // Redirect based on role
      if (user.role === 'Admin') navigate('/admin/dashboard');
      else if (user.role === 'Doctor') navigate('/doctor/dashboard');
      else if (user.role === 'Patient') navigate('/patient/dashboard');
    } catch (error) {
      setAuthError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-slate-100">
        <div className="text-center mb-8">
          <HeartPulse className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">Portal Login</h2>
          <p className="mt-2 text-sm text-slate-600">Access your secure dashboard</p>
        </div>

        {authError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <p className="text-sm text-red-700">{authError}</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-primary hover:text-blue-800">Forgot password?</a>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
          >
            {isLoading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 border-t border-slate-200 pt-6">
          <div className="text-sm text-center bg-slate-50 p-4 rounded text-slate-600">
            <p className="font-semibold mb-2">Demo Credentials:</p>
            <p>Admin: admin@hospital.com / Admin@123</p>
            <p>Doctor: john@hospital.com / Admin@123</p>
            <p>Patient: jane@gmail.com / Admin@123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
