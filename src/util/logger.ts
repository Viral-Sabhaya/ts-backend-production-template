import { createLogger, format, transports } from 'winston';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';
import util from 'util';
import config from '../config/config';
import { EApplicationEnvironment } from '../constant/application';
import path from 'path';
import * as sourceMapSupport from 'source-map-support';
import { blue, green, red, yellow, magenta } from 'colorette'
// Linking Trace support
sourceMapSupport.install();

const colorizeLevel = (level: string) => {
  switch (level) {
    case 'ERROR':
      return red(level)
    case 'info':
      return blue(level)
    case 'WARN':
      return yellow(level)
    default:
      return level
  }
}

const consoleLogFormate = format.printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { level, message, timestamp, meta = {} } = info
  const customLevel = colorizeLevel(level.toLowerCase());

  const customTimeStamp = green(timestamp as string);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const customMessage = message;
  const customMeta = util.inspect(meta, {
    showHidden: false,
    depth: null,
    colors: true
  })
  const customLog = `${customLevel} [${customTimeStamp}] ${customMessage}\n${magenta('META')} ${customMeta}\n`
  return customLog
})

const consoleTransport = (): Array<ConsoleTransportInstance> => {
  if (config.env === EApplicationEnvironment.DEVELOPMENT) {
    return [
      new transports.Console({
        level: 'info',
        format: format.combine(format.timestamp(), consoleLogFormate)
      })
    ]
  }
  return []
}

const fileLogFormate = format.printf((info) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { level, message, timestamp, meta = {} } = info;

  const logMeta: Record<string, unknown> = {};

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  for (const [key, value] of Object.entries(meta)) {
    if (value instanceof Error) {
      logMeta[key] = {
        name: value.name,
        message: value.message,
        trace: value.stack || ''
      }
    } else {
      logMeta[key] = value
    }
  }

  const logData = {
    level: level.toLowerCase(),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    message,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    timestamp,
    meta: logMeta
  }
  return JSON.stringify(logData, null, 4)
})

const fileTransport = (): Array<FileTransportInstance> => {
  return [
    new transports.File({
      filename: path.join(__dirname, '../../', 'logs', `${config.env}.log`),
      level: 'info',
      format: format.combine(format.timestamp(), fileLogFormate)
    })
  ]
}

export default createLogger({
  defaultMeta: {
    meta: {}
  },
  transports: [...fileTransport(), ...consoleTransport()]
})