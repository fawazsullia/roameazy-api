import { CompanyDetailSchema } from './company-detail.schema';
import { CompanySchema } from './company.schema';
import { ContentSchema } from './content.schema';
import { Customer, CustomerSchema } from './customer.schema';
import { EnquirySchema } from './enquiry.schema';
import { ListingSchema } from './listing.schema';
import { placeSchema } from './places.schema';
import { SuperAdminUserSchema } from './super-admin-user.schema';
import { UserSchema } from './user.schema';

export default () => [
  { name: 'Content', schema: ContentSchema },
  { name: 'CompanyDetail', schema: CompanyDetailSchema },
  { name: 'User', schema: UserSchema },
  { name: 'Listing', schema: ListingSchema },
  { name: 'Company', schema: CompanySchema },
  { name: 'Place', schema: placeSchema },
  { name: 'SuperAdminUser', schema: SuperAdminUserSchema },
  { name: 'Listing', schema: ListingSchema },
  {name: 'Enquiry', schema: EnquirySchema },
  { name: 'Customer', schema: CustomerSchema },
];