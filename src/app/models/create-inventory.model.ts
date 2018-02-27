export class InventoryProductModel {
  product_id: string = null;
  variant_id: string = null;
  vendor_name: string = null;
  vendor_id: string = null;
  
  price:string = null;
  list_price:string = null;
  club_price:string = null;
  negotiated_price:string = null;
  catalog_number:string = null;
  upc:string = null;
  edited: boolean = false;
  
  inventory_by: any[] = [];
  
  name: string = '';
  images: any[] = [];
  vendors: any[] = [];
  
  account_product_id: string = null;
  account_variant_id: string = null;
  inventory_product_id: string = null;
  
  manufacturer: string = null;
  mfg_number: string|number = '';
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class InventoryStorageLocationModel {
  name: string = '';
  inventory_location_id: string = '';
  on_hand: number = 0;
  floor_stock: boolean = false;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class InventoryLocationModel {
  name: string = '';
  location_id: string = '';
  critical_level: number = null;
  fully_stocked: number = null;
  overstock_level: number = null;
  tracking_method: string = 'Perpetual';
  auto_reorder_start_date: string = null;
  auto_reorder_frequency: number = 1;
  auto_reorder_timespan: string = 'Months';
  auto_reorder_qty: number = null;
  restock_frequency: string = 'Monthly';
  storage_locations: InventoryStorageLocationModel[] = [];
  active: boolean = false;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class InventoryModel {
  name: string = '';
  products: InventoryProductModel[] = [];
  department: string = 'Clinic';
  category: string = null;
  account_category: string = 'Supplies: Clinical';
  tax_exempt: boolean = false;
  trackable: boolean = false;
  description: string = '';
  notes: string = '';
  msds: any[] = [];
  attachments: any[] = [];
  image: string = '';
  locations: InventoryLocationModel[] =[];
  inventory_by: string = '';
  inventory_by_label: string = '';
  hazardous: boolean = false;
  
  inventory_by_array: any[] = [];
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

