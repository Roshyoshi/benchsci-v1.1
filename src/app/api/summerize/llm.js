import { OpenAI } from "langchain/llms/openai";
import { OpenAIChat } from "langchain/llms/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
import { DocxLoader } from "langchain/document_loaders/fs/docx";

export default async function llmHandle(text, document) {
  try {
    const APIKey = process.env.OPENAI_API_KEY;
    const model = new OpenAI({
      temperature: 0,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      openAIApiKey: APIKey,
      modelName: "gpt-3.5-turbo-16k",
    });

    const chain = await loadQARefineChain(model);

    const startTime = Date.now();

    console.log(document);

    console.log("Starting generation task...(this may take a while)");
    const callChain = async () => {
      try {
        res = await chain.call({
          input_documents: [document],
          question: text,
        });
        return res
      } catch (err) {
        console.log(err);
      }
    };
    const res = await callChain();
    
    const endTime = Date.now();
    console.log("Generation task completed!");
    console.log(" Result \n --------- \n" + res.output_text);

    console.log(`Completed task in ${endTime - startTime}ms`);
    return res.output_text;
  } catch (err) {
    console.log(err);
    return "Error";
  }
}
