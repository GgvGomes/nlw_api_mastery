import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";

import { getAllPromptsRoute } from "./routers/get-all-prompts";
import { uploadVideoRoute } from "./routers/upload-video";
import { createTranscriptionRoute } from "./routers/create-transcription";
import { generateAICompletionRoute } from "./routers/generate-ai-completion";

const app = fastify();

app.register(fastifyCors, {
  origin: "*",
  // colocar a url do front
});

app.register(getAllPromptsRoute);
app.register(generateAICompletionRoute);
app.register(uploadVideoRoute);
app.register(createTranscriptionRoute);

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
