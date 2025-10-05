import React, { useState } from 'react';
import { View } from '../types';
import { UserIcon } from './icons';
import SignIn from '../src/routes/SignIn';

interface AuthViewProps {
  defaultMode: 'signin' | 'signup';
  onLogin: () => void;
  onSignUp: () => void;
  setView: (view: View) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ defaultMode, onLogin, onSignUp, setView }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [error] = useState<string | null>(null);

  const handleClearSession = async () => {};

  const isSignUp = mode === 'signup';

  const handleSubmit = async (_e: React.FormEvent) => {};

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
              <SignIn />
            </div>
            
            <div className="text-center mt-6">
                <p className="text-gray-600">Use your email to receive a secure magic link.</p>
            </div>
        </div>
    </div>
  );
};

export default AuthView;