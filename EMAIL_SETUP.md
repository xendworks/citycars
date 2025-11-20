# Email Setup Guide for Contact Form

The contact form sends emails using Nodemailer with Gmail SMTP. Follow these steps to configure it:

## 1. Enable 2-Factor Authentication on Gmail

1. Go to your Google Account settings: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification**
3. Enable 2-Step Verification if not already enabled

## 2. Create an App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter name: "CityCars Contact Form"
5. Click **Generate**
6. Copy the 16-character app password (remove spaces)

## 3. Update Environment Variables

Add these to your `.env` file:

```bash
# Email Configuration (Gmail)
SMTP_USER=xendworks@gmail.com
SMTP_PASS=your-16-character-app-password-here
```

**IMPORTANT**: Never commit the `.env` file to Git! It's already in `.gitignore`.

## 4. Alternative: Using Different Email Providers

### SendGrid (Recommended for production)
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### AWS SES
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASS=your-ses-smtp-password
```

### Mailgun
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-smtp-username
SMTP_PASS=your-mailgun-smtp-password
```

## 5. Update the API Code (if using non-Gmail)

Edit `server/api/contact.post.ts` and change:

```typescript
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});
```

## 6. Testing

1. Restart your dev server: `pnpm dev`
2. Go to: http://localhost:3000/contact
3. Fill out and submit the form
4. Check the email inbox at xendworks@gmail.com

## Email Features

✅ **Customer receives**: Auto-reply confirmation email
✅ **Admin receives**: Detailed contact form submission at xendworks@gmail.com
✅ **Beautiful HTML**: Branded email templates with CityCars styling
✅ **Reply-to**: Admin can reply directly to customer's email
✅ **Timestamps**: UK timezone formatting

## Troubleshooting

### "Invalid login" error
- Make sure you're using an **App Password**, not your regular Gmail password
- Enable 2-Step Verification first
- Double-check the app password (no spaces)

### Emails not sending
- Check `server/api/contact.post.ts` logs in terminal
- Verify `.env` variables are loaded
- Make sure port 587 is not blocked by firewall

### Emails going to spam
- Add SPF and DKIM records to your domain (for production)
- Use a professional email service like SendGrid or AWS SES
- Avoid spam trigger words in email content

## Production Recommendations

For production, consider:
- **SendGrid** (free tier: 100 emails/day)
- **AWS SES** (very cheap, highly reliable)
- **Mailgun** (good for high volume)

These are more reliable than Gmail for transactional emails and provide better deliverability.

