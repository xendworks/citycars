import { defineEventHandler, readBody, createError } from 'h3';
import nodemailer from 'nodemailer';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Quick validation
    if (!body.userEmail || !body.bookingReference) {
      throw createError({
        statusCode: 400,
        message: 'Missing essential booking data for email'
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-app-password'
      }
    });

    const formatDateTime = (dateString: string) => {
      if (!dateString) return '';
      try {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch {
        return dateString;
      }
    };

    const subject = `Booking Confirmation - ${body.bookingReference} - CityCars`;
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb; border-top: none; }
          .details-box { background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; margin: 20px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #f3f4f6; padding-bottom: 10px; }
          .row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
          .label { color: #6b7280; font-weight: bold; }
          .value { font-weight: bold; color: #111827; text-align: right; }
          .price { color: #ea580c; font-size: 1.25rem; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0; font-size: 28px;">CITY<span style="color: #fbbf24;">CARS</span></h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmed</p>
          </div>
          <div class="content">
            <h2 style="color: #111827; margin-top: 0;">Hi ${body.userName || 'Customer'},</h2>
            <p>Your ride has been successfully booked! Your booking reference is <strong style="color: #ea580c;">${body.bookingReference}</strong>.</p>
            
            <div class="details-box">
              <h3 style="margin-top: 0; margin-bottom: 15px; color: #374151;">Journey Summary</h3>
              
              <div class="row">
                <span class="label">From:</span>
                <span class="value">${body.pickupAddress}</span>
              </div>
              <div class="row">
                <span class="label">To:</span>
                <span class="value">${body.dropoffAddress}</span>
              </div>
              <div class="row">
                <span class="label">Date & Time:</span>
                <span class="value">${formatDateTime(body.pickupDateTime)}</span>
              </div>
              <div class="row">
                <span class="label">Vehicle:</span>
                <span class="value" style="text-transform: capitalize;">${body.cabType}</span>
              </div>
              <div class="row" style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #e5e7eb;">
                <span class="label" style="font-size: 1.1rem; color: #374151;">Total Fare:</span>
                <span class="price">£${Number(body.totalFare).toFixed(2)}</span>
              </div>
            </div>

            <p style="margin-bottom: 5px;"><strong>Payment Method:</strong> ${body.paymentMethod}</p>
            <p style="margin-top: 0; color: #6b7280; font-size: 0.9rem;">
              Please note: if paying by cash, this is payable directly to your driver.
            </p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e5e5; text-align: center; color: #6b7280; font-size: 12px;">
              <p>CityCars - Your Trusted Transfer Service</p>
              <p><a href="mailto:xendworks@gmail.com" style="color: #f59e0b; text-decoration: none;">xendworks@gmail.com</a> | <a href="tel:+447123456789" style="color: #f59e0b; text-decoration: none;">+44 712 345 6789</a></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the email to the user
    await transporter.sendMail({
      from: `"CityCars Bookings" <${process.env.SMTP_USER || 'noreply@citycars.com'}>`,
      to: body.userEmail,
      subject: subject,
      html: htmlContent
    });

    // Option: notify admin
    try {
      await transporter.sendMail({
        from: `"CityCars Bookings" <${process.env.SMTP_USER || 'noreply@citycars.com'}>`,
        to: 'xendworks@gmail.com', // To the business owner
        subject: `NEW BOOKING - ${body.bookingReference} - ${body.pickupAddress}`,
        html: htmlContent
      });
    } catch(e) {}

    return { success: true, message: 'Confirmation email sent' };
  } catch (error: any) {
    console.error('[EMAIL] Failed to send booking confirmation', error);
    throw createError({
      statusCode: 500,
      message: 'Failed to send confirmation email'
    });
  }
});
