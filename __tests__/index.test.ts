import { createLogger } from "reg-suit-util";
import { FilesystemPreparer, SetupInquireResult } from "../src/preparer";
import { FilesystemPublisher } from "../src/publisher";
import glob from "glob";
import rimraf from "rimraf";
import { existsDir } from "../src/util";

describe("E2E test", () => {
  const logger = createLogger();
  logger.setLevel("verbose");

  const baseConf = {
    coreConfig: { actualDir: "", workingDir: "" },
    logger,
    noEmit: false,
  };

  const dirsA = {
    base: __dirname + "/report-fixture",
    actualDir: __dirname + "/report-fixture/dir_a",
    expectedDir: __dirname + "/report-fixture/dir_b",
    diffDir: "",
  };

  const dirsB = {
    base: __dirname + "/report-fixture-expected",
    actualDir: __dirname + "/report-fixture-expected/dir_a",
    expectedDir: __dirname + "/report-fixture-expected/dir_b",
    diffDir: "",
  };

  afterEach(() => rimraf(dirsB.base));

  async function doAction(key: string, options: SetupInquireResult = {}) {
    const preparer = new FilesystemPreparer();
    const plugin = new FilesystemPublisher();

    const { path } = await preparer.prepare({ ...baseConf, options, workingDirs: dirsA });

    plugin.init({ ...baseConf, options: { path }, workingDirs: dirsA });
    await plugin.publish(key);

    plugin.init({ ...baseConf, options: { path }, workingDirs: dirsB });
    await plugin.fetch(key);
  }

  function doAssertion() {
    const list = glob.sync("dir_b/**/*.png", { cwd: dirsB.base }).sort();
    expect(list).toEqual(["dir_b/sample01.png", "dir_b/sub_dir/sample01.png"]);
  }

  test("case 1: fetch files from default publish directory", async () => {
    await doAction("abcdef12345");
    doAssertion();
  });

  test("case 1: fetch files from specified publish directory", async () => {
    await doAction("abcdef12345", { path: "/tmp/.reg-assets" });
    doAssertion();
    expect(existsDir("/tmp/.reg-assets/abcdef12345")).toBeTruthy();
    await rimraf("/tmp/.reg-assets");
  });
});
