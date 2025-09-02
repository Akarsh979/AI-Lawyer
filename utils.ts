import { Pinecone } from "@pinecone-database/pinecone";
import { InferenceClient } from "@huggingface/inference";
const hf = new InferenceClient(process.env.HUGGING_FACE_TOKEN);

export async function queryPineconeVectorStore(
  client: Pinecone,
  indexName: string,
  namespace: string,
  searchQuey: string
): Promise<string> {
  const hfOutput = await hf.featureExtraction({
    model: "mixedbread-ai/mxbai-embed-large-v1",
    inputs: searchQuey,
  });

  const queryEmbedding = Array.from(hfOutput);

  const index = client.index(indexName);
  const queryResponse = await index.namespace(namespace).query({
    topK: 5,
    vector: queryEmbedding as any,
    includeMetadata: true,
    includeValues: false,
  });

  console.log(queryResponse);

  if (queryResponse.matches.length > 0) {
    const concatenatedRetrievals = queryResponse.matches
      .map(
        (match, index) =>
          `\nLegal Finding ${index + 1}: \n ${match.metadata?.chunk}`
      )
      .join(". \n\n");

      console.log(concatenatedRetrievals);

    return concatenatedRetrievals;
  } else {
    return "<No_Match>";
  }

}
