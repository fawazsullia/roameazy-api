import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreatePlaceRequest, GetDepartingPlacesRequest } from "src/models";
import { Place } from "src/schemas/places.schema";

@Injectable()
export class PlaceService {

    @InjectModel(Place.name)
    private placeModel: Model<Place>;

    async create(params: CreatePlaceRequest) {

        console.log(params);
        const existingPlace = await this.placeModel.findOne({ name: params.name });
        if(existingPlace) {
            throw new Error('Place already exists');
        }
        const newPlace = new Place();
        newPlace.name = params.name;
        if(params.description) {
            newPlace.description = params.description;
        }
        if(params.images) {
            newPlace.images = params.images;
        }
        newPlace.country = params.country;
        if(params.isDeparture) {
            newPlace.isDeparture = params.isDeparture;
        }
        if(params.isDestination) {
            newPlace.isDestination = params.isDestination;
        }
        if(params.type) {
            newPlace.type = params.type;
        }
        newPlace.createdAt = new Date();
        newPlace.updatedAt = new Date();
        await this.placeModel.create(newPlace);
    }

    async getDeparting(params: GetDepartingPlacesRequest) {
        const { limit, offset, searchTerm, country } = params;

        const query = {
            isDeparture: true
        };

        if(searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            query['name'] = regex;
        }

        if(country) {
            query['country'] = country;
        }

        const places = await this.placeModel.find(query).limit(limit).skip(offset);
        return places;
    }

    async getDestinations(params: GetDepartingPlacesRequest) {
        const { limit, offset, searchTerm, country } = params;

        const query = {
            isDestination: true
        };

        if(searchTerm) {
            const regex = new RegExp(searchTerm, 'i');
            query['name'] = regex;
        }

        if(country) {
            query['country'] = country;
        }

        const places = await this.placeModel.find(query).limit(limit).skip(offset);
        return places;
    }
}