import "./globals.css";
import { Inter } from "next/font/google";
import { Roboto } from "next/font/google";
import { StateContext } from "@/context/state-context";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";

const inter = Inter({
  subsets: ["latin"],
});

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://shopfineryimports.vercel.app"),
  title: "Shopfinery Imports",
  description: "Save more. Smile more",
};

// Check your code at layout.tsx:14 Error: Unsopported Server Component type:

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>
          <StateContext>
            <Toaster />
            <div className="w-full sticky top-0 z-50">
              <Header />
            </div>
            <main className="flex flex-col md:w-[70%] mx-auto">{children}</main>
            <Footer />
          </StateContext>
        </AuthProvider>
      </body>
    </html>
  );
}
