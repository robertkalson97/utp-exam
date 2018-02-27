export class NewVendorModel {
  id: string = '';
  created_at: string = null;
  updated_at: string = null;
  vendor_id: string = null;
  location_id: string = 'all';
  fax: string = '';
  phone: string = '';
  state: string = '';
  city: string = '';
  street_1: string = '';
  street_2: string = '';
  country: string = '';
  postCode: string = '';
  email: string = '';
  name: string = '';
  website: string = '';

  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
