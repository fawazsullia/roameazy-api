import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { OnboardUserRequest } from "src/models";
import { User } from "src/schemas/user.schema";
const bcrypt = require('bcrypt');
import { Company } from "src/schemas/company.schema";
import { CompanyDetail } from "src/schemas/company-detail.schema";
import { InjectConnection } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import { UploadUtils } from "src/utils/upload.util";
import { CreateSuperAdminRequest } from "src/models/user/create-super-admin.request.model";
import { SuperAdminUser } from "src/schemas/super-admin-user.schema";

@Injectable()
export class UserService {

  @InjectModel(User.name)
  private userModel: Model<User>;

  @InjectModel(Company.name)
  private companyModel: Model<Company>;

  @InjectModel(CompanyDetail.name)
  private companyDetailModel: Model<CompanyDetail>;

  @InjectConnection()
  private readonly connection: mongoose.Connection

  @InjectModel(SuperAdminUser.name)
  private readonly superAdminUserModel: Model<SuperAdminUser>;



  // this is to create an admin user
  async create(params: OnboardUserRequest, license: Express.Multer.File) {
    const { name, email, companyName, companyEmail, companyAddress, companyPhone, companyDescription } = params;
    console.log('params', license);
    const user = await this.userModel.findOne({ email });

    const existingCompany = await this.companyModel.findOne({ name: companyEmail });

    if (existingCompany) {
      throw new Error('Company already exists');
    }

    if (user) {
      throw new Error('User already exists');
    }

    var password = crypto.randomBytes(10).toString('hex');

    const transactionSession = await this.connection.startSession();
    try {
      transactionSession.startTransaction();

      const uploadedUrl = await UploadUtils.uploadFileToS3(license, 'license', 'license');

      const hashedPassword = await bcrypt.hash(password, 10);
      const newuser = new User();
      const company = new Company();
      company.name = companyName;
      company.createdAt = new Date();
      company.updatedAt = new Date();
      company.isVerified = true;
      company.plan = 'free';
      const createdCompany = await this.companyModel.create(company);

      const companyDetail = new CompanyDetail();
      companyDetail.address = companyAddress;
      companyDetail.email = companyEmail;
      companyDetail.phone = companyPhone;
      companyDetail.createdAt = new Date();
      companyDetail.updatedAt = new Date();
      companyDetail.companyId = createdCompany._id;
      companyDetail.tradeLicense = uploadedUrl;
      companyDetail.description = companyDescription;
      await this.companyDetailModel.create(companyDetail);

      newuser.companyId = createdCompany._id;
      newuser.name = name;
      newuser.email = email;
      newuser.password = hashedPassword;
      newuser.role = 'admin';
      newuser.createdAt = new Date();
      newuser.updatedAt = new Date();
      await this.userModel.create(newuser);
    } catch (error) {
      transactionSession.abortTransaction();
      throw error;
    } finally {
      transactionSession.endSession();
    }
  }

  async createSuperAdmin(params: CreateSuperAdminRequest) {
    const { username, email, password, confirmPassword, role } = params;
    const existing = await this.superAdminUserModel.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      throw new Error('User already exists');
    }
    if (password !== confirmPassword) {
      throw new Error('Password does not match');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const superAdminUser = new SuperAdminUser();
    superAdminUser.username = username;
    superAdminUser.email = email;
    superAdminUser.password = hashedPassword;
    superAdminUser.role = role;
    superAdminUser.createdAt = new Date();
    superAdminUser.updatedAt = new Date();
    await this.superAdminUserModel.create(superAdminUser);
  }
}