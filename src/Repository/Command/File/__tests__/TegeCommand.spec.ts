import { MockSequence } from '@jamashita/publikum-collection';
import { DataSourceError, MockDataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { MockClosureTable, MockClosureTableHierarchy } from '@jamashita/publikum-tree';
import { MockTege, MockTegeID, Tege, TegeError, TegeID, Teges } from '@tegebu/syrup';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../../../Container/Container';
import { Types } from '../../../../Container/Types';
import { FileError } from '../../../../General/File/Error/FileError';
import { MockFile } from '../../../../General/File/Mock/MockFile';
import { MockLogger } from '../../../../Infrastructure/Mock/MockLogger';
import { ITegeCommand } from '../../Interface/ITegeCommand';
import { MockTegeHierarchyCommand } from '../../Mock/MockTegeHierarchyCommand';
import { TegeCommand } from '../TegeCommand';

describe('TegeCommand', () => {
  describe('container', () => {
    it('returns singleton instance', () => {
      expect.assertions(2);

      const command1: ITegeCommand = container.get<ITegeCommand>(Types.TegeFileCommand);
      const command2: ITegeCommand = container.get<ITegeCommand>(Types.TegeFileCommand);

      expect(command1).toBeInstanceOf(TegeCommand);
      expect(command1).toBe(command2);
    });
  });

  describe('bulkCreate', () => {
    it('returns Alive', async () => {
      expect.assertions(1);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const table: MockClosureTable<TegeID> = new MockClosureTable<TegeID>(
        new MockClosureTableHierarchy(id1, id1),
        new MockClosureTableHierarchy(id1, id2),
        new MockClosureTableHierarchy(id2, id2)
      );
      const values: MockSequence<Tege> = new MockSequence<Tege>([
        new MockTege({
          id: id1
        }),
        new MockTege({
          id: id2
        })
      ]);

      const teges: Teges = Teges.ofTable(table, values);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);
      hierarchyCommand.bulkCreate = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Alive even if file does not exist', async () => {
      expect.assertions(1);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const table: MockClosureTable<TegeID> = new MockClosureTable<TegeID>(
        new MockClosureTableHierarchy(id1, id1),
        new MockClosureTableHierarchy(id1, id2),
        new MockClosureTableHierarchy(id2, id2)
      );
      const values: MockSequence<Tege> = new MockSequence<Tege>([
        new MockTege({
          id: id1
        }),
        new MockTege({
          id: id2
        })
      ]);

      const teges: Teges = Teges.ofTable(table, values);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);
      hierarchyCommand.bulkCreate = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.TegeError when JSONA.stringify() throws JSONAError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const table: MockClosureTable<TegeID> = new MockClosureTable<TegeID>(
        new MockClosureTableHierarchy(id1, id1),
        new MockClosureTableHierarchy(id1, id2),
        new MockClosureTableHierarchy(id2, id2)
      );
      const values: MockSequence<Tege> = new MockSequence<Tege>([
        new MockTege({
          id: id1
        }),
        new MockTege({
          id: id2
        })
      ]);

      const teges: Teges = Teges.ofTable(table, values);

      const recurr1: unknown = {};
      const recurr2: unknown = {
        r: recurr1
      };
      // @ts-expect-error
      recurr1.r = recurr2;

      const stub: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      teges.toJSON = stub;
      stub.returns(recurr1);

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.FileError when file.write() throws FileError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const table: MockClosureTable<TegeID> = new MockClosureTable<TegeID>(
        new MockClosureTableHierarchy(id1, id1),
        new MockClosureTableHierarchy(id1, id2),
        new MockClosureTableHierarchy(id2, id2)
      );
      const values: MockSequence<Tege> = new MockSequence<Tege>([
        new MockTege({
          id: id1
        }),
        new MockTege({
          id: id2
        })
      ]);

      const teges: Teges = Teges.ofTable(table, values);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.rejects(new FileError('failed'));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FileError);
    });

    it('returns Dead.TegeError when hierarchyCommand.bulkCreate() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const table: MockClosureTable<TegeID> = new MockClosureTable<TegeID>(
        new MockClosureTableHierarchy(id1, id1),
        new MockClosureTableHierarchy(id1, id2),
        new MockClosureTableHierarchy(id2, id2)
      );
      const values: MockSequence<Tege> = new MockSequence<Tege>([
        new MockTege({
          id: id1
        }),
        new MockTege({
          id: id2
        })
      ]);

      const teges: Teges = Teges.ofTable(table, values);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);
      hierarchyCommand.bulkCreate = stub3;
      stub3.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when hierarchyCommand.bulkCreate() returns Dead.DataSourceError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const table: MockClosureTable<TegeID> = new MockClosureTable<TegeID>(
        new MockClosureTableHierarchy(id1, id1),
        new MockClosureTableHierarchy(id1, id2),
        new MockClosureTableHierarchy(id2, id2)
      );
      const values: MockSequence<Tege> = new MockSequence<Tege>([
        new MockTege({
          id: id1
        }),
        new MockTege({
          id: id2
        })
      ]);

      const teges: Teges = Teges.ofTable(table, values);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);
      hierarchyCommand.bulkCreate = stub3;
      stub3.returns(Superposition.dead<unknown, DataSourceError>(new MockDataSourceError(), DataSourceError));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });
  });

  describe('delete', () => {
    it('returns Alive', async () => {
      expect.assertions(1);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);
      hierarchyCommand.delete = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.delete().terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Alive even if file does not exist', async () => {
      expect.assertions(1);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(false);
      file.write = stub2;
      stub2.resolves(undefined);
      hierarchyCommand.delete = stub3;
      stub3.returns(Superposition.alive<unknown, DataSourceError>(null));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.delete().terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.FileError when file.write() throws FileError', async () => {
      expect.assertions(2);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(false);
      file.write = stub2;
      stub2.rejects(new FileError('failed'));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FileError);
    });

    it('returns Dead.TegeError when hierarchyCommand.delete() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);
      hierarchyCommand.delete = stub3;
      stub3.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when hierarchyCommand.delete() returns Dead.DataSourceError', async () => {
      expect.assertions(2);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const hierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);
      hierarchyCommand.delete = stub3;
      stub3.returns(Superposition.dead<unknown, DataSourceError>(new MockDataSourceError(), DataSourceError));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(hierarchyCommand, file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });
  });
});
