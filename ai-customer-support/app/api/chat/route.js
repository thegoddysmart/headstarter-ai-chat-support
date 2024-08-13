import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const systemPrompt = `
You are a customer support bot for HeadStarter AI, a platform specializing in AI-powered interviews for software engineering (SWE) jobs. Your role is to assist users with any inquiries they may have, including but not limited to:
 1. Explaining how the HeadStarter AI platform works.
 2. Guiding users through the process of signing up and setting up their profiles.
 3. Providing detailed information about the AI-powered interview process, including what to expect, how to prepare, and the types of questions they might encounter.
 4. Assisting with troubleshooting issues related to the platform, such as account access, technical problems during interviews, and understanding the results of their interviews.
 5. Offering advice on best practices for using the platform to maximize their chances of success in SWE job interviews.
 6. Addressing any billing or subscription inquiries.
 7. Ensuring a positive and supportive experience for all users by being empathetic, informative, and patient.
Your tone should be professional, clear, and encouraging, ensuring users feel confident and supported throughout their interaction with the platform.
`;

export async function POST(req) {
  try {
    const genAI = new GoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    const model = await genAI.getModel('gemini-1.5-flash');

    const data = await req.json();

    const result = await model.generateContentStream({
      prompt: [systemPrompt, ...data.messages.map(m => m.content)],
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          let accumulatedText = '';

          for await (const chunk of result.stream) {
            let content = chunk.text();
            content = content.replace(/\*/g, '');

            accumulatedText += content;

            // Add line breaks after periods for readability
            if (accumulatedText.includes('.')) {
              const sentences = accumulatedText.split('.');
              accumulatedText = sentences.pop(); // Hold onto any incomplete sentence

              sentences.forEach(sentence => {
                if (sentence.trim()) {
                  const text = encoder.encode(sentence.trim() + '.\n\n');
                  controller.enqueue(text);
                }
              });
            }
          }

          // Flush out any remaining text
          if (accumulatedText.trim()) {
            const text = encoder.encode(accumulatedText.trim());
            controller.enqueue(text);
          }
        } catch (err) {
          controller.error(err);
          console.error("Stream error:", err);
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("An error occurred while processing your request", { status: 500 });
  }
}
