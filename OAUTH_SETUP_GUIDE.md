# OAuth Setup Guide for h2jaan.online

This guide will help you configure Google and GitHub OAuth providers in your Supabase dashboard for the `https://www.h2jaan.online` domain.

## Prerequisites

- Access to your Supabase dashboard
- Google Cloud Console access (for Google OAuth)
- GitHub Developer Settings access (for GitHub OAuth)

## Step 1: Configure Google OAuth

### 1.1 Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add these Authorized redirect URIs:
     ```
     https://zjxksrybibrxqlobnuyb.supabase.co/auth/v1/callback
     https://www.h2jaan.online/auth/callback
     https://www.h2jaan.online
     ```
   - Add these Authorized JavaScript origins:
     ```
     https://www.h2jaan.online
     https://zjxksrybibrxqlobnuyb.supabase.co
     ```
5. Copy the Client ID and Client Secret

### 1.2 Supabase Dashboard Configuration

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (`zjxksrybibrxqlobnuyb`)
3. Go to "Authentication" > "Providers"
4. Find "Google" and click "Edit"
5. Enable Google provider
6. Enter your Google OAuth credentials:
   - **Client ID**: Your Google OAuth Client ID
   - **Client Secret**: Your Google OAuth Client Secret
7. Save the configuration

## Step 2: Configure GitHub OAuth

### 2.1 GitHub Developer Settings

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the application details:
   - **Application name**: `H2jaan Online`
   - **Homepage URL**: `https://www.h2jaan.online`
   - **Application description**: `Portfolio and gaming community platform`
   - **Authorization callback URL**: `https://zjxksrybibrxqlobnuyb.supabase.co/auth/v1/callback`
4. Click "Register application"
5. Copy the Client ID and Client Secret

### 2.2 Supabase Dashboard Configuration

1. In your Supabase Dashboard, go to "Authentication" > "Providers"
2. Find "GitHub" and click "Edit"
3. Enable GitHub provider
4. Enter your GitHub OAuth credentials:
   - **Client ID**: Your GitHub OAuth Client ID
   - **Client Secret**: Your GitHub OAuth Client Secret
5. Save the configuration

## Step 3: Configure Site URL and Redirect URLs

### 3.1 Site URL Configuration

1. In your Supabase Dashboard, go to "Authentication" > "URL Configuration"
2. Set the **Site URL** to: `https://www.h2jaan.online`
3. Add these **Redirect URLs**:
   ```
   https://www.h2jaan.online
   https://www.h2jaan.online/
   https://www.h2jaan.online/auth/callback
   https://www.h2jaan.online/login
   https://www.h2jaan.online/signup
   https://www.h2jaan.online/profile
   ```

### 3.2 Additional Settings

1. **Enable email confirmations**: Recommended for security
2. **Enable phone confirmations**: Optional
3. **Enable email change confirmations**: Recommended
4. **Enable secure email change**: Recommended

## Step 4: Test the Configuration

### 4.1 Test Google OAuth

1. Go to `https://www.h2jaan.online/login`
2. Click "Continue with Google"
3. You should be redirected to Google's consent screen
4. After authorization, you should be redirected back to your site

### 4.2 Test GitHub OAuth

1. Go to `https://www.h2jaan.online/login`
2. Click "Continue with GitHub"
3. You should be redirected to GitHub's authorization screen
4. After authorization, you should be redirected back to your site

## Step 5: Troubleshooting

### Common Issues

1. **Redirect URI mismatch**: Ensure all redirect URIs in Google/GitHub match exactly with Supabase
2. **CORS errors**: Make sure your domain is properly configured in the OAuth providers
3. **Session not persisting**: Check that cookies are enabled and the domain is correct

### Debug Steps

1. Check browser console for errors
2. Verify Supabase logs in the dashboard
3. Test with different browsers/devices
4. Check network tab for failed requests

## Step 6: Security Considerations

1. **HTTPS Only**: Ensure your site is served over HTTPS
2. **Secure Headers**: Consider adding security headers to your site
3. **Rate Limiting**: Monitor for unusual authentication patterns
4. **Session Management**: Regularly review active sessions

## Step 7: Production Checklist

- [ ] Google OAuth configured and tested
- [ ] GitHub OAuth configured and tested
- [ ] Site URL set to production domain
- [ ] All redirect URLs configured
- [ ] Email confirmations enabled
- [ ] Security settings reviewed
- [ ] Error handling implemented
- [ ] User profile creation working
- [ ] Sign out functionality working

## Support

If you encounter issues:

1. Check the [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
2. Review the [OAuth Provider Guides](https://supabase.com/docs/guides/auth/social-login)
3. Check the Supabase community forums
4. Review your browser's developer console for errors

## Environment Variables (Optional)

For additional security, you can move OAuth credentials to environment variables:

```env
# .env.local
VITE_SUPABASE_URL=https://zjxksrybibrxqlobnuyb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Then update your `supabase.js`:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

**Note**: OAuth client secrets should remain in Supabase dashboard for security.
