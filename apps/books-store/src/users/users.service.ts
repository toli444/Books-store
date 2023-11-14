import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User, UserRoles } from './types/user.type';

let id = 3;

@Injectable()
export class UsersService {
  private readonly users: Array<User> = [
    {
      id: 1,
      email: 'john@email.com',
      password: 'changeme123',
      role: UserRoles.CUSTOMER
    },
    {
      id: 2,
      email: 'maria@email.com',
      password: 'guess123',
      role: UserRoles.CUSTOMER
    }
  ];

  async findById(id: number) {
    return this.users.find((user) => user.id === id);
  }

  async findByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser = {
      id: id++,
      role: UserRoles.CUSTOMER,
      ...createUserDto
    };

    this.users.push(createdUser);

    return createdUser;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateUserDto
    };

    return this.users[userIndex];
  }
}
