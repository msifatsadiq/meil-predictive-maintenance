import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const { signIn, error, loading } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    try {
      await signIn(email, password);
      navigate('/dashboard');
    } catch (err) {
      setLocalError(err.message || 'Failed to sign in');
    }
  };

  // Demo credentials for quick login
  const demoUsers = [
    { email: 'admin@meil.com', password: 'admin123', role: 'Admin' },
    { email: 'engineer@meil.com', password: 'engineer123', role: 'Engineer' },
    { email: 'viewer@meil.com', password: 'viewer123', role: 'Viewer' },
  ];

  const fillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <span className="text-3xl">🏭</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            MEIL Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Maintenance Engineering Insider Ltd
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {(localError || error) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {localError || error}
                </p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Demo Credentials (click to fill):
            </p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => fillDemo(user.email, user.password)}
                  className="w-full text-left px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.role}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          © 2025 MEIL. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
