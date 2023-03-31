import { FilesystemPublisher } from "./publisher";
import { FilesystemPreparer } from "./preparer";

export default () => {
  return {
    publisher: new FilesystemPublisher(),
    preparer: new FilesystemPreparer(),
  };
};
