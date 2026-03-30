import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendBookingEmails(booking: any) {
  const { email, name, roomName, checkIn, checkOut, totalAmount, tokenAmount, remainingAmount } = booking;

  const userMailOptions = {
    from: `"Sri Ganesh Residency" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Booking Confirmation - Sri Ganesh Residency',
    html: `
      <div style="font-family: 'serif', 'Times New Roman', Times, serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h1 style="color: #6366f1; text-align: center; font-size: 24px;">Booking <span style="font-style: italic;">Confirmed</span></h1>
        <p>Dear ${name},</p>
        <p>Thank you for choosing Sri Ganesh Residency. Your booking for <strong>${roomName}</strong> is confirmed.</p>
        
        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #4b5563;">Stay Details:</h3>
          <p><strong>Check-in:</strong> ${new Date(checkIn).toDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(checkOut).toDateString()}</p>
        </div>

        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #d1d5db;">
          <h3 style="margin-top: 0; color: #4b5563;">Payment Summary:</h3>
          <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
          <p style="color: #6366f1; font-weight: bold;"><strong>Token Paid:</strong> ₹${tokenAmount}</p>
          <p><strong>Remaining Amount (to be paid at hotel):</strong> ₹${remainingAmount}</p>
          <p style="font-size: 14px; color: #6366f1; font-weight: bold; margin-top: 15px;">Note: This ₹500 is your booking confirmation token. Remaining amount will be paid at the hotel.</p>
        </div>

        <p>We look forward to welcoming you to our hotel!</p>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="text-align: center; color: #9ca3af; font-size: 12px;">© ${new Date().getFullYear()} Sri Ganesh Residency. All rights reserved.</p>
      </div>
    `,
  };

  const adminMailOptions = {
    from: `"Sri Ganesh Residency" <${process.env.EMAIL_USER}>`,
    to: 'sriganeshresidencytpt@gmail.com',
    subject: `New Booking: ${name}`,
    html: `
      <h2>New Booking Received</h2>
      <p><strong>Guest:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${booking.phone}</p>
      <p><strong>Room:</strong> ${roomName}</p>
      <p><strong>Check-in:</strong> ${new Date(checkIn).toDateString()}</p>
      <p><strong>Check-out:</strong> ${new Date(checkOut).toDateString()}</p>
      <p><strong>Total Amount:</strong> ₹${totalAmount}</p>
      <p><strong>Token Paid:</strong> ₹${tokenAmount}</p>
      <p><strong>Remaining Amount:</strong> ₹${remainingAmount}</p>
    `,
  };

  try {
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);
  } catch (error) {
    console.error('Failed to send booking emails:', error);
  }
}
