'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled App Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          We encountered an unexpected error. Please try again or return to the home page.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => reset()}
            className="flex-1 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-zinc-200 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push('/')}
            className="flex-1 bg-zinc-800 text-white font-semibold py-3 px-4 rounded-xl hover:bg-zinc-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
}
