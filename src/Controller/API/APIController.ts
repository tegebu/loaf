import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';
import { TegeController } from './TegeController';

export const APIController = (app: Express): Express => {
  return useExpressServer<Express>(app, {
    controllers: [TegeController]
  });
};
