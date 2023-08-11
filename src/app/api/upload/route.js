import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("file");

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const path = "public/current.docx";

  //If current file exists, delete it
  try {
    await fs.unlinkSync(path);
  } catch (err) {
    console.log(err);
  }

  async function content(path) {  
  return await readFile(path, 'utf8')
}



  await writeFile(path, buffer);

  return NextResponse.json({ success: true });
}
