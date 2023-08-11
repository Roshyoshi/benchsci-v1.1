"use client";
import React, { useState } from "react";
import axios from "axios";
import { Vortex } from "react-loader-spinner";
import { useRouter } from "next/navigation";
import { Interweave } from "interweave";
import  ContentTitle  from "@/components/ContentTitle";

export default function Home() {
  // Handles the submit event on form submit.
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiresponse] = useState(null);
  const router = useRouter();
  
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const content = event.target.content.value;

    const data = new FormData();
    data.append("text", content);
    const file = localStorage.getItem("text")
    if (!file) {
      alert("Please upload a file first")
      router.push("/")
      return
    }

    data.append("file", file);
    setIsLoading(true);
    // Send the data to the API route
    const response = await axios.post("/api/summerize", data);
    console.log(response);
    const { text } = response.data;
    setAiresponse(text);

    setIsLoading(false);
  };
  return (
    // We pass the event to the handleSubmit() function on submit.
    isLoading ? (
      <div className="flex flex-col items-center">
        <Vortex
          visible={true}
          height="80"
          width="80"
          ariaLabel="vortex-loading"
          wrapperStyle={{}}
          wrapperClass="vortex-wrapper"
          colors={[
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
            "white",
          ]}
        />
        <p>This might take a while...</p>
      </div>
    ) : aiResponse ? (
      <div>
        <ContentTitle />
        <Interweave content={aiResponse} />
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h1 className="text-xl font-semibold">Additional Context</h1>
        <p>
          Enter your role, what tools you use, and what you are working on
          within a sentence.
        </p>
        <div className="flex gap-4 w-max">
          <input
            id="content"
            name="content"
            type="text"
            placeholder="UI/UX Designer working in Figma to create the layout of the application"
            className="border-2 border-gray-300 rounded-md p-2 w-[700px] text-slate-950"
          />
          <button
            type="submit"
            className="border border-white rounded-xl p-4 hover:border-none hover:bg-slate-900"
          >
            Submit
          </button>
        </div>
      </form>
    )
  );
}
