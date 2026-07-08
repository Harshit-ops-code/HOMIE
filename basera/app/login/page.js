'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const urlError = searchParams.get('error');

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(urlError ? 'Authentication failed. Please try again.' : '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (isRegister) {
      // Register Mode
      try {
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const regData = await regRes.json();

        if (!regRes.ok) {
          setError(regData.error || 'Registration failed. Please check details.');
          setSubmitting(false);
          return;
        }

        // Auto sign in on success
        const loginRes = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl
        });

        if (loginRes?.error) {
          setError('Registration succeeded, but login failed. Please sign in manually.');
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        setError('Connection error. Please check your internet connection.');
      } finally {
        setSubmitting(false);
      }
    } else {
      // Login Mode
      try {
        const loginRes = await signIn('credentials', {
          redirect: false,
          email,
          password,
          callbackUrl
        });

        if (loginRes?.error) {
          setError('Invalid credentials. Please verify your email and password.');
        } else {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err) {
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleGithubSignIn = () => {
    signIn('github', { callbackUrl });
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col justify-center items-center bg-pattern relative p-6 overflow-hidden w-full">
      {/* Aurora Ambient Background Blurs */}
      <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-indigo-200/30 aurora-blur animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[55vw] h-[55vw] rounded-full bg-pink-200/30 aurora-blur animate-float-reverse"></div>

      {/* Brand Back-Link */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/" className="font-plus-jakarta text-sm font-bold text-primary flex items-center gap-1.5 hover:text-gray-600 transition-colors group">
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
          <span>Back to Basera</span>
        </Link>
      </div>

      {/* Main Glassmorphic Login Card */}
      <div className="glass-panel rounded-card border border-white/60 p-8 w-full max-w-sm shadow-sm relative z-10 flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-1.5">
          <span className="material-symbols-outlined text-[32px] text-primary">vpn_key</span>
          <h2 className="font-plus-jakarta text-xl font-bold text-primary tracking-tight">
            {isRegister ? 'Create Account' : 'Welcome to Basera'}
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            {isRegister ? 'Register your user profile' : 'Access your relocation dashboard'}
          </p>
        </div>

        {/* Local Credentials Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegister && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Harshit"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white border border-outline rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-xs font-semibold text-primary transition-all"
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              placeholder="e.g. name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white border border-outline rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-xs font-semibold text-primary transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-outline rounded-xl py-3 px-4 focus:ring-2 focus:ring-primary/10 focus:border-primary outline-none text-xs font-semibold text-primary transition-all"
            />
          </div>

          {error && (
            <p className="text-xs font-semibold text-error bg-red-50 border border-red-150 px-3.5 py-2.5 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-3.5 rounded-full text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
          >
            {submitting ? 'Processing...' : isRegister ? 'Register & Sign In' : 'Sign In'}
            <span className="material-symbols-outlined text-[16px]">login</span>
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-1">
          <span className="h-[1px] bg-outline/60 flex-grow"></span>
          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">or</span>
          <span className="h-[1px] bg-outline/60 flex-grow"></span>
        </div>

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleGithubSignIn}
            className="w-full bg-white hover:bg-gray-50 border border-outline py-3.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 text-primary shadow-sm"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
            </svg>
            GitHub Account
          </button>
        </div>

        {/* Register Toggle Option */}
        <button
          onClick={() => {
            setIsRegister(!isRegister);
            setError('');
          }}
          className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1 hover:underline hover:text-primary transition-all"
        >
          {isRegister ? 'Already have an account? Sign In' : 'First time here? Create Account'}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex justify-center items-center">
        <p className="text-sm font-bold text-gray-400">Loading Login...</p>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
