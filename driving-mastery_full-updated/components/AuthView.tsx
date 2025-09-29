import React, { useState } from 'react';
import { View } from '../types';
import { UserIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, BookOpenIcon } from './icons';

interface AuthViewProps {
  defaultMode: 'signin' | 'signup';
  onLogin: () => void;
  onSignUp: () => void;
  setView: (view: View) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ defaultMode, onLogin, onSignUp, setView }) => {
  const [mode, setMode] = useState(defaultMode);
  const [showPassword, setShowPassword] = useState(false);

  const isSignUp = mode === 'signup';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      onSignUp();
    } else {
      onLogin();
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
                    {isSignUp && (
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <UserIcon className="w-5 h-5 text-gray-400" />
                                </span>
                                <input type="text" placeholder="e.g. Alex Smith" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition" required />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                </svg>
                            </span>
                            <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition" required />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon className="w-5 h-5 text-gray-400" />
                            </span>
                            <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition" required />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-md font-bold text-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
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