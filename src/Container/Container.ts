import { Container } from 'inversify';
import { TegeController } from '../Controller/API/TegeController';
import { ITegeIDFactory } from '../Factory/Interface/TegeIDFactory';
import { TegeIDFactory } from '../Factory/TegeIDFactory';
import { File } from '../General/File/File';
import { IFile } from '../General/File/Interface/IFile';
import { Git } from '../General/Git/Git';
import { IGit } from '../General/Git/Interface/IGit';
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

// Controller
c.bind<TegeController>(TegeController).toSelf().inSingletonScope();

// Factory
c.bind<ITegeIDFactory>(Types.TegeIDFactory).to(TegeIDFactory).inSingletonScope();

// Infrastructure
c.bind<IGit>(Types.Git).toConstantValue(new Git());
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
