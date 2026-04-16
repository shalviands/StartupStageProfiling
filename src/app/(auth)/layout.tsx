export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-smoke flex items-center justify-center p-6 sm:p-0 font-sans">
      <div className="w-full max-w-sm sm:max-w-md">
        {children}
      </div>
    </div>
  )
}
