import { DataSourceError } from '@jamashita/publikum-error';
import { Noun } from '@jamashita/publikum-interface';
import { PlainObject } from '@jamashita/publikum-type';
import { Tege, TegeError } from '@tegebu/syrup';
import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Body, Controller, Post, Res } from 'routing-controllers';
import { Types } from '../../Container/Types';
import { ILogger } from '../../Infrastructure/Interface/ILogger';
import { ITegeInteractor } from '../../Interactor/Interface/ITegeInteractor';

@injectable()
@Controller('/teges')
export class TegeController implements Noun<'TegeController'> {
  public readonly noun: 'TegeController' = 'TegeController';
  private readonly tegeInteractor: ITegeInteractor;
  private readonly logger: ILogger;

  public constructor(
    @inject(Types.TegeInteractor)tegeInteractor: ITegeInteractor,
    @inject(Types.Logger) logger: ILogger
  ) {
    this.tegeInteractor = tegeInteractor;
    this.logger = logger;
  }

  @Post('/')
  public save(@Body({ required: true })body: PlainObject, @Res() res: Response): Promise<Response> {
    if (!Tege.validateInput(body)) {
      return Promise.resolve<Response>(res.sendStatus(StatusCodes.BAD_REQUEST));
    }

    return this.tegeInteractor.create(Tege.ofInputJSON(body)).transform<Response, Error>(() => {
      return res.sendStatus(StatusCodes.CREATED);
    }, (err: TegeError | DataSourceError) => {
      if (err instanceof TegeError) {
        this.logger.warn(err.message);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          message: err.message,
          stack: err.getStack()
        });
      }

      this.logger.error(err.message);

      return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).send({
        message: err.message,
        stack: err.getStack()
      });
    }).get();
  }
}
