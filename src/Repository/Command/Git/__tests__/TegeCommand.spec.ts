import { MockSequence } from '@jamashita/publikum-collection';
import { DataSourceError, MockDataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { MockClosureTable, MockClosureTableHierarchy } from '@jamashita/publikum-tree';
import { MockTege, MockTegeID, Tege, TegeError, TegeID, Teges } from '@tegebu/syrup';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../../../Container/Container';
import { Types } from '../../../../Container/Types';
import { GitError } from '../../../../General/Git/Error/GitError';
import { MockGit } from '../../../../General/Git/Mock/MockGit';
import { MockLogger } from '../../../../Infrastructure/Mock/MockLogger';
import { ITegeCommand } from '../../Interface/ITegeCommand';
import { MockTegeCommand } from '../../Mock/MockTegeCommand';
import { TegeCommand } from '../TegeCommand';

describe('TegeCommand', () => {
  describe('container', () => {
    it('returns singleton instance', () => {
      expect.assertions(2);

      const command1: ITegeCommand = container.get<ITegeCommand>(Types.TegeGitCommand);
      const command2: ITegeCommand = container.get<ITegeCommand>(Types.TegeGitCommand);

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
      const fileCommand: MockTegeCommand = new MockTegeCommand();
      const git: MockGit = new MockGit();
      fileCommand.bulkCreate = stub1;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      git.add = stub2;
      stub2.resolves(undefined);
      git.push = stub3;
      stub3.resolves(undefined);

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(fileCommand, git, logger);

      const schrodinger: Schrodinger<unknown, TegeError | GitError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.TegeError when fileCommand.bulkCreate() returns Dead.TegeError', async () => {
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
      const fileCommand: MockTegeCommand = new MockTegeCommand();
      const git: MockGit = new MockGit();
      fileCommand.bulkCreate = stub1;
      stub1.returns(Superposition.dead<unknown, TegeError>(new TegeError('test failed'), TegeError));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(fileCommand, git, logger);

      const schrodinger: Schrodinger<unknown, TegeError | GitError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.FileError when fileCommand.bulkCreate() returns Dead.DataSourceError', async () => {
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
      const fileCommand: MockTegeCommand = new MockTegeCommand();
      const git: MockGit = new MockGit();
      fileCommand.bulkCreate = stub1;
      stub1.returns(Superposition.dead<unknown, DataSourceError>(new MockDataSourceError(), DataSourceError));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(fileCommand, git, logger);

      const schrodinger: Schrodinger<unknown, TegeError | GitError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.GitError when git.add() rejects GitError', async () => {
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
      const fileCommand: MockTegeCommand = new MockTegeCommand();
      const git: MockGit = new MockGit();
      fileCommand.bulkCreate = stub1;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      git.add = stub2;
      stub2.rejects(new GitError('test failed'));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(fileCommand, git, logger);

      const schrodinger: Schrodinger<unknown, TegeError | GitError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(GitError);
    });

    it('returns Dead.TegeError when git.push() rejects GitError', async () => {
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
      const fileCommand: MockTegeCommand = new MockTegeCommand();
      const git: MockGit = new MockGit();
      fileCommand.bulkCreate = stub1;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      git.add = stub2;
      stub2.resolves(undefined);
      git.push = stub3;
      stub3.rejects(new GitError('test failed'));

      const logger: MockLogger = new MockLogger();
      const tegeCommand: TegeCommand = new TegeCommand(fileCommand, git, logger);

      const schrodinger: Schrodinger<unknown, TegeError | GitError> = await tegeCommand.bulkCreate(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(GitError);
    });
  });
});
