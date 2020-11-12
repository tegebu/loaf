import { DataSourceError, MockDataSourceError } from '@jamashita/publikum-error';
import { Schrodinger, Superposition } from '@jamashita/publikum-monad';
import {
  ClosureTableHierarchies,
  ClosureTableHierarchy,
  StructurableTree,
  StructurableTreeNode
} from '@jamashita/publikum-tree';
import { Nullable } from '@jamashita/publikum-type';
import { Tege, TegeError, TegeID, Teges } from '@tegebu/syrup';
import sinon, { SinonStub } from 'sinon';
import { container } from '../../../../Container/Container';
import { Types } from '../../../../Container/Types';
import { FileError } from '../../../../General/File/Error/FileError';
import { MockFile } from '../../../../General/File/Mock/MockFile';
import { MockLogger } from '../../../../Infrastructure/Mock/MockLogger';
import { ITegeQuery } from '../../Interface/ITegeQuery';
import { MockTegeHierarchyQuery } from '../../Mock/MockTegeHierarchyQuery';
import { TegeQuery } from '../TegeQuery';

describe('TegeQuery', () => {
  describe('container', () => {
    it('returns singleton instance', () => {
      expect.assertions(2);

      const query1: ITegeQuery = container.get<ITegeQuery>(Types.TegeFileQuery);
      const query2: ITegeQuery = container.get<ITegeQuery>(Types.TegeFileQuery);

      expect(query1).toBeInstanceOf(TegeQuery);
      expect(query1).toBe(query2);
    });
  });

  describe('all', () => {
    it('returns Alive', async () => {
      expect.assertions(5);

      const id1: TegeID = TegeID.generate();
      const id2: TegeID = TegeID.generate();
      const str: string = `[{"id":"${id1.toString()}","name":"te","playingTime":20,"players":{"type":"unique","value":30},"minAge":8,"imagePath":"/","expansion":true},{"id":"${id2.toString()}","name":"le","playingTime":30,"players":{"type":"unique","value":14},"minAge":12,"imagePath":"/","expansion":false}]`;
      const hierarchies: ClosureTableHierarchies<TegeID> = ClosureTableHierarchies.ofArray<TegeID>([
        ClosureTableHierarchy.of<TegeID>(id1, id1),
        ClosureTableHierarchy.of<TegeID>(id2, id1),
        ClosureTableHierarchy.of<TegeID>(id2, id2)
      ]);

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const tegeHierarchyQuery: MockTegeHierarchyQuery = new MockTegeHierarchyQuery();
      file.exists = stub1;
      stub1.resolves(true);
      file.read = stub2;
      stub2.resolves(str);
      tegeHierarchyQuery.all = stub3;
      stub3.returns(Superposition.alive<ClosureTableHierarchies<TegeID>, TegeError>(hierarchies));

      const logger: MockLogger = new MockLogger();
      const tegeQuery: TegeQuery = new TegeQuery(tegeHierarchyQuery, file, logger);

      const schrodinger: Schrodinger<Teges, TegeError | FileError> = await tegeQuery.all().terminate();

      expect(schrodinger.isAlive()).toBe(true);

      const teges: Teges = schrodinger.get();

      expect(teges.size()).toBe(1);

      const tege: Nullable<StructurableTree<TegeID, Tege>> = teges.get(id2);

      if (tege === null) {
        fail();

        return;
      }

      expect(tege.getTreeID().equals(id2)).toBe(true);
      tege.getRoot().getChildren().forEach((child: StructurableTreeNode<TegeID, Tege>) => {
        expect(child.isLeaf()).toBe(true);
        expect(child.getTreeID().equals(id1)).toBe(true);
      });
    });

    it('returns Dead.FileError when file.exists() returns false', async () => {
      expect.assertions(2);

      const stub1: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const tegeHierarchyQuery: MockTegeHierarchyQuery = new MockTegeHierarchyQuery();
      file.exists = stub1;
      stub1.resolves(false);

      const logger: MockLogger = new MockLogger();
      const tegeQuery: TegeQuery = new TegeQuery(tegeHierarchyQuery, file, logger);

      const schrodinger: Schrodinger<Teges, TegeError | FileError> = await tegeQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(FileError);
    });

    it('returns Dead.TegeError when JSONA.parse() throws JSONAError', async () => {
      expect.assertions(2);

      const id1: TegeID = TegeID.generate();
      const id2: TegeID = TegeID.generate();
      const str: string = `[{"id":"${id1.toString()}","name":"te","playingTime":20,"players":{"type":"unique","value":30},"minAge":8,"imagePath":"/","expansion":true},{"id":"${id2.toString()}","name":"le","playingTime":30,"players":{"type":"unique","value":14},"minAge":12,"imagePath":"/","expansion":false}`;

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const tegeHierarchyQuery: MockTegeHierarchyQuery = new MockTegeHierarchyQuery();
      file.exists = stub1;
      stub1.resolves(true);
      file.read = stub2;
      stub2.resolves(str);

      const logger: MockLogger = new MockLogger();
      const tegeQuery: TegeQuery = new TegeQuery(tegeHierarchyQuery, file, logger);

      const schrodinger: Schrodinger<Teges, TegeError | FileError> = await tegeQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when hierarchyQuery.all() returns Dead.TegeError', async () => {
      expect.assertions(2);

      const id1: TegeID = TegeID.generate();
      const id2: TegeID = TegeID.generate();
      const str: string = `[{"id":"${id1.toString()}","name":"te","playingTime":20,"players":{"type":"unique","value":30},"minAge":8,"imagePath":"/","expansion":true},{"id":"${id2.toString()}","name":"le","playingTime":30,"players":{"type":"unique","value":14},"minAge":12,"imagePath":"/","expansion":false}]`;

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const tegeHierarchyQuery: MockTegeHierarchyQuery = new MockTegeHierarchyQuery();
      file.exists = stub1;
      stub1.resolves(true);
      file.read = stub2;
      stub2.resolves(str);
      tegeHierarchyQuery.all = stub3;
      stub3.returns(Superposition.dead<unknown, TegeError>(new TegeError('failed'), TegeError));

      const logger: MockLogger = new MockLogger();
      const tegeQuery: TegeQuery = new TegeQuery(tegeHierarchyQuery, file, logger);

      const schrodinger: Schrodinger<Teges, TegeError | FileError> = await tegeQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });

    it('returns Dead.TegeError when hierarchyQuery.all() returns Dead.DataSourceError', async () => {
      expect.assertions(2);

      const id1: TegeID = TegeID.generate();
      const id2: TegeID = TegeID.generate();
      const str: string = `[{"id":"${id1.toString()}","name":"te","playingTime":20,"players":{"type":"unique","value":30},"minAge":8,"imagePath":"/","expansion":true},{"id":"${id2.toString()}","name":"le","playingTime":30,"players":{"type":"unique","value":14},"minAge":12,"imagePath":"/","expansion":false}]`;

      const stub1: SinonStub = sinon.stub();
      const stub2: SinonStub = sinon.stub();
      const stub3: SinonStub = sinon.stub();
      const file: MockFile = new MockFile();
      const tegeHierarchyQuery: MockTegeHierarchyQuery = new MockTegeHierarchyQuery();
      file.exists = stub1;
      stub1.resolves(true);
      file.read = stub2;
      stub2.resolves(str);
      tegeHierarchyQuery.all = stub3;
      stub3.returns(Superposition.dead<unknown, DataSourceError>(new MockDataSourceError(), DataSourceError));

      const logger: MockLogger = new MockLogger();
      const tegeQuery: TegeQuery = new TegeQuery(tegeHierarchyQuery, file, logger);

      const schrodinger: Schrodinger<Teges, TegeError | FileError> = await tegeQuery.all().terminate();

      expect(schrodinger.isDead()).toBe(true);
      expect(() => {
        schrodinger.get();
      }).toThrow(TegeError);
    });
  });
});
