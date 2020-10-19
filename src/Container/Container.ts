import { Container } from 'inversify';
import { TegeCommand as TegeFileCommand } from '../Command/File/TegeCommand';
import { TegeHierarchyCommand as TegeHierarchyFileCommand } from '../Command/File/TegeHierarchyCommand';
import { ITegeCommand } from '../Command/Interface/ITegeCommand';
import { ITegeHierarchyCommand } from '../Command/Interface/ITegeHierarchyCommand';
import { File } from '../General/File';
import { IFile } from '../General/Interface/IFile';
import { ILogger } from '../Infrastructure/Interface/ILogger';
import { logger } from '../Infrastructure/Logger';
import { ITegeInteractor } from '../Interactor/Interface/ITegeInteractor';
import { TegeInteractor } from '../Interactor/TegeInteractor';
import { Types } from './Types';

const c: Container = new Container();

// Infrastructure
c.bind<IFile>(Types.File).toConstantValue(new File());
c.bind<ILogger>(Types.Logger).toConstantValue(logger);

// Command
c.bind<ITegeCommand>(Types.TegeFileCommand).to(TegeFileCommand).inSingletonScope();
c.bind<ITegeHierarchyCommand>(Types.TegeHierarchyFileCommand).to(TegeHierarchyFileCommand).inSingletonScope();

// Interactor
c.bind<ITegeInteractor>(Types.TegeInteractor).to(TegeInteractor).inSingletonScope();

export const container: Container = c;
