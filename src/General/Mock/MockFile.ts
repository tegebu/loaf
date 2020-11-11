import { UnimplementedError } from '@jamashita/publikum-error';
import { IFile } from '../Interface/IFile';

export class MockFile implements IFile {
  public read(): Promise<string> {
    throw new UnimplementedError();
  }

  public write(): Promise<void> {
    throw new UnimplementedError();
  }

  public delete(): Promise<void> {
    throw new UnimplementedError();
  }

  public copy(): Promise<void> {
    throw new UnimplementedError();
  }

  public exists(): Promise<boolean> {
    throw new UnimplementedError();
  }
}
