# Village Cares

A comprehensive platform offering fitness training, forex trading education, and martial arts instruction.

## Features

- **Fitness Journey**: Personalized workout plans, progress tracking, and fitness education
- **Forex Trading**: Trading signals, educational resources, and market analysis
- **Martial Arts**: Karate training, belt progression tracking, and philosophy

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (Authentication, Database, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/village-cares-forge.git
   cd village-cares-forge
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file based on `.env.example`
   ```bash
   cp .env.example .env
   ```

4. Update the environment variables in the `.env` file with your Supabase credentials

5. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Deployment to Vercel

### Option 1: Deploy from the Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Configure the project:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
7. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel
   ```bash
   vercel login
   ```

3. Deploy the project
   ```bash
   vercel
   ```

4. Follow the prompts to configure your project

### Environment Variables

Make sure to set the following environment variables in your Vercel project:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Project Structure

- `src/components/`: Reusable UI components
- `src/contexts/`: React context providers
- `src/hooks/`: Custom React hooks
- `src/integrations/`: Third-party service integrations
- `src/lib/`: Utility functions and helpers
- `src/pages/`: Application pages
- `src/services/`: Business logic and data services
- `src/types/`: TypeScript type definitions
- `supabase/`: Supabase configuration and migrations

## License

This project is licensed under the MIT License - see the LICENSE file for details.