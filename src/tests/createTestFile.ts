import fs from "node:fs";
import path from "node:path";

const makeFullName = async (
  folderWithTests: string, // __dirname
  fileName: string
) => {
  const filesFolder = path.join(folderWithTests, "files");
  try {
    await fs.promises.access(filesFolder, fs.constants.F_OK);
  } catch (e) {
    await fs.promises.mkdir(filesFolder);
  }
  return path.join(filesFolder, fileName);
};

export const createTestFile = async (
  folderWithTests: string, // __dirname
  fileName: string,
  data: string
): Promise<void> => {
  const fullName = await makeFullName(folderWithTests, fileName);
  await fs.promises.writeFile(fullName, data, { encoding: "utf-8" });
};
