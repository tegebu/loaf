import { Schrodinger } from '@jamashita/publikum-monad';
import { ClosureTableHierarchies } from '@jamashita/publikum-tree';
import { MockTegeID, TegeError, TegeID } from '@tegebu/syrup';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../../../Container/Container';
import { Types } from '../../../../Container/Types';
import { MockTegeIDFactory } from '../../../../Factory/Mock/MockTegeIDFactory';
import { FileError } from '../../../../General/File/Error/FileError';
import { MockFile } from '../../../../General/File/Mock/MockFile';
import { MockLogger } from '../../../../Infrastructure/Mock/MockLogger';
import { ITegeHierarchyQuery } from '../../Interface/ITegeHierarchyQuery';
import { TegeHierarchyQuery } from '../TegeHierarchyQuery';

describe('TegeHierarchyQuery', () => {
  describe('container', () => {
    it('returns singleton instance', () => {
      expect.assertions(2);

      const query1: ITegeHierarchyQuery = container.get<ITegeHierarchyQuery>(Types.TegeHierarchyFileQuery);
      const query2: ITegeHierarchyQuery = container.get<ITegeHierarchyQuery>(Types.TegeHierarchyFileQuery);

      expect(query1).toBeInstanceOf(TegeHierarchyQuery);
      expect(query1).toBe(query2);
    });
  });

  describe('all', () => {
    it('returns Alive', async () => {
      expect.assertions(8);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const str: string = `[{"ancestor":"${id1.toString()}","offspring":"${id1.toString()}"},{"ancestor":"${id2.toString()}","offspring":"${id2.toString()}"},{"ancestor":"${id1.toString()}","offspring":"${id2.toString()}"}]`;

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const factory: MockTegeIDFactory = new MockTegeIDFactory();
      file.exists = stub1;
      stub1.resolves(true);
      file.read = stub2;
      stub2.resolves(str);
      factory.forge = stub3;
      stub3.withArgs(id1.toString()).returns(id1);
      stub3.withArgs(id2.toString()).returns(id2);

      const logger: MockLogger = new MockLogger();
      const tegeHierarchyQuery: TegeHierarchyQuery = new TegeHierarchyQuery(factory, file, logger);

      const schrodinger: Schrodinger<ClosureTableHierarchies<TegeID>, TegeError | FileError> = await tegeHierarchyQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const hierarchies: ClosureTableHierarchies<TegeID> = schrodinger.get();

      expect(hierarchies.size()).toBe(3);
      expect(hierarchies.get(0)?.getAncestor()).toBe(id1);
      expect(hierarchies.get(0)?.getOffspring()).toBe(id1);
      expect(hierarchies.get(1)?.getAncestor()).toBe(id2);
      expect(hierarchies.get(1)?.getOffspring()).toBe(id2);
      expect(hierarchies.get(2)?.getAncestor()).toBe(id1);
      expect(hierarchies.get(2)?.getOffspring()).toBe(id2);
    });

    it('returns Dead.FileError when file.exists() returns false', async () => {
      expect.assertions(2);

      const stub1: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const factory: MockTegeIDFactory = new MockTegeIDFactory();
      file.exists = stub1;
      stub1.resolves(false);

      const logger: MockLogger = new MockLogger();
      const tegeHierarchyQuery: TegeHierarchyQuery = new TegeHierarchyQuery(factory, file, logger);

      const schrodinger: Schrodinger<ClosureTableHierarchies<TegeID>, TegeError | FileError> = await tegeHierarchyQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FileError);
    });

    it('returns Dead.TegeError when JSONA.parse() throws JSONAError', async () => {
      expect.assertions(2);

      const id1: TegeID = new MockTegeID();
      const id2: TegeID = new MockTegeID();
      const str: string = `[{"ancestor":"${id1.toString()}","offspring":"${id1.toString()}"},{"ancestor":"${id2.toString()}","offspring":"${id2.toString()}"},{"ancestor":"${id1.toString()}","offspring":"${id2.toString()}"}`;

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const factory: MockTegeIDFactory = new MockTegeIDFactory();
      file.exists = stub1;
      stub1.resolves(true);
      file.read = stub2;
      stub2.resolves(str);

      const logger: MockLogger = new MockLogger();
      const tegeHierarchyQuery: TegeHierarchyQuery = new TegeHierarchyQuery(factory, file, logger);

      const schrodinger: Schrodinger<ClosureTableHierarchies<TegeID>, TegeError | FileError> = await tegeHierarchyQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });
  });
});
