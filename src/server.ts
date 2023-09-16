import { fastify } from "fastify";
import { prisma } from "./lib/prisma";
import { getAllPromptsRoute } from "./routers/get-all-prompts";
import { uploadVideoRoute } from "./routers/upload-video";

const app = fastify();

app.register(getAllPromptsRoute);
app.register(uploadVideoRoute);

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`Server listening at ${address}`);
});
