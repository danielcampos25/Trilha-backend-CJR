import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskDTO } from './dto/TaskDTO';
import { PrismaService } from 'src/database/PrismaService';
import { CategoryDTO } from './dto/CategoryDTO';
import { generateError, responses } from 'src/ilb/helpers';
import { doesNotMatch } from 'assert';


@Injectable()
export class TodoService {
  
  constructor(private prisma: PrismaService) {}

  async create(data: TaskDTO) {
    if (!data.name) generateError('task', 400);
    
    const task = await this.prisma.task.findFirst({
      where:{name:data.name},})
    if (task) generateError('task',409);

    if (data?.categoryID) {
      const categoryExists: CategoryDTO = await this.prisma.category.findUnique(
        {
          where: {
            categoryID: data.categoryID,
          },
        },
      );

      if (!categoryExists) generateError('category', 404);
    }
    const newTask = await this.prisma.task.create({
      data,
      
      
    })
    
    console.log(responses.task[201].message, data)
    return {
      data: newTask,
      statusCode: 201,
    };
  
}

  async createCategory(data:CategoryDTO){
    if (!data.name) generateError('category', 400);
    const categoryExists = await this.prisma.category.findUnique({
      where: {
        name: data.name,
      },
    })
    if (categoryExists) generateError('category', 409);


    const category = await this.prisma.category.create({
      data,
    })
    console.log(responses.category[201].message, data);
    return {
    
      data: category,
      statusCode:201,
    }
  }

  async findAll() {
    return { 
      
    data: await this.prisma.task.findMany(),
    statusCode: 200
    }
  }

  async findallCategories(){
    return{ 
      data: await this.prisma.category.findMany(),
      statusCode: 200
    
    }
  }

  async update(id: string, data: TaskDTO) {  //Pode editar tanto a tarefa quanto a categoria
    const taskExists = await this.prisma.task.findUnique({
        where: {
            id,
        },
    });

    if (!taskExists) {
        generateError('task',400)
    }

    if (data?.categoryID) {
      const categoryExists = await this.prisma.category.findUnique({
        where: {
          categoryID: data.categoryID,
        },
      });

      if (!categoryExists) generateError('category', 404);
    }

    try {
        
        if (data.name !== undefined) {
           const updatedTask = await this.prisma.task.update({
                data: {
                    name: data.name,
                    categoryID:data.categoryID
                    
                },
                where: {
                    id,
                },
            });
            console.log(responses.task[200].message, data)
            return {
              data: updatedTask,
              statusCode:200
            }
        }
    } catch (error) {
        console.error('Error updating task:', error);
        throw new Error('Failed to update task');
    }
}

  async findOne(id: string) {   
    const task = this.prisma.task.findUnique({
      where: { id },
    });
    if (!task){generateError('task', 404)};
    
    console.log(responses.task[200].message)
    
    return task
      
    
  }
  

  async markAsDone(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
  
    if (!task){generateError('task', 404)};
  
    const updatedTask = await this.prisma.task.update({
      data: {
        done: true,
        
      },
      where: {
        id,
      },
    });

    console.log(responses.task[200].message)
    return{
      data: updatedTask,
      statusCode: 200

    }

  }

  async markAsPriority(id:string){
    const task = await this.prisma.task.findUnique({ where: { id } });
  
    if (!task){generateError('task', 404)};

    if (task.done == true){
      throw new Error('Esta tarefa ja foi feita!')
    }

  
    const updatedTask = await this.prisma.task.update({
      data: {
        priority: true,
        
      },
      where: {
        id,
      },
    });

    console.log(responses.task[200].message)
    return{
      data: updatedTask,
      statusCode:200
    }
    
  }

  async remove(id: string) {
    if (id.toLowerCase() === 'limpartudo') {
      await this.deleteAllTasks();
      console.log(responses.task[200].message)
      return { message: 'Todas as tarefas foram deletadas com sucesso.' };
    }
    if (id.toLowerCase() === 'limparfeitas') {
      await this.deleteDone();
      console.log(responses.task[200].message)
      return { message: 'Todas as tarefas feitas foram deletadas com sucesso.' };
    }
  
    const existingTask = await this.prisma.task.findUnique({ where: { id } });
  
    if (!existingTask){generateError('task', 404)};
  
    console.log(responses.task[200].message)
    return this.prisma.task.delete({ where: { id } });
  }

  async deleteCategory(name:string){
    const categoryExists = await this.prisma.category.findUnique({where: {name}});

    if (!categoryExists){
      throw new Error(`Category with ID ${name} not found`)
    }
    return this.prisma.category.delete({where: {name}})
  }
  
  async filterActive() {  //dando problema "Não retorna nada"
      const tasks = await this.prisma.task.findMany({
      where: {
        done: false,
      },
    });
    return tasks
  }

  async filterbyCategory(name:string) { 
    const category = await this.prisma.category.findUnique({
      
      where: {
       name : name,
      },
    });

    if (!category) {generateError('category', 404)};

    const activities = await this.prisma.task.findMany({
      where: { 
        categoryID : category.categoryID
      }
    })
    return activities
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

  async showPriorities() {
    const data = await this.prisma.task.findMany({
        where: { priority: true }
    });

    return { data };
}
  

}
