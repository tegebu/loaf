import 'reflect-metadata';
import { Logger } from 'tslog';
import { container } from '../../Container/Container';
import { Types } from '../../Container/Types';
import { ILogger } from '../Interface/ILogger';

describe('Logger', () => {
  describe('container', () => {
    it('must be a singleton', () => {
      expect.assertions(2);

      const logger1: ILogger = container.get<ILogger>(Types.Logger);
      const logger2: ILogger = container.get<ILogger>(Types.Logger);

      expect(logger1).toBeInstanceOf(Logger);
      expect(logger1).toBe(logger2);
    });
  });
});
