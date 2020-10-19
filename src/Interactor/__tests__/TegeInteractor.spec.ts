import { ImmutableProject } from '@jamashita/publikum-collection';
import { DataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import { MockClosureTableHierarchy, MockTege, MockTegeID, Tege, TegeError, TegeID, Teges } from '@tegebu/syrup';
import 'reflect-metadata';
import sinon, { SinonStub } from 'sinon';
import { MockTegeCommand } from '../../Command/Mock/MockTegeCommand';
import { MockTegeHierarchyCommand } from '../../Command/Mock/MockTegeHierarchyCommand';
import { container } from '../../Container/Container';
import { Types } from '../../Container/Types';
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

  describe('save', () => {
    it('returns Alive', async () => {
      expect.assertions(1);

      const id: TegeID = new MockTegeID();
      const teges: Teges = Teges.of(
        ImmutableProject.ofMap<TegeID, Tege>(
          new Map<TegeID, Tege>([
            [id, new MockTege({
              id
            })]
          ])
        ),
        [
          new MockClosureTableHierarchy(id, id)
        ]
      );

      const tegeCommand: MockTegeCommand = new MockTegeCommand();
      const tegeHierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();

      tegeCommand.delete = stub1;
      tegeHierarchyCommand.delete = stub2;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      stub2.returns(Superposition.alive<unknown, TegeError>(null));

      const stub3: SinonStub = sinon.stub();
      const stub4: SinonStub = sinon.stub();

      tegeCommand.bulkCreate = stub3;
      tegeHierarchyCommand.bulkCreate = stub4;
      stub3.returns(Superposition.alive<unknown, TegeError>(null));
      stub4.returns(Superposition.alive<unknown, TegeError>(null));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeCommand, tegeHierarchyCommand);
      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.save(teges).terminate();

      expect(schrodinger.isAlive()).toBe(true);
    });

    it('returns Dead.TegeError when tegeCommand.delete() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id: TegeID = new MockTegeID();
      const teges: Teges = Teges.of(
        ImmutableProject.ofMap<TegeID, Tege>(
          new Map<TegeID, Tege>([
            [id, new MockTege({
              id
            })]
          ])
        ),
        [
          new MockClosureTableHierarchy(id, id)
        ]
      );

      const tegeCommand: MockTegeCommand = new MockTegeCommand();
      const tegeHierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();

      tegeCommand.delete = stub1;
      tegeHierarchyCommand.delete = stub2;
      stub1.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));
      stub2.returns(Superposition.alive<unknown, TegeError>(null));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeCommand, tegeHierarchyCommand);
      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.save(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when tegeHierarchyCommand.delete() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id: TegeID = new MockTegeID();
      const teges: Teges = Teges.of(
        ImmutableProject.ofMap<TegeID, Tege>(
          new Map<TegeID, Tege>([
            [id, new MockTege({
              id
            })]
          ])
        ),
        [
          new MockClosureTableHierarchy(id, id)
        ]
      );

      const tegeCommand: MockTegeCommand = new MockTegeCommand();
      const tegeHierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();

      tegeCommand.delete = stub1;
      tegeHierarchyCommand.delete = stub2;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      stub2.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeCommand, tegeHierarchyCommand);
      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.save(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when tegeCommand.bulkCreate() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id: TegeID = new MockTegeID();
      const teges: Teges = Teges.of(
        ImmutableProject.ofMap<TegeID, Tege>(
          new Map<TegeID, Tege>([
            [id, new MockTege({
              id
            })]
          ])
        ),
        [
          new MockClosureTableHierarchy(id, id)
        ]
      );

      const tegeCommand: MockTegeCommand = new MockTegeCommand();
      const tegeHierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();

      tegeCommand.delete = stub1;
      tegeHierarchyCommand.delete = stub2;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      stub2.returns(Superposition.alive<unknown, TegeError>(null));

      const stub3: SinonStub = sinon.stub();
      const stub4: SinonStub = sinon.stub();

      tegeCommand.bulkCreate = stub3;
      tegeHierarchyCommand.bulkCreate = stub4;
      stub3.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));
      stub4.returns(Superposition.alive<unknown, TegeError>(null));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeCommand, tegeHierarchyCommand);
      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.save(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when tegeHierarchyCommand.bulkCreate() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id: TegeID = new MockTegeID();
      const teges: Teges = Teges.of(
        ImmutableProject.ofMap<TegeID, Tege>(
          new Map<TegeID, Tege>([
            [id, new MockTege({
              id
            })]
          ])
        ),
        [
          new MockClosureTableHierarchy(id, id)
        ]
      );

      const tegeCommand: MockTegeCommand = new MockTegeCommand();
      const tegeHierarchyCommand: MockTegeHierarchyCommand = new MockTegeHierarchyCommand();

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();

      tegeCommand.delete = stub1;
      tegeHierarchyCommand.delete = stub2;
      stub1.returns(Superposition.alive<unknown, TegeError>(null));
      stub2.returns(Superposition.alive<unknown, TegeError>(null));

      const stub3: SinonStub = sinon.stub();
      const stub4: SinonStub = sinon.stub();

      tegeCommand.bulkCreate = stub3;
      tegeHierarchyCommand.bulkCreate = stub4;
      stub3.returns(Superposition.alive<unknown, TegeError>(null));
      stub4.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const tegeInteractor: TegeInteractor = new TegeInteractor(tegeCommand, tegeHierarchyCommand);
      const schrodinger: Schrodinger<unknown, TegeError | DataSourceError> = await tegeInteractor.save(teges).terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });
  });
});
