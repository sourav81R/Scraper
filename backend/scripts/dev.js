const { spawn, spawnSync } = require("child_process");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const port = Number.parseInt(process.env.PORT || "5000", 10);

const runCommand = (command, args) => {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.error) {
    throw result.error;
  }

  return result.stdout || "";
};

const getListeningPids = (targetPort) => {
  if (process.platform === "win32") {
    const output = runCommand("netstat", ["-ano", "-p", "tcp"]);

    return [...new Set(
      output
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.includes("LISTENING") && line.includes(`:${targetPort}`))
        .map((line) => line.split(/\s+/).pop())
        .map((value) => Number.parseInt(value, 10))
        .filter((value) => Number.isInteger(value) && value > 0 && value !== process.pid)
    )];
  }

  const output = runCommand("lsof", ["-ti", `tcp:${targetPort}`, "-sTCP:LISTEN"]);

  return [...new Set(
    output
      .split(/\r?\n/)
      .map((value) => Number.parseInt(value.trim(), 10))
      .filter((value) => Number.isInteger(value) && value > 0 && value !== process.pid)
  )];
};

const stopPid = (pid) => {
  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(pid), "/T", "/F"], {
      stdio: "ignore",
    });
    return;
  }

  try {
    process.kill(pid, "SIGTERM");
  } catch (error) {
    if (error.code !== "ESRCH") {
      throw error;
    }
  }
};

const releasePort = (targetPort) => {
  const pids = getListeningPids(targetPort);

  if (pids.length === 0) {
    return;
  }

  console.log(
    `[dev] Port ${targetPort} is busy. Stopping existing process${pids.length > 1 ? "es" : ""}: ${pids.join(", ")}`
  );

  for (const pid of pids) {
    stopPid(pid);
  }
};

const startNodemon = () => {
  const nodemonBin = require.resolve("nodemon/bin/nodemon.js");
  const child = spawn(process.execPath, [nodemonBin, "server.js"], {
    stdio: "inherit",
  });

  child.on("exit", (code, signal) => {
    if (signal) {
      process.kill(process.pid, signal);
      return;
    }

    process.exit(code ?? 0);
  });

  const forwardSignal = (signal) => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on("SIGINT", () => forwardSignal("SIGINT"));
  process.on("SIGTERM", () => forwardSignal("SIGTERM"));
};

releasePort(port);
startNodemon();
