import { Logger } from 'tslog';
import { ILogger } from './Interface/ILogger';

export const logger: ILogger = new Logger({
  overwriteConsole: true
});
