# AI Text Humanizer

A modern web application that transforms AI-generated text into natural, human-like writing using advanced AI technology.

## Features

### Core Features
- Text Humanization
  - Transform AI-generated text into natural writing
  - Multiple tone options (casual, professional, friendly)
  - Adjustable output length
  - Real-time word count

- User Management
  - Secure email/password authentication
  - Personal dashboard
  - Document history
  - Credit system tracking

- Credit System
  - Free credits for new users
  - Multiple subscription tiers
  - Usage tracking
  - Credit balance management

- Document Management
  - Save and organize documents
  - View processing history
  - Track document status
  - Delete unwanted documents

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- Framer Motion
- Radix UI Components

### Backend
- Supabase
  - Authentication
  - Database
  - Edge Functions
  - Row Level Security

## Database Schema

### Tables

#### subscription_tiers
- `id` (uuid, primary key)
- `name` (text)
- `description` (text)
- `credits_per_month` (integer)
- `price` (numeric)
- `features` (jsonb)
- `created_at` (timestamp)

#### user_subscriptions
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `tier_id` (uuid, foreign key)
- `status` (text)
- `current_period_start` (timestamp)
- `current_period_end` (timestamp)
- `created_at` (timestamp)

#### user_credits
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `credits_remaining` (integer)
- `credits_used` (integer)
- `last_reset_at` (timestamp)
- `created_at` (timestamp)

#### documents
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `title` (text)
- `original_text` (text)
- `humanized_text` (text)
- `words_count` (integer)
- `credits_used` (integer)
- `status` (text)
- `created_at` (timestamp)

## Security

### Row Level Security (RLS)
- Enabled on all tables
- User-specific data protection
- Secure credit management
- Authentication-based policies

### Authentication
- Email/password signup and login
- Protected routes
- Session management
- Automatic token refresh

## API Integration

### Humanizer API
- Endpoint: `https://humanize.undetectable.ai`
- Methods:
  - `POST /submit`: Submit text for humanization
  - `POST /document`: Retrieve humanized text
- Error handling and retry logic
- Rate limiting support

### Edge Functions
- Location: `/supabase/functions/humanize`
- Purpose: Text processing and API integration
- CORS handling
- Error management

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   └── link-preview.tsx
│   │   ├── Button.tsx
│   │   ├── Footer.tsx
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   ├── supabaseClient.ts
│   │   └── types.ts
│   ├── pages/
│   │   ├── About.tsx
│   │   ├── Contact.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Home.tsx
│   │   ├── Login.tsx
│   │   ├── NotFound.tsx
│   │   ├── Payment.tsx
│   │   ├── Pricing.tsx
│   │   ├── Rewriter.tsx
│   │   ├── Services.tsx
│   │   └── SignUp.tsx
│   ├── App.tsx
│   └── main.tsx
├── supabase/
│   └── functions/
│       └── humanize/
│           └── index.ts
├── public/
├── package.json
└── README.md
```

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_UNDETECTABLE_API_KEY=your_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment

The application can be deployed to Netlify:

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

Copyright © 2025 Manideep Reddy. All rights reserved.

This project is licensed under the MIT License.