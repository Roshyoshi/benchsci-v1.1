import { NextResponse } from "next/server";
import llmHandle from "./llm";
import { readFile } from "fs/promises";

export async function POST(req) {
  const data = await req.formData();
  console.log(data)
  let context = data.values();
  
  context = [...context][0]
  console.log(context)

  if (!context || context.length === 0) {
    context =
      "UI/UX Designer working in Figma to create the layout of the application";
  }

  console.log("User context:" + context)

  const storyTemplate = await readFile("public/user.txt", "utf-8");
  const prompt =
    "Generate 10 user stories based on the project brief for the specificed customer within it. " +
    "The user stories should be returned as html, with a div (div should have a class name of content) surrounding all content and no newlines or anything else."  +
    "For context these user stories will be used by a " +
    context +
    "." +
    " This context is essential so please cater the content of your stories towards this person. " +
    "Here is format for each user story: " +
    storyTemplate;
  const sanitizedPrompt = prompt.replace(/(\r\n|\n|\r)/gm, " ");


  const response = await llmHandle(sanitizedPrompt);

  //Use for debugging
  //const response = "<div>OK</div>"
  
  return NextResponse.json({ success: true, text: response });
}
