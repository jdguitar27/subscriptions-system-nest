import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.find().select('-__v').exec();
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-__v').exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.name = updateUserDto.name ?? user.name;
    user.lastName = updateUserDto.lastName ?? user.lastName;
    user.email = updateUserDto.email ?? user.email;

    return user.save();
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
