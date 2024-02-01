import { Injectable } from '@nestjs/common';
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

  async update(id: string, data: TaskDTO){
    const taskExists = await this.prisma.task.findUnique({
      where: {
        id,
      }
    })
    if (!taskExists){
      throw new Error ('Essa tarefa não existe');
    }
    await this.prisma.task.update({
      data,
      where:{id,}
    })
  }

  async findOne(id: string) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
  
  async filterByDone(done: boolean) {
    return this.prisma.task.findMany({
      where: {
        done,
      },
    });
  }

  async filterbyCategory(categoryID: number) {
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

  

}
