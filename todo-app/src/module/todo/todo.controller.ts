import { Controller, Get, Post, Body, Patch, Param, Delete,Put } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TaskDTO} from './dto/TaskDTO';

@Controller('tarefa')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  async create(@Body() data: TaskDTO) {
    return this.todoService.create(data);
  }

  @Get()
  async findAll(){
    return this.todoService.findAll();
  }

  @Put(':id')      //dando problema aqui
  async update(@Param('id') id: string, data: TaskDTO){
    return this.todoService.update(id,data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }

  @Get(':done')
  async filterByDone(@Param('done') done: boolean) {
    return this.todoService.filterByDone(done);
  }
}
