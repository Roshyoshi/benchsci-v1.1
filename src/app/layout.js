import "./globals.css";
import { Rubik } from "next/font/google";
import Header from "../components/Header";
import Footer from "../components/Footer";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Benchsci Project",
  description: "Software for parsing briefs and generating summaries",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="@/app/favicon.ico" />
      </head>
      <body className={rubik.className}>
        <Header />
      <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-slate-800 text-white">
        {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
