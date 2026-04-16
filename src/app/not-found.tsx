import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-smoke flex items-center justify-center font-sans">
      <div className="bg-white rounded-xl border border-rule p-10 max-w-sm w-full text-center shadow-lg">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-xl font-bold text-navy mb-2">
          Page not found
        </h1>
        <p className="text-sm text-silver mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        
        <Link
          href="/"
          className="bg-navy text-white px-6 py-2 rounded-lg text-sm font-semibold inline-block hover:opacity-90 transition-opacity"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
