import { Module } from '@nestjs/common';
import { TodoService } from './service/todo.service';
import { TodoController } from './controller/todo.controller';
import { PrismaService } from 'src/prisma.service';
// import { applyMiddleware }  from '../middleware/method-interceptor'

@Module({
  providers: [TodoService, PrismaService],
  controllers: [TodoController],
})
export class TodoModule {}
