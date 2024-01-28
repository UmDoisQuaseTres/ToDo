"use client";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex justify-center items-center bg-slate-950 w-full h-[76px]">
      <section
        id="content"
        className="flex items-center justify-between w-full max-w-5xl px-[18px]"
      >
        <nav id="navbar" className="flex items-center">
          <Link href="/">
            <h1 className="text-white text-4xl font-bold">
              Tarefas<span className="text-red-700">+</span>
            </h1>
          </Link>
          {session?.user && (
            <Link
              href="/dashboard"
              className="bg-white py-[4px] px-[14px] rounded-md ml-4"
            >
              <span className="font-semibold text-black">Meu painel</span>
            </Link>
          )}
        </nav>
        {session ? (
          <button
            onClick={() => signOut()}
            className="py-2 px-8 border-[1.5px] rounded-3xl text-white font-bold hover:bg-white hover:text-slate-950 hover:scale-110 transition duration-150 ease-in-out"
          >
            Olá, {session?.user?.name}
          </button>
        ) : (
          <button
            className="py-2 px-8 border-[1.5px] rounded-3xl text-white font-bold hover:bg-white hover:text-slate-950 hover:scale-110 transition duration-150 ease-in-out"
            onClick={() => signIn("google")}
          >
            Acessar
          </button>
        )}
      </section>
    </header>
  );
}
