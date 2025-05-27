/*
  # Insert Initial Subscription Tiers

  1. New Data
    - Free tier with limited credits
    - Pro tier with more features
    - Enterprise tier with unlimited credits

  2. Features
    - Define credit limits
    - Set pricing
    - Configure features
*/

INSERT INTO subscription_tiers (name, description, credits_per_month, price, features)
VALUES
  (
    'Free',
    'Perfect for trying out the service',
    1000,
    0,
    '[
      "1,000 words per month",
      "Basic text humanization",
      "Standard support",
      "Web-based editor"
    ]'::jsonb
  ),
  (
    'Pro',
    'Ideal for content creators and small teams',
    50000,
    29.99,
    '[
      "50,000 words per month",
      "Advanced humanization features",
      "Priority support",
      "API access",
      "Custom tone settings",
      "Plagiarism checker"
    ]'::jsonb
  ),
  (
    'Enterprise',
    'For organizations with high-volume needs',
    -1,
    299.99,
    '[
      "Unlimited words",
      "Custom AI model training",
      "Dedicated support",
      "API access",
      "Custom integrations",
      "Team collaboration",
      "Advanced analytics"
    ]'::jsonb
  );