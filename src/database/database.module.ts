import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as postgres from 'pg';
import * as schema from './schema';

export type Database = NodePgDatabase<typeof schema>;
export const DATABASE_CONNECTION = Symbol.for('DATABASE_CONNECTION');

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (configService: ConfigService) => {
        const postgresPool = new postgres.Pool({
          connectionString: configService.getOrThrow('DATABASE_URL'),
        });

        return drizzle(postgresPool, { schema });
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
