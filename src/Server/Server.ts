import { Ambiguous, Kind } from '@jamashita/publikum-type';
import config from 'config';
import express, { Express } from 'express';
import 'reflect-metadata';
import { container } from '../Container/Container';
import { Types } from '../Container/Types';
import { BaseController } from '../Controller/BaseController';
import { ILogger } from '../Infrastructure/Interface/ILogger';

const logger: ILogger = container.get<ILogger>(Types.Logger);
const port: number = config.get<number>('port');
// eslint-disable-next-line no-process-env
const mode: Ambiguous<string> = process.env.NODE_ENV;

if (Kind.isUndefined(mode)) {
  logger.fatal('mode IS NOT SET');
  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

process.on('unhandledRejection', (reason: unknown) => {
  logger.fatal('UNHANDLED REJECTION');
  logger.fatal(reason);
});

const app: Express = express();

app.disable('x-powered-by');
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());

BaseController(app);

app.listen(port, () => {
  logger.info(`Server running on port ${port} in ${mode} mode`);
});
