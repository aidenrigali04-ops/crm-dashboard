# AI Marketing CRM

Next.js dashboard for monitoring AI marketing agents, leads, outreach sequences, and pipeline metrics.

## Setup

1. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Supabase and Anthropic credentials to `.env.local`.

3. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000)

## Stack

- Next.js 14 (App Router)
- Supabase
- Tailwind CSS
- Recharts
- Anthropic Claude (AI chat API at `/api/chat`)
