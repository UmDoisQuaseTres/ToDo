"use client";
import Textarea from "@/components/Textarea";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { db } from "../services/firebaseConection";
import {
  addDoc,
  doc,
  deleteDoc,
  collection,
  orderBy,
  where,
  onSnapshot,
  query,
} from "firebase/firestore";
import Link from "next/link";
import { toast, useToast } from "@/components/ui/use-toast";

interface TasksProps {
  id: string;
  created: Date;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [publicTask, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TasksProps[]>([]);

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas");
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", session?.user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let lista = [] as TasksProps[];
        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });

        setTasks(lista);
      });
    }
    loadTarefas();
  }, [session?.user?.email]);

  function handleChangePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }
  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();
    if (input === "") return;
    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: session?.user?.email,
        public: publicTask,
      });

      setInput("");
      setPublicTask(false);
    } catch (err) {
      console.log(err);
    }
  }
  async function handleShare(id: string) {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/tasks/${id}`
    );
  }
  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
  }

  if (session) {
    return (
      <div id="container" className="w-full">
        <main>
          <section
            id="content"
            className="flex w-full items-center justify-center bg-slate-950"
          >
            <div id="content-form" className="max-w-5xl w-full px-4 pb-7 mt-14">
              <h1 className="text-white text-3xl font-semibold mb-2">
                Qual sua tarefa?
              </h1>
              <form onSubmit={handleRegisterTask}>
                <Textarea
                  placeholder="Digite sua tarefa..."
                  value={input}
                  onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                    setInput(event.target.value)
                  }
                />
                <div id="checkboxarea">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mb-3"
                    checked={publicTask}
                    onChange={handleChangePublic}
                  />
                  <label className="pl-2 text-white">
                    Deixar tarefa pública
                  </label>
                </div>
                <button
                  onClick={() => {
                    toast({
                      title: "Tarefa cadastrada",
                      description: `${new Date().toLocaleString()}`,
                    });
                  }}
                  type="submit"
                  className="w-full border-none rounded-md text-white bg-sky-600 h-[50px] text-lg font-semibold"
                >
                  Registrar
                </button>
              </form>
            </div>
          </section>
          <section
            id="taskcontainer"
            className="flex flex-col w-full max-w-[1024px] mt-8 mr-auto mb-0 ml-auto pt-0 pl-4 "
          >
            <h1 className="text-center text-3xl font-semibold mb-3">
              Minhas tarefas
            </h1>
            {tasks.map((item) => (
              <article
                key={item.id}
                id="task"
                className="flex flex-col items-start border-gray-400 border-[1.5px] mb-3 leading-[150%] rounded-md p-3"
              >
                {item.public && (
                  <div
                    id="tagcontainer"
                    className="flex items-center justify-center mb-2"
                  >
                    <label className="bg-sky-600 mb-[2px] p-[4px] text-sm text-white rounded-[4px]">
                      PUBLICO
                    </label>
                    <button
                      className="bg-transparent border-none mr-2 ml-2 cursor-pointer"
                      onClick={() => handleShare(item.id)}
                    >
                      <FiShare2 size={22} color="#3183ff" />
                    </button>
                  </div>
                )}
                <div
                  id="taskcontent"
                  className="flex w-full items-center justify-between"
                >
                  {item.public ? (
                    <Link href={`/tasks/${item.id}`}>
                      <p className="whitespace-pre-wrap">{item.tarefa}</p>
                    </Link>
                  ) : (
                    <p className="whitespace-pre-wrap">{item.tarefa}</p>
                  )}
                  <button
                    className="cursor-pointer bg-transparent border-none mr-2 ml-2"
                    onClick={() => {
                      handleDeleteTask(item.id);
                      toast({
                        title: "Tarefa deletada",
                        description: `${new Date().toLocaleString()}`,
                      });
                    }}
                  >
                    <FaTrash size={24} color="#ea3140" />
                  </button>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    );
  }
  return redirect("localhost");
}
