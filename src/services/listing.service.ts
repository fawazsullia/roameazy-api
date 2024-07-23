import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model } from "mongoose";
import { CreateListingRequest, GetListingRequest } from "src/models";
import { Listing } from "src/schemas/listing.schema";

@Injectable()
export class ListingService {

    @InjectModel(Listing.name)
    private listingModel: Model<Listing>;

    async create(params: CreateListingRequest) {
        const { title, from, to, includedPlaces, numberOfNights, mealsIncluded, travelInsurance, visaFee, hotels, airPortTransfers, itinerary, tags, startDate, endDate } = params;

        // create the listing here
        const existingListing = await this.listingModel.findOne({ title });
        if (existingListing) {
            throw new Error('Listing already exists');
        }
        const newListing = new Listing();
        newListing.title = title;
        newListing.from = from;
        newListing.to = to;
        newListing.includedPlaces = includedPlaces;
        newListing.numberOfNights = numberOfNights;
        newListing.mealsIncluded = mealsIncluded;
        newListing.travelInsurance = travelInsurance;
        newListing.startDate = new Date(startDate);
        newListing.endDate = new Date(endDate);
        if (visaFee) {
            newListing.visaFee = visaFee;
        }
        if (hotels) {
            newListing.hotels = hotels;
        }
        if (airPortTransfers) {
            newListing.airPortTransfers = airPortTransfers;
        }
        newListing.itinerary = itinerary;
        if (tags) {
            newListing.tags = tags;
        }
        newListing.createdAt = new Date();
        newListing.updatedAt = new Date();
        await this.listingModel.create(newListing);
    }

    async get(params: GetListingRequest) {

        const { from, to, listingType, limit, offset, startDate, endDate, isFeatured } = params;

        const query: FilterQuery<Listing> = {
            // start date should be between the start and end date

            startDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            },
            // end date should be between the start and end date
            endDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        };

        if (from) {
            const regex = new RegExp(from, 'i');
            query['from'] = regex;
        }
        if (to) {
            const regex = new RegExp(to, 'i');
            query['to'] = regex;
        }
        query.isActive = true;
        if(listingType === 'inactive'){
            query.isActive = false;
        }
        if(listingType === 'all'){
            delete query.isActive;
        }
        if (isFeatured) {
            query.isFeatured = isFeatured;
        }

        const listings = await this.listingModel.find(query).limit(limit).skip(offset);
        return this.calculatePricing(listings, new Date(startDate), new Date(endDate));

    }

    public calculatePricing(listings: Listing[], startDate: Date, endDate: Date) {
        listings.forEach(listing => { 
            const daysForStartFromToday = startDate.getTime() - new Date().getTime();
            const days = Math.floor(daysForStartFromToday / (1000 * 60 * 60 * 24));
            let price = listing.basePrice;
            let variablePriceTotal = 0;
            listing.variablePrices.forEach(variablePrice => {
                if (days >= variablePrice.window) {
                    variablePriceTotal = variablePrice.price;
                }
            });
            price += variablePriceTotal;
            listing.price = price;
        });
    }
}