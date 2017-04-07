import FileConnection from './connections/file';
import WebConnection from './connections/web-file';
import InlineData from './connections/inline-data';

export default {
  File: FileConnection,
  Web: WebConnection,
  Inline: InlineData,
};
