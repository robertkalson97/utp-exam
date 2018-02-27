export class ProductModel {
  id: string = null;
  catalog_number: number = null;
  category: string = null;
  created_at: string = null;
  department: string = null;
  hazardous: boolean = null;
  images: any = null;
  maufacturer: string = null;
  msds: string = null;
  name: string = null;
  price_max: string = null;
  price_min: string = null;
  price_range: string = null;
  proper_name: string = null;
  trackable: boolean = null;
  updated_at: string = null;
  variant_count: number = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
