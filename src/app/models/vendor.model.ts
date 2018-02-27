export class VendorModel {
  id: string = null;
  active: boolean = null;
  address: any = null;
  created_at: string = null;
  email: string = null;
  fax: string = null;
  logo: string = null;
  name: string = null;
  phone: string = null;
  updated_at: string = null;
  website: string = null;

  priority: number = 0;
  account_vendor: any = [];
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
