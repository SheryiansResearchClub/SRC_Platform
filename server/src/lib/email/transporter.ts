import type { Transporter } from '@/types';
import nodemailer from 'nodemailer';
import { emailConfig } from '@/config/email.config';
import { logger } from '@/utils/logger';

class EmailTransporter {
  private transporter: Transporter | null = null;
  private isVerified: boolean = false;

  async getTransporter(): Promise<Transporter> {
    if (this.transporter && this.isVerified) {
      return this.transporter;
    }

    try {
      this.transporter = nodemailer.createTransport({
        service: emailConfig.service,
        auth: emailConfig.auth,
      });

      await this.verifyConnection();
      return this.transporter;
    } catch (error) {
      logger.error('Failed to create email transporter:', error);
      throw new Error('Email service initialization failed');
    }
  }

  private async verifyConnection(): Promise<void> {
    if (!this.transporter) {
      throw new Error('Transporter not initialized');
    }

    try {
      await this.transporter.verify();
      this.isVerified = true;
      logger.info('Email service is ready to send messages');
    } catch (error) {
      this.isVerified = false;
      logger.error('Email service verification failed:', error);
      throw error;
    }
  }

  async checkConnection(): Promise<boolean> {
    try {
      const transporter = await this.getTransporter();
      await transporter.verify();
      return true;
    } catch (error) {
      logger.error('Email connection check failed:', error);
      return false;
    }
  }

  async resetConnection(): Promise<void> {
    this.transporter = null;
    this.isVerified = false;
    await this.getTransporter();
  }
}

export const emailTransporter = new EmailTransporter();