import { PluginCreateOptions, PluginPreparer } from "reg-suit-interface";
import { PluginConfig } from "./publisher";
import { makeDirIfNotExists } from "./util";

export interface SetupInquireResult {
  path?: string;
}

const DEFAULT_PATH = ".reg-assets";

export class FilesystemPreparer implements PluginPreparer<SetupInquireResult, PluginConfig> {
  inquire() {
    return [
      {
        name: "path",
        type: "input",
        message: "Publish directory (relative or absolute) path",
        default: DEFAULT_PATH,
      },
    ];
  }

  async prepare(config: PluginCreateOptions<SetupInquireResult>) {
    const path = config.options.path || DEFAULT_PATH;
    await makeDirIfNotExists(path);
    return { path };
  }
}
