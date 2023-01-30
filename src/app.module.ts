import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TodoController } from './todo/controller/todo.controller';
import { PrismaService } from './prisma.service';
import { TodoService } from './todo/service/todo.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [TodoModule, AuthModule, UsersModule],
  controllers: [AppController, TodoController],
  providers: [AppService, TodoService, PrismaService],
})
export class AppModule {}
