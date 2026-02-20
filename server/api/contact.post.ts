import { defineEventHandler, readBody, createError } from 'h3';
import nodemailer from 'nodemailer';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<ContactFormData>(event);

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      throw createError({
        statusCode: 400,
        message: 'Please fill in all required fields'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        message: 'Please provide a valid email address'
      });
    }


    // Create a transporter using Gmail SMTP
    // For production, use environment variables for credentials
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });

    // Email content
    const subjectLine = `[CityCars Contact] ${body.subject} - ${body.name}`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9f9;
          }
          .header {
            background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
          }
          .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: bold;
            color: #f59e0b;
            margin-bottom: 5px;
          }
          .value {
            padding: 10px;
            background-color: #f9f9f9;
            border-left: 3px solid #f59e0b;
            margin-top: 5px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e5e5e5;
            color: #666;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">CITY<span style="color: #fbbf24;">CARS</span></h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">New Contact Form Submission</p>
          </div>
          <div class="content">
            <div class="field">
              <div class="label">From:</div>
              <div class="value">${body.name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${body.email}">${body.email}</a></div>
            </div>
            
            ${body.phone ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value"><a href="tel:${body.phone}">${body.phone}</a></div>
            </div>
            ` : ''}
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${body.subject}</div>
            </div>
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="value" style="white-space: pre-wrap;">${body.message}</div>
            </div>
            
            <div class="footer">
              <p>This email was sent from the CityCars contact form</p>
              <p>Submitted on ${new Date().toLocaleString('en-GB', { 
                dateStyle: 'full', 
                timeStyle: 'short',
                timeZone: 'Europe/London'
              })}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
New Contact Form Submission from CityCars

From: ${body.name}
Email: ${body.email}
${body.phone ? `Phone: ${body.phone}` : ''}
Subject: ${body.subject}

Message:
${body.message}

---
Submitted on ${new Date().toLocaleString('en-GB', { 
  dateStyle: 'full', 
  timeStyle: 'short',
  timeZone: 'Europe/London'
})}
    `.trim();

    // Send email
    const info = await transporter.sendMail({
      from: `"CityCars Contact Form" <${process.env.SMTP_USER || 'noreply@citycars.com'}>`,
      to: 'xendworks@gmail.com',
      replyTo: body.email,
      subject: subjectLine,
      text: textContent,
      html: htmlContent
    });


    // Send auto-reply to customer
    try {
      await transporter.sendMail({
        from: `"CityCars" <${process.env.SMTP_USER || 'noreply@citycars.com'}>`,
        to: body.email,
        subject: 'We received your message - CityCars',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .content {
                background: white;
                padding: 30px;
                border-radius: 0 0 10px 10px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0; font-size: 32px;">CITY<span style="color: #fbbf24;">CARS</span></h1>
              </div>
              <div class="content">
                <h2 style="color: #f59e0b;">Thank you for contacting us!</h2>
                <p>Hi ${body.name},</p>
                <p>We've received your message and our team will get back to you within 24 hours.</p>
                <p>In the meantime, feel free to browse our services or book a ride directly on our website.</p>
                <p style="margin-top: 30px;">Best regards,<br><strong>The CityCars Team</strong></p>
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #666; font-size: 12px;">
                  <p>CityCars - Your Trusted Airport Transfer Service</p>
                  <p><a href="mailto:xendworks@gmail.com" style="color: #f59e0b;">xendworks@gmail.com</a> | <a href="tel:+447123456789" style="color: #f59e0b;">+44 712 345 6789</a></p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      });
    } catch (replyError) {
      console.error('[CONTACT] ⚠️ Failed to send auto-reply:', replyError);
      // Don't fail the request if auto-reply fails
    }

    return {
      success: true,
      message: 'Message sent successfully'
    };
  } catch (error: any) {
    console.error('[CONTACT] ❌ Error sending email:', error);
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to send message. Please try again later or email us directly at xendworks@gmail.com'
    });
  }
});

