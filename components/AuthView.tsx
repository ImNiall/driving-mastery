import React, { useState } from 'react';
import { View } from '../types';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from './icons';
import { useSignIn, useSignUp, useClerk } from '@clerk/clerk-react';

interface AuthViewProps {
  defaultMode: 'signin' | 'signup';
  onLogin: () => void;
  onSignUp: () => void;
  setView: (view: View) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ defaultMode, onLogin, onSignUp, setView }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const clerk = useClerk() as any;
  const [needsCode, setNeedsCode] = useState(false);
  const [code, setCode] = useState('');

  const { isLoaded: signInLoaded, signIn, setActive: setActiveFromSignIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp, setActive: setActiveFromSignUp } = useSignUp();

  const isSignUp = mode === 'signup';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (isSignUp) {
        if (!signUpLoaded) throw new Error('Auth not ready');
        if (!needsCode) {
          // 1) Create sign up intent and send code
          let captchaToken: string | undefined;
          try {
            // If bot protection enabled, fetch a token. Fallback if not available.
            captchaToken = (await clerk?.captcha?.getToken?.()) as string | undefined;
          } catch {}
          await (signUp as any).create({ emailAddress: email, password, captchaToken });
          if (fullName) {
            await signUp.update({ firstName: fullName.split(' ').slice(0, -1).join(' ') || fullName, lastName: fullName.split(' ').slice(-1).join(' ') || undefined });
          }
          await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
          setNeedsCode(true);
          setSubmitting(false);
          return;
        } else {
          // 2) Verify the code and complete session
          const res = await signUp.attemptEmailAddressVerification({ code: code.trim() });
          if (res.status === 'complete') {
            await setActiveFromSignUp({ session: res.createdSessionId });
            onSignUp();
          } else {
            // Surface Clerk response to help diagnose
            console.warn('[Clerk] Email verification not complete:', res);
            const message = (res as any)?.errors?.[0]?.message || `Verification not complete (status: ${res.status})`;
            throw new Error(message);
          }
        }
      } else {
        if (!signInLoaded) throw new Error('Auth not ready');
        await signIn.create({ identifier: email, password });
        const attempt = await signIn.attemptFirstFactor({ strategy: 'password', password });
        if (attempt.status === 'complete') {
          await setActiveFromSignIn({ session: attempt.createdSessionId });
        }
        onLogin();
      }
    } catch (err: any) {
      const msg = err?.errors?.[0]?.message || err?.message || 'Authentication failed';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h1 
                    onClick={() => setView('dashboard')} // Go back to landing page by resetting view
                    className="text-3xl font-bold text-brand-blue cursor-pointer mb-2"
                >
                    Driving Mastery
                </h1>
                <h2 className="text-2xl font-bold text-gray-800">{isSignUp ? 'Create Your Account' : 'Welcome Back!'}</h2>
                <p className="text-gray-600 mt-2">{isSignUp ? 'Join now to start your journey to passing.' : 'Sign in to access your dashboard.'}</p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && !needsCode && (
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <UserIcon className="w-5 h-5 text-gray-400" />
                                </span>
                                <input
                                  type="text"
                                  placeholder="e.g. Alex Smith"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                                  required
                                />
                            </div>
                        </div>
                    )}

                    {!needsCode && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </span>
                            <input
                              type="email"
                              placeholder="you@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                              required
                            />
                        </div>
                    </div>)}

                    {!needsCode && (
                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                              required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>)}

                    {isSignUp && needsCode && (
                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Verification code</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          placeholder="Enter the 6-digit code"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">We sent a code to {email}. Check your inbox and spam.</p>
                        <button
                          type="button"
                          onClick={async () => {
                            try {
                              setSubmitting(true);
                              setError(null);
                              await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
                            } catch (e: any) {
                              setError(e?.errors?.[0]?.message || e?.message || 'Failed to resend code');
                            } finally {
                              setSubmitting(false);
                            }
                          }}
                          className="mt-2 text-sm font-semibold text-brand-blue hover:underline"
                          disabled={submitting}
                        >
                          Resend code
                        </button>
                      </div>
                    )}
                    
                    {error && <p className="text-sm text-red-600 mb-2" role="alert">{error}</p>}
                    <button type="submit" disabled={submitting} className="w-full bg-brand-blue text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-60">
                        {isSignUp ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>
            </div>
            
            <div className="text-center mt-6">
                <p className="text-gray-600">
                    {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    <button onClick={() => setMode(isSignUp ? 'signin' : 'signup')} className="font-semibold text-brand-blue hover:underline ml-1">
                        {isSignUp ? 'Sign In' : 'Sign Up'}
                    </button>
                </p>
            </div>
        </div>
    </div>
  );
};

export default AuthView;