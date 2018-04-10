export class OrdersPageFiltersModel {
  archived: boolean = false;
  bogo: boolean = false;
  percent_off: boolean = false;
  rewards: boolean = false;
  vendors: string[] = [];
  voided: boolean = false;
  my_favorite: boolean = false;
  order_date_min: Date = null;
  order_date_max: Date = null;

  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
