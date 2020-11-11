import { DataSourceError, MockDataSourceError } from '@jamashita/publikum-error';
import { Superposition } from '@jamashita/publikum-monad';
import { TegeError } from '@tegebu/syrup';
import express, { Express } from 'express';
import { StatusCodes } from 'http-status-codes';
import 'reflect-metadata';
import { useContainer, useExpressServer } from 'routing-controllers';
import sinon, { SinonStub } from 'sinon';
import supertest from 'supertest';
import { container } from '../../../Container/Container';
import { Types } from '../../../Container/Types';
import { ITegeInteractor } from '../../../Interactor/Interface/ITegeInteractor';
import { TegeController } from '../TegeController';

describe('TegeController', () => {
  describe('POST /', () => {
    it('responds CREATED', async () => {
      expect.assertions(1);

      const tegeInteractor: ITegeInteractor = container.get<ITegeInteractor>(Types.TegeInteractor);

      const stub1: SinonStub = sinon.stub();

      tegeInteractor.create = stub1;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));

      const app: Express = express();

      useContainer(container);
      app.use(express.urlencoded({
        extended: false
      }));
      app.use(express.json());
      useExpressServer<Express>(app, {
        controllers: [TegeController]
      });

      const response: supertest.Response = await supertest(app).post('/teges').send({
        name: 'monopoly',
        playingTime: 30,
        players: {
          type: 'unique',
          value: 4
        },
        minAge: 12,
        imagePath: '/root',
        expansion: false
      });

      expect(response.status).toBe(StatusCodes.CREATED);
    });

    it('responds BAD_REQUEST when given body was not convertable to TegeInputJSON', async () => {
      expect.assertions(1);

      const tegeInteractor: ITegeInteractor = container.get<ITegeInteractor>(Types.TegeInteractor);

      const stub1: SinonStub = sinon.stub();

      tegeInteractor.create = stub1;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));

      const app: Express = express();

      useContainer(container);
      app.use(express.urlencoded({
        extended: false
      }));
      app.use(express.json());
      useExpressServer<Express>(app, {
        controllers: [TegeController]
      });

      const response: supertest.Response = await supertest(app).post('/teges').send({
        name: null,
        playingTime: 30,
        players: {
          type: 'unique',
          value: 4
        },
        minAge: 12,
        imagePath: '/root',
        expansion: false
      });

      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });

    it('responds INTERNAL_SERVER_ERROR when tegeInteractor.create() returns Dead.TegeError', async () => {
      expect.assertions(1);

      const tegeInteractor: ITegeInteractor = container.get<ITegeInteractor>(Types.TegeInteractor);

      const stub1: SinonStub = sinon.stub();

      tegeInteractor.create = stub1;
      stub1.returns(Superposition.dead<unknown, TegeError>(new TegeError('test failed')));

      const app: Express = express();

      useContainer(container);
      app.use(express.urlencoded({
        extended: false
      }));
      app.use(express.json());
      useExpressServer<Express>(app, {
        controllers: [TegeController]
      });

      const response: supertest.Response = await supertest(app).post('/teges').send({
        name: 'monopoly',
        playingTime: 30,
        players: {
          type: 'unique',
          value: 4
        },
        minAge: 12,
        imagePath: '/root',
        expansion: false
      });

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });

    it('responds INTERNAL_SERVER_ERROR when  tegeInteractor.create() returns Dead.DataSourceError', async () => {
      expect.assertions(1);

      const tegeInteractor: ITegeInteractor = container.get<ITegeInteractor>(Types.TegeInteractor);

      const stub1: SinonStub = sinon.stub();

      tegeInteractor.create = stub1;
      stub1.returns(Superposition.dead<unknown, DataSourceError>(new MockDataSourceError()));

      const app: Express = express();

      useContainer(container);
      app.use(express.urlencoded({
        extended: false
      }));
      app.use(express.json());
      useExpressServer<Express>(app, {
        controllers: [TegeController]
      });

      const response: supertest.Response = await supertest(app).post('/teges').send({
        name: 'monopoly',
        playingTime: 30,
        players: {
          type: 'unique',
          value: 4
        },
        minAge: 12,
        imagePath: '/root',
        expansion: false
      });

      expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    });
  });
});
