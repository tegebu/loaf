import { Container } from 'inversify';
import { TegeHierarchyCommand as TegeHierarchyFileCommand } from '../Command/File/TegeHierarchyCommand';
import { ITegeHierarchyCommand } from '../Command/Interface/ITegeHierarchyCommand';
import { File } from '../General/File';
import { IFile } from '../General/Interface/IFile';
import { ILogger } from '../Infrastructure/Interface/ILogger';
import { logger } from '../Infrastructure/Logger';
import { Types } from './Types';

const c: Container = new Container();

// Infrastructure
c.bind<IFile>(Types.File).toConstantValue(new File());
c.bind<ILogger>(Types.Logger).toConstantValue(logger);

// Command
c.bind<ITegeHierarchyCommand>(Types.TegeHierarchyFileCommand).to(TegeHierarchyFileCommand).inSingletonScope();

export const container: Container = c;
