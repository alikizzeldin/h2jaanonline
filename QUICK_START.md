# Quick Start: OAuth Setup for h2jaan.online

## 🚀 Immediate Actions Required

### 1. Supabase Dashboard Configuration (5 minutes)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `zjxksrybibrxqlobnuyb`
3. Navigate to **Authentication** > **URL Configuration**
4. Set **Site URL** to: `https://www.h2jaan.online`
5. Add these **Redirect URLs**:
   ```
   https://www.h2jaan.online
   https://www.h2jaan.online/
   https://www.h2jaan.online/auth/callback
   https://www.h2jaan.online/login
   https://www.h2jaan.online/signup
   https://www.h2jaan.online/profile
   ```

### 2. Google OAuth Setup (10 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API** (APIs & Services > Library)
4. Create **OAuth 2.0 Client ID**:
   - Type: Web application
   - **Authorized redirect URIs**:
     ```
     https://zjxksrybibrxqlobnuyb.supabase.co/auth/v1/callback
     https://www.h2jaan.online/auth/callback
     https://www.h2jaan.online
     ```
   - **Authorized JavaScript origins**:
     ```
     https://www.h2jaan.online
     https://zjxksrybibrxqlobnuyb.supabase.co
     ```
5. Copy **Client ID** and **Client Secret**
6. In Supabase: **Authentication** > **Providers** > **Google** > Enable and enter credentials

### 3. GitHub OAuth Setup (5 minutes)

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Fill in:
   - **Application name**: `H2jaan Online`
   - **Homepage URL**: `https://www.h2jaan.online`
   - **Authorization callback URL**: `https://zjxksrybibrxqlobnuyb.supabase.co/auth/v1/callback`
4. Copy **Client ID** and **Client Secret**
5. In Supabase: **Authentication** > **Providers** > **GitHub** > Enable and enter credentials

## 🧪 Test Your Setup

Run the test script to verify configuration:

```bash
npm run test:oauth
```

## ✅ Quick Verification

1. **Test Google OAuth**:
   - Visit: `https://www.h2jaan.online/login`
   - Click "Continue with Google"
   - Should redirect to Google consent screen

2. **Test GitHub OAuth**:
   - Visit: `https://www.h2jaan.online/login`
   - Click "Continue with GitHub"
   - Should redirect to GitHub authorization

## 🔧 Troubleshooting

### Common Issues:

1. **"Redirect URI mismatch"**
   - Ensure all URIs in Google/GitHub match exactly with Supabase
   - Check for trailing slashes and protocol (https://)

2. **"CORS error"**
   - Verify domain is added to authorized origins
   - Check that site is served over HTTPS

3. **"Session not persisting"**
   - Check browser cookies are enabled
   - Verify domain configuration in Supabase

### Debug Steps:

1. Open browser developer tools
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify Supabase logs in dashboard

## 📞 Need Help?

- **Supabase Docs**: [Auth Guide](https://supabase.com/docs/guides/auth)
- **Google OAuth**: [Setup Guide](https://developers.google.com/identity/protocols/oauth2)
- **GitHub OAuth**: [App Setup](https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app)

## 🎯 What's Next?

After OAuth is working:

1. Test user profile creation
2. Verify sign out functionality
3. Test profile setup flow
4. Review security settings
5. Monitor authentication logs

---

**Time Estimate**: 20-30 minutes total setup time

**Difficulty**: Beginner-friendly with step-by-step instructions
