import { MockSequence } from '@jamashita/publikum-collection';
import { Schrodinger } from '@jamashita/publikum-monad';
import { MockClosureTable, MockClosureTableHierarchy } from '@jamashita/publikum-tree';
import { MockTege, MockTegeID, Tege, TegeError, TegeID, Teges } from '@tegebu/syrup';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../../../Container/Container';
import { Types } from '../../../../Container/Types';
import { FileError } from '../../../../General/Error/FileError';
import { MockFile } from '../../../../General/Mock/MockFile';
import { MockLogger } from '../../../../Infrastructure/Mock/MockLogger';
import { ITegeCommand } from '../../Interface/ITegeCommand';
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
      const file: MockFile = new MockFile();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(file, logger);

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
      const file: MockFile = new MockFile();
      file.exists = stub1;
      stub1.resolves(false);
      file.write = stub2;
      stub2.resolves(undefined);

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(file, logger);

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
      teges.toJSON = stub;
      stub.returns(recurr1);

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(file, logger);

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
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.rejects(new FileError('failed'));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FileError);
    });
  });

  describe('delete', () => {
    it('returns Alive', async () => {
      expect.assertions(1);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(undefined);

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.delete().terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Alive even if file does not exist', async () => {
      expect.assertions(1);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      file.exists = stub1;
      stub1.resolves(false);
      file.write = stub2;
      stub2.resolves(undefined);

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.delete().terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.FileError when file.write() throws FileError', async () => {
      expect.assertions(2);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      file.exists = stub1;
      stub1.resolves(false);
      file.write = stub2;
      stub2.rejects(new FileError('failed'));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeCommand.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FileError);
    });
  });
});
