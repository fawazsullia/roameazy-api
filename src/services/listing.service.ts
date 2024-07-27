import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery, Model, PipelineStage } from "mongoose";
import { CreateListingRequest, GetListingRequest } from "src/models";
import { Listing } from "src/schemas/listing.schema";

@Injectable()
export class ListingService {

  @InjectModel(Listing.name)
  private listingModel: Model<Listing>;

  async create(params: CreateListingRequest) {
    const { title, from, to, includedPlaces, numberOfNights, mealsIncluded, travelInsurance, visaFee, hotels, airPortTransfers, itinerary, tags, startDate, endDate, basePrice, variablePrices } = params;

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
    newListing.basePrice = basePrice;
    if (variablePrices) {
      newListing.variablePrices = variablePrices;
    }
    await this.listingModel.create(newListing);
  }

  async get(params: GetListingRequest) {

    const { from, to, listingType, limit, offset, startDate, endDate, isFeatured, budgetMin, budgetMax, isFlightIncluded, maxNights, minNights, sortKey, sortOrder } = params;

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
    if (listingType === 'inactive') {
      query.isActive = false;
    }
    if (listingType === 'all') {
      delete query.isActive;
    }
    if (isFeatured) {
      query.isFeatured = isFeatured;
    }

    if (budgetMin) {
      query.basePrice = {
        $gte: budgetMin
      };
    }

    if (budgetMax) {
      query.basePrice = {
        $lte: budgetMax
      };
    }

    if (isFlightIncluded !== undefined) {
      query.isFlightIncluded = isFlightIncluded;
    }

    if (maxNights) {
      query.numberOfNights = {
        $lte: maxNights
      };
    }

    if (minNights) {
      query.numberOfNights = {
        $gte: minNights
      };
    }

    const { listings, total } = await this.getFilteredAndSortedListings(
      limit,
      offset,
      new Date(startDate),
      new Date(endDate),
      from,
      to,
      listingType,
      isFeatured,
      budgetMin,
      budgetMax,
      isFlightIncluded,
      maxNights,
      minNights,
      sortKey,
      sortOrder
    )
    return {
      listings,
      total
    }

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

  async getFilteredAndSortedListings(
    limit: number,
    offset: number,
    startDate: Date,
    endDate: Date,
    from?: string,
    to?: string,
    listingType?: 'active' | 'inactive' | 'all',
    isFeatured?: boolean,
    budgetMin?: number,
    budgetMax?: number,
    isFlightIncluded?: boolean,
    maxNights?: number,
    minNights?: number,
    sortKey?: string,
    sortOrder?: number
  ) {
    const matchStage: PipelineStage.Match['$match'] = {
      startDate: { $gte: startDate, $lte: endDate },
      endDate: { $gte: startDate, $lte: endDate },
    };

    if (from) matchStage.from = { $regex: from, $options: 'i' };
    if (to) matchStage.to = { $regex: to, $options: 'i' };

    if (listingType === 'active') matchStage.isActive = true;
    else if (listingType === 'inactive') matchStage.isActive = false;

    if (isFeatured !== undefined) matchStage.isFeatured = isFeatured;
    if (isFlightIncluded !== undefined) matchStage.isFlightIncluded = isFlightIncluded;

    if (budgetMin !== undefined || budgetMax !== undefined) {
      matchStage.basePrice = {};
      if (budgetMin !== undefined) matchStage.basePrice.$gte = budgetMin;
      if (budgetMax !== undefined) matchStage.basePrice.$lte = budgetMax;
    }

    if (maxNights !== undefined || minNights !== undefined) {
      matchStage.numberOfNights = {};
      if (maxNights !== undefined) matchStage.numberOfNights.$lte = maxNights;
      if (minNights !== undefined) matchStage.numberOfNights.$gte = minNights;
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
    ];

    if (sortKey === 'price') {
      pipeline.push(
        {
          $addFields: {
            daysDifference: {
              $dateDiff: {
                startDate: "$startDate",
                endDate: startDate,
                unit: "day"
              }
            }
          }
        },
        {
          $addFields: {
            applicableVariablePrices: {
              $filter: {
                input: "$variablePrices",
                as: "vp",
                cond: { $gte: ["$daysDifference", "$$vp.window"] }
              }
            }
          }
        },
        {
          $addFields: {
            totalVariablePrice: {
              $sum: "$applicableVariablePrices.price"
            }
          }
        },
        {
          $addFields: {
            totalPrice: { $add: ["$basePrice", "$totalVariablePrice"] }
          }
        },
        {
          $sort: { totalPrice: sortOrder || 1 } as any
        }
      );
    } else if (sortKey) {
      pipeline.push({
        $sort: { [sortKey]: sortOrder || 1 } as any
      });
    }

    // Add $skip stage if offset is provided
    if (offset !== undefined) {
      pipeline.push({ $skip: offset });
    }

    // Add $limit stage if limit is provided
    if (limit !== undefined && limit > 0) {
      pipeline.push({ $limit: limit });
    }

    // Execute the aggregation pipeline
    const results = await this.listingModel.aggregate(pipeline);

    // Get total count (without pagination)
    const totalCount = await this.listingModel.aggregate([
      { $match: matchStage },
      { $count: 'total' }
    ]);

    return {
      listings: results,
      total: totalCount[0]?.total || 0
    };
  }
}