# MetaPrompt - Product Requirements Document v3.3

## AI Prompt Engineering Studio - Complete Technical Specification

---

# TABLE OF CONTENTS

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [Technical Architecture](#3-technical-architecture)
4. [Database Schema](#4-database-schema)
5. [User Authentication Flow](#5-user-authentication-flow)
6. [Frontend Architecture](#6-frontend-architecture)
7. [Component Specifications](#7-component-specifications)
8. [Page Specifications](#8-page-specifications)
9. [API Specifications](#9-api-specifications)
10. [Design System](#10-design-system)
11. [Visual Effects & Animations](#11-visual-effects--animations)
12. [User Flows](#12-user-flows)
13. [Admin Panel](#13-admin-panel)
14. [Feature Specifications](#14-feature-specifications)
15. [Environment Configuration](#15-environment-configuration)
16. [Deployment & Infrastructure](#16-deployment--infrastructure)

---

# 1. EXECUTIVE SUMMARY

## 1.1 Product Name
**MetaPrompt** - AI Prompt Engineering Studio

## 1.2 Version
v3.3 (Production Ready)

## 1.3 Purpose
MetaPrompt is a premium SaaS platform that transforms basic user prompts into high-performance, optimized prompts for leading AI models including GPT-4.5, Claude 3.7, Gemini 2.0, Llama 3.3, Mistral Large 2, and DeepSeek-V3.

## 1.4 Target Users
- AI Developers & Engineers
- Content Creators & Writers
- Business Professionals
- Researchers & Academics
- Marketing Teams
- Anyone using AI models regularly

## 1.5 Core Value Proposition
- Transform basic prompts into expert-level instructions
- Multi-model optimization across 6+ AI providers
- Real-time benchmark scoring for prompt quality
- Version history and prompt management
- Interactive analytics dashboard
- Premium visual experience with 3D-feeling animations

---

# 2. PROJECT OVERVIEW

## 2.1 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Frontend Framework | Next.js | 15.5.7 |
| React Version | React | 19.x |
| Styling | Tailwind CSS | 4.x |
| UI Components | shadcn/ui (Radix primitives) | Latest |
| Animations | Framer Motion | 12.x |
| Authentication | Supabase Auth | 2.x |
| Database | Supabase PostgreSQL | Latest |
| State Management | React Hooks + Context | Native |
| HTTP Client | Fetch API | Native |
| Notifications | Sonner | 2.x |
| Icons | Lucide React | Latest |
| Theme Management | next-themes | Latest |
| Package Manager | npm / bun | Latest |

## 2.2 Project Structure

```
metaprompt/
├── public/                      # Static assets
├── src/
│   ├── app/                     # Next.js App Router pages
│   │   ├── admin/               # Admin panel
│   │   ├── api/                 # API routes
│   │   │   ├── admin/           # Admin API endpoints
│   │   │   └── generate/        # Prompt generation endpoint
│   │   ├── dashboard/           # Main dashboard (Protected)
│   │   ├── login/               # Login page
│   │   ├── signup/              # Signup page
│   │   ├── globals.css          # Global styles + animations
│   │   ├── layout.tsx           # Root layout with particles
│   │   └── page.tsx             # Landing page
│   ├── components/              # React components
│   ├── hooks/                   # Custom React hooks
│   └── lib/                     # Utilities
├── .env.local                   # Environment variables
├── PRD.md                       # This document
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

---

# 3. TECHNICAL ARCHITECTURE

## 3.1 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT BROWSER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Landing    │  │  Dashboard  │  │  Authentication         │ │
│  │  Page       │  │  Pages      │  │  (Login/Signup)         │ │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘ │
│         │                │                      │               │
│  ┌──────▼────────────────▼──────────────────────▼─────────────┐ │
│  │              LIVING PARTICLES + MESH GRADIENT              │ │
│  │              (Full opacity on Landing, 25% on Dashboard)   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                          │                                      │
│  ┌───────────────────────▼───────────────────────────────────┐ │
│  │                    NEXT.JS APP ROUTER                      │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐   │ │
│  │  │ Server      │  │ Client       │  │ API Routes      │   │ │
│  │  │ Components  │  │ Components   │  │ (/api/*)        │   │ │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘   │ │
│  └───────────────────────────────────────────────────────────┘ │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               │ HTTPS
                               │
  ┌──────────────────────────────▼──────────────────────────────────┐
  │                        SUPABASE CLOUD                           │
  │  ┌─────────────────┐  ┌─────────────────┐  ┌────────────────┐  │
  │  │  PostgreSQL     │  │  Auth Service   │  │  Storage       │  │
  │  │  Database       │  │  (OAuth/Email)  │  │  (Files)       │  │
  │  └─────────────────┘  └─────────────────┘  └────────────────┘  │
  └─────────────────────────────────────────────────────────────────┘
```

---

# 4. DATABASE SCHEMA

Refer to section 4.1 in v3.0 for the detailed SQL schema.

---

# 9. API SPECIFICATIONS

## 9.1 POST /api/generate

### Request
```typescript
interface GenerateRequest {
  prompt: string;
  mode: 'standard' | 'precision' | 'creative' | 'safe';
  model: string;
  ultraMode: boolean;
}
```

### Response
```typescript
interface GenerateResponse {
  enhanced_prompt: string;
  benchmark_score: number;
  intent_category: string;
  tags: string[];
  analysis_result: {
    score: number;
    clarity: number;
    specificity: number;
    context: number;
    structure: number;
  };
}
```

---

# 15. ENVIRONMENT CONFIGURATION

## 15.1 Required Environment Variables

```bash
# .env.local

# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenRouter API (Required for live generation)
OPENROUTER_API_KEY=sk-or-v1-...
```

---

# 16. DEPLOYMENT & INFRASTRUCTURE

## 16.1 Deployment
MetaPrompt is fully optimized for **Vercel** deployment. The project uses standard Next.js configuration for seamless one-click deployment.

---

# APPENDIX A: CHANGELOG

## Version 3.3 (Current)
- **DEPLOYMENT READY**: Optimized for Vercel with standard Next.js configuration.
- **BUILD STABILITY**: Cleaned `package.json`, `next.config.ts`, and `layout.tsx` for zero-regression production builds.
- **ENVIRONMENT**: Standardized Supabase and OpenRouter environment variable usage.

## Version 3.2
- **IMPROVED**: Hero section spacing balanced - 50vh mobile, 60vh tablet, 80vh desktop.
- **IMPROVED**: Consistent vertical padding (py-24/28/32) across breakpoints.
- Responsive hero that doesn't get cut off on any screen size.

## Version 3.1
- **NEW**: Glass-card components now have proper backdrop-filter blur (20px).
- **NEW**: Increased card opacity (85% light mode, 90% dark mode).
- **IMPROVED**: Mobile responsive hero section.
- **FIX**: Demo section API response parsing.

## Version 3.0
- **NEW**: Living Particles System (10 animated particles).
- **NEW**: Mesh Gradient Premium background.
- **NEW**: Dashboard view opacity reduction.
- **FIX**: Hydration errors.

---

**Document Version**: 3.3  
**Last Updated**: March 2025  
**Author**: MetaPrompt Development Team
