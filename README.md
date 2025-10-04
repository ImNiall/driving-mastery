# Driving Mastery: AI Driving Theory Coach

An interactive platform to help learner drivers master the UK driving theory test through personalized quizzes, learning modules, and AI-powered assistance.

## Features

- **Interactive Quizzes**: Practice with questions similar to the official DVSA test
- **Learning Modules**: Study specific topics to improve your knowledge
- **Progress Tracking**: Monitor your improvement over time
- **AI Chat Assistant**: Get personalized help with difficult concepts
- **Leaderboard**: Compare your progress with other learners

## Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Supabase account
- Clerk account for authentication
- OpenAI API key (optional for chat functionality)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/driving-mastery.git
   cd driving-mastery
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env.local` file based on `.env.local.example`
   ```bash
   cp .env.local.example .env.local
   ```

4. Update the environment variables in `.env.local` with your credentials

5. Start the development server
   ```bash
   npm run dev
   ```

## Environment Setup

### Supabase Configuration

1. Create a new Supabase project
2. Run the SQL scripts in the `scripts` directory to set up the database schema
3. Update your `.env.local` file with the Supabase URL and anon key

### Clerk Dashboard Settings

#### Authorized JavaScript Origins

- [ ] `http://localhost:5173` (Vite dev server)
- [ ] `https://<your-prod-domain>` (Your production domain)
- [ ] `https://<your-netlify-preview-domain>` (Optional, for Netlify preview deployments)

#### Redirect URLs

- [ ] `http://localhost:5173/sign-in`
- [ ] `http://localhost:5173/sign-up`
- [ ] `http://localhost:5173/sso-callback`
- [ ] `https://<your-prod-domain>/sign-in`
- [ ] `https://<your-prod-domain>/sign-up`
- [ ] `https://<your-prod-domain>/sso-callback`

> **Note**: Production instance should be bound to your custom FQDN; development instance uses *.accounts.dev domain.

## Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in the Netlify dashboard
4. Set NODE_VERSION to 20 in the environment variables

## Project Structure

- `components/`: React components
- `hooks/`: Custom React hooks
- `services/`: API and service functions
- `store/`: Zustand state management
- `types/`: TypeScript type definitions
- `constants/`: Application constants
- `scripts/`: Database and utility scripts

## License

This project is licensed under the MIT License - see the LICENSE file for details.
