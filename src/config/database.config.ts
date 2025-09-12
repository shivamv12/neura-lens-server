import { registerAs } from '@nestjs/config';
import { DatabaseConfig } from '../common/interfaces/database-config.interface';

export default registerAs<DatabaseConfig>('database', (): DatabaseConfig => {
  const {DB_USER, DB_PASS, DB_NAME, DB_APP_NAME, DB_CLUSTER } = process.env;
  return {
    uri: `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=${DB_APP_NAME}`,
    name: process.env.DB_NAME!,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  }
});
