import { isArray } from 'lodash';


export class Model {
  protected populate(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class ChangingShoppingListModel extends Model {
  items: ItemModel[] = [];
  
  constructor(obj?:any) {
    super();
    this.populate(obj);
    if(obj && obj.items && isArray(obj.items)) {
      this.items = obj.items.map(item => new ItemModel(item))
    }
  }
}

export class ItemModel extends Model {
  product_id: string = '';
  location_id: string = '';
  custom: boolean = false;
  variants: VariantModel[] =[];
  
  constructor(obj?:any) {
    super();
    this.populate(obj);
    this.variants = [new VariantModel(obj)];
    this.location_id = obj.prev_location;
  }
}

export class VariantModel extends Model {
  variant_id: string = '';
  location_id: string = '';
  vendor_id: string = null;
  qty: number = 0;
  vendor_auto_select: boolean = true;
  status: number = 1;
  
  constructor(obj?:any) {
    super();
    this.populate(obj);
    this.vendor_auto_select = obj.selected_vendor.id ? false : true;
    this.vendor_id = obj.selected_vendor.id ? obj.selected_vendor.id : null;
  }
  

}