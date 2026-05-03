import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md w-full">
        <h1 className="text-8xl font-black bg-gradient-to-r from-teal-400 to-indigo-500 bg-clip-text text-transparent">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Page Not Found</h2>
          <p className="text-zinc-400 text-lg">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="pt-8">
          <Link 
            href="/"
            className="inline-flex items-center justify-center w-full sm:w-auto bg-white text-black font-semibold py-3 px-8 rounded-xl hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
          >
            Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
}
