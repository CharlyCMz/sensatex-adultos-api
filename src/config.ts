import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const yaml_file = 'config.yml';

export default () => {
  const configPath = join(__dirname, '..', 'config.yml');
  return yaml.load(readFileSync(configPath, 'utf-8')) as AppConfig;
};

export type AppConfig = {
  sensatexAdultos: {
    port: number;
    jwtSecret: string;
  };
  database: {
    username: string;
    password: string;
    dbName: string;
    host: string;
    port: number;
  };
};
