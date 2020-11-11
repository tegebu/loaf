import { Primitive } from '@jamashita/publikum-type';
import { TegeError, TegeID } from '@tegebu/syrup';
import { injectable } from 'inversify';
import { ITegeIDFactory } from './Interface/TegeIDFactory';

@injectable()
export class TegeIDFactory implements ITegeIDFactory {
  public forge(id: Primitive): TegeID {
    if (TegeID.validate(id)) {
      return TegeID.ofString(id);
    }

    throw new TegeError('THIS VALUE IS NOT ACCEPTABLE FOR TegeID');
  }
}
