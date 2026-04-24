"use client";

import { Terminal } from "@/components/ui/terminal";
import { motion } from "motion/react";

export function TerminalCard() {
   return (
      <motion.div
         initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
         animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
         transition={{
            duration: 0.5,
            delay: 1.25,
            ease: "easeInOut",
         }}
         className="w-full pt-14 lg:pt-16 2xl:pt-20 relative z-999"
      >
         <Terminal
            commands={[
               "npx create-next-app@latest my-app --typescript",
               "cd my-app && npm install ai @anthropic-ai/sdk",
               "cat app/api/chat/route.ts",
               "curl -X POST http://localhost:3000/api/chat -d '{\"message\": \"Hello\"}'",
            ]}
            outputs={{
               0: [
                  "✔ Would you like to use TypeScript? Yes",
                  "✔ Would you like to use Tailwind CSS? Yes",
                  "✔ Created my-app in 3.2s",
               ],
               1: [
                  "added 42 packages in 4s",
               ],
               2: [
                  "import Anthropic from '@anthropic-ai/sdk';",
                  "export const runtime = 'edge';",
                  "export async function POST(req: Request) {",
                  "  const { message } = await req.json();",
                  "  const stream = await client.messages.stream({...});",
                  "  return stream.toDataStreamResponse();",
                  "}",
               ],
               3: [
                  "< HTTP/1.1 200 OK",
                  "< Content-Type: text/event-stream",
                  "",
                  "data: {\"type\":\"content\",\"text\":\"Hello\"}",
                  "data: {\"type\":\"content\",\"text\":\" there!\"}",
                  "data: [DONE]",
               ],
            }}
            typingSpeed={45}
            delayBetweenCommands={1000}
            initialDelay={2000}
         />
      </motion.div>
   );
}
