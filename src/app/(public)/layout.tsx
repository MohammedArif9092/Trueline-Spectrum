import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TrendingTicker } from "@/components/site/TrendingTicker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <TrendingTicker />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
