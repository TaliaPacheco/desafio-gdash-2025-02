import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async create(dto: CreateUserDto) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = new this.userModel({ ...dto, password: hashed });
    return user.save();
  }

  async findAll() {
    return this.userModel.find();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(id: string, dto: Partial<CreateUserDto>) {
    return this.userModel.findByIdAndUpdate(id, dto, { new: true });
  }

  async delete(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
