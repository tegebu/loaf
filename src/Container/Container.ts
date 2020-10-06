import { Container } from 'inversify';
import { ILogger } from '../Infrastructure/Interface/ILogger';
import { logger } from '../Infrastructure/Logger';
import { Types } from './Types';

const c: Container = new Container();

// Infrastructure
c.bind<ILogger>(Types.Logger).toConstantValue(logger);

export const container: Container = c;
