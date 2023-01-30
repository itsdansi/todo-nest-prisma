import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Todo, Prisma } from '@prisma/client';
import { TaskStatus } from '../task-status.enum';
@Injectable()
export class TodoService {
  constructor(private prisma: PrismaService) {}

  /**
   *
   * @returns
   */
  async getAllTodo(): Promise<Todo[]> {
    return this.prisma.todo.findMany();
  }

  /**
   *
   * @param id
   * @returns
   */
  async getTodo(id: number): Promise<Todo | null> {
    try {
      const result = await this.prisma.todo.findUnique({
        where: { id: Number(id) },
      });
      if (!result) {
        throw new HttpException(
          `Todo with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * @param data
   * @returns
   */
  async createTodo(data: Todo): Promise<Todo> {
    return this.prisma.todo.create({
      data,
    });
  }

  /**
   *
   * @param id
   * @param updatePayload
   * @returns
   */
  async updateTodo(id: number, updatePayload: Todo): Promise<Todo> {
    try {
      var id = Number(id);
      const todo = await this.prisma.todo.findUnique({
        where: { id },
      });
      if (!todo)
        throw new HttpException(
          `Todo with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      if (todo.status === 'COMPLETED')
        throw new HttpException(
          { error: 'Cannot update COMPLETED task!' },
          HttpStatus.BAD_REQUEST,
        );
      if (!Object.values(TaskStatus).includes(updatePayload.status as any))
        throw new HttpException(
          `Invalid status value: ${
            updatePayload.status
          }. Allowed values: ${Object.values(TaskStatus)}`,
          HttpStatus.BAD_REQUEST,
        );

      return this.prisma.todo.update({
        where: { id },
        data: { status: updatePayload.status },
      });
    } catch (error) {
      if (error.code === '121928') {
        throw new HttpException(
          `Todo with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw error;
      }
    }
  }

  /**
   *
   * @param id
   * @returns
   */
  async deleteTodo(id: number): Promise<void> {
    try {
      await this.prisma.todo.delete({
        where: { id: Number(id) },
      });
    } catch (error) {
      if (error.meta.cause === 'Record to delete does not exist.') {
        throw new HttpException(
          `Todo with ID ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw error;
      }
    }
  }
}
