import {UserModel} from "./user.model";

export class AccountModel {
  
  id: number = null;

  account_owner: string = null;
  address: any = {};
  // alert_on_dup_product: boolean = null;
  // allow_multiple_locations: boolean = null;
  // allow_product_nicknames: boolean = null;
  // annual_income: string = null;
  // annual_inventory_budget: string = null;
  // annual_net_revenue: string = null;
  // auto_manage_inventory: boolean = null;
  // bcc_account_email: string = null;
  // breakout_products_by_location: string = null;
  // cc_account_email: string = null;
  // cc_last_four: number = null;
  // cc_type: string = null;
  company_name: string = null;
  contact_email_address: string = null;
  created_at: string = null;
  created_by: string = null;
  // "currency": "USD";
  // "dashboard_notifications": true;
  // "default_billing_location": "Order Location";
  // "default_order_type": "Email";
  // "default_report_interval": null;
  // "default_shipping_location": "Order Location";
  // "email_verification_token": "57df4df371d08f08fceec701";
  // "email_verified": false;
  // "email_verified_timestamp": null;
  // "fiscal_year": null;
  // "hide_obsolete_supplies": true;
  locations: any = [];
  marys_list_member: boolean = null;
  // "marys_list_pricing": false;
  // "paper_size": "US Letter";
  // "parent_account": null;
  payment_token: string = null;
  // "perpetual_inventory": true;
  // "phone_format": "+1 222-3333";
  // "print_emailed_po": false;
  // "print_non_emailed_po": true;
  // "purchase_order_notes": null;
  // "remember_product_order_qty": false;
  // "req_po_confirmation": true;
  // "scanner_functionality": true;
  // "share_pricing_data": true;
  status: number = null;
  trial_code: string = null;
  // "trial_expiration": null;
  updated_at: string = null;
  // "use_reorder_level": false;
  users: UserModel[] = [];
  
  roles: any;
  
  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}