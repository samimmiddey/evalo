"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

function useInView(ref: React.RefObject<HTMLElement | null>, once = true) {
   const [inView, setInView] = useState(false);
   const triggered = useRef(false);

   useEffect(() => {
      const el = ref.current;
      if (!el || (once && triggered.current)) return;

      const observer = new IntersectionObserver(
         ([entry]) => {
            if (entry.isIntersecting && !triggered.current) {
               setInView(true);
               if (once) {
                  triggered.current = true;
                  observer.disconnect();
               }
            }
         },
         { threshold: 0.1 },
      );
      observer.observe(el);
      return () => observer.disconnect();
   }, [ref, once]);

   return inView;
}

function tokenizeCode(text: string) {
   const tokens: { type: string; value: string }[] = [];
   const regex = /([A-Za-z0-9_]+|['"`][^'"`]*['"`]|[{}()[\]<>/:;.,=+\-*&|?!]+|\s+)/g;
   const parts = text.match(regex) || [];

   for (const part of parts) {
      if (/^\s+$/.test(part)) {
         tokens.push({ type: "whitespace", value: part });
      } else if (/^['"`]/.test(part)) {
         tokens.push({ type: "string", value: part });
      } else if (/^(import|from|export|default|return|if|else|await)$/.test(part)) {
         tokens.push({ type: "control", value: part });
      } else if (/^(function|const|let|var|true|false|new|async|type|interface|div|span|p|h1|h2|h3|button|input|form)$/.test(part)) {
         tokens.push({ type: "keyword", value: part });
      } else if (/^(React|useState|useEffect|useRef|motion|useMemo|useCallback)$/.test(part)) {
         tokens.push({ type: "module", value: part });
      } else if (/^[{}()[\]<>/:;.,=+\-*&|?!]+$/.test(part)) {
         if (part.includes("<") || part.includes(">") || part === "/" || part === "=") {
            tokens.push({ type: "punctuationTag", value: part });
         } else {
            tokens.push({ type: "punctuation", value: part });
         }
      } else if (/^[A-Z][a-zA-Z0-9]*$/.test(part)) {
         tokens.push({ type: "component", value: part });
      } else if (/^[0-9]+$/.test(part)) {
         tokens.push({ type: "number", value: part });
      } else {
         tokens.push({ type: "default", value: part });
      }
   }
   return tokens;
}

const tokenColors: Record<string, string> = {
   control: "text-[#bb9af7]", // import, export, return
   keyword: "text-[#bb9af7]", // const, function, div
   string: "text-[#9ece6a]",
   module: "text-[#7aa2f7]",
   component: "text-[#2ac3de]",
   number: "text-[#ff9e64]",
   punctuation: "text-[#89ddff]",
   punctuationTag: "text-[#89ddff]",
   default: "text-[#c0caf5]",
   whitespace: "",
};

function SyntaxHighlightedText({ text }: { text: string }) {
   const tokens = tokenizeCode(text);

   return (
      <>
         {tokens.map((token, i) => (
            <span key={i} className={tokenColors[token.type]}>
               {token.value}
            </span>
         ))}
      </>
   );
}

export interface TerminalProps {
   code: string;
   filename?: string;
   className?: string;
   typingSpeed?: number;
   initialDelay?: number;
}

export function Terminal({
   code,
   filename = "App.tsx",
   className,
   typingSpeed = 20,
   initialDelay = 500,
}: TerminalProps) {
   const containerRef = useRef<HTMLDivElement>(null);
   const contentRef = useRef<HTMLDivElement>(null);
   const inView = useInView(containerRef);

   const [currentText, setCurrentText] = useState("");
   const [charIdx, setCharIdx] = useState(0);
   const [phase, setPhase] = useState<"idle" | "typing" | "evaluating" | "evaluated" | "done">("idle");
   const [cursorVisible, setCursorVisible] = useState(true);

   useEffect(() => {
      if (!inView || phase !== "idle") return;
      const t = setTimeout(() => setPhase("typing"), initialDelay);
      return () => clearTimeout(t);
   }, [inView, phase, initialDelay]);

   useEffect(() => {
      if (phase !== "typing") return;

      if (charIdx < code.length) {
         const t = setTimeout(
            () => {
               // Type multiple characters at a time for faster realistic typing
               const charsToType = Math.floor(Math.random() * 3) + 1;
               setCurrentText(code.slice(0, charIdx + charsToType));
               setCharIdx((c) => c + charsToType);
            },
            typingSpeed + Math.random() * 20,
         );
         return () => clearTimeout(t);
      } else {
         const t = setTimeout(() => {
            setPhase("evaluating");
         }, 400);
         return () => clearTimeout(t);
      }
   }, [phase, charIdx, code, typingSpeed]);

   useEffect(() => {
      if (phase !== "evaluating") return;
      const t = setTimeout(() => {
         setPhase("evaluated");
      }, 1500); // Simulate running tests
      return () => clearTimeout(t);
   }, [phase]);

   useEffect(() => {
      const interval = setInterval(() => setCursorVisible((v) => !v), 530);
      return () => clearInterval(interval);
   }, []);

   useEffect(() => {
      if (contentRef.current) {
         contentRef.current.scrollTop = contentRef.current.scrollHeight;
      }
   }, [currentText]);

   const lines = currentText.split("\n");

   return (
      <div
         ref={containerRef}
         className={cn(
            "mx-auto w-full max-w-5xl font-mono text-[13px]",
            className,
         )}
      >
         <div className="overflow-hidden rounded-lg border border-[#292e42] bg-[#1a1b26] shadow-2xl backdrop-blur-md">
            {/* Title Bar */}
            <div className="flex items-center bg-[#16161e] px-4 py-2 border-b border-[#292e42]">
               <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#f7768e]" />
                  <div className="h-3 w-3 rounded-full bg-[#e0af68]" />
                  <div className="h-3 w-3 rounded-full bg-[#9ece6a]" />
               </div>
               <div className="flex-1 text-center text-xs text-[#a9b1d6] font-sans">
                  {filename} - evalo
               </div>
               <div className="w-12" />
            </div>

            {/* Tabs */}
            <div className="flex items-center bg-[#16161e] text-xs font-sans">
               <div className="flex items-center bg-[#1a1b26] px-4 py-2 border-t-2 border-[#7aa2f7] text-[#c0caf5] min-w-[120px]">
                  <span className="text-[#7aa2f7] mr-2">TS</span>
                  {filename}
               </div>
            </div>

            {/* Split Content */}
            <div className="flex flex-col md:flex-row h-80 min-h-120">
               {/* Code Content */}
               <div
                  ref={contentRef}
                  className="flex-1 no-visible-scrollbar overflow-y-auto p-4 font-mono text-[13px] leading-[22px] border-b md:border-b-0 md:border-r border-[#292e42]"
               >
                  {lines.map((line, i) => (
                     <div key={i} className="flex">
                        <div className="w-8 shrink-0 text-right pr-4 text-[#3b4261] select-none">
                           {i + 1}
                        </div>
                        <div className="flex-1 whitespace-pre-wrap break-all">
                           <SyntaxHighlightedText text={line} />
                           {i === lines.length - 1 && (
                              <span
                                 className={cn(
                                    "ml-px inline-block h-[15px] w-2 bg-[#c0caf5] align-middle transition-opacity duration-100",
                                    !cursorVisible && (phase === "evaluating" || phase === "evaluated" || phase === "done") && "opacity-0",
                                 )}
                              />
                           )}
                        </div>
                     </div>
                  ))}
               </div>

               {/* Terminal Output */}
               <div className="w-full md:w-[350px] lg:w-[400px] flex flex-col bg-[#16161e] font-mono text-[13px]">
                  <div className="px-4 py-2 border-b border-[#292e42] text-[#565f89] text-xs uppercase tracking-wider flex justify-between items-center">
                     <span>Terminal</span>
                     <span className="text-[#9ece6a] lowercase">bash</span>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto no-visible-scrollbar">
                     {(phase === "evaluating" || phase === "evaluated") && (
                        <div className="text-[#c0caf5] leading-[22px]">
                           <div className="flex items-center gap-2 mb-2 text-[#7aa2f7]">
                              <span className="text-[#ff9e64]">➜</span>
                              <span>npm run test two-sum.spec.ts</span>
                           </div>

                           {phase === "evaluating" && (
                              <div className="text-[#565f89] animate-pulse mt-2">
                                 Running tests...
                              </div>
                           )}

                           {phase === "evaluated" && (
                              <div className="space-y-1 mt-2">
                                 <div className="text-[#9ece6a]">✓ Test Case 1: Passed (2ms)</div>
                                 <div className="text-[#9ece6a]">✓ Test Case 2: Passed (1ms)</div>
                                 <div className="text-[#9ece6a]">✓ Test Case 3: Passed (1ms)</div>
                                 <div className="text-[#9ece6a]">✓ Test Case 4: Passed (1ms)</div>
                                 <div className="mt-4 border-t border-[#292e42] pt-2">
                                    <div className="text-[#7aa2f7] font-bold">All tests passed!</div>
                                    <div className="text-[#ff9e64] mt-1">Score: 100/100</div>
                                    <div className="text-[#565f89] text-xs mt-2">Time complexity: O(N)</div>
                                    <div className="text-[#565f89] text-xs">Space complexity: O(N)</div>
                                 </div>
                              </div>
                           )}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
