import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ProtectedLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-[inherit] flex-col gap-12">
      <div>
        <Navbar />
        <div className="pt-14 sm:pt-24">{children}</div>
      </div>
      <Footer />
    </section>
  );
}
