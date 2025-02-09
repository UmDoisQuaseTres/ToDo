"use client";
import Image from "next/image";
import hero from "../../public/hero.png";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./services/firebaseConection";
import { useEffect, useState } from "react";

export default function Home() {
  const [comments, setComments] = useState<number>(0);
  const [posts, setPosts] = useState<number>(0);

  useEffect(() => {
    async function getComments() {
      const commentRef = collection(db, "comments");
      const commentSnapshot = await getDocs(commentRef);
      setComments(commentSnapshot.size);
    }
    getComments();
  });

  useEffect(() => {
    async function getPosts() {
      const postRef = collection(db, "tarefas");
      const postSnapshot = await getDocs(postRef);
      setPosts(postSnapshot.size);
    }
    getPosts();
  });

  return (
    <main>
      <div className="flex flex-col justify-center items-center bg-slate-950 w-full h-[calc(100vh-76px)]">
        <div className="flex flex-col justify-center items-center">
          <Image
            className="max-w-[488px] w-auto h-auto object-contain"
            src={hero}
            alt="Logo tarefas"
            priority
          />
        </div>
        <h1 className="text-white text-center mt-7 font-bold text-4xl">
          Sistema feito para você organizar
          <br /> seus estudos e tarefas.
        </h1>

        <div
          id="infocontent"
          className="flex items-center justify-around gap-6 py-7"
        >
          <section
            id="box"
            className="bg-white px-[44px] py-[14px] rounded-[4px] hover:scale-110 transition duration-75 ease-in-out"
          >
            <span className="text-black">+{posts} posts</span>
          </section>
          <section
            id="box"
            className="bg-white px-[44px] py-[14px] rounded-[4px] hover:scale-110 transition duration-75 ease-in-out"
          >
            <span className="text-black">+{comments} comentarios</span>
          </section>
        </div>
      </div>
    </main>
  );
}
