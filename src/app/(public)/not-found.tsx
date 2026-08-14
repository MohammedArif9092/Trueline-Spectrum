import Link from "next/link";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="font-serif text-7xl font-bold text-green">404</p>
      <h1 className="mt-4 text-2xl font-bold text-navy">Page not found</h1>
      <p className="mt-2 max-w-md text-stone-500">
        The page you’re looking for may have moved, been archived, or never existed.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary"><Home className="h-4 w-4" /> Back to Home</Link>
        <Link href="/search" className="btn-outline"><Search className="h-4 w-4" /> Search the site</Link>
      </div>
    </div>
  );
}
