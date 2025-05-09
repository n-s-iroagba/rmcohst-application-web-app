
import { Response } from 'express';
import logger from './logger';

class NotificationService {
  private clients: Map<string, Response[]>;

  constructor() {
    this.clients = new Map();
  }

  addClient(userId: string, res: Response) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.push(res);
      logger.info(`Client added for user ${userId}`);
    }
  }

  removeClient(userId: string, res: Response) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      const index = userClients.indexOf(res);
      if (index > -1) {
        userClients.splice(index, 1);
        logger.info(`Client removed for user ${userId}`);
      }
      if (userClients.length === 0) {
        this.clients.delete(userId);
      }
    }
  }

  sendNotification(userId: string, event: string, data: any) {
    const userClients = this.clients.get(userId);
    if (userClients) {
      userClients.forEach(client => {
        client.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      });
      logger.info(`Notification sent to user ${userId}`);
    }
  }
}

export const notificationService = new NotificationService();
