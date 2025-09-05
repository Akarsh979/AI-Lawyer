# AI Lawyer

AI Lawyer is an advanced legal document analysis and Q&A platform. It leverages state-of-the-art AI and a custom knowledge base to help users analyze contracts, agreements, and other legal documents, providing actionable insights and answers to legal queries.

---

## 🚀 Features

- **Contract & Agreement Analysis**: Upload legal documents (PDF or image) and receive a concise, plain-language summary.
- **Key Clause Extraction**: Automatically highlights key relevant clauses, obligations, rights, and unusual terms.
- **Risk & Red Flag Detection**: Identifies potential risks, compliance issues, and red flags in your documents.
- **Custom Legal Q&A**: Ask questions about your uploaded document and get grounded, document-specific answers.
- **Custom Knowledge Base**: Built on a private, extensible knowledge base containing legal documents, acts, laws, and more. You can update or expand the knowledge base as needed.
- **Free Embedding Generation**: Embeddings for legal documents are created locally using [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) and pushed to Pinecone vector DB. See [this repo](https://github.com/Akarsh979/RAG) for the embedding pipeline. The app uses LangChain to load, parse, and process documents, and updates the vector database in real time with progress feedback.
- **Modern, Responsive UI**: Clean, user-friendly interface with support for dark mode and mobile devices.

---

## 🛠️ Tech Stack

- **Next.js** (React, App Router)
- **TypeScript**
- **Tailwind CSS**
- **Pinecone** (Vector Database)
- **LangChain** (Document loading, parsing, and chunking)
- **@ai-sdk/google** (Gemini LLM for text generation)
- **@pinecone-database/pinecone** (Vector search)
- **@huggingface/inference** (Embedding generation)
- **Shadcn** (UI)

---

## 📚 Custom Knowledge Base

- The app is built on a private, extensible knowledge base containing legal documents, acts, laws, and more.
- You can update or expand the knowledge base at any time by adding new documents and re-running the embedding pipeline.
- Embeddings are generated for free locally using [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) and pushed to Pinecone. See the [RAG repo](https://github.com/Akarsh979/RAG) for details.

---

## 📝 How It Works

1. **Upload Document**: Upload a contract or agreement (PDF or image). The app extracts and summarizes key information.
2. **Document Analysis**: The AI highlights key clauses, obligations, risks, and red flags.
3. **Ask Questions**: Enter your legal question. The AI answers using both the document and the custom knowledge base.
4. **Knowledge Base Search**: Relevant legal insights are retrieved from the knowledge base and used to enrich the answer.

---

## 📂 Supported File Types
- PDF (.pdf)
- Images (.jpg, .jpeg, .png, .webp)

---

## 🏗️ Local Embedding Pipeline
- Embeddings are created for free using [mixedbread-ai/mxbai-embed-large-v1](https://huggingface.co/mixedbread-ai/mxbai-embed-large-v1) locally.
- The embedding and Pinecone push pipeline is open source: [RAG repo](https://github.com/Akarsh979/RAG)

---

## 🧑‍💻 Getting Started

1. Clone this repo and install dependencies:
   ```bash
   git clone <this-repo-url>
   cd AI-Lawyer
   npm install
   ```
2. Set up environment variables for Pinecone, Gemini, and HuggingFace tokens.
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 License

This project is for educational and informational purposes only. It does not provide legal advice. Always consult a qualified attorney for legal matters.
