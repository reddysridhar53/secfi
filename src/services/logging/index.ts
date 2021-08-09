import { getParamFromUrl, UrlValueType } from "../../utils";

export enum LogLevel {
  TRACE,
  DEBUG,
  INFO,
  WARN,
  ERROR
}

// Keep in sync with above
const COLORS = {
  "TRACE": '#888',
  "DEBUG": 'green',
  "INFO": 'blue',
  "WARN": 'orange',
  "ERROR": '#FF0000'
};

export default class Logger {

  private DEFAULT_LOG_LEVEL: LogLevel = LogLevel.INFO;

  private readonly URL_QUERY_PARAM_KEY: string = "debug";

  constructor() {
    const isDebugMode: UrlValueType = getParamFromUrl(this.URL_QUERY_PARAM_KEY) as boolean;
    if (isDebugMode) {
      this.DEFAULT_LOG_LEVEL = LogLevel.DEBUG;
    }
  }

  log(level: LogLevel, module: string, message: string): void {

    switch (level) {
      case LogLevel.TRACE: {
        this.trace(module, message);
        break;
      }
      case LogLevel.DEBUG: {
        this.debug(module, message);
        break;
      }
      case LogLevel.INFO: {
        this.info(module, message);
        break;
      }
      case LogLevel.WARN: {
        this.warn(module, message);
        break;
      }
      case LogLevel.ERROR: {
        this.error(module, message);
        break;
      }
    }
  }

  trace(module: string, message: string): void {
    if (this.allowLoggingForLevel(LogLevel.TRACE)) {
      console.log(`%c TRACE: ${module}: ${message}`, `color: ${COLORS["TRACE"]}`);
    }
  }

  debug(module: string, message: string): void {
    if (this.allowLoggingForLevel(LogLevel.DEBUG)) {
      console.log(`%c DEBUG: ${module}: ${message}`, `color: ${COLORS["DEBUG"]}`);
    }
  }

  info(module: string, message: string): void {
    if (this.allowLoggingForLevel(LogLevel.INFO)) {
      console.log(`%c INFO: ${module}: ${message}`, `color: ${COLORS["INFO"]}`);
    }
  }

  warn(module: string, message: string): void {
    if (this.allowLoggingForLevel(LogLevel.WARN)) {
      console.log(`%c WARN: ${module}: ${message}`, `color: ${COLORS["WARN"]}`);
    }
  }

  error(module: string, message: string, error?: any): void {
    error = error || "";
    if (this.allowLoggingForLevel(LogLevel.ERROR)) {
      console.log(`%c ERROR: ${module}: ${message} \n ${error}`, `color: ${COLORS["ERROR"]}`, error);
    }
  }

  private allowLoggingForLevel(level: LogLevel): boolean {
    return level >= this.DEFAULT_LOG_LEVEL;
  }

  // public: only for testing purpose
  setDefaultLogLevel(level: LogLevel): void {
    this.DEFAULT_LOG_LEVEL = level;
  }
}

const loggerInstance = new Logger();

export { loggerInstance as logger };

