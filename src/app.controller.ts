import { Controller, Get , Post,Param,ParseIntPipe,Body} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('users')
  createUser() {
    return this.appService.createUser();
  }
  @Get('users')
  getUsers(){
    return this.appService.getUsers();
  }
  @Get('users/:id')
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.appService.getUserById(id);
}
@Get('users/age/:age')
getFirstUserByAge(@Param('age', ParseIntPipe) age: number) {
  return this.appService.getFirstUserByAge(age);
}
@Post('posts')
createPost(
  @Body() body: { userId: number; title: string },
) {
  return this.appService.createPost(body.userId, body.title);
}
}