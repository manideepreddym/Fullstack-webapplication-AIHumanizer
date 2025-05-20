# AI Text Humanizer

A modern web application that transforms AI-generated text into natural, human-like writing using advanced AI technology.

![AI Humanizer Screenshot](https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## Live Demo

Visit the live application: [AI Humanizer]([https://ai-humanizer.netlify.app](https://classy-buttercream-de19d5.netlify.app)

## Features

- **Text Humanization**
  - Transform AI-generated text into natural writing
  - Multiple tone options (casual, professional, friendly)
  - Adjustable output length
  - Real-time word count

- **User Management**
  - Secure email/password authentication
  - Personal dashboard
  - Document history
  - Credit system tracking

- **Credit System**
  - Free credits for new users
  - Multiple subscription tiers
  - Usage tracking
  - Credit balance management

- **Document Management**
  - Save and organize documents
  - View processing history
  - Track document status
  - Delete unwanted documents

## Tech Stack

- **Frontend**
  - React 18
  - TypeScript
  - Tailwind CSS
  - Lucide Icons

- **Backend**
  - Supabase
  - PostgreSQL
  - Row Level Security
  - Edge Functions

- **Authentication**
  - Supabase Auth
  - Protected Routes
  - Session Management

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ai-humanizer.git
   ```

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

## Database Schema

### Tables

- `subscription_tiers`: Subscription plans and features
- `user_subscriptions`: User subscription management
- `user_credits`: Credit tracking system
- `documents`: Document storage and processing

### Security

- Row Level Security (RLS) enabled on all tables
- User-specific data protection
- Secure credit management

## API Integration

The application integrates with Undetectable AI's humanizer API for text processing:

- Secure API communication
- Rate limiting
- Asynchronous processing
- Error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

Copyright © 2025 Manideep Reddy. All rights reserved.

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue or contact the maintainers.
