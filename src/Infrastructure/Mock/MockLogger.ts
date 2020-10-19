import { UnimplementedError } from '@jamashita/publikum-error';
import { ILogger } from '../Interface/ILogger';

export class MockLogger implements ILogger {
  public silly(): unknown {
    throw new UnimplementedError();
  }

  public trace(): unknown {
    throw new UnimplementedError();
  }

  public debug(): unknown {
    throw new UnimplementedError();
  }

  public info(): unknown {
    throw new UnimplementedError();
  }

  public warn(): unknown {
    throw new UnimplementedError();
  }

  public error(): unknown {
    throw new UnimplementedError();
  }

  public fatal(): unknown {
    throw new UnimplementedError();
  }
}
