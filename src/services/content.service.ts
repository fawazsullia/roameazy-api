import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateContentRequest, GetContentRequest, UpdateContentRequest } from "src/models";
import { Content } from "src/schemas/content.schema";

@Injectable()
export class ContentService {

    @InjectModel(Content.name)
    private contentModel: Model<Content>;

    public async create(body: CreateContentRequest) {
        const { key, group, data } = body;
        const content = new Content();
        content.key = key;
        content.group = group;
        content.data = data;
        content.createdAt = new Date();
        content.updatedAt = new Date();
        await this.contentModel.create(content);
    }

    // here, make provisions to only update single keys later
    public async update(body: UpdateContentRequest) {
        const { key, group, data } = body;
        const content = await this.contentModel.findOne({ key, group });
        if (!content) {
            throw new Error('Content not found');
        }
        content.data = data;
        content.updatedAt = new Date();
        await content.save();
    }

    public async get(params: GetContentRequest) {
        const { key, group } = params;
        const response = await this.contentModel.findOne({ key, group });
        if(!response) {
            throw new Error('Content not found');
        }
        return response;
    }
}