import { ArrowLeft, BookCheck, Brain, MessageSquare, User } from "lucide-react";
import { InterviewsData, InterviewerDetails } from "./interviews.types";
import { InterviewExpertise } from "@/generated/prisma/enums";

export const interviewsData: InterviewsData = {
   header: {
      title: "Find your perfect interviewer",
      description: "Connect with industry experts from top companies for mock interviews, career guidance, and technical mentorship."
   },
   expertise: [
      {
         label: "Frontend",
         value: "FRONTEND"
      },
      {
         label: "Backend",
         value: "BACKEND"
      },
      {
         label: "FullStack",
         value: "FULLSTACK"
      },
      {
         label: "DevOps",
         value: "DEVOPS"
      },
      {
         label: "DSA",
         value: "DSA"
      },
      {
         label: "System Design",
         value: "SYSTEM_DESIGN"
      },
      {
         label: "Mobile",
         value: "MOBILE"
      },
      {
         label: "Machine Learning",
         value: "ML_AI"
      },
      {
         label: "Security",
         value: "SECURITY"
      },
      {
         label: "QA",
         value: "QA"
      },
      {
         label: "Cloud",
         value: "CLOUD"
      }
   ],
   experience: [
      {
         label: 'Entry Level (0-2 yrs)',
         value: '0-2'
      },
      {
         label: 'Mid Level (3-5 yrs)',
         value: '3-5'
      },
      {
         label: 'Senior (6-9 yrs)',
         value: '6-9'
      },
      {
         label: 'Staff+ (10+ yrs)',
         value: '10+'
      }
   ]
};

export const interviewerDetailsData: InterviewerDetails = {
   backBtn: {
      title: "Back to Interviewers",
      icon: ArrowLeft
   },
   creditRate: 1,
   bio: {
      title: "About Me",
      icon: User
   },
   testimonial: {
      title: "Candidate Reviews",
      icon: MessageSquare
   },
   booking: {
      title: "Book a Session",
      icon: BookCheck
   },
   whatToExpect: {
      header: {
         title: 'What to expect',
         icon: Brain,
      }
   },
   interviewers: [
      {
         id: "int_1",
         firstName: "Sarah",
         lastName: "Chen",
         imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200",
         designation: "Staff Software Engineer",
         company: "Google",
         experience: 8,
         bio: "Sarah is a staff front-end architect at Google with 8+ years of experience. She specializes in large-scale React systems, performance tuning, and technical system design interviews.",
         expertise: ["FRONTEND", "FULLSTACK", "SYSTEM_DESIGN"],
         averageRating: 4.9,
         totalRatings: 142,
         availabilities: [
            { startTime: "2026-08-10T09:00:00Z", endTime: "2026-08-10T10:00:00Z" },
            { startTime: "2026-08-10T11:00:00Z", endTime: "2026-08-10T12:00:00Z" },
            { startTime: "2026-08-11T14:00:00Z", endTime: "2026-08-11T15:00:00Z" },
            { startTime: "2026-08-11T16:00:00Z", endTime: "2026-08-11T17:00:00Z" },
            { startTime: "2026-08-12T10:00:00Z", endTime: "2026-08-12T11:00:00Z" },
         ],
         testimonials: [
            {
               id: "t1",
               authorName: "Marcus Aurelius",
               role: "Frontend Engineer @ Stripe",
               rating: 5,
               comment: "Sarah's mock interview was extremely realistic. Her feedback on component design and state management helped me land my offer at Stripe!",
               date: "2 weeks ago"
            },
            {
               id: "t2",
               authorName: "Elena Rostova",
               role: "Software Engineer",
               rating: 5,
               comment: "Super detailed comments on Javascript performance and rendering cycles. Highly recommended if you want to push for a senior role.",
               date: "1 month ago"
            }
         ]
      },
      {
         id: "int_2",
         firstName: "David",
         lastName: "Kovacs",
         imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200",
         designation: "Senior Backend Architect",
         company: "Netflix",
         experience: 10,
         bio: "David leads cloud platform initiatives at Netflix. He has extensive expertise in distributed systems, microservices design, and Go/Java scaling patterns.",
         expertise: ["BACKEND", "SYSTEM_DESIGN", "CLOUD"],
         averageRating: 4.8,
         totalRatings: 98,
         availabilities: [
            { startTime: "2026-08-10T10:00:00Z", endTime: "2026-08-10T11:00:00Z" },
            { startTime: "2026-08-10T15:00:00Z", endTime: "2026-08-10T16:00:00Z" },
            { startTime: "2026-08-12T13:00:00Z", endTime: "2026-08-12T14:00:00Z" },
            { startTime: "2026-08-13T09:00:00Z", endTime: "2026-08-13T10:00:00Z" },
         ],
         testimonials: [
            {
               id: "t3",
               authorName: "Julianne V.",
               role: "Backend Dev",
               rating: 5,
               comment: "Amazing feedback on system scalability. He pointed out single points of failure in my architecture that I hadn't even considered.",
               date: "3 days ago"
            }
         ],
      },
      {
         id: "int_3",
         firstName: "Sophia",
         lastName: "Bennett",
         imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
         designation: "Engineering Lead",
         company: "Microsoft",
         experience: 12,
         bio: "Aisha is a dev lead at Microsoft who loves helping engineers prep for technical interviews. She has deep expertise in DSA, Full Stack systems, and leadership coaching.",
         expertise: ["FULLSTACK", "DSA", "DEVOPS"],
         averageRating: 5.0,
         totalRatings: 184,
         availabilities: [
            { startTime: "2026-08-11T09:00:00Z", endTime: "2026-08-11T10:00:00Z" },
            { startTime: "2026-08-11T10:30:00Z", endTime: "2026-08-11T11:30:00Z" },
            { startTime: "2026-08-13T16:00:00Z", endTime: "2026-08-13T17:00:00Z" },
         ],
         testimonials: [
            {
               id: "t4",
               authorName: "Kofi A.",
               role: "Software Dev II",
               rating: 5,
               comment: "Aisha's behavioral advice was just as valuable as her technical advice. She really knows what hiring managers look for in top-tier candidates.",
               date: "1 month ago"
            }
         ]
      }
   ]
};

export const EXPERTISE_PROMPTS: Record<InterviewExpertise, string> = {
   FRONTEND: "React.js, Next.js, JavaScript (ES6+), TypeScript, HTML5, CSS3, Tailwind CSS, State Management (Redux, Zustand, React Query), Web Performance, Core Web Vitals, SSR, ISR, SSG, DOM Manipulation, Browser APIs, Client-side Caching, Component Lifecycle, Accessibility (a11y), Responsive Design, Micro-frontends",
   BACKEND: "Node.js, Express, NestJS, Python (Django/FastAPI), Go, Java (Spring Boot), RESTful APIs, GraphQL, gRPC, Microservices Architecture, Relational Databases (PostgreSQL, MySQL), NoSQL (MongoDB, Redis), ORMs (Prisma, TypeORM), Authentication & Authorization (JWT, OAuth2, RBAC), Caching Strategies, Message Queues (Kafka, RabbitMQ), API Rate Limiting, Concurrency, WebSockets",
   FULLSTACK: "End-to-End Web Architecture, Frontend Frameworks (React, Next.js), Backend Runtimes (Node.js, Python), REST & GraphQL API Design, Database Design & Query Optimization (SQL & NoSQL), State Management, SSR & Static Site Generation, Authentication Flows, CI/CD Integration, Fullstack Testing, Performance Tuning, Security Best Practices",
   DEVOPS: "Docker Containerization, Kubernetes Orchestration, Helm, CI/CD Pipelines (GitHub Actions, GitLab CI), Infrastructure as Code (Terraform, CloudFormation), Monitoring & Observability (Prometheus, Grafana, Datadog), Linux System Administration, Nginx/Reverse Proxies, Cloud Networking, Security Automation, Zero-downtime Deployments",
   DSA: "Data Structures (Arrays, Linked Lists, Stacks, Queues, Hash Tables, Trees, BSTs, Heaps, Graphs, Tries), Algorithmic Techniques (Two Pointers, Sliding Window, Binary Search, Divide & Conquer, Dynamic Programming, Greedy, Backtracking, BFS/DFS, Topological Sort), Time & Space Complexity Analysis (Big-O), Recursion, Sorting & Searching Algorithms",
   SYSTEM_DESIGN: "High-Level System Architecture, Horizontal vs Vertical Scaling, Load Balancing, Caching Layers (CDN, Distributed Cache), Database Sharding & Replication, CAP Theorem, Event-Driven Architecture, Message Brokers (Kafka, RabbitMQ), Microservices vs Monolith, Distributed Transactions, Fault Tolerance, Rate Limiting, High Availability, Disaster Recovery",
   MOBILE: "React Native, Flutter, iOS (Swift, SwiftUI, UIKit), Android (Kotlin, Jetpack Compose), Cross-Platform Architecture, Mobile Performance Optimization, Offline Storage & Sync (SQLite, Realm, WatermelonDB), Push Notifications, Native Modules & Bridges, Memory Management, Mobile Security, App Store & Play Store Release Pipelines",
   ML_AI: "Machine Learning Fundamentals, Deep Learning (PyTorch, TensorFlow), Large Language Models (LLMs), Prompt Engineering, Retrieval-Augmented Generation (RAG), Vector Databases (Pinecone, Chroma, pgvector), Embeddings, Fine-Tuning, NLP, Computer Vision, MLOps, Model Evaluation & Metrics, AI Agents & Tool Calling",
   SECURITY: "OWASP Top 10 Vulnerabilities (XSS, CSRF, SQLi, SSRF), Authentication & Authorization (OAuth2, OIDC, SAML, JWT), Cryptography & Encryption (AES, RSA, TLS/HTTPS), Public Key Infrastructure (PKI), Zero-Trust Architecture, Threat Modeling, Secure Code Review, Network Security, API Security, IAM & Role-Based Access Control, Penetration Testing",
   QA: "Test Automation Frameworks (Playwright, Cypress, Selenium), Unit & Integration Testing (Jest, Vitest, React Testing Library), Test-Driven Development (TDD), End-to-End (E2E) Testing, Performance & Load Testing (k6, JMeter), API Testing (Postman, Supertest), CI/CD Automated Test Suites, Bug Triage & Reporting, Test Coverage & Quality Gates",
   CLOUD: "Cloud Computing Platforms (AWS, GCP, Azure), Cloud Architecture Patterns, Serverless Computing (AWS Lambda, Cloud Functions), Cloud Storage (S3, Cloud Storage), Cloud Networking (VPC, Subnets, Gateways, Route Tables, CloudFront/CDN), Identity and Access Management (IAM), Cloud Security & Compliance, Auto-Scaling, Cost Optimization, Multi-Region Redundancy",
};