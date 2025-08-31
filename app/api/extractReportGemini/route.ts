import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY!});

const prompt = `Attached is a legal document (such as a contract, agreement, or terms of service). 
Go through the document carefully and identify important clauses, obligations, rights, risks, and unusual terms. Highlight sections that could create financial, legal, or compliance implications. 
Then provide a clear, plain-language summary in about 150 words (you may increase the word limit if the document has multiple pages or complex sections). 
Do not output names, dates, addresses, signatures, or personally identifiable details. 
Make sure to include the document type/title, key clauses, potential risks, and obligations in your summary.
## Summary: `;


export async function POST(req: Request, res: Response){
   const {base64} = await req.json();
   const filePart = fileToGenerativePart(base64);
   
   const contents = [
     filePart,
     { text: prompt },
   ];

   const response = await ai.models.generateContent({
   model: "gemini-2.5-pro",
   contents: contents,
   });

   return new Response(response.text, {status: 200});
}

function fileToGenerativePart(imageData: string) {
    return {
        inlineData: {
            data: imageData.split(",")[1],
            mimeType: imageData.substring(
                imageData.indexOf(":") + 1,
                imageData.lastIndexOf(";")
            ),
        },
    }
}