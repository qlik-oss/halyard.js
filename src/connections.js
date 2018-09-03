import FileConnection from './connections/file';
import WebConnection from './connections/web-file';
import InlineData from './connections/inline-data';

/**
 * Default set of Connections that are available
 * @constant
 * @type {object}
 */
export default {
  File: FileConnection,
  Web: WebConnection,
  Inline: InlineData,
};
