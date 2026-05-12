import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import * as authApi from '../api/auth';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // If already logged in, redirect to the app app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const data = await authApi.login(email, password);
        dispatch(loginSuccess({ user: data.user, token: data.token }));
        navigate('/app');
      } else {
        await authApi.register(name, email, password);
        setIsLogin(true);
        setError('Account created! Please sign in.');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary rotate-12 transition-transform hover:rotate-0">
              <Lock className="h-7 w-7" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center mb-2 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-8">
            {isLogin ? 'Sign in to access your application' : 'Join us to start managing your data'}
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-semibold ml-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    className="flex h-11 w-full rounded-xl border border-input bg-background pl-4 pr-3 py-2 text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  className="flex h-11 w-full rounded-xl border border-input bg-background pl-4 pr-3 py-2 text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold">Password</label>
                {isLogin && (
                  <button type="button" className="text-xs text-primary hover:underline font-medium">
                    Forgot?
                  </button>
                )}
              </div>
              <input
                type="password"
                required
                className="flex h-11 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                isLogin ? 'Sign In' : 'Get Started'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-bold hover:underline transition-all"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
