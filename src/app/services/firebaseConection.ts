import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCMf4k3V1o87bPsnbutUlItoOthNN-rVLE",
  authDomain: "tarefasplus-4f059.firebaseapp.com",
  projectId: "tarefasplus-4f059",
  storageBucket: "tarefasplus-4f059.appspot.com",
  messagingSenderId: "621668383516",
  appId: "1:621668383516:web:efff25b67ad75ac47c58d9"
};


const firebaseApp = initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp)

export {db}