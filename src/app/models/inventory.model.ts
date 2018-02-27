

export class PackageProperties{
  properties:Package
}

export class Package{
  qty:number;
  unit_type:string;
}

export class VendorProperties{
  properties:Vendor
}

export class Vendor{
  vendor_id:string = null;
  vendor_name:string = null;
}

export class InventorySearchResults {
  consumable_unit: PackageProperties =  {properties:{qty:null, unit_type:null}};
  sub_package: PackageProperties =  {properties:{qty:null, unit_type:null}};
  vendor:Vendor = {vendor_name:null, vendor_id:null};
  vendors: Vendor[] = [];
  description:string = "";
  catalog_number: string = "";
  price: number = 0;
  negotiated_price: number = 0;
  club_price:number = 0;
  list_price:number = 0;
  images:string[] = [];
  mfg_number: string|number = '';
  name:string = "";
  package_type:string = "";
  product_id:string  = null;
  upc:string = "";
  variant_id:string = null;
  
  inventory_by: any[] = [];
  
  checked:boolean = false; // my prop
  
  notActive:boolean = false; // my prop
  
  formattedPrice: any = '$0.00';
  formattedForumPrice: any = '$0.00';
  formattedClubPrice: any = '$0.00';
  custom_product_id: string = null; // my prop
  custom_product: boolean = false; // my prop
  vendor_id: string = null;
  vendor_name: string = 'Auto';
  
  account_product_id: string = null;
  account_variant_id: string = null;
  inventory_product_id: string = null;
  consumableUnitQty: string = null;
  manufacturer: string = null;
  
  edited:boolean = false;

  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}

export class searchData {
  count:number;
  results:InventorySearchResults[];
}

export class AttachmentFiles {
  file_name: string;
  s3_object: string;
  id: string;
  ts: string;
  uri: string;
  type: string;
}