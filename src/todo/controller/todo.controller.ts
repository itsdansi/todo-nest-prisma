import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TodoService } from '../service/todo.service';
import { Todo } from '@prisma/client';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { CreateTaskDto } from '../dto/create-todo.dto';
import { UpdateTaskDto } from '../dto/update-todo.dto';

@ApiBearerAuth()
@ApiTags('Tasks')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
  @Get()
  @ApiOperation({ summary: 'Fetch all TODO items' })
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  //   @ApiNotFoundResponse({ description: 'Resource not found' })
  async getAllTodo(): Promise<Todo[]> {
    return this.todoService.getAllTodo();
  }

  @Post()
  //   @ApiOkResponse({ description: 'The resource was returned successfully' })
  //   @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  //   @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiOperation({ summary: 'Create a TODO item' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async createTodo(@Body() createPayload: Todo): Promise<Todo> {
    return this.todoService.createTodo(createPayload);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Fetch a TODO item' })
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getTodo(@Param('id') id: number): Promise<Todo | null> {
    return this.todoService.getTodo(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a TODO item' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async Update(
    @Param('id') id: number,
    @Body() updatePayload: Todo,
  ): Promise<Todo> {
    return this.todoService.updateTodo(id, updatePayload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a TODO item' })
  @ApiOkResponse({ description: 'The resource was returned successfully' })
  @ApiForbiddenResponse({ description: 'Unauthorized Request' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async Delete(@Param('id') id: number): Promise<void> {
    return this.todoService.deleteTodo(id);
  }
}
