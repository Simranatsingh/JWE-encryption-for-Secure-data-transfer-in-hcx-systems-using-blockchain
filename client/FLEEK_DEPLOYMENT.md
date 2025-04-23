# Deploying to Fleek

This guide will help you deploy the HCX Secure Transfer application to Fleek, a service that allows you to deploy your site to IPFS and access it via the IPFS network or your custom domain.

## Prerequisites

1. Create a Fleek account at [app.fleek.co](https://app.fleek.co/)
2. Connect your GitHub account to Fleek

## Setup Repository for Deployment

1. Ensure your code is pushed to GitHub
2. Login to Fleek and add a new site
3. Select your GitHub repository
4. Configure build settings as follows:

## Fleek Build Configuration

- **Framework**: Vite
- **Docker Image**: node:16
- **Build Command**: `cd client && npm install && npm run build:fleek`
- **Publish Directory**: `client/dist`
- **Base Directory**: `/` (default)
- **Environment Variables**: 
  - `VITE_FLEEK_DEPLOYMENT`: `true`
  - `VITE_SUPABASE_URL`: `https://ekhuscbqsqrljhkzukak.supabase.co`
  - `VITE_SUPABASE_ANON_KEY`: `[your_supabase_anon_key]`

## How the Application Works on Fleek

Since Fleek doesn't support backend services, this deployment has been modified to:

1. Connect directly to Supabase from the frontend
2. Use Supabase Auth for user authentication
3. Use Supabase Database for storing and retrieving data

All API requests that would normally go to the Express backend now go directly to Supabase using the Supabase client.

## Important Notes

- The security model is different when connecting directly to Supabase from the client. Be sure to set up your Supabase Row Level Security (RLS) policies appropriately.
- Make sure your Supabase project has the correct tables and columns as expected by the application.
- This deployment doesn't include blockchain integration. If you need blockchain support, additional configuration will be needed.

## Testing the Deployment

After deploying to Fleek, your site will be available at:
- IPFS URL: `ipfs://[your-ipfs-hash]`
- Fleek URL: `[your-site-name].on.fleek.co`

You can also configure a custom domain in Fleek settings.

## Troubleshooting

If you encounter issues with the deployment:

1. Check the build logs in Fleek
2. Ensure all required environment variables are set
3. Verify your Supabase project has the correct tables and permissions
4. Consider viewing the console logs in your browser for client-side errors 