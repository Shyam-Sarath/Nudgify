export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Nudgify</h1>
        <p className="text-xl text-gray-100 mb-8">Food Marketplace Platform</p>
        <a
          href="/login"
          className="btn-primary text-lg"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
