import express, { Express } from 'express';
import { VidShareNowServer } from '@bootstrap/setupServer.bootstrap';
import databaseConnection from '@bootstrap/setupDatabase.bootstrap';
import { config } from '@configs/configEnv';

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();

    const app: Express = express();
    const server: VidShareNowServer = new VidShareNowServer(app);
    server.start();
  }

  private loadConfig(): void {
    config.validateConfigEnv();
  }
}

const application: Application = new Application();
application.initialize();
