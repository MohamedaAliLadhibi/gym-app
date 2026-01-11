const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendWelcomeEmail(email, name) {
    try {
      if (!process.env.EMAIL_ENABLED || process.env.EMAIL_ENABLED === 'false') {
        console.log(`📧 Email disabled: Welcome email would be sent to ${email} for ${name}`);
        return true;
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@gymapp.com',
        to: email,
        subject: 'Welcome to GymApp! 🏋️‍♂️',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4F46E5;">Welcome to GymApp, ${name}! 👋</h1>
            <p>Thank you for joining GymApp. We're excited to help you achieve your fitness goals!</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1F2937;">Getting Started:</h3>
              <ul>
                <li>📋 Create your first workout</li>
                <li>📊 Track your progress</li>
                <li>🎯 Set fitness goals</li>
                <li>📱 Download our mobile app</li>
              </ul>
            </div>
            <p>Start your fitness journey today!</p>
            <p>Best regards,<br>The GymApp Team</p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error.message);
      return false;
    }
  }

  async sendPasswordResetEmail(email, resetToken) {
    try {
      if (!process.env.EMAIL_ENABLED || process.env.EMAIL_ENABLED === 'false') {
        console.log(`📧 Email disabled: Password reset email would be sent to ${email}`);
        return true;
      }

      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: process.env.EMAIL_FROM || 'noreply@gymapp.com',
        to: email,
        subject: 'Reset Your GymApp Password',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4F46E5;">Password Reset Request</h2>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}" 
                 style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #6B7280; font-size: 14px;">
              This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`✅ Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to send password reset email:', error.message);
      return false;
    }
  }
}

module.exports = new EmailService();