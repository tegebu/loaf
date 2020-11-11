import { ILogger } from '../Interface/ILogger';

export class MockLogger implements ILogger {
  public silly(): unknown {
    return null;
  }

  public trace(): unknown {
    return null;
  }

  public debug(): unknown {
    return null;
  }

  public info(): unknown {
    return null;
  }

  public warn(): unknown {
    return null;
  }

  public error(): unknown {
    return null;
  }

  public fatal(): unknown {
    return null;
  }
}
