import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#e9f8fb]">
        <div className="flex">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Navbar */}
            <Navbar />

            {/* Page Content */}
            <div className="mt-6">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}