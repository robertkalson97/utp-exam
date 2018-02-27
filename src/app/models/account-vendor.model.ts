export class AccountVendorModel {
  id: string = '';
  account_id: string = null;
  avg_lead_time: string = null;
  created_at: string = null;
  currency: string = 'USD';
  default_order_type: string = 'email';
  discount_percentage: any = null;
  documents: any = null;
  email: string = null;
  ext_account_number: string = null;
  fax: string = null;
  hidden: boolean = null;
  location_id: string = null;
  logo: string = null;
  name: string = null;
  notes: string = null;
  payment_method: string = 'check';
  phone: string = null;
  priority: string = '1';
  product_count: number = null;
  rep_email: string = '';
  rep_fax: string = '';
  rep_mobile_phone: string = '';
  rep_name: string = '';
  rep_office_phone: string = '';
  secondary_rep_email: string = '';
  secondary_rep_fax: string = '';
  secondary_rep_mobile_phone: string = '';
  secondary_rep_name: string = '';
  secondary_rep_office_phone: string = '';
  shipping_handling: any = null;
  updated_at: string = null;
  vendor_id: string = null;
  website: string = null;
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}
