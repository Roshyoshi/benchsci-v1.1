import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { DocxLoader } from "langchain/document_loaders/fs/docx";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc } from "firebase/firestore";
import fs from "fs";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ success: false });
    }

    console.log(file);

    //TODO: Create DocxLoader and load file
    const loader = new DocxLoader(file);

    console.log(loader)

    
    const document = await loader.load();

    //TODO: convert Docxloader to JSON
    const json = JSON.stringify(document);

    //TODO: Save JSON to firestore
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
    const docRef = await addDoc(collection(db, "file"), {
      file: json,
    });
    console.log("Document successfully written:" + docRef.id);
    const response = docRef.id;

    return NextResponse.json({ success: true, text: response });
  } catch (err) {
    console.log(err);
  }
}
