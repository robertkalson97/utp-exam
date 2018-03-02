// import { HttpClient } from './http.service';
import { ToasterService } from './toaster.service';
import { UserService } from './user.service';
import { AccountService } from './account.service';
import { CardService } from './card.service';
import { StateService } from './state.service';
import { SpinnerService } from './spinner.service';
import { PhoneMaskService } from './phone-mask.service';
import { SessionService } from './session.service';
import { FileUploadService } from './file-upload.service';
import { ExifService } from './exif.service';
import { VendorService } from './vendor.service';
import { ModalWindowService, CustomRenderer } from './modal-window.service';
import { ProductService } from './product.service';
import { JwtService } from './jwt.service';
import { LocationService } from './location.service';
import { CartService } from './cart.service';
import { OrderService } from './order.service';
import { ConfigService } from './config.service';
import { DashboardService } from './dashboard.service';
import { InventoryService } from './inventory.service';
import { PastOrderService } from './pastOrder.service';
import {ScannerService} from './scanner.service';
import { ReceivedOrderService } from './received-order.service';
import { ReceivedOrderListService } from './received-order-list.service';
import { RestockService } from './restock.service';


export {
  ToasterService,
  UserService,
  SessionService,
  SpinnerService,
  AccountService,
  CardService,
  StateService,
  PhoneMaskService,
  FileUploadService,
  ExifService,
  VendorService,
  ModalWindowService,
  ProductService,
  JwtService,
  LocationService,
  CustomRenderer,
  CartService,
  OrderService,
  PastOrderService,
  ReceivedOrderService,
  ConfigService,
  DashboardService,
  InventoryService,
  ScannerService,
  ReceivedOrderListService,
  RestockService
};

// an array of services to resolve routes with data
export const APP_SERVICE_PROVIDERS = [
  ToasterService,
  UserService,
  SessionService,
  SpinnerService,
  AccountService,
  CardService,
  StateService,
  PhoneMaskService,
  FileUploadService,
  ExifService,
  VendorService,
  ModalWindowService,
  ProductService,
  JwtService,
  LocationService,
  CartService,
  OrderService,
  PastOrderService,
  ReceivedOrderService,
  ConfigService,
  DashboardService,
  InventoryService,
  ScannerService,
  ReceivedOrderListService,
  RestockService
];
