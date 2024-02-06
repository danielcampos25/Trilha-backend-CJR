import { Controller, Get, Post, Body, Patch, Param, Delete,Put, Query } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TaskDTO} from './dto/TaskDTO';
import { CategoryDTO } from './dto/CategoryDTO';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { responses } from 'src/ilb/helpers';


@ApiTags('API routes')
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}



  @ApiOperation({ summary: 'Creates a new task' })
  @ApiResponse({ status: 201, description: responses.task[201].message })
  @ApiResponse({ status: 400, description: responses.task[400].error })
  @ApiResponse({ status: 409, description: responses.task[409].error })
  @Post() // Obs: ao criar uma tarefa deve-se passar a id de uma categoria ja existente ?? Como corrigir isso (?)
  async create(@Body() data: TaskDTO) {
    return this.todoService.create(data);
  }


  @ApiOperation({ summary: 'Creates a new category' })
  @ApiResponse({ status: 201, description: responses.category[201].message })
  @ApiResponse({ status: 400, description: responses.category[400].error })
  @ApiResponse({ status: 409, description: responses.category[409].error })
  @Post('novacategoria')
  async createCategory(@Body() data:CategoryDTO){
    return this.todoService.createCategory(data)
  }



  @ApiOperation({ summary: 'Shows all tasks' })
  @ApiResponse({ status: 200, description: responses.task[200].message })
  @Get('tarefas')   
  async findAll(){
    return this.todoService.findAll();
  }
  @Get('categorias')  //sem problemas
  async findallCategories(){
    return this.todoService.findallCategories();
  }



  @ApiOperation({ summary: 'Updates a task specified by id' })
  @ApiResponse({ status: 200, description: responses.task[200].message })
  @ApiResponse({ status: 400, description: responses.task[400].error })
  @ApiResponse({
    status: 404,
    description:
      responses.task[404].error + ' or ' + responses.category[404].error,
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() data: TaskDTO) {
  return this.todoService.update(id, data);
  }



  @ApiOperation({ summary: 'Updates the "done" status of the task specified by id' })
  @ApiResponse({ status: 200, description: responses.task[200].message })
  @ApiResponse({ status: 400, description: responses.task[400].error })
  @ApiResponse({
    status: 404,
    description:
      responses.task[404].error + ' or ' + responses.category[404].error,
  })
  @Put('foifeito/:id')  //Marca como feita
  async markAsDone(@Param('id') id: string){
    return this.todoService.markAsDone(id);
  }


  @ApiOperation({ summary: 'Updates the "priority" status of the task specified by id' })
  @ApiResponse({ status: 200, description: responses.task[200].message })
  @ApiResponse({ status: 400, description: responses.task[400].error })
  @ApiResponse({
    status: 404,
    description:
      responses.task[404].error + ' or ' + responses.category[404].error,
  })
  @Put('marcarprioridade/:id') //Obs: não é possivel marcar como prioritária uma tarefa ja feita
  async markAsPriority(@Param('id') id:string){
    return this.todoService.markAsPriority(id);
  }
  


  @ApiOperation({ summary: 'Shows a task specified by id' })
  @ApiResponse({ status: 200, description: responses.task[200].message })
  @ApiResponse({ status: 400, description: responses.task[400].error })
  @ApiResponse({ status: 404, description: responses.task[404].error })
  @Get(':id') // OK
  async findOne(@Param('id') id: string) {
    return this.todoService.findOne(id);
  }



  @ApiOperation({ summary: 'Deletes a task specified by id or all tasks if passed "limpartudo"' })
  @ApiResponse({ status: 200, description: responses.task[200].message })
  @ApiResponse({ status: 400, description: responses.task[400].error })
  @ApiResponse({ status: 404, description: responses.task[404].error })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.todoService.remove(id);
  }
  


  @ApiOperation({ summary: 'Deletes a category specified by its name' })
  @ApiResponse({ status: 200, description: responses.category[200].message })
  @ApiResponse({ status: 400, description: responses.category[400].error })
  @ApiResponse({ status: 404, description: responses.category[404].error })
  @Delete('excluircategoria/:name')
  async deleteCategory(@Param('name') name:string){
    return this.todoService.deleteCategory(name)
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
