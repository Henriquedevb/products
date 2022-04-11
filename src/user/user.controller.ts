import { Controller, Get, Patch } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  getAllUsers() {
    return this.usersService.getAll();
  }

  @Patch('/enable/:id')
  enableUser(id: string) {
    return this.usersService.enableUser(id);
  }
}
