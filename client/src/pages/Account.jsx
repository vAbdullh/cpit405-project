import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../store/authSlice';
import * as profileApi from '../api/profile';
import { User, Lock, Mail, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function Account() {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isFetching, setIsFetching] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch latest user details on mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsFetching(true);
        setError('');
        const data = await profileApi.getProfile();

        // Sync fetched data with local state
        setName(data.user.name || '');
        setEmail(data.user.email || '');

        // Also keep Redux store up to date
        dispatch(updateUser({ name: data.user.name, email: data.user.email }));
      } catch (err) {
        console.error('Failed to load profile details:', err);
        setError(err.message || 'Failed to load user profile information.');
        // Fallback to redux user details if backend fetch fails
        if (currentUser) {
          setName(currentUser.name || '');
          setEmail(currentUser.email || '');
        }
      } finally {
        setIsFetching(false);
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validations
    if (!name.trim()) {
      setError('Full Name is required.');
      return;
    }

    const hasPassword = password.length > 0;
    if (hasPassword) {
      if (password !== confirmPassword) {
        setError('New Passwords do not match.');
        return;
      }

      // Password strength validation (length >= 8, uppercase, lowercase, number, special character)
      if (password.length < 8) {
        setError('New Password must be at least 8 characters long.');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError('New Password must contain at least one uppercase letter.');
        return;
      }
      if (!/[a-z]/.test(password)) {
        setError('New Password must contain at least one lowercase letter.');
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError('New Password must contain at least one number.');
        return;
      }
      if (!/[^A-Za-z0-9]/.test(password)) {
        setError('New Password must contain at least one special character/symbol.');
        return;
      }
    }

    try {
      setIsUpdating(true);
      const updateData = { name: name.trim() };
      if (hasPassword) {
        updateData.password = password;
      }

      const response = await profileApi.updateProfile(updateData);

      // Update Redux state & localStorage
      dispatch(updateUser({ name: response.user.name }));

      // Clear password fields on success
      setPassword('');
      setConfirmPassword('');

      setSuccess('Your profile has been updated successfully!');
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during update.');
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanged = name.trim() !== (currentUser?.name || '') || password.length > 0 || confirmPassword.length > 0;

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Loading account details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-3 py-4 animate-in fade-in duration-300">
      <div className="space-y-2 border-b border-border pb-6">
        <h2 className="text-4xl font-bold tracking-tight uppercase">Account Profile</h2>
      </div>

      {error && (
        <div className="p-4 border-2 border-destructive bg-destructive/5 text-destructive flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase text-xs block mb-1">Error</span>
            <p className="text-sm font-medium">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 border-2 border-green-600 bg-green-600/5 text-green-600 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase text-xs block mb-1">Success</span>
            <p className="text-sm font-medium">{success}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="border-2 border-border p-8 bg-card space-y-6">
        {/* Email Field (READ ONLY) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider block text-muted-foreground">
            Email Address (Non-Changeable)
          </label>
          <div className="relative flex items-center border border-border bg-secondary">
            <div className="absolute left-3 text-muted-foreground">
              <Mail className="w-5 h-5" />
            </div>
            <input
              type="email"
              disabled
              readOnly
              className="w-full h-12 pl-10 pr-4 bg-transparent text-sm font-medium text-muted-foreground outline-none cursor-not-allowed"
              value={email}
            />
          </div>
          <p className="text-xs text-muted-foreground italic font-serif">
            Email addresses are securely tied to your profile and cannot be changed.
          </p>
        </div>

        {/* Username Field (EDITABLE) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider block text-foreground">
            Full Name
          </label>
          <div className="relative flex items-center border border-border focus-within:border-primary transition-all">
            <div className="absolute left-3 text-muted-foreground">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              required
              className="w-full h-12 pl-10 pr-4 bg-background text-sm font-medium outline-none"
              placeholder="e.g. Abdullah Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="border-t border-border my-8 pt-6 space-y-6">
          <div>
            <h3 className="text-lg font-bold uppercase tracking-tight">Change Password</h3>
            <p className="text-xs text-muted-foreground font-serif">
              Leave these fields blank if you do not wish to update your current password.
            </p>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider block text-foreground">
              New Password
            </label>
            <div className="relative flex items-center border border-border focus-within:border-primary transition-all">
              <div className="absolute left-3 text-muted-foreground">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                className="w-full h-12 pl-10 pr-4 bg-background text-sm font-medium outline-none"
                placeholder="Enter a secure password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground font-serif leading-relaxed">
              Must be at least 8 characters, combining uppercase and lowercase letters, numbers, and symbols/special characters.
            </p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider block text-foreground">
              Confirm New Password
            </label>
            <div className="relative flex items-center border border-border focus-within:border-primary transition-all">
              <div className="absolute left-3 text-muted-foreground">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                className="w-full h-12 pl-10 pr-4 bg-background text-sm font-medium outline-none"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground font-serif leading-relaxed">
              Confirm your secure password. Must match the new password entered above.
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUpdating || !hasChanged}
          className="w-full h-12 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs border border-transparent hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving updates...</span>
            </>
          ) : (
            <span>Save Profile Updates</span>
          )}
        </button>
      </form>
    </div>
  );
}
