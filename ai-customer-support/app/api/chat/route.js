import {NextResponse} from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `You are a customer support bot for HeadStarter AI, a platform specializing in AI-powered interviews for software engineering (SWE) jobs. Your role is to assist users with any inquiries they may have, including but not limited to:
 1. Explaining how the HeadStarter AI platform works.
 2. Guiding users through the process of signing up and setting up their profiles.
 3. Providing detailed information about the AI-powered interview process, including what to expect, how to prepare, and the types of questions they might encounter.
 4. Assisting with troubleshooting issues related to the platform, such as account access, technical problems during interviews, and understanding the results of their interviews.
 5. Offering advice on best practices for using the platform to maximize their chances of success in SWE job interviews.
 6. Addressing any billing or subscription inquiries.
 7. Ensuring a positive and supportive experience for all users by being empathetic, informative, and patient.
Your tone should be professional, clear, and encouraging, ensuring users feel confident and supported throughout their interaction with the platform.`

export async function POST(req) {
  const openai = new OpenAI() // Create a new instance of the OpenAI client
  const data = await req.json() // Parse the JSON body of the incoming request

  // Create a chat completion request to the OpenAI API
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: systemPrompt}, ...data], // Include the system prompt and user messages
    model: 'gpt-4o', // Specify the model to use
    stream: true, // Enable streaming responses
  })

  // Create a ReadableStream to handle the streaming response
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder() // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content // Extract the content from the chunk
          if (content) {
            const text = encoder.encode(content) // Encode the content to Uint8Array
            controller.enqueue(text) // Enqueue the encoded text to the stream
          }
        }
      } catch (err) {
        controller.error(err) // Handle any errors that occur during streaming
      } finally {
        controller.close() // Close the stream when done
      }
    },
  })

  return new NextResponse(stream) // Return the stream as the response
}
