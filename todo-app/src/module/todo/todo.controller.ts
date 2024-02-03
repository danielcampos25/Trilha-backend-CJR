import { Controller, Get, Post, Body, Patch, Param, Delete,Put } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TaskDTO} from './dto/TaskDTO';

@Controller('tarefa')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post() // Obs: ao criar uma tarefa deve-se passar a id de uma categoria ja existente
  async create(@Body() data: TaskDTO) {
    return this.todoService.create(data);
  }

  @Get()  //Sem problemas 
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

  @Delete(':done')
  async deleteDone(){
    return this.todoService.deleteDone();
  }

  @Delete('limpartudo')
  async deleteAllTasks() {
    await this.todoService.deleteAllTasks();
    return { message: 'Todas as tarefas foram deletadas com sucesso.' };
  }

  @Get('feito')
  async filterByDone(@Param('done') done: boolean) {
    const tasks =  this.todoService.filterByDone(done);
    return tasks
  }
  @Get(':category')
  async filterbyCategory(@Param('category') category:number){
    return this.todoService.filterbyCategory(category)
  }
}
