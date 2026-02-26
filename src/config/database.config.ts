import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  master: {
    dialect: 'mysql',
    host: process.env.MASTER_DB_HOST,
    port: Number(process.env.MASTER_DB_PORT),
    username: process.env.MASTER_DB_USERNAME,
    password: process.env.MASTER_DB_PASSWORD,
    database: process.env.MASTER_DB_DATABASE,

    timezone: '+05:30',
    logging: process.env.NODE_ENV === 'development',

    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    define: {
      timestamps: true,
      underscored: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
}));
