import { newlineChar, indentation } from '../../src/utils/utils';
import Table from '../../src/table';

const mockConnector = {
  getScript() {
    return 'FROM [lib://unique]';
  },
};

describe('Table', () => {
  it('should return script', () => {
    const table = new Table(mockConnector, 'TableName');
    expect(table.getScript()).to.eql(`LOAD\n*\n${mockConnector.getScript()};`);
  });

  it('should return table name', () => {
    const table = new Table(mockConnector, 'TableName');
    expect(table.getName()).to.eql('TableName');
  });

  describe('options', () => {
    it('should return table name from options', () => {
      const table2 = new Table(mockConnector, { name: 'TableName' });
      expect(table2.getName()).to.eql('TableName');
    });

    it('should be possible to add a optional delimiter', () => {
      const table2 = new Table(mockConnector, { delimiter: '-' });
      expect(table2.getScript()).to.eql(
        `LOAD\n*\n${mockConnector.getScript()}\n(delimiter is '-');`
      );
    });

    it('should use the second row as the header', () => {
      const table2 = new Table(mockConnector, { headerRowNr: 1 });
      expect(table2.getScript()).to.eql(
        `LOAD\n*\n${mockConnector.getScript()}\n(header is 1 lines, embedded labels);`
      );
    });

    it('should use a delimiter and header row nr seperated by ,', () => {
      const table2 = new Table(mockConnector, {
        delimiter: '-',
        headerRowNr: 1,
      });
      expect(table2.getScript()).to.eql(
        `LOAD\n*\n${mockConnector.getScript()}\n(header is 1 lines, embedded labels, delimiter is '-');`
      );
    });

    it('should be possible to specify which source table to use', () => {
      const table2 = new Table(mockConnector, { srcTable: 'table2' });
      expect(table2.getScript()).to.eql(
        `LOAD\n*\n${mockConnector.getScript()}\n(table is "table2");`
      );

      // Should work with html make sure it is documented
    });
  });

  describe('connection input', () => {
    it('should be possible to do proceeding load by adding another table as the connection to the first', () => {
      const table = new Table(mockConnector, 'TableName');
      const table2 = new Table(table);
      expect(table2.getScript()).to.eql(`LOAD\n*;\n${table.getScript()}`);
    });

    it('should be possible to pass JSON data into a table and have it converted into CSV in an inline load', () => {
      const jsonData = [
        { Header1: 'a1', Header2: 'b1' },
        { Header1: 'a2', Header2: 'b2' },
        { Header1: 'a3', Header2: 'b3' },
      ];
      expect(new Table(jsonData, 'TableName').getScript()).to.eql(
        'LOAD\n*\nINLINE "\nHeader1,Header2\na1,b1\na2,b2\na3,b3\n"\n(txt);'
      );
    });

    it('should escape JSON data that contains separator character', () => {
      const jsonData = [
        { 'Head,er1': 'a,1', Header2: 1 },
        { 'Head,er1': 'a2', Header2: 'b2' },
        { 'Head,er1': 'a3', Header2: 'b3' },
      ];
      expect(new Table(jsonData, 'TableName').getScript()).to.eql(
        'LOAD\n*\nINLINE "\n""Head,er1"",Header2\n""a,1"",1\na2,b2\na3,b3\n"\n(txt);'
      );
    });

    it('should escape JSON data that contains separator character and double quotes', () => {
      const jsonData = [
        { 'Head,er1': '"a,1"', Header2: 1 },
        { 'Head,er1': 'a,"2"', Header2: 'b2' },
        { 'Head,er1': 'a3', Header2: 'b3' },
      ];
      expect(new Table(jsonData, 'TableName').getScript()).to.eql(
        'LOAD\n*\nINLINE "\n""Head,er1"",Header2\n""""""a,1"""""",1\n""a,""""2"""""",b2\na3,b3\n"\n(txt);'
      );
    });

    it('should replace new lines with spaces and escape JSON data that contains new lines', () => {
      const jsonData = [
        { 'Head,er1': 'a\n1', Header2: 1 },
        { 'Head,er1': 'a2', Header2: 'b2' },
        { 'Head,er1': 'a3', Header2: 'b3' },
      ];
      expect(new Table(jsonData, 'TableName').getScript()).to.eql(
        'LOAD\n*\nINLINE "\n""Head,er1"",Header2\n""a 1"",1\na2,b2\na3,b3\n"\n(txt);'
      );
    });

    it('should be possible to add a path and a file connection should be created', () => {
      const filePath = 'C:\\data\\data.txt';
      const table = new Table(filePath, 'TableName');
      expect(table.getScript()).to.eql(
        `LOAD\n*\nFROM [lib://${table
          .getConnection()
          .getName()}/data.txt]\n(txt);`
      );
    });

    it('should be possible to add url and a webfile connection should be created', () => {
      const filePath = 'http://www.data.com/data';
      const table = new Table(filePath, {
        name: 'TableName',
        characterSet: 'utf8',
      });
      expect(table.getScript()).to.eql(
        `LOAD\n*\nFROM [lib://${table
          .getConnection()
          .getName()}]\n(html, utf8);`
      );
    });

    it('should be select html for a url that contains webfile connection with htm', () => {
      const filePath = 'http://www.data.com/data.htm';
      const table = new Table(filePath, {
        name: 'TableName',
        characterSet: 'utf8',
      });
      expect(table.getScript()).to.eql(
        `LOAD\n*\nFROM [lib://${table
          .getConnection()
          .getName()}]\n(html, utf8);`
      );
    });
  });

  describe('fieldlists', () => {
    it('should be possible to specify srcName and name', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [
          { src: 'original_name', name: 'Title' },
          { src: 'original_data', name: 'Data' },
        ],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}"original_name" AS "Title",\n${indentation()}"original_data" AS "Data"\n${mockConnector.getScript()};`
      );
    });

    it('should be possible to only specify srcName and that name will be used as the field name', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [{ src: 'original_name' }, { src: 'original_data' }],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}"original_name" AS "original_name",\n${indentation()}"original_data" AS "original_data"\n${mockConnector.getScript()};`
      );
    });

    it('should be possible to a field without src and only name', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [{ expr: 'DATE("original_name")', name: 'original_name' }],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}DATE("original_name") AS "original_name"\n${mockConnector.getScript()};`
      );
    });

    it('should be possible to specify expr and it should override srcName', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [
          { src: 'original_name', expr: 'DATE("original_name")' },
          { src: 'original_data' },
        ],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}DATE("original_name") AS "original_name",\n${indentation()}"original_data" AS "original_data"\n${mockConnector.getScript()};`
      );
    });

    it('should support input format and display formats it should override srcName', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [
          {
            src: 'original_name',
            type: 'date',
            inputFormat: 'YYYY MM DD',
            displayFormat: 'YY-DD-MM',
          },
        ],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}DATE(DATE#("original_name", 'YYYY MM DD'), 'YY-DD-MM') AS "original_name"\n${mockConnector.getScript()};`
      );
    });

    it('should support input format and it should override srcName', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [
          { src: 'original_name', type: 'date', inputFormat: 'YYYY MM DD' },
        ],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}DATE(DATE#("original_name", 'YYYY MM DD')) AS "original_name"\n${mockConnector.getScript()};`
      );
    });

    it('should support display format and it should override srcName', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [
          { src: 'original_name', type: 'date', displayFormat: 'YYYY MM DD' },
        ],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}DATE("original_name", 'YYYY MM DD') AS "original_name"\n${mockConnector.getScript()};`
      );
    });

    it('should support timestamp type', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [{ src: 'original_name', type: 'timestamp' }],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}TIMESTAMP("original_name") AS "original_name"\n${mockConnector.getScript()};`
      );
    });

    it('should support time type', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [{ src: 'original_name', type: 'time' }],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}TIME("original_name") AS "original_name"\n${mockConnector.getScript()};`
      );
    });

    it('should not support empty type', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [{ src: 'original_name', type: '' }],
      });
      expect(table.getScript()).to.eql(
        `LOAD\n${indentation()}"original_name" AS "original_name"\n${mockConnector.getScript()};`
      );
    });

    it('should not support other types', () => {
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [{ src: 'original_name', type: 'custom' }],
      });
      expect(table.getScript()).to.not.eql(
        `LOAD\n${indentation()}CUSTOM("original_name") AS "original_name"\n${mockConnector.getScript()};`
      );
    });

    it('should throw error if field does not include either name or src', () => {
      const field = { expr: 'only-expr' };
      const table = new Table(mockConnector, {
        name: 'TableName',
        fields: [field],
      });

      expect(() => table.getFieldList()).to.throw(
        `A name or src needs to specified on the field: ${JSON.stringify(field)}`
      );
    });
  });
});
