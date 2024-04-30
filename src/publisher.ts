import { promises as fs } from "fs";
import path from "path";
import { AbstractPublisher, FileItem, RemoteFileItem } from "reg-suit-util";
import { PluginCreateOptions, PublisherPlugin } from "reg-suit-interface";
import { existsDir, makeParentIfNotExists } from "./util";

export interface PluginConfig {
  path: string;
}

export class FilesystemPublisher extends AbstractPublisher implements PublisherPlugin<PluginConfig> {
  name = "reg-publish-filesystem-plugin";

  private _options!: PluginCreateOptions<PluginConfig>;
  private _pluginConfig!: PluginConfig;

  init(config: PluginCreateOptions<PluginConfig>) {
    this.noEmit = config.noEmit;
    this.logger = config.logger;
    this._options = config;
    this._pluginConfig = { ...config.options };
  }

  publish(key: string) {
    return this.publishInternal(key).then(({ indexFile }) => ({ reportUrl: indexFile?.absPath }));
  }

  fetch(key: string) {
    return this.fetchInternal(key);
  }

  private get _storePath() {
    return this._pluginConfig.path;
  }

  protected getBucketName() {
    return this._storePath;
  }

  protected getBucketRootDir() {
    return undefined;
  }

  protected getLocalGlobPattern() {
    return undefined;
  }

  protected getWorkingDirs() {
    return this._options.workingDirs;
  }

  protected async listItems(_lastKey: string, prefix: string) {
    const dir = path.resolve(this._storePath, prefix);

    if (!(await existsDir(dir))) {
      return { isTruncated: false, contents: [] };
    }

    const files = await fs.readdir(dir);
    return { isTruncated: false, contents: files.map(key => ({ key })) };
  }

  protected async uploadItem(key: string, item: FileItem) {
    const dest = path.resolve(this._storePath, key, item.path);
    await makeParentIfNotExists(dest);
    await fs.cp(item.absPath, dest, { recursive: true });
    return item;
  }

  protected async downloadItem(remoteItem: RemoteFileItem, item: FileItem) {
    await makeParentIfNotExists(item.absPath);
    const src = path.resolve(this._storePath, remoteItem.remotePath);
    await fs.cp(src, item.absPath, { recursive: true });
    return item;
  }
}
