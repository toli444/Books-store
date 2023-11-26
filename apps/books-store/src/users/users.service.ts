import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { UserRoles } from './types/user.type';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel({
      ...createUserDto,
      role: UserRoles.CUSTOMER
    });

    return createdUser.save();
  }

  async findAll() {
    return this.userModel.find().exec();
  }

  async findById(id: Types.ObjectId) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`User with provided id not found.`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailWithPassword(email: string) {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async update(id: Types.ObjectId, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }
}
