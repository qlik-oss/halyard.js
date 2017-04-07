import Connections from './connections';

import * as JsonToCsv from './utils/json-to-csv';

import ConnectionMatcher from './connection-matcher';

const connectionMatcher = new ConnectionMatcher();


// url to a table file
connectionMatcher.addConnection(data => typeof data === 'string' && data.match(/^https?:\/\/(.*)$/g), data => new Connections.Web(data));

// Path to a table file
connectionMatcher.addConnection(data => typeof data === 'string' && data.match(/^.*\.(.*)$/g), data => new Connections.File(data));

// Inline JSON table to csv
connectionMatcher.addConnection(data => data instanceof Array && JsonToCsv.isJson(data),
    data => new Connections.Inline(JsonToCsv.convert(data)));

// Inline csv table
connectionMatcher.addConnection(data => typeof data === 'string', data => new Connections.Inline(data));

export default connectionMatcher;
