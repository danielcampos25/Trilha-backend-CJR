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

  async findAll() {
    return this.prisma.task.findMany()
  }

  async update(id: string, data: TaskDTO) {  //Ok
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

  async remove(id: string) {
    // Check if the task exists
    const existingTask = await this.prisma.task.findUnique({ where: { id } });
  
    if (!existingTask) {
      throw new Error(`Task with ID ${id} not found`);
    }
  
    // If the task exists, proceed with deletion
    return this.prisma.task.delete({ where: { id } });
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
