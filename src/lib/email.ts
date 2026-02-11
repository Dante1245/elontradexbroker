
'use server';

import nodemailer from 'nodemailer';

interface WelcomeEmailProps {
  to: string;
  name: string;
}

interface WithdrawalRequestEmailProps {
    userId: string;
    userName: string;
    amount: number;
    asset: string;
    address: string;
}

const smtpConfig = {
  host: 'mail.privateemail.com',
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const adminEmail = process.env.ADMIN_EMAIL || 'admin@elontradex.live';

async function sendEmail(mailOptions: nodemailer.SendMailOptions) {
    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
        console.warn(
          'EMAIL_USER or EMAIL_PASS environment variables not set. Skipping sending email.'
        );
        return;
    }
    const transporter = nodemailer.createTransport(smtpConfig);
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to: ${mailOptions.to}`);
    } catch (error) {
        console.error(`Error sending email to ${mailOptions.to}:`, error);
        // Do not throw error to prevent crashing the server action
    }
}

export async function sendWelcomeEmail({ to, name }: WelcomeEmailProps) {
  const emailHtml = `
  <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; color: #333;">
    <h1 style="color: #2962FF;">Welcome to ElonTradeX, ${name}!</h1>
    <p>We're thrilled to have you join the future of finance.</p>
    <p>Your account is now active, and a <strong>$200.00 USDT bonus</strong> has been credited to your portfolio to get you started.</p>
    <p>You can now log in to your dashboard to explore the platform, view live market data, and start trading.</p>
    <a href="https://elontradex.live/login" style="background-color: #2962FF; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-weight: bold;">
      Go to Your Dashboard
    </a>
    <p style="margin-top: 24px;">If you have any questions, feel free to contact our support team at any time.</p>
    <p>Happy trading!</p>
    <p><strong>The ElonTradeX Team</strong></p>
  </div>`;

  await sendEmail({
    from: `"ElonTradeX" <${smtpConfig.auth.user}>`,
    to: to,
    subject: 'Welcome to ElonTradeX - Your Trading Journey Begins!',
    html: emailHtml,
  });
}


export async function sendWithdrawalRequestEmail({ userId, userName, amount, asset, address }: WithdrawalRequestEmailProps) {
    const emailHtml = `
    <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; font-size: 16px; color: #333;">
      <h1 style="color: #2962FF;">New Withdrawal Request</h1>
      <p>A new withdrawal request has been submitted and requires your approval.</p>
      <hr style="border: 0; border-top: 1px solid #eee;">
      <h3 style="color: #333;">Request Details:</h3>
      <ul>
        <li><strong>User ID:</strong> ${userId}</li>
        <li><strong>User Name:</strong> ${userName}</li>
        <li><strong>Amount:</strong> ${amount} ${asset}</li>
        <li><strong>Destination Address:</strong> <code>${address}</code></li>
      </ul>
      <hr style="border: 0; border-top: 1px solid #eee;">
      <p>Please log in to the admin panel to review and process this request.</p>
      <a href="https://elontradex.live/admin" style="background-color: #2962FF; color: white; padding: 14px 25px; text-align: center; text-decoration: none; display: inline-block; border-radius: 8px; font-weight: bold;">
        Go to Admin Panel
      </a>
      <p style="margin-top: 24px; font-size: 12px; color: #777;">This is an automated notification. Please do not reply directly to this email.</p>
    </div>`;
  
    await sendEmail({
      from: `"ElonTradeX System" <${smtpConfig.auth.user}>`,
      to: adminEmail,
      subject: `[ACTION REQUIRED] New Withdrawal Request: ${amount} ${asset} from ${userName}`,
      html: emailHtml,
    });
  }
