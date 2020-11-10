import { MockSequence } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { MockClosureTable, MockClosureTableHierarchy } from '@jamashita/publikum-tree';
import { MockTege, MockTegeID, Tege, TegeError, TegeID, Teges } from '@tegebu/syrup';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../Container/Container';
import { Types } from '../../Container/Types';
import { MockTegeCommand } from '../../Repository/Command/Mock/MockTegeCommand';
import { MockTegeQuery } from '../../Repository/Query/Mock/MockTegeQuery';
import { ITegeInteractor } from '../Interface/ITegeInteractor';
import { TegeInteractor } from '../TegeInteractor';

describe('TegeInteractor', () => {
  describe('container', () => {
    it('returns singleton instance', () => {
      expect.assertions(2);

      const interactor1: ITegeInteractor = container.get<ITegeInteractor>(Types.TegeInteractor);
      const interactor2: ITegeInteractor = container.get<ITegeInteractor>(Types.TegeInteractor);

      expect(interactor1).toBeInstanceOf(TegeInteractor);
      expect(interactor1).toBe(interactor2);
    });
  });

  describe('create', () => {
    it('returns Alive', async () => {
      expect.assertions(1);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const id3: TegeID = new MockTegeID();
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

      const tege: Tege = new MockTege({
        id: id3
      });
      const teges: Teges = Teges.ofTable(table, values);

      const tegeQuery: MockTegeQuery = new MockTegeQuery();
      const tegeCommand: MockTegeCommand = new MockTegeCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      tegeQuery.all = stub1;
      tegeCommand.delete = stub2;
      tegeCommand.bulkCreate = stub3;
      stub1.returns(Superposition.alive<Teges, TegeError>(teges));
      stub2.returns(Superposition.alive<unknown, TegeError>(null));
      stub3.returns(Superposition.alive<unknown, TegeError>(null));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeQuery, tegeCommand);

      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.create(tege).terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.TegeError when tegeQuery.all() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();

      const tege: Tege = new MockTege({
        id: id1
      });

      const tegeQuery: MockTegeQuery = new MockTegeQuery();
      const tegeCommand: MockTegeCommand = new MockTegeCommand();

      const stub1: SinonStub = sinon.stub();
      tegeQuery.all = stub1;
      stub1.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeQuery, tegeCommand);

      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.create(tege).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when Teges already have such TegeID', async () => {
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

      const tege: Tege = new MockTege({
        id: id1
      });
      const teges: Teges = Teges.ofTable(table, values);

      const tegeQuery: MockTegeQuery = new MockTegeQuery();
      const tegeCommand: MockTegeCommand = new MockTegeCommand();

      const stub1: SinonStub = sinon.stub();
      tegeQuery.all = stub1;
      stub1.returns(Superposition.alive<Teges, TegeError>(teges, TegeError));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeQuery, tegeCommand);

      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.create(tege).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when tegeCommand.delete() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const id3: TegeID = new MockTegeID();
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

      const tege: Tege = new MockTege({
        id: id3
      });
      const teges: Teges = Teges.ofTable(table, values);

      const tegeQuery: MockTegeQuery = new MockTegeQuery();
      const tegeCommand: MockTegeCommand = new MockTegeCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      tegeQuery.all = stub1;
      tegeCommand.delete = stub2;
      stub1.returns(Superposition.alive<Teges, TegeError>(teges));
      stub2.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeQuery, tegeCommand);

      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.create(tege).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when tegeCommand.bulkCreate() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const id3: TegeID = new MockTegeID();
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

      const tege: Tege = new MockTege({
        id: id3
      });
      const teges: Teges = Teges.ofTable(table, values);

      const tegeQuery: MockTegeQuery = new MockTegeQuery();
      const tegeCommand: MockTegeCommand = new MockTegeCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      tegeQuery.all = stub1;
      tegeCommand.delete = stub2;
      tegeCommand.bulkCreate = stub3;
      stub1.returns(Superposition.alive<Teges, TegeError>(teges));
      stub2.returns(Superposition.alive<unknown, TegeError>(null));
      stub3.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeQuery, tegeCommand);

      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.create(tege).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });
  });

  describe('save', () => {
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

      const tegeQuery: MockTegeQuery = new MockTegeQuery();
      const tegeCommand: MockTegeCommand = new MockTegeCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      tegeCommand.delete = stub1;
      tegeCommand.bulkCreate = stub2;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      stub2.returns(Superposition.alive<unknown, TegeError>(null));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeQuery, tegeCommand);

      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.save(teges).terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.TegeError when tegeCommand.delete() returns Dead.TegeError', async () => {
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

      const tegeQuery: MockTegeQuery = new MockTegeQuery();
      const tegeCommand: MockTegeCommand = new MockTegeCommand();

      const stub1: SinonStub = sinon.stub();
      tegeCommand.delete = stub1;
      stub1.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeQuery, tegeCommand);

      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.save(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when tegeCommand.bulkCreate() returns Dead.TegeError', async () => {
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

      const tegeQuery: MockTegeQuery = new MockTegeQuery();
      const tegeCommand: MockTegeCommand = new MockTegeCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      tegeCommand.delete = stub1;
      tegeCommand.bulkCreate = stub2;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      stub2.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeQuery, tegeCommand);

      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.save(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });
  });
});
