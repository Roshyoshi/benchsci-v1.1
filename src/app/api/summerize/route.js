import { NextResponse } from "next/server";
import llmHandle from "./llm";
import { readFile } from "fs/promises";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, getDoc } from "firebase/firestore";
import { get } from "http";

export async function POST(req) {
  const data = await req.formData();
  console.log(data);
  const parsedData = [...data.values()];
  let context = parsedData[0];
  const file = parsedData[1];

  //TODO: Get DocxLoader from firestore
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "benchsci-292ad.firebaseapp.com",

    projectId: "benchsci-292ad",

    storageBucket: "benchsci-292ad.appspot.com",

    messagingSenderId: "726114407630",

    appId: "1:726114407630:web:f91ee0834b3c128b9b6c9f",
  };

  // Initialize Firebase
  const app = await initializeApp(firebaseConfig);
  const db = await getFirestore(app);

  const docRef = doc(db, "file", file);
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data().file;

  const document = JSON.parse(docData);

  if (!context || context.length === 0) {
    context =
      "UI/UX Designer working in Figma to create the layout of the application";
  }

  console.log("User context:" + context);

  const storyTemplate = await readFile("public/user.txt", "utf-8");
  const prompt =
    "Generate 10 user stories based on the project brief for the specificed customer within it. " +
    "The user stories should be returned as html, with a div (div should have a class name of content) surrounding all content and no newlines or anything else." +
    "For context these user stories will be used by a " +
    context +
    "." +
    " This context is essential so please cater the content of your stories towards this person. " +
    "Here is format for each user story: " +
    storyTemplate;
  const sanitizedPrompt = prompt.replace(/(\r\n|\n|\r)/gm, " ");

  const response = await llmHandle(sanitizedPrompt, document);

  //Use for debugging
  //const response = "<div>OK</div>";

  return NextResponse.json({ success: true, text: response });
}
