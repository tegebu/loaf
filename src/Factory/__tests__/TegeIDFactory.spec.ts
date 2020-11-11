import { TegeError } from '@tegebu/syrup';
import 'reflect-metadata';
import { container } from '../../Container/Container';
import { Types } from '../../Container/Types';
import { ITegeIDFactory } from '../Interface/TegeIDFactory';
import { TegeIDFactory } from '../TegeIDFactory';

describe('TegeIDFactory', () => {
  describe('container', () => {
    it('returns singleton instance', () => {
      expect.assertions(2);

      const factory1: ITegeIDFactory = container.get<ITegeIDFactory>(Types.TegeIDFactory);
      const factory2: ITegeIDFactory = container.get<ITegeIDFactory>(Types.TegeIDFactory);

      expect(factory1).toBeInstanceOf(TegeIDFactory);
      expect(factory1).toBe(factory2);
    });
  });

  describe('forge', () => {
    it('returns instance when uuid-format string given', () => {
      expect.assertions(1);

      const id: string = '3e97a260-bef0-4a0a-b060-af7a4b0c7775';

      const factory: TegeIDFactory = new TegeIDFactory();

      expect(factory.forge(id).toString()).toBe(id);
    });

    it('throws TegeError when non-uuid-format string given', () => {
      expect.assertions(1);

      const id: string = 'molto bene';

      const factory: TegeIDFactory = new TegeIDFactory();

      expect(() => {
        factory.forge(id);
      }).toThrow(TegeError);
    });

    it('returns instance when other primitive value given', () => {
      expect.assertions(6);

      const factory: TegeIDFactory = new TegeIDFactory();

      expect(() => {
        factory.forge(undefined);
      }).toThrow(TegeError);
      expect(() => {
        factory.forge(null);
      }).toThrow(TegeError);
      expect(() => {
        factory.forge(true);
      }).toThrow(TegeError);
      expect(() => {
        factory.forge(-8);
      }).toThrow(TegeError);
      expect(() => {
        factory.forge(Symbol());
      }).toThrow(TegeError);
      expect(() => {
        factory.forge(-8n);
      }).toThrow(TegeError);
    });
  });
});
