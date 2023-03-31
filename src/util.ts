import { dirname } from "path";
import { PathLike, promises as fs } from "fs";

export async function existsDir(path: PathLike): Promise<boolean> {
  try {
    const stat = await fs.lstat(path);
    return stat.isDirectory();
  } catch (e: unknown) {
    if ((e as any).code === "ENOENT") {
      return false;
    }
    throw e;
  }
}

export async function makeDirIfNotExists(path: string): Promise<void> {
  if (!(await existsDir(path))) {
    await fs.mkdir(path, { recursive: true });
  }
}

export function makeParentIfNotExists(path: string): Promise<void> {
  return makeDirIfNotExists(dirname(path));
}
