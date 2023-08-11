import { writeFile } from "fs/promises";
import { extractRawText } from "mammoth";
import { NextResponse } from "next/server";
import { Document } from "langchain/document";

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc } from "firebase/firestore";
import fs from "fs";

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("file");
    const buffer = await file.arrayBuffer();

    if (!file) {
      return NextResponse.json({ success: false });
    }

    console.log(file);

    //TODO: Create DocxLoader and load file
    const text = await extractRawText({ buffer })
    
    
    const document = new Document({
      pageContent: text.value
    });

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
