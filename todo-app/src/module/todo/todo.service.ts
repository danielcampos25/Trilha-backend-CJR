import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDTO } from './dto/TaskDTO';
import { PrismaService } from 'src/database/PrismaService';
import { CategoryDTO } from './dto/CategoryDTO';

@Injectable()
export class TodoService {
  
  constructor(private prisma: PrismaService) {}

  async create(data: TaskDTO) {
    const task = await this.prisma.task.create({
      data,
      
      
    })
    return task
  }

  async createCategory(data:CategoryDTO){
    const category = await this.prisma.category.create({
      data,
    })
    return category
  }

  async findAll() {
    return this.prisma.task.findMany()
  }

  async findallCategories(){
    return this.prisma.category.findMany()
  }

  async update(id: string, data: TaskDTO) {  //Pode editar tanto a tarefa quanto a categoria
    const taskExists = await this.prisma.task.findUnique({
        where: {
            id,
        },
    });

    if (!taskExists) {
        throw new Error('Essa tarefa não existe');
    }

    try {
        
        if (data.name !== undefined) {
            await this.prisma.task.update({
                data: {
                    name: data.name,
                    categoryID:data.categoryID
                    
                },
                where: {
                    id,
                },
            });
        }
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error('Failed to update task');
    }
}

  async findOne(id: string) {   //OK
    const task = this.prisma.task.findUnique({
      where: { id },
    });
    if (!task){
      throw new NotFoundException('Está tarefa não existe')
    }
    return task
  }

  async markAsDone(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
  
    if (!task) {
      throw new NotFoundException('Esta tarefa não existe');
    }
  
    await this.prisma.task.update({
      data: {
        done: true,
        
      },
      where: {
        id,
      },
    });
  }

  async markAsPriority(id:string){
    const task = await this.prisma.task.findUnique({ where: { id } });
  
    if (!task) {
      throw new NotFoundException('Esta tarefa não existe');
    }

    if (task.done == true){
      throw new Error('Esta tarefa ja foi feita!')
    }

  
    await this.prisma.task.update({
      data: {
        priority: true,
        
      },
      where: {
        id,
      },
    });
  }

  async remove(id: string) {
    if (id.toLowerCase() === 'limpartudo') {
      await this.deleteAllTasks();
      return { message: 'Todas as tarefas foram deletadas com sucesso.' };
    }
  
    const existingTask = await this.prisma.task.findUnique({ where: { id } });
  
    if (!existingTask) {
      throw new Error(`Task with ID ${id} not found`);
    }
  
    return this.prisma.task.delete({ where: { id } });
  }

  async deleteCategory(name:string){
    const categoryExists = await this.prisma.category.findUnique({where: {name}});

    if (!categoryExists){
      throw new Error(`Category with ID ${name} not found`)
    }
    return this.prisma.category.delete({where: {name}})
  }
  
  async filterByDone(done: boolean) {  //dando problema "Não retorna nada"
    return this.prisma.task.findMany({
      where: {
        done:done,
      },
    });
  }

  async filterbyCategory(categoryID: number) {  //Tbm não retorna nada
    return this.prisma.task.findMany({
      
      where: {
        categoryID: categoryID,
      },
    });
  }

  async updateCategory(id: string, categoryID: number) {
    const task = await this.prisma.task.findUnique({
      where: {
        id,
      },
    });

    if (!task) {
      throw new Error('Tarefa não encontrada');
    }

    return this.prisma.task.update({
      where: {
        id,
      },
      data: {
        categoryID: categoryID,
      },
    });
  }

  async deleteDone(){
    return this.prisma.task.deleteMany({
      where: {done:true}
    });
  }
  async deleteAllTasks() {
    try {
      const result = await this.prisma.task.deleteMany();
      return { message: `Successfully deleted ${result.count} tasks.` };
    } catch (error) {
      console.error('Error deleting tasks:', error);
      throw new Error('Failed to delete tasks.');
    }
  }
  

}
