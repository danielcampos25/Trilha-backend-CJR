import { Controller, Get, Post, Body, Patch, Param, Delete,Put, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TaskDTO} from './dto/TaskDTO';

@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post() // Obs: ao criar uma tarefa deve-se passar a id de uma categoria ja existente ??
  async create(@Body() data: TaskDTO) {
    return this.todoService.create(data);
  }

  @Get('tarefas')  //Sem problemas 
  async findAll(){
    return this.todoService.findAll();
  }
  @Get('categorias')  //sem problemas
  async findallCategories(){
    return this.todoService.findallCategories();
  }

  @Put(':id')
async update(@Param('id') id: string, @Body() data: TaskDTO) {
  return this.todoService.update(id, data);
}
  

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }

  @Delete()  //Delete the done false or true tasks
async deleteDone(@Query('done') done: boolean) {
  return this.todoService.deleteDone();
}

 

  @Get('feito')
async filterByDone(@Query('done') done: boolean) {
  const tasks = this.todoService.filterByDone(done);
  return tasks;
}
  

  @Get('filtrar/:category')
  async filterbyCategory(@Param('category') category:number){
    return this.todoService.filterbyCategory(category)
  }
}
