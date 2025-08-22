# Supabase Email Template Customization

## Overview

Yes, you can customize the Supabase auth confirmation email template! This is done through the Supabase dashboard, not in your code.

## How to Customize Email Templates

### 1. Access Email Templates

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `zjxksrybibrxqlobnuyb`
3. Navigate to **Authentication** > **Email Templates**

### 2. Available Templates

You can customize these email templates:

- **Confirm signup** - Email sent when users sign up
- **Invite user** - Email sent when inviting users
- **Magic Link** - Email sent for passwordless sign-in
- **Change email address** - Email sent when changing email
- **Reset password** - Email sent for password reset

### 3. Customization Options

For each template, you can customize:

#### **Subject Line**
- Change the email subject
- Example: `"Welcome to H2jaan Online - Confirm Your Account"`

#### **Email Content**
- HTML and text versions
- Use variables like `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .Token }}`
- Add your branding, colors, and styling

#### **Available Variables**
```
{{ .ConfirmationURL }} - The confirmation link
{{ .Email }} - User's email address
{{ .Token }} - Confirmation token
{{ .TokenHash }} - Hashed token
{{ .SiteURL }} - Your site URL
{{ .RedirectTo }} - Redirect URL after confirmation
```

### 4. Example Custom Template

Here's an example of a customized confirmation email:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome to H2jaan Online</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; 
                  padding: 15px 30px; text-decoration: none; border-radius: 5px; 
                  font-weight: bold; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎮 Welcome to H2jaan Online!</h1>
            <p>Your gaming portfolio and community platform</p>
        </div>
        
        <div class="content">
            <h2>Confirm Your Account</h2>
            <p>Hi there! 👋</p>
            <p>Thanks for joining <strong>H2jaan Online</strong>! To complete your registration and start exploring your gaming portfolio, please confirm your email address.</p>
            
            <div style="text-align: center;">
                <a href="{{ .ConfirmationURL }}" class="button">
                    ✅ Confirm My Email
                </a>
            </div>
            
            <p><strong>What happens next?</strong></p>
            <ul>
                <li>✅ Confirm your email address</li>
                <li>🎮 Set up your gaming profile</li>
                <li>👥 Connect with other gamers</li>
                <li>🏆 Track your achievements</li>
            </ul>
            
            <p><em>If you didn't create an account with H2jaan Online, you can safely ignore this email.</em></p>
        </div>
        
        <div class="footer">
            <p>© 2024 H2jaan Online. All rights reserved.</p>
            <p>This email was sent to {{ .Email }}</p>
        </div>
    </div>
</body>
</html>
```

### 5. Text Version (Plain Text)

Also customize the plain text version:

```
Welcome to H2jaan Online!

Hi there!

Thanks for joining H2jaan Online! To complete your registration and start exploring your gaming portfolio, please confirm your email address.

Confirm your email: {{ .ConfirmationURL }}

What happens next?
✅ Confirm your email address
🎮 Set up your gaming profile
👥 Connect with other gamers
🏆 Track your achievements

If you didn't create an account with H2jaan Online, you can safely ignore this email.

© 2024 H2jaan Online. All rights reserved.
This email was sent to {{ .Email }}
```

### 6. Branding Tips

- **Colors**: Use your brand colors (primary: #667eea, secondary: #764ba2)
- **Logo**: Add your logo to the header
- **Typography**: Use consistent fonts
- **Call-to-Action**: Make the confirmation button prominent
- **Mobile-Friendly**: Ensure emails look good on mobile devices

### 7. Testing

After customizing:

1. **Test the template** using the "Send test email" feature
2. **Check on different email clients** (Gmail, Outlook, etc.)
3. **Verify mobile responsiveness**
4. **Test the confirmation flow** end-to-end

### 8. Advanced Customization

For more advanced customization, you can:

- **Use custom domains** for sending emails
- **Set up email templates** programmatically via API
- **Add dynamic content** based on user data
- **Implement email analytics** and tracking

### 9. Best Practices

- Keep emails concise and focused
- Use clear call-to-action buttons
- Include your branding consistently
- Test across different email clients
- Follow email marketing best practices
- Include unsubscribe options where required

## Quick Setup Steps

1. Go to Supabase Dashboard > Authentication > Email Templates
2. Click on "Confirm signup" template
3. Customize the subject line and content
4. Add your branding and styling
5. Test the template
6. Save your changes

## Support

If you need help with email customization:
- [Supabase Email Templates Documentation](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase Community Forums](https://github.com/supabase/supabase/discussions)
- [Email Template Best Practices](https://supabase.com/docs/guides/auth/auth-email-templates#best-practices)
