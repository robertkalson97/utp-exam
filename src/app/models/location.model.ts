export class LocationModel {
  id: string = null;
  account_id: string = null;
  name: string = null;
  email: string = null;
  fax: string = null;
  fax_ext: string = null;
  street_1: string = null;
  street_2: string = null;
  city: string = null;
  zip_code: string = null;
  image: string = null;

  location_type: string = null;
  phone: string = null;
  phone_ext: string = null;
  updated_at: string = null;
  created_at: string = null;
  state: string = null;
  postal_code: string = null;
  country: string = null;

  address: any = {};

  formattedAddress: any = null;
  inventory_locations: any = [];
  primary_tax_rate: number = null;
  secondary_tax_rate: number = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}