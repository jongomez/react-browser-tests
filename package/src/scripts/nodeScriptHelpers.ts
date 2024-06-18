import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export type YargsArgv = {
  [x: string]: unknown;
  url: string;
  log: boolean;
  _: (string | number)[];
  $0: string;
};

export const yargsArgv = yargs(hideBin(process.argv))
  .usage('Usage: $0 --url <url> [--log]')
  .option('url', {
    describe: 'URL to visit',
    type: 'string',
    demandOption: true,  // URL is required
    nargs: 1,            // Only one URL is allowed
    alias: 'u'
  })
  .option('log', {
    describe: 'Show browser logs on the console',
    type: 'boolean',     // The log option is a boolean flag
    default: false,      // By default, logging is turned off
    alias: 'l'           // Short alias for the log option
  })
  .help('h')
  .alias('h', 'help')
  .argv;