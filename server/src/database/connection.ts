import knex from 'knex';
import path from 'path';

import mySql from '../../knexfile';

const connection = knex(mySql);

export default connection;