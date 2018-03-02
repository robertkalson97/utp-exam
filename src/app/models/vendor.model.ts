import { AccountVendorModel } from "./account-vendor.model";

export class VendorModel {
  id: string = null;
  active: boolean = null;
  account_id: string;
  address: any = null;
  created_at: string = null;
  currency: string = '';
  email: string = null;
  fax: string = null;
  logo: string = null;
  name: string = null;
  phone: string = null;
  updated_at: string = null;
  vendor_id: string = null;
  po_number_prefix: any = null;
  website: string = null;

  priority: number = 0;
  account_vendor: any = [];
  
  locations: AccountVendorModel[] = [];

  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
