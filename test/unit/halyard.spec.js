import Halyard from '../../src/halyard';
import { newlineChar } from '../../src/utils/utils';
import mockHyperCubes from './mocks/hyper-cubes';
import mockScripts from './mocks/scripts';

describe('Halyard', () => {
  describe('add table', () => {
    let halyard;

    beforeEach(() => {
      halyard = new Halyard();
    });

    it('should be possible to implicitly add a table', () => {
      const table = halyard.addTable('C:\\\\Data\\Data.txt', { name: 'DataTable' });
      expect(halyard.getScript()).to.eql(`"DataTable":\nLOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });

    it('should be possible to implicitly add a table and section', () => {
      const table = halyard.addTable('C:\\\\Data\\Data.txt', { name: 'DataTable', section: 'New Section' });
      expect(halyard.getScript()).to.eql(`///$tab New Section\n"DataTable":\nLOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });

    it('should be possible to explicitly add a table', () => {
      const table = new Halyard.Table('C:\\\\Data\\Data.txt', 'DataTable');
      halyard.addTable(table);
      expect(halyard.getScript()).to.eql(`"DataTable":\nLOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });

    it('should not be possible to add two tables with the same name', () => {
      const table = new Halyard.Table('C:\\\\Data\\Data.txt', 'DataTable');
      halyard.addTable(table);

      const table2 = new Halyard.Table('C:\\\\Data\\Data.txt', 'DataTable');
      expect(() => halyard.addTable(table2)).to.throw('Cannot add another table with the same name.');
      expect(halyard.getScript()).to.eql(`"DataTable":\nLOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });

    it('should escape tableNames', () => {
      const table = new Halyard.Table('C:\\\\Data\\Data.txt', 'Data"Table');
      halyard.addTable(table);
      expect(halyard.getScript()).to.eql(`"Data""Table":\nLOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });

    it('should escape sectionNames', () => {
      const table = new Halyard.Table('C:\\\\Data\\Data.txt', {name: 'DataTable', section: 'Data"Table' });
      halyard.addTable(table);
      expect(halyard.getScript()).to.eql(`///$tab Data""Table\n"DataTable":\nLOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });

    it('should not add table name if non is provided', () => {
      const table = new Halyard.Table('C:\\\\Data\\Data.txt');
      halyard.addTable(table);
      expect(halyard.getScript()).to.eql(`LOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });
  }),
  describe('add hyper cube', () => {
    let halyard;

    beforeEach(() => {
      halyard = new Halyard();
    });

    it('should be possible to implicitly add a hyper cube', () => {
      halyard.addHyperCube(mockHyperCubes.StraightMode, { name: 'HyperCube' });
      expect(halyard.getScript()).to.eql(mockScripts.HyperCubes.StraightMode.replace('///$tab HyperCube\n',''));
    });

    it('should be possible to implicitly add a table and section', () => {
      halyard.addHyperCube(mockHyperCubes.StraightMode, { name: 'HyperCube', section: 'New Section' });
      expect(halyard.getScript()).to.eql(mockScripts.HyperCubes.StraightMode.replace('///$tab HyperCube\n','///$tab New Section\n'));
    });

    it('should be possible to explicitly add a hyper cube', () => {
      const hyperCube = new Halyard.HyperCube(mockHyperCubes.StraightMode, { name: 'HyperCube' });
      halyard.addHyperCube(hyperCube);
      expect(halyard.getScript()).to.eql(mockScripts.HyperCubes.StraightMode.replace('///$tab HyperCube\n',''));
    });

    it('should not be possible to add a hyper cube with the same name as an already added table', () => {
      const table = new Halyard.Table('C:\\\\Data\\Data.txt', 'DataTable');
      halyard.addTable(table);

      const hyperCube = new Halyard.HyperCube(mockHyperCubes.StraightMode, { name: 'DataTable' });
      
      expect(() => halyard.addHyperCube(hyperCube)).to.throw('Cannot add another table with the same name.');
      expect(halyard.getScript()).to.eql(`"DataTable":\nLOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });

    it('should not be possible to add a hyper cube with a dual map table with the same name as an already added table', () => {
      const dualMapTableName = 'MapDual__sorted_country';
      const table = new Halyard.Table('C:\\\\Data\\Data.txt',dualMapTableName);
      halyard.addTable(table);

      const hyperCube = new Halyard.HyperCube(mockHyperCubes.StraightMode, { name: 'HyperCube' });
      
      expect(() => halyard.addHyperCube(hyperCube)).to.throw('Cannot add another table with the same name.');
      expect(halyard.getScript()).to.eql(`"${dualMapTableName}":\nLOAD\n*\n${table.getConnection().getScript()}\n(txt);`);
    });

    it('should not add hyper cube name if non is provided', () => {
      const hyperCube = new Halyard.HyperCube(mockHyperCubes.StraightMode);
      halyard.addHyperCube(hyperCube);
      expect(halyard.getScript()).to.eql(mockScripts.HyperCubes.StraightMode.replace('///$tab HyperCube\n','').replace('"HyperCube":\n',''));
    });
    
  }),
  describe('add item', () => {
    let halyard;

    beforeEach(() => {
      halyard = new Halyard();
    });

    it('should be possible to add item with getScript as the only method', () => {
      const customScript = '//Custom Script';

      class CustomObject {
        getScript() {
          return customScript;
        }
      }

      halyard.addItem(new CustomObject());
      expect(halyard.getScript()).to.eql(customScript);
    });
  }),

  describe('connection', () => {
    let halyard;
    const table = new Halyard.Table('C:\\\\Data\\Data.txt', 'DataTable');
    const table2 = new Halyard.Table([{ a: 1, b: 2 }], 'ArrayTable');

    beforeEach(() => {
      halyard = new Halyard();
      halyard.addTable(table);
      halyard.addTable(table2);
    });

    it('should return qix connections without inline loads', () => {
      expect(halyard.getQixConnections()).to.eql([table.getConnection().getQixConnectionObject()]);
    });

    it('should inlcude all connections', () => {
      expect(halyard.getConnections()).to.eql([table.getConnection(), table2.getConnection()]);
    });
  });

  describe('fields', () => {
    let halyard;

    const table = new Halyard.Table([{ a: 1, b: 2 }], { fields: [{ src: 'a' }, { src: 'b' }] });
    const table2 = new Halyard.Table('C:\\\\Data\\Data.txt', { fields: [{ src: 'c', calendarTemplate: true }, { src: 'd' }] });

    beforeEach(() => {
      halyard = new Halyard();
      halyard.addTable(table);
      halyard.addTable(table2);
    });

    it('should return all field if no matcher is provided', () => {
      expect(halyard.getFields()).to.eql([...table.getFields(), ...table2.getFields()]);
    });

    it('should only return field named c', () => {
      expect(halyard.getFields((field => field.calendarTemplate))).to.eql([table2.getFields()[0]]);
    });
  });

  describe('default set statements', () => {
    let halyard;

    beforeEach(() => {
      halyard = new Halyard();
    });

    it('should reutrn empty if nothing has been set', () => {
      expect(halyard.getScript()).to.eql('');
    });

    it('should return entered default set statemetns', () => {
      halyard.setDefaultSetStatements({ test: 1, test2: 2 });
      expect(halyard.getScript()).to.eql('SET test=\'1\';\nSET test2=\'2\';');
    });

    it('should join set statment array values with a semicolon', () => {
      halyard.setDefaultSetStatements({ test: [1,2,3], test2: 2 });
      expect(halyard.getScript()).to.eql('SET test=\'1;2;3\';\nSET test2=\'2\';');
    });

    it('should not replace previously entered default statements', () => {
      halyard.setDefaultSetStatements({ test: 'first' });
      halyard.setDefaultSetStatements({ test: 'second', test2: 'second' }, true);
      expect(halyard.getScript()).to.eql('SET test=\'first\';\nSET test2=\'second\';');
    });
  });

  describe('getItemsThatGeneratedScriptAt', () => {
    let halyard;
    let table;

    beforeEach(() => {
      halyard = new Halyard();
      table = new Halyard.Table('C:\\\\Data\\Data.txt');
      halyard.addTable(table);
    });

    it('should return the first table', () => {
      const lastCharOfTableScript = (`${table.getScript()}\n\n`).length;

      expect(halyard.getItemThatGeneratedScriptAt(0)).to.eql(table);
      expect(halyard.getItemThatGeneratedScriptAt(lastCharOfTableScript)).to.eql(table);
      expect(halyard.getItemThatGeneratedScriptAt(lastCharOfTableScript + 1)).to.not.eql(table);
    });

    it('should work with many items', () => {
      halyard.setDefaultSetStatements({ date: 'YYYY-MM-DD' });

      const allScriptItems = halyard.getAllScriptBlocks();

      expect(allScriptItems[1]).to.eql(table);

      expect(halyard.getItemThatGeneratedScriptAt(0)).to.eql(allScriptItems[0]);
      expect(halyard.getItemThatGeneratedScriptAt((`${allScriptItems[0].getScript()}\n\n`).length)).to.eql(allScriptItems[0]);
      expect(halyard.getItemThatGeneratedScriptAt((`${allScriptItems[0].getScript()}\n\n`).length + 1)).to.eql(allScriptItems[1]);

      expect(halyard.getItemThatGeneratedScriptAt(1000000)).to.be.undefined;
    });
  });
});
