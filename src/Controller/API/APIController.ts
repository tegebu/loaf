import { Express } from 'express';
import { useExpressServer } from 'routing-controllers';

export const APIController = (app: Express): Express => {
  return useExpressServer<Express>(app, {
    routePrefix: '/',
    controllers: []
  });
};
