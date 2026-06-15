import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const webDir = path.join(root, "apps", "web");
const apiDir = path.join(root, "apps", "api");
const isWindows = process.platform === "win32";
const npmCommand = "npm";
const pythonCommand = isWindows ? "python" : "python3";
const venvDir = path.join(apiDir, ".venv");
const venvPython = isWindows
  ? path.join(venvDir, "Scripts", "python.exe")
  : path.join(venvDir, "bin", "python");

function run(command, args, cwd) {
  const usesWindowsNpmWrapper = isWindows && command === npmCommand;
  const actualCommand = usesWindowsNpmWrapper ? "cmd" : command;
  const actualArgs = usesWindowsNpmWrapper ? ["/c", command, ...args] : args;
  const result = spawnSync(actualCommand, actualArgs, {
    cwd,
    stdio: "inherit",
    shell: false,
  });

  if (result.status !== 0) {
    throw new Error(`${command} ${args.join(" ")} failed with code ${result.status ?? 1}`);
  }
}

try {
  if (!existsSync(path.join(webDir, "node_modules"))) {
    run(npmCommand, ["install"], webDir);
  }

  if (!existsSync(venvPython)) {
    run(pythonCommand, ["-m", "venv", venvDir], apiDir);
  }

  run(venvPython, ["-m", "pip", "install", "--upgrade", "pip"], apiDir);
  run(venvPython, ["-m", "pip", "install", "-r", "requirements.txt"], apiDir);

  console.log("Workspace setup completed.");
} catch (error) {
  console.error(error.message);
  process.exit(1);
}