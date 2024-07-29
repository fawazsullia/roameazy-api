import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { parsePhoneNumber } from "awesome-phonenumber";
import { FilterQuery, Model, PipelineStage } from "mongoose";
import { CreateListingRequest, GetListingRequest, SubmitEnquiryRequest } from "src/models";
import { Customer } from "src/schemas/customer.schema";
import { Enquiry, EnquirySchema } from "src/schemas/enquiry.schema";
import { Listing } from "src/schemas/listing.schema";

import { v4 as uuidV4 } from "uuid"

@Injectable()
export class ListingService {

  @InjectModel(Listing.name)
  private listingModel: Model<Listing>;

  @InjectModel(Enquiry.name)
  private enquiryModel: Model<Enquiry>;

  @InjectModel(Customer.name)
  private customerModel: Model<Customer>;

  async create(params: CreateListingRequest) {
    const { title, from, to, includedPlaces, numberOfNights, mealsIncluded, travelInsurance, visa, hotels, airPortTransfers, itinerary, tags, startDate, endDate, basePrice, variablePrices, airTickets, tourGuide} = params;

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
    newListing.listingId = uuidV4();
    if (visa) {
      newListing.visa = visa;
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
    if(airTickets){
      newListing.airTickets = airTickets;
    }
    if(tourGuide){
      newListing.tourGuide = tourGuide;
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

  public async getListingById (listingId) {
    return this.listingModel.findOne({
      listingId
    })
  }

  public async submitEnquiry (body: SubmitEnquiryRequest) {
    const { listingId, companyId, source, phoneNumber } = body;
    const pn = parsePhoneNumber(phoneNumber);
    if (!pn.valid) {
      throw new Error('Invalid phone number');
    }
    const existingCustomer = await this.customerModel.findOne({ phoneNumber });
    let customerId;
    if (existingCustomer) {
      customerId = existingCustomer._id;
    } else {
      const customer = new Customer();
      customer.phoneNumber = phoneNumber;
      customer.createdAt = new Date();
      const createdCustomer = await this.customerModel.create(customer);
      customerId = createdCustomer._id;
    }
    const enquiry = new Enquiry();
    enquiry.listingId = listingId;
    enquiry.companyId = companyId;
    enquiry.source = source;
    enquiry.customerId = customerId;
    enquiry.createdAt = new Date();
    await this.enquiryModel.create(enquiry);

    // after enquiry created, send message to the company. This is via whatsapp
  }
}