import { UnimplementedError } from '@jamashita/publikum-error';
import { TegeID } from '@tegebu/syrup';
import { ITegeIDFactory } from '../Interface/TegeIDFactory';

export class MockTegeIDFactory implements ITegeIDFactory {
  public forge(): TegeID {
    throw new UnimplementedError();
  }
}
