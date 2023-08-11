"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import icon from "@/assets/Icon.gif";
import Image from "next/image";



export default function Home() {
  const [file, setFile] = useState(null);
  const [res, setRes] = useState(null); // [status, message]
  const router = useRouter();
  const { toast } = useToast();


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        throw new Error("No file provided");
      } else if (file.name.split(".").pop() !== "docx") {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please upload a .docx file",
        });
        throw new Error("Invalid file type");
      }

      const data = new FormData();
      data.set("file", file);

      const res = await axios.post("/api/upload", data)
      // handle the error
      console.log(res)
      if (res.status !== 200) {
        throw new Error("Something went wrong");
      }
      console.log(res)
      const { text } = res.data;
      console.log(text)
      localStorage.setItem("text", text);
      setRes(["success", "File uploaded successfully!"]);
    } catch (e) {
      let title, description;
      // Handle errors here
      if (e.message === "No file provided") {
        title = "No file provided";
        description = "Please upload a file";
      } else if (e.message === "Invalid file type") {
        title = "Invalid file type";
        description = "Please upload a .docx file";
      } else {
        title = "Error";
        description = "Something went wrong";
      }
      console.log(e)
      setRes([title, description]);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-40 max-w-[1000px] justify-between items-center gap-50">
      {/*This should probably be a component*/}
      {!res ? (
        <div className=" text-center font-light">
          {" "}
          <h1 className="text-4xl text-mediumf">Project Brief Translator</h1>
          Simple tool to translate a complicatated project brief into easy to
          understand user stories that you can implement! Download your project
          prief as a .docx and insert it here for it to be turned into a user
          stories.
        </div>
      ) : (
        <></>
      )}
      <form onSubmit={(e) => onSubmit(e)}>
        <div className="flex items-center justify-center gap-5">
          {res == null ? (
            <input
              type="file"
              name="file"
              onChange={(e) => setFile(e.target.files?.[0])}
              className="border border-gray-300 rounded-md p-2 block"
            />
          ) : (
            <div className=" rounded-xl p-4 m-9 flex flex-col items-start border gap-4  bg-slate-900 border-gray-400">
              <h1 className="text-4xl font-medium">{res[0]}</h1>
              <p>
                File Name:{" "}
                <span className="text-center text-large font-medium underline text-sky-700">
                  {file.name}
                </span>
              </p>
              <p className="text-center font-bold">{res[1]}</p>
            </div>
          )}
          {res == null ? (
            <button
              type={file === null ? "button" : "submit"}
              className={`border border-slate-200 rounded-xl p-2 max-w-sm  ${
                file === null
                  ? "hover:bg-zinc-500 hover:border-none hover:text-zinc-200"
                  : "hover:bg-slate-900 hover:text-white hover:border-none"
              }`}
            >
              Upload
            </button>
          ) : (
            <button
              type="button"
              className="border border-gray-400 rounded-xl p-2 max-w-lg hover:bg-slate-900 hover:text-white hover:border-none"
              onClick={() => {
                if (res[0] === "success") {
                  router.push("/prompt");
                } else {
                  setRes(null);
                  setFile(null);
                }
              }}
            >
              Continue
            </button>
          )}
        </div>
      </form>
      {res == null ? (
        <div className="flex  items-center justify-between gap-5">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-auto h-40 fill-white">
            <path d="M 20.875 2.5625 L 20.1875 3.3125 L 18.5 5.09375 L 14.90625 5.09375 L 14.90625 8.59375 L 13.1875 10.40625 L 12.5 11.125 L 14.6875 13.3125 L 3.03125 25 L 2.3125 25.71875 L 3.03125 26.40625 L 6.3125 29.6875 L 7 28.96875 L 18.6875 17.3125 L 20.875 19.5 L 21.59375 18.8125 L 23.40625 17.09375 L 26.90625 17.09375 L 26.90625 13.5 L 28.6875 11.8125 L 29.4375 11.125 L 26.90625 8.59375 L 26.90625 5.09375 L 23.40625 5.09375 Z M 20.90625 5.4375 L 22.28125 6.8125 L 22.59375 7.09375 L 24.90625 7.09375 L 24.90625 9.40625 L 25.1875 9.71875 L 26.5625 11.09375 L 25.21875 12.375 L 24.90625 12.65625 L 24.90625 15.09375 L 22.59375 15.09375 L 22.3125 15.375 L 20.90625 16.71875 L 20.09375 15.90625 L 24.625 11.375 L 20.65625 7.40625 L 19.9375 8.09375 L 16.125 11.9375 L 15.28125 11.09375 L 16.625 9.6875 L 16.90625 9.40625 L 16.90625 7.09375 L 19.34375 7.09375 L 19.625 6.78125 Z M 20.65625 10.21875 L 21.78125 11.375 L 6.3125 26.875 L 5.15625 25.71875 Z M 19 21 L 19 22 L 18 22 L 18 24 L 19 24 L 19 25 L 21 25 L 21 24 L 22 24 L 22 22 L 21 22 L 21 21 Z M 25 23 L 25 25 L 23 25 L 23 27 L 25 27 L 25 29 L 27 29 L 27 27 L 29 27 L 29 25 L 27 25 L 27 23 Z" />
          </svg>
          <div className="flex flex-col gap-3">
            <h1 className="font-medium font-2xl">Ditch steps A to B</h1>
            <div className="font-light">
              No more back to back calls and googling technical jargon! Submit
              your project brief and get the user stories that you need in the
              format you want them.
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
