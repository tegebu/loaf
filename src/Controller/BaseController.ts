import { Express } from 'express';
import { useContainer } from 'routing-controllers';
import { container } from '../Container/Container';
import { APIController } from './API/APIController';

export const BaseController = (app: Express): Express => {
  useContainer(container);
  APIController(app);

  return app;
};
