import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <p className="font-serif text-7xl font-bold text-green">404</p>
      <h1 className="mt-4 text-2xl font-bold text-navy">Page not found</h1>
      <p className="mt-2 max-w-md text-stone-500">The page you’re looking for could not be found.</p>
      <Link href="/" className="btn-primary mt-6">Back to Home</Link>
    </div>
  );
}
