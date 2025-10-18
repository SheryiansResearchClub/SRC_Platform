export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  priority?: 'high' | 'normal' | 'low';
}