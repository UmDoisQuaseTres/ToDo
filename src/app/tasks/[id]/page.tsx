"use client";
import Textarea from "@/components/Textarea";
import { db } from "../../services/firebaseConection";
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  collection,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { redirect, usePathname } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import { Metadata } from "next";

interface TaskProps {
  tarefa: string;
  public: boolean;
  created: string;
  user: string;
  taskId: string;
}
interface CommentsProps {
  id: string;
  comment: string;
  user: string;
  name: string;
  taskId: string;
}
const metaData: Metadata = {
  title: "Your Page Title",
  // Add more metadata properties as needed
};
export default function Tasks() {
  //Retrieving the session
  const { data: session } = useSession();

  //UseState for storage the task
  const [task, setTask] = useState<TaskProps>();

  //UseState to storage the input content
  const [input, setInput] = useState("");

  //UseState to store the comment
  const [comment, setComment] = useState<CommentsProps[]>([]);

  //Getting the id param from url
  const urlFull = usePathname();
  const idSplit = urlFull.split("/");
  const id = idSplit[idSplit.length - 1];

  async function handleComments(event: FormEvent) {
    event.preventDefault();
    if (input === "") return;

    if (!session?.user?.name || !session?.user?.email) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: id,
      });
      toast.success("Tarefa cadastrada com sucesso!", {
        style: {
          background: "#dedede",
        },
        className: "class",
      });
      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: id,
      };
      setComment((oldItems) => [...oldItems, data]);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  }

  //useEffect to load tasks from db
  useEffect(() => {
    async function displayDoc() {
      const docRef = doc(db, "tarefas", id);
      const snapshot = await getDoc(docRef);
      if (snapshot.data() === undefined) {
        return redirect("${process.env.NEXT_PUBLIC_URL}");
      }
      if (!snapshot.data()?.public) {
        return redirect("${process.env.NEXT_PUBLIC_URL}");
      }
      const miliseconds = snapshot.data()?.created?.seconds * 1000;
      const task: TaskProps = {
        tarefa: snapshot.data()?.tarefa,
        public: snapshot.data()?.public,
        created: new Date(miliseconds).toLocaleDateString(),
        user: snapshot.data()?.user,
        taskId: id,
      };
      setTask(task);
    }
    displayDoc();
  }, [id]);

  //UseEffect for retrieving all comments
  useEffect(() => {
    async function getComments() {
      const q = query(collection(db, "comments"), where("taskId", "==", id));
      const snapshotComments = await getDocs(q);
      let allComments: CommentsProps[] = [];
      snapshotComments.forEach((doc) => {
        allComments.push({
          id: doc.id,
          comment: doc.data()?.comment,
          user: doc.data()?.user,
          name: doc.data()?.name,
          taskId: doc.data()?.taskId,
        });
        setComment(allComments);
      });
    }
    getComments();
  }, [id]);

  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id);
      await deleteDoc(docRef);
      const deleteComment = comment.filter((item) => item.id !== id);
      setComment(deleteComment);
      toast.success("Comentário deletado com sucesso!", {
        style: {
          background: "#dedede",
        },
        className: "class",
      });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div
      id="container"
      className="flex flex-col justify-center items-center w-full max-w-[1024px] mt-10 mr-auto mb-0 ml-auto pl-4 pr-0"
    >
      <main className="w-full ">
        <h1 className="font-semibold text-4xl mb-3">Tarefa</h1>
        <article
          id="tasks"
          className="flex items-center justify-center border-[1.5px] border-gray-400 p-3 leading-[150%] rounded-md"
        >
          <p className="w-full whitespace-pre-wrap">{task?.tarefa}</p>
        </article>
      </main>

      <section
        id="comments"
        className="w-full max-w-[1024px] mb-[18px] mt-[18px] mr-0 ml-0"
      >
        <h2 className="mt-[14px] mb-[14px] ml-0 mr-0">Deixar comantário</h2>
        <form onSubmit={handleComments}>
          <Textarea
            value={input}
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(event.target.value)
            }
            placeholder="Digite seu comentário..."
          />
          <button
            disabled={!session?.user}
            className="w-full cursor-pointer pb-[12px] pt-[12px] pl-0 pr-0 rounded-[4px] bg-sky-600 text-white font-semibold text-[18px] disabled:bg-sky-400 disabled:cursor-not-allowed"
          >
            Enviar comentário
          </button>
        </form>
      </section>
      <section id="commentcontainer" className="w-full">
        <h1 className="font-semibold text-xl mb-3">Todos os comentários</h1>
        {comment.length === 0 && <span>Nenhum comentário foi encontrado</span>}
        {comment.map((item) => (
          <article
            key={item.id}
            className="border-gray-300 border-[1px] p-3 rounded mb-3"
          >
            <div id="headComment" className="flex items-center">
              <label className="bg-gray-400 pb-1 pt-1 pr-2 pl-2 mr-2 rounded">
                {item.name}
              </label>
              {item.user === session?.user?.email && (
                <button
                  onClick={() => handleDeleteComment(item.id)}
                  className="border-none cursor-pointer"
                >
                  <FaTrash size={14} color="#ea3140" />
                </button>
              )}
            </div>
            <p className="mt-[14px] whitespace-pre-wrap">{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
