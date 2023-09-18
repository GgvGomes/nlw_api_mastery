import { FastifyInstance } from "fastify";

import { z } from "zod";
import { prisma } from "../lib/prisma";
import { createReadStream } from "fs";

import {streamToResponse, OpenAIStream} from 'ai'
import { openai } from "../lib/openai";

export async function generateAICompletionRoute(app: FastifyInstance) {
  app.post("/ai/complete", async (req, reply) => {
    const bodySchema = z.object({
      videoId: z.string(),
      // videoId: z.string().uuid(),
      prompt: z.string(),
      temperature: z.number().min(0).max(1).default(0.5),
    });

    const { temperature, prompt, videoId } = bodySchema.parse(req.body);

    const video = await prisma.video.findUniqueOrThrow({
      where: {
        id: videoId,
      },
    });

    if (!video.transcription) {
      return reply.status(400).send({ error: "Transcription not found" });
    }

    const promptMessage = prompt.replace("{transcription}", video.transcription);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k",
      temperature,
      messages: [{ role: "user", content: promptMessage }],
      stream: true,
    });

    const stream = OpenAIStream(response);
    streamToResponse(stream, reply.raw, {
      headers: {
        "Acess-Control-Allow-Origin": "*",
        "Acess-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      }
    });

    return {
      temperature,
      prompt,
      videoId,
    };

    // return "Um testee de retorno";
  });
}
