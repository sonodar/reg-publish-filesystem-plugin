import { createLogger } from "reg-suit-util";
import { FilesystemPreparer, SetupInquireResult } from "../lib/preparer";
import { FilesystemPublisher } from "../lib/publisher";
import glob from "glob";
import rimraf from "rimraf";
import { existsDir } from "../lib/util";

describe("E2E test", () => {
  const logger = createLogger();
  logger.setLevel("verbose");

  const baseConf = {
    coreConfig: { actualDir: "", workingDir: "" },
    logger,
    noEmit: false,
  };

  const dirsA = {
    base: __dirname + "/../e2e/report-fixture",
    actualDir: __dirname + "/../e2e/report-fixture/dir_a",
    expectedDir: __dirname + "/../e2e/report-fixture/dir_b",
    diffDir: "",
  };

  const dirsB = {
    base: __dirname + "/../e2e/report-fixture-expected",
    actualDir: __dirname + "/../e2e/report-fixture-expected/dir_a",
    expectedDir: __dirname + "/../e2e/report-fixture-expected/dir_b",
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
    const list = glob.sync("dir_b/sample01.png", { cwd: dirsB.base });
    expect(list[0]).toEqual("dir_b/sample01.png");
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
