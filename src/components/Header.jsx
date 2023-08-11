import Head from "next/head";
import Image from "next/image";
import benchsci from "../assets/benchsci.png"
import Link from "next/link"

export default function Header() {
  return (
    <header className="flex flex-row justify-between items-center gap-5 bg-slate-900 p-5">
      <Link href="/"><Image src={benchsci} className="w-auto h-12"/> </Link>
      <h1 className="text-2xl font-bold text-center text-white">
        Brief Translator 
      </h1>
    </header>
  );
}
