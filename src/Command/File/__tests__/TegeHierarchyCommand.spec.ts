import { Schrodinger } from '@jamashita/publikum-monad';
import { ClosureTableHierarchies, ClosureTableHierarchy, MockTegeID, TegeError, TegeID } from '@tegebu/syrup';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../../Container/Container';
import { Types } from '../../../Container/Types';
import { FileError } from '../../../General/Error/FileError';
import { MockFile } from '../../../General/Mock/MockFile';
import { MockLogger } from '../../../Infrastructure/Mock/MockLogger';
import { ITegeHierarchyCommand } from '../../Interface/ITegeHierarchyCommand';
import { TegeHierarchyCommand } from '../TegeHierarchyCommand';

describe('TegeHierarchyCommand', () => {
  describe('container', () => {
    it('returns singleton instance', () => {
      expect.assertions(2);

      const command1: ITegeHierarchyCommand = container.get<ITegeHierarchyCommand>(Types.TegeHierarchyFileCommand);
      const command2: ITegeHierarchyCommand = container.get<ITegeHierarchyCommand>(Types.TegeHierarchyFileCommand);

      expect(command1).toBeInstanceOf(TegeHierarchyCommand);
      expect(command1).toBe(command2);
    });
  });

  describe('bulkCreate', () => {
    it('returns Alive', async () => {
      expect.assertions(1);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const hierarchies: ClosureTableHierarchies<TegeID> = ClosureTableHierarchies.ofArray<TegeID>([
        ClosureTableHierarchy.of<TegeID>(id1, id1),
        ClosureTableHierarchy.of<TegeID>(id1, id2),
        ClosureTableHierarchy.of<TegeID>(id2, id2)
      ]);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.resolves(null);

      const logger: MockLogger = new MockLogger();
      const tegeHierarchyCommand: TegeHierarchyCommand = new TegeHierarchyCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeHierarchyCommand.bulkCreate(hierarchies).terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.TegeError when JSONA.stringify() throws JSONAError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const hierarchies: ClosureTableHierarchies<TegeID> = ClosureTableHierarchies.ofArray<TegeID>([
        ClosureTableHierarchy.of<TegeID>(id1, id1),
        ClosureTableHierarchy.of<TegeID>(id1, id2),
        ClosureTableHierarchy.of<TegeID>(id2, id2)
      ]);
      const recurr1: unknown = {};
      const recurr2: unknown = {
        r: recurr1
      };
      // @ts-expect-error
      recurr1.r = recurr2;

      const stub: SinonStub = sinon.stub();
      hierarchies.toJSON = stub;
      stub.returns(recurr1);

      const file: MockFile = new MockFile();
      const logger: MockLogger = new MockLogger();
      const tegeHierarchyCommand: TegeHierarchyCommand = new TegeHierarchyCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeHierarchyCommand.bulkCreate(hierarchies).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.FileError when file.write() throws FileError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const hierarchies: ClosureTableHierarchies<TegeID> = ClosureTableHierarchies.ofArray<TegeID>([
        ClosureTableHierarchy.of<TegeID>(id1, id1),
        ClosureTableHierarchy.of<TegeID>(id1, id2),
        ClosureTableHierarchy.of<TegeID>(id2, id2)
      ]);

      const stub: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      file.write = stub;
      stub.rejects(new FileError('failed'));

      const logger: MockLogger = new MockLogger();
      const tegeHierarchyCommand: TegeHierarchyCommand = new TegeHierarchyCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeHierarchyCommand.bulkCreate(hierarchies).terminate();

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
      stub2.resolves(null);

      const logger: MockLogger = new MockLogger();
      const tegeHierarchyCommand: TegeHierarchyCommand = new TegeHierarchyCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeHierarchyCommand.delete().terminate();

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
      stub2.resolves(null);

      const logger: MockLogger = new MockLogger();
      const tegeHierarchyCommand: TegeHierarchyCommand = new TegeHierarchyCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeHierarchyCommand.delete().terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.FileError when file.write() throws FileError', async () => {
      expect.assertions(2);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      file.exists = stub1;
      stub1.resolves(true);
      file.write = stub2;
      stub2.rejects(new FileError('failed'));

      const logger: MockLogger = new MockLogger();
      const tegeHierarchyCommand: TegeHierarchyCommand = new TegeHierarchyCommand(file, logger);

      const schrodinger: Schrodinger<unknown, TegeError | FileError> = await tegeHierarchyCommand.delete().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FileError);
    });
  });
});
