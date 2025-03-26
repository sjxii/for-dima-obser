import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { JwtStrategy } from './auth/strategy/jwt.strategy';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, TasksModule],
  controllers: [],
  providers: [JwtStrategy],
})
export class AppModule {}
