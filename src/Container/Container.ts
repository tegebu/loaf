import { Container } from 'inversify';
import { ITegeIDFactory } from '../Factory/Interface/TegeIDFactory';
import { TegeIDFactory } from '../Factory/TegeIDFactory';
import { File } from '../General/File';
import { IFile } from '../General/Interface/IFile';
import { ILogger } from '../Infrastructure/Interface/ILogger';
import { logger } from '../Infrastructure/Logger';
import { ITegeInteractor } from '../Interactor/Interface/ITegeInteractor';
import { TegeInteractor } from '../Interactor/TegeInteractor';
import { TegeCommand as TegeFileCommand } from '../Repository/Command/File/TegeCommand';
import { TegeHierarchyCommand as TegeHierarchyFileCommand } from '../Repository/Command/File/TegeHierarchyCommand';
import { ITegeCommand } from '../Repository/Command/Interface/ITegeCommand';
import { ITegeHierarchyCommand } from '../Repository/Command/Interface/ITegeHierarchyCommand';
import { TegeHierarchyQuery as TegeHierarchyFileQuery } from '../Repository/Query/File/TegeHierarchyQuery';
import { TegeQuery as TegeFileQuery } from '../Repository/Query/File/TegeQuery';
import { ITegeHierarchyQuery } from '../Repository/Query/Interface/ITegeHierarchyQuery';
import { ITegeQuery } from '../Repository/Query/Interface/ITegeQuery';
import { Types } from './Types';

const c: Container = new Container();

// Factory
c.bind<ITegeIDFactory>(Types.TegeIDFactory).to(TegeIDFactory).inSingletonScope();

// Infrastructure
c.bind<IFile>(Types.File).toConstantValue(new File());
c.bind<ILogger>(Types.Logger).toConstantValue(logger);

// Interactor
c.bind<ITegeInteractor>(Types.TegeInteractor).to(TegeInteractor).inSingletonScope();

// Command
c.bind<ITegeCommand>(Types.TegeFileCommand).to(TegeFileCommand).inSingletonScope();
c.bind<ITegeHierarchyCommand>(Types.TegeHierarchyFileCommand).to(TegeHierarchyFileCommand).inSingletonScope();

// Query
c.bind<ITegeQuery>(Types.TegeFileQuery).to(TegeFileQuery).inSingletonScope();
c.bind<ITegeHierarchyQuery>(Types.TegeHierarchyFileQuery).to(TegeHierarchyFileQuery).inSingletonScope();

export const container: Container = c;
