export class InventoryLocationModel {
  name: string = null;
  floor_stock: boolean = false;
  _id: number = null;
  default_location: boolean = false;

  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}