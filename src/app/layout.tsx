import "./globals.css";
import Footer from "./footer/page";
import ChatbotWidget from "./chat/page";

export const metadata = {
  title: "StationSync",
  description: "AI powered platform for Kochi MRL",
  icons: {
    icon: "/logo.png", // ✅ from public/
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <ChatbotWidget />
        <Footer />
      </body>
    </html>
  );
}
