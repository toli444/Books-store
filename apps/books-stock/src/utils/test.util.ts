import { exec } from 'child_process';
import * as util from 'util';

const execPromisify = util.promisify(exec);

export const clearDB = async () => execPromisify('npm run test:db:reset');
