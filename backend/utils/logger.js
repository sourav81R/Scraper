const formatMessage = (level, message, error) => {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] ${level.toUpperCase()}: ${message}`;

  if (!error) {
    return base;
  }

  return `${base}\n${error.stack || error.message}`;
};

const logger = {
  info(message) {
    console.log(formatMessage("info", message));
  },
  warn(message) {
    console.warn(formatMessage("warn", message));
  },
  error(message, error) {
    console.error(formatMessage("error", message, error));
  },
};

module.exports = logger;
