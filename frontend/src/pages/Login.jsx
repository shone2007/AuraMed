import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { HeartPulse, AlertCircle, UserPlus, LogIn, Mail, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStatus, setForgotPasswordStatus] = useState('idle'); // idle, loading, success, error
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      role: 'Patient' // default role for signup
    }
  });
  const { login, register: registerUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setAuthError('');
    setShowForgotPassword(false);
    reset();
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!forgotPasswordEmail) return;
    
    setForgotPasswordStatus('loading');
    try {
      await api.post('/auth/forgotpassword', { email: forgotPasswordEmail });
      setForgotPasswordStatus('success');
      setForgotPasswordMessage('A password reset link has been sent to your email address.');
    } catch (err) {
      setForgotPasswordStatus('error');
      setForgotPasswordMessage(err.response?.data?.message || 'Could not process request');
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    setAuthError('');
    try {
      let user;
      if (isLogin) {
        user = await login(data.email, data.password);
      } else {
        user = await registerUser(data.name, data.email, data.password, 'Patient');
      }
      
      // Redirect based on role
      if (user.role === 'Admin') navigate('/admin/dashboard');
      else if (user.role === 'Doctor') navigate('/doctor/dashboard');
      else if (user.role === 'Patient') navigate('/patient/dashboard');
    } catch (error) {
      setAuthError(typeof error === 'string' ? error : error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-slate-100 transition-all duration-300">
        <div className="text-center mb-8">
          <HeartPulse className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900">
            {isLogin ? 'Portal Login' : 'Create Account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {isLogin ? 'Access your secure dashboard' : 'Join our healthcare portal'}
          </p>
        </div>

        {authError && !showForgotPassword && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 flex items-start">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
            <p className="text-sm text-red-700">{authError}</p>
          </div>
        )}

        {showForgotPassword ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            {forgotPasswordStatus === 'success' ? (
              <div className="text-center py-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Check your email!</h3>
                <p className="text-slate-500 text-sm mb-6">{forgotPasswordMessage}</p>
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="w-full py-2.5 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-5">
                {forgotPasswordStatus === 'error' && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-3 flex items-start">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2 mt-0.5" />
                    <p className="text-xs text-red-700">{forgotPasswordMessage}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Enter your email address to reset</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <button
                    type="submit"
                    disabled={forgotPasswordStatus === 'loading'}
                    className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 disabled:opacity-70 transition-colors"
                  >
                    {forgotPasswordStatus === 'loading' ? 'Processing...' : 'Send Reset Link'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="w-full py-2.5 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.name ? 'border-red-500' : 'border-slate-300'}`}
                {...register('name', { required: !isLogin ? 'Name is required' : false })}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.email ? 'border-red-500' : 'border-slate-300'}`}
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${errors.password ? 'border-red-500' : 'border-slate-300'}`}
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          {!isLogin && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Role selection has been removed for security. All new public registrations default to Patient. */}
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-slate-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">Remember me</label>
              </div>
              <div className="text-sm">
                <button type="button" onClick={() => setShowForgotPassword(true)} className="font-medium text-primary hover:text-blue-800">Forgot password?</button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70 transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {isLogin ? 'Authenticating...' : 'Creating Account...'}
              </span>
            ) : (
              <span className="flex items-center">
                {isLogin ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                {isLogin ? 'Sign In' : 'Sign Up'}
              </span>
            )}
          </button>
          </form>
        )}
        
        <div className="mt-6 text-center text-sm">
          <p className="text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleMode} 
              className="font-medium text-primary hover:text-blue-800 focus:outline-none transition-colors"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        {isLogin && (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <div className="text-xs text-center bg-slate-50 p-3 rounded text-slate-500">
              <p className="font-semibold mb-1">Demo Credentials:</p>
              <div className="grid grid-cols-1 gap-1 text-left inline-block">
                <p><strong>Admin:</strong> admin@hospital.com / Admin@123</p>
                <p><strong>Doctor:</strong> john@hospital.com / Admin@123</p>
                <p><strong>Patient:</strong> jane@gmail.com / Admin@123</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
