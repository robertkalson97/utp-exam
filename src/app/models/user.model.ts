import { CreditCardModel } from './credit-card.model';
import { AccountModel } from './account.model';


export class InviteUserModel {
  email_address:string = '';
  name:string = '';
  phone:string = '';
  user_id:string = null;
}

export class InviteUserPwdModel extends InviteUserModel {
  password:string = null;
}


export class UserModel {
  id: string = null;
  name: string = null;
  email_address: string = null;
  password: string = null;
  
  locations: any = [];
  permissions: any = [];
  phone: string = null;
  phone_ext: string = null;

  account_id: string = null;
  signup: boolean = null; // for SelfDataActions in user.service to avoid putting user_id in cookies (for isGuest functionality)
  tutorial_mode: boolean = null;
  template: any = null;
  department: any = null;
  default_location: any = null;
  reg_code:string = '';
  
  // cards: CreditCardModel[] = [];
  // defaultCard: CreditCardModel = null;
  account: AccountModel = new AccountModel();
  avatar: string = null;
  created_at: string = null;
  updated_at: string = null;
  last_login: string = null;
  email_verify_token: string = null;
  status: number = null;
  welcome_email: string = null;
  role: string = null;

  constructor(obj?: any) {
    for (let field in obj) {
      if (typeof this[field] !== "undefined") {
        this[field] = obj && obj[field];
      }
    }
  }
}