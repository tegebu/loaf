import { UnimplementedError } from '@jamashita/publikum-error';
import { IGit } from '../Interface/IGit';

export class MockGit implements IGit {
  public add(): Promise<void> {
    throw new UnimplementedError();
  }

  public push(): Promise<void> {
    throw new UnimplementedError();
  }
}
