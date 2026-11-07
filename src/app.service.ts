import { Injectable ,NotFoundException} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { title } from 'process';

@Injectable()
export class AppService {
  constructor( private prisma:PrismaService){}
  getHello(): string {
    return 'Hello World!';
  }
  async createUser(){
    const newUser = await this.prisma.user.create({
      data:{
        name:'ahmad',
        email:'ahamd@example.com',
        age:23
      },
      select:{
        id:true,
        name:true,
        createdAt:true
      }
    })
    return newUser;
}
async getUsers(){
  const users=await this.prisma.user.findMany();
  return users;
}
async getUserById(id: number) {
  const user = await this.prisma.user.findUnique({
    where: { id }
  });
  if(!user){
    throw new NotFoundException(`User with ID ${id} not found`);
  }
  return user;

}
async getFirstUserByAge(age: number) {
  const user = await this.prisma.user.findFirst({
    where: { age }
  });
return user;
}
async getUsersByAgeRange(minAge: number, maxAge?: number) {
  const users = await this.prisma.user.findMany({
    where: {
      age: maxAge !== undefined
        ? { gte: minAge, lte: maxAge }
        : { gte: minAge },
    },
  });

  return users;
}
async getUsersBySpecificAges(age: number[]) {
  const users = await this.prisma.user.findMany({
    where: {
      age: {
        in: age,
      },
    },
  });

  return users;
}
async getUsersExceptAge(age:number){
  const users =await this.prisma.user.findMany({
    where:{
      NOT:{
        age
      }
    }
  })
return users;
}
async getUsersSortedByAge(){
  const users = await this.prisma.user.findMany({
    orderBy:{
      age:'asc',
    }
  });
  return users;
}
async getUserscreatedAt(){
  const users = await this.prisma.user.findMany({
    orderBy:{
      createdAt:'desc',
    }
  });
  return users;
}
async getUsersPaginated(page:number, limit:number){
  const users=await this.prisma.user.findMany({
    skip : (page - 1) * limit,
    take: limit
  });
  return users;
}
async createPost(userId: number, title: string) {
  const newPost = await this.prisma.post.create({
    data: {
      title,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });

  return newPost;
}
async getUserWithPosts(userId: number){
  const userWithPosts = await this.prisma.user.findUnique({
    where: { id: userId },
    include:{
      posts:true
    }
    
  });
  return userWithPosts;
}
async getPostsWithUsers() {
  const postsWithUsers = await this.prisma.post.findMany({
    include: {
      user: {
        select: {
          name: true,
          age: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  return postsWithUsers;
}
async getUserWithPostsTitles(userId: number) {
  const userPostTitle = await this.prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      email: true,
      posts: {
        select: {
          title: true,
        },
      },
    },
  });

  return userPostTitle;
}
async updateUserName(id: number, name: string){
  const updatedUser = await this.prisma.user.update({
    where: { id },
    data: { name },
});
return updatedUser;
}
async deactivateOldUsers() {
  const deactiveUser = await this.prisma.user.updateMany({
    where: {
      age: {
        gt: 60,
      },
    },
    data: {
      active: false,
    },
  });

  return deactiveUser;
}
async deletePost(id: number){
  const deletPostBYnumber=await this.prisma.post.delete({
    where:{
      id
    }
  });
  return deletPostBYnumber;
}
async deletePostsByUser(userId: number) {
  const deletedPosts = await this.prisma.post.deleteMany({
    where: {
      userId,
    },
  });
  return deletedPosts;
}
async upsertUser(email:string,name:string,age:number){
  const upsertUsre=await this.prisma.user.upsert({
   where:{
    email,
   },
   update:{
    name,
    age
   },
   create:{
    email,
    name,
    age
   },
  });
  return upsertUsre;
}
async connectPostToUser(postId: number, userId: number) {
  const updatedPost = await this.prisma.post.update({
    where: { id: postId },
    data: {
      user: {
        connect: { id: userId },
      },
    },
  });
  return updatedPost;
}
async createStudent(name: string) {
  const creatStudent=await this.prisma.student.create({
    data: {
      name,
    },
  });
  return creatStudent;
}
async createCourse(title: string) {
  const creatCourse=await this.prisma.course.create({
    data: {
      title,
    },
  });
  return creatCourse;
}
async enrollStudent(studentId: number, courseId: number){
  const enrollStudent=await this.prisma.student.update({
    where: { id: studentId },
    data: {
      courses: {
        connect: { id: courseId },
      },
    }
  });
  return enrollStudent;
}
async getStudentCourses(studentId: number){
  const getStudent=await this.prisma.student.findUnique({
    where:{
        id: studentId,
    },
    include:{
      courses:true
    }
  });
  return getStudent;
}
async getCourseStudents(courseId: number){
  const getCourse=await this.prisma.course.findUnique({
    where:{
      id:courseId
    },
    include:{
      students:true
    }
  });
  return getCourse;
}
async createCourseWithStudents(
  title: string,
  studentNames: string[],
) {
  const newCourse = await this.prisma.course.create({
    data: {
      title,
      students: {
        create: studentNames.map((name) => ({
          name,
        })),
      },
    },
    include: {
      students: true,
    },
  });
  return newCourse;
}
async createUserAndCourse(){
  const newUser = await this.prisma.$transaction([
    this.prisma.user.create({
      data:{
        name:"Ahamd",
        email:"ahmad_transaction@test.com"
      },
    }),
    this.prisma.course.create({
      data:{
        title:"DataBase",
      },
    })
  ]);
  return newUser;
}
async createStudentWithCourse(
  studentName: string,
  courseTitle: string,
) {
  const result = await this.prisma.$transaction(async (tx) => {
    const student = await tx.student.create({
      data: {
        name: studentName,
      },
    });

    const course = await tx.course.create({
      data: {
        title: courseTitle,
        students: {
          connect: {
            id: student.id,
          },
        },
      },
    });

    return { student, course };
  });

  return result;
}
async countActiveUsers(){
  const activeUsersCount = await this.prisma.user.count({
    where: {
      active: true,
    },
  });
  return activeUsersCount;
}
async getUsersAgeStats(){
  const ageStats = await this.prisma.user.aggregate({
    _avg: {
      age: true,
},
  _sum:{
    age:true
  }
});
  return ageStats;
}
async countUsersByAge() {
  const countUser = await this.prisma.user.groupBy({
    by: ['age'],
    _count: {
      age: true,
    },
    having: {
      age: {
        _count: {
          gt: 2,
        },
      },
    },
  });

  return countUser;
}
}