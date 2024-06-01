import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateUserRequest } from "src/models";
import { User } from "src/schemas/user.schema";
const bcrypt = require('bcrypt');
import { Company } from "src/schemas/company.schema";

@Injectable()
export class UserService {

  @InjectModel(User.name)
  private userModel: Model<User>;

  @InjectModel(Company.name)
  private companyModel: Model<Company>;


  // this is to create an admin user
  async create(params: CreateUserRequest) {
    const { name, email, password, confirmPassword, companyName } = params;

    if (password !== confirmPassword) {
      throw new Error('Password and confirm password do not match');
    }

    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newuser = new User();
    const company = new Company();
    company.name = companyName;
    company.createdAt = new Date();
    company.updatedAt = new Date();
    const createdCompany = await this.companyModel.create(company);
    newuser.companyId = createdCompany._id;
    newuser.name = name;
    newuser.email = email;
    newuser.password = hashedPassword;
    newuser.role = 'admin';
    newuser.createdAt = new Date();
    newuser.updatedAt = new Date();
    await this.userModel.create(newuser);
  }
}