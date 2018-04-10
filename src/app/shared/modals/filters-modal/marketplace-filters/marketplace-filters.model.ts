export class MarketplaceFiltersModel {
  accountings: string[] = [];
  categories: string[] = [];
  departments: string[] = [];
  vendors: string[] = [];
  my_favorite: boolean = false;
  order_date_min: Date = null;
  order_date_max: Date = null;
  retired: boolean = false;
  hazardous: boolean = false;
  trackable: boolean = false;
  tax_exempt: boolean = false;
  most_frequently_ordered: boolean = false;

  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
