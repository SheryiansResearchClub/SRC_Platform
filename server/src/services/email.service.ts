import type { EmailOptions } from '@/types';
import { emailTransporter } from '@/lib/email/transporter';
import { emailTemplates } from '@/lib/email/templates';
import { emailConfig } from '@/config/email.config';
import { logger } from '@/utils/logger';
import { emailRateLimiter } from '@/middleware/rate-limit';

export class EmailService {
  async sendEmail(options: EmailOptions, userId?: string): Promise<boolean> {
    if (userId) {
      const rateLimitCheck = await emailRateLimiter.checkEmailRateLimit(userId);

      if (!rateLimitCheck.allowed) {
        logger.warn('Email rate limit exceeded', {
          userId,
          message: rateLimitCheck.message,
        });
        throw new Error(rateLimitCheck.message || 'Email rate limit exceeded');
      }
    }

    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= emailConfig.retry.maxAttempts; attempt++) {
      try {
        const transporter = await emailTransporter.getTransporter();

        const result = await transporter.sendMail({
          from: `"${emailConfig.from.name}" <${emailConfig.from.email}>`,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text,
          priority: options.priority || 'normal',
        });

        logger.info(`✅ Email sent successfully to ${options.to}`, {
          messageId: result.messageId,
          subject: options.subject,
        });

        if (userId) {
          await emailRateLimiter.incrementCounters(userId);
        }

        return true;
      } catch (error: any) {
        lastError = error;
        logger.error(`❌ Email send attempt ${attempt} failed:`, {
          error: error.message,
          to: options.to,
          subject: options.subject,
        });

        if (attempt < emailConfig.retry.maxAttempts) {
          await this.sleep(emailConfig.retry.delay * attempt);

          if (error.code === 'EAUTH') {
            await emailTransporter.resetConnection();
          }
        }
      }
    }

    logger.error(`❌ Failed to send email after ${emailConfig.retry.maxAttempts} attempts`, {
      to: options.to,
      subject: options.subject,
      error: lastError?.message,
    });

    return false;
  }

  async sendWelcomeEmail(email: string, name: string, userId?: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Welcome to SRC Platform! 🎉',
      html: emailTemplates.welcomeEmail(name),
      text: emailTemplates.plainTextWelcome(name),
    }, userId);
  }

  async sendVerificationEmail(email: string, name: string, token: string, userId?: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Verify Your Email - SRC Platform',
      html: emailTemplates.verifyEmail(name, token),
      priority: 'high',
    }, userId);
  }

  async sendPasswordResetEmail(email: string, name: string, token: string, userId?: string): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: 'Reset Your Password - SRC Platform',
      html: emailTemplates.resetPassword(name, token),
      priority: 'high',
    }, userId);
  }

  async sendTaskAssignedEmail(
    email: string,
    name: string,
    taskTitle: string,
    projectName: string,
    taskId: string,
    userId?: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject: `New Task Assigned: ${taskTitle}`,
      html: emailTemplates.taskAssigned(name, taskTitle, projectName, taskId),
    }, userId);
  }

  async sendNotificationEmail(
    email: string,
    subject: string,
    htmlContent: string,
    userId?: string
  ): Promise<boolean> {
    return this.sendEmail({
      to: email,
      subject,
      html: htmlContent,
    }, userId);
  }

  async checkHealth(): Promise<boolean> {
    try {
      return await emailTransporter.checkConnection();
    } catch (error: unknown) {
      logger.error('Email service health check failed:', error);
      return false;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const emailService = new EmailService();