// import { Message } from "ai/react";
import { streamText, UIMessage, LanguageModel } from 'ai';
import { Pinecone } from '@pinecone-database/pinecone'
import { queryPineconeVectorStore } from "@/utils";
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { NextRequest } from 'next/server';
// import { LanguageModelV1, streamText } from 'ai';

interface StreamTextError extends Error {
  statusCode?: number;
}


const google = createGoogleGenerativeAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GEMINI_API_KEY
});

const model = google('gemini-2.5-flash');

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });

export async function POST(req: NextRequest){
   const reqBody = await req.json();
   
   const messages: UIMessage[] = reqBody.messages;
   messages.map((m)=>console.log(m.parts));

  const lastMessage = messages[messages.length - 1];
  const firstPart = lastMessage.parts[0];
  
  let userQuestion; 

  if (firstPart?.type === "text") {
    userQuestion = firstPart.text;
  } else {
    userQuestion = "";
  }

  console.log("User Question: ",userQuestion);

   const reportData = reqBody.reportData;

   const searchQuey = `Legal Contract or Agreement says: \n${reportData} \n\n ${userQuestion}`;

   const retrievals = await queryPineconeVectorStore(pc,"index-one","rentalSpace",searchQuey);

   const finalPrompt = `Here is a summary of a legal document (e.g., contract, agreement, terms of service) and a user question. Some generic legal insights are also provided that may or may not be relevant to this specific document or jurisdiction.
   Your job: Use the document summary as the primary source to answer the user’s question in clear, plain language. Identify relevant clauses, obligations, rights, timeframes, fees, and risks. If the summary lacks evidence for any part of the answer, state "insufficient evidence in document" and explain what is needed.

   Ensure the response is factually accurate, and demonstrates a thorough understanding of the query topic and the legal document.
   Before answering you may enrich your knowledge by going through the provided legal findings. 
   The legal findings are generic insights and not part of the patient's medical report. Do not include any legal finding if it is not relevant for the user's case.

   Grounding & relevance:
   - Treat the generic legal insights as background only; include them **only** if directly applicable to this document and jurisdiction—otherwise ignore.
   - Do not speculate or invent clauses. If jurisdiction is unclear, state assumptions explicitly.
   - Prefer short quotes or references to the document summary over paraphrases when clarifying key terms.
   
   Privacy & safety:
   - Do not include names, addresses, signature blocks, or other personally identifying details.
   - This is informational assistance, not legal advice.
   
   Output format:
   - Start with a concise answer (3–5 sentences).
   - Then list key relevant clauses with brief explanations.
   - Add a "Risks / Red Flags" section if applicable.
   - When possible, cite the supporting part of the summary in brackets like [Section/Paragraph …].
   
   \n\n**Legal document summary:** 
   ${reportData}
   \n**end of legal document summary** 
   
   \n\n**User Question:**
   ${userQuestion}
   \n**end of user question** 

   **Generic legal insights (background, include only if relevant):**
   ${retrievals}
   **end of generic legal insights**
   
   \n\nProvide thorough justification referencing the document summary first, and only add relevant generic insights where applicable.
   \n\n**Answer:**`;
   
   // Retry wrapper for 429 rate limit errors
   async function safeStreamText( model: LanguageModel, prompt: string ) {
     let delay = 2000; // 2s
     for (let i = 0; i < 3; i++) {
       try {
         return await streamText({ model, prompt });
       } catch (err) {
         const error = err as StreamTextError;
         if (error.statusCode === 429) {
           console.warn(`Rate limit hit. Retrying in ${delay / 1000}s...`);
           await new Promise((r) => setTimeout(r, delay));
           delay *= 2;
         } else {
           throw error;
         }
       }
     }
     throw new Error("Quota exceeded after retries");
   }
   
   let result;
   try {
      result = await safeStreamText( model, finalPrompt);
   } catch (err) {
      const error = err as StreamTextError;
      console.log("Safe Stream Failed", error.message);
      return new Response("Some error occured",{status: 500});
   }

   // const result = await streamText({
   //    model: model,
   //    prompt: finalPrompt
   // });

   return result.toUIMessageStreamResponse();

  // return new Response('dummy response',{status: 200});
}