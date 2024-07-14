import { CompanyDetailSchema } from './company-detail.schema';
import { CompanySchema } from './company.schema';
import { ContentSchema } from './content.schema';
import { ListingSchema } from './listing.schema';
import { placeSchema } from './places.schema';
import { UserSchema } from './user.schema';

export default () => [
    { name: 'Content', schema: ContentSchema },
    { name: 'CompanyDetail', schema: CompanyDetailSchema },
    { name: 'User', schema: UserSchema },
    { name: 'Listing', schema: ListingSchema },
    { name: 'Company', schema: CompanySchema },
    { name: 'Place', schema: placeSchema },
  ];