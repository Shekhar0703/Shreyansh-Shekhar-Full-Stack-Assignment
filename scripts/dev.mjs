import { spawn } from "node:child_process";

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

const processes = [
  {
    name: "web",
    command: npmCommand,
    args: ["run", "dev:web"],
  },
  {
    name: "api",
    command: npmCommand,
    args: ["run", "dev:api"],
  },
];

const children = processes.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    stdio: "inherit",
  });

  child.on("exit", (code) => {
    if (code && code !== 0) {
      console.error(`${name} exited with code ${code}`);
      process.exitCode = code;
    }
  });

  return child;
});

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
  process.exit();
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);