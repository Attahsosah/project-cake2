import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-pink-50">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}