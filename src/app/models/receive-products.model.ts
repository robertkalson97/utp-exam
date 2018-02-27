export class StorageLocationModel {
  storage_location_is: string = '';
  qty: string = '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class StatusModel {
  type: string = '';
  qty: string = '';
  primary_status: boolean = false;
  showStatusSelect: boolean = true;
  location_id: string = '';
  storage_location_id: string = '';
  tmp_id: string = '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class ItemModel {
  item_id: string = '';
  status: StatusModel[] = [];
  inventory_group_id: string = '';
  inventory_group = {};
  inventory_groups:any =[];
  location_id: string = '';
  //storage_locations: StorageLocationModel[] =[];
  
  quantity: string = '';
  item_name: string = '';
  location_name: string = '';
  existInvGroup: boolean = false;
  locations: any =[];
  status_line_items: any = [];
  catalog_number: string = "";
  price: number = 0;
  product_id:string  = null;
  variant_id:string = null;
  vendor_id: string = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class OrderModel {
  order_id: string = '';
  items: ItemModel[] = [];
  po_number: string = '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class ReceiveProductsModel {
  orders: OrderModel[] = [];
  packing_slip_number: string = '';
  invoice_number: string = '';
  vendor: any = {};
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}