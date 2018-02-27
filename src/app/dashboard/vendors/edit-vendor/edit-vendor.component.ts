import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Location }                 from '@angular/common';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import * as _ from 'lodash';

import {
  AccountService,
  UserService,
  PhoneMaskService,
  VendorService
} from '../../../core/services/index';
import { AccountVendorModel } from '../../../models/index';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorModel } from '../../../models/vendor.model';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ConfirmModalService } from '../../../shared/modals/confirm-modal/confirm-modal.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';


@Component({
  selector: 'app-edit-vendor',
  templateUrl: './edit-vendor.component.html',
  styleUrls: ['./edit-vendor.component.scss']
})
@DestroySubscribers()
export class EditVendorComponent implements OnInit, AfterViewInit {
  public options: any;
  public subscribers: any = {};
  public currentVendor$;
  public vendor: AccountVendorModel;
  public accountVendors: AccountVendorModel[];
  public vendorData: any;
  public formData: FormData = new FormData();
  public currency$: Observable<any>;
  public currencyArr: any;
  public currencyDirty: boolean = false;
  public currencySign: string = '$';
  public amountMask: any = createNumberMask({
    allowDecimal: true,
    prefix: ''
  });
  public discountMask: any = this.amountMask; //[/\d/, /\d/, /\d/];
  public priorityMargin: string = '0';
  
  public vendorFormPhone: string = '';
  public vendorFormPhone2: string = '';
  public vendorFormFax: string = '';

  public secondaryFormPhone: string = '';
  public secondaryFormPhone2: string = '';
  public secondaryFormFax: string = '';

  public phoneMask: any = this.phoneMaskService.defaultTextMask;
  // default country for phone input
  public selectedCountry: any = this.phoneMaskService.defaultCountry;
  public selectedCountry2: any = this.phoneMaskService.defaultCountry;
  public selectedFaxCountry: any = this.phoneMaskService.defaultCountry;

  public selectedSecondaryCountry: any = this.phoneMaskService.defaultCountry;
  public selectedSecondaryCountry2: any = this.phoneMaskService.defaultCountry;
  public selectedSecondaryFaxCountry: any = this.phoneMaskService.defaultCountry;
  
  fileIsOver: boolean = false;
  public files$: Observable<any>;
  public newFiles$: BehaviorSubject<any> = new BehaviorSubject(null);
  public oldFiles$: BehaviorSubject<any> = new BehaviorSubject(null);
  public viewInit$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public vendorLoaded$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public fileArr: any = [];
  public oldFileArr: any = [];
  
  public locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any;
  public secondaryLocationArr: any = [];
  
  @ViewChild('secondary') secondaryLocationLink: ElementRef;
  @ViewChild('all') allLocationLink: ElementRef;
  @ViewChild('primary') primaryLocationLink: ElementRef;
  public defaultPlaceholder: any = {
    discount_percentage: "Enter Value",
    shipping_handling: "Enter Value",
    avg_lead_time: "Enter Value",
    ext_account_number: "Enter Value",
    rep_name: "Enter full name",
    rep_email: "username@email.com",
    vendorFormPhone: "Enter phone number",
    vendorFormPhone2: "Enter phone number",
    vendorFormFax: "Enter fax number",
    notes: ""
  };
  public placeholder: any = {};
  public vendorId: string;
  public inited: boolean = false;
  public allVendor$: Observable<any>;
  private noAV:  boolean = false;

  public openConfirmModal$: Subject<any>;
  
  constructor(
    public userService: UserService,
    public accountService: AccountService,
    public location: Location,
    public vendorService: VendorService,
    public router: Router,
    public route: ActivatedRoute,
    public phoneMaskService: PhoneMaskService,
    public modalWindowService: ModalWindowService,
    public confirmModalService: ConfirmModalService,
  ) {
    this.vendor = new AccountVendorModel();

    this.openConfirmModal$ = new Subject();
  }
  
  ngOnInit() {
    this.currentVendor$ = this.vendorService.globalVendor$;
    
    this.currency$ = this.accountService.getCurrencies();
    
    this.files$ = Observable.combineLatest(
      this.newFiles$,
      this.oldFiles$,
      (newFiles, oldFiles) => {
        let files = _.union(oldFiles, newFiles);
        return files;
      }
    );
    
    this.locations$ = this.accountService.locations$
    .map((res: any) => {
      this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
      this.secondaryLocationArr = _.filter(res, (loc) => {
        return this.primaryLocation != loc;
      });
      if (this.secondaryLocationArr.length > 0)
        this.secondaryLocation = this.secondaryLocationArr[0];
      return this.secondaryLocationArr;
    });
    
    
  }
  
  addSubscribers() {
    this.subscribers.AccountVendorsSubscribtion = Observable.combineLatest(
      this.route.params,
      this.vendorService.getAccountVendors(),
    )
    .map(([route, vendors]: any) => _.filter(vendors, {'vendor_id': route['id']}))
    .subscribe((vendors: any[]) => {
    
      if (!_.isEmpty(vendors)) {
        this.vendorData = vendors[0];
        this.vendorData['vendor_id'] = vendors[0]['vendor_id'];
        this.vendorId = vendors[0]['vendor_id'];
      }
      
      this.accountVendors = vendors;
    
      this.vendorLoaded$.next(true);
      
    });
  
    this.subscribers.viewInitAndVendorLoadedSubscriber = Observable
    .combineLatest(this.viewInit$, this.vendorLoaded$)
    .filter(([a, b]) => (a && b))
    .subscribe(()=>{
      this.initTabs()
    });
    
    this.subscribers.currencySubscription = this.currency$
    .subscribe(currency => this.currencyArr = currency);

    this.subscribers.openConfirmModalSubscription = this.openConfirmModal$
    .switchMap(() => this.confirmModalService.confirmModal(
      'Save?', {text: 'Do you want to save the applied changes?', btn: 'Save'}
    )).subscribe(res => {
      if (res.success) {
        this.onSubmit();
      }
      return this.chooseTabLocation();
    });
  }
  
  initTabs() {
    
     //this.secondaryLocationLink.nativeElement.click();
    
    //this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$.subscribe((res: any) => {
    //  //this.chooseTabLocation(res);
    //  if (this.secondaryLocationArr.length == 1) return;
    //  if (res && res.id != this.primaryLocation.id ) {
    //    this.secondaryLocationLink.nativeElement.click();
    //  }
    //});
 
    // observer to detect class change
    if (this.secondaryLocationLink) {
      let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation: any) => {
          if (this.vendorData && mutation.attributeName === "class" && mutation.oldValue == 'active' && mutation.target.className == '') {
            this.selectTabLocation(this.secondaryLocation);
          }
        });
      });
      observer.observe(this.secondaryLocationLink.nativeElement, {
        attributes: true,
        attributeOldValue: true
      });
    }

    this.currentLocation = this.vendorService.selectedTab;
    
    if (!this.currentLocation){
      this.allLocationLink.nativeElement.click();
    } else {
      
      if (this.primaryLocation == this.currentLocation) {
        this.primaryLocationLink.nativeElement.click();
      } else {
        this.secondaryLocationLink.nativeElement.click();
      }
    }
  
    this.inited = true;
    
  }
  
  ngAfterViewInit() {
    this.viewInit$.next(true)
  }

  openConfirmModal() {
    this.openConfirmModal$.next('');
  }

  selectTabLocation(location = null) {
    if (this.vendor.id) {
      this.openConfirmModal();
    } else {
      this.chooseTabLocation(location);
    }
  }
  
  chooseTabLocation(location = null) {

    console.log(this.vendor, 1111111);
    // set placeholders
    if (location) {
      let allLocationsVendor = _.find(_.cloneDeep(this.vendorData), {'location_id': null}) || {};
      _.each(this.defaultPlaceholder, (value, key: any) => {
        switch (key) {
          case 'rep_office_phone':
            this.placeholder.vendorFormPhone = this.phoneMaskService.getPhoneByIntlPhone(allLocationsVendor[key]);
            break;
          case 'rep_mobile_phone':
            this.placeholder.vendorFormPhone2 = this.phoneMaskService.getPhoneByIntlPhone(allLocationsVendor[key]);
            break;
          case 'rep_fax':
            this.placeholder.vendorFormFax = this.phoneMaskService.getPhoneByIntlPhone(allLocationsVendor[key]);
            break;
          case 'discount_percentage':
            allLocationsVendor[key] = allLocationsVendor[key] * 100;
            break;
        }
        this.placeholder[key] = allLocationsVendor[key] || this.defaultPlaceholder[key];
      });
    } else {
      this.placeholder = this.defaultPlaceholder;
    }
    
    // check if secondary location was chosen

    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      
      this.secondaryLocation = location;
    } else {
      this.sateliteLocationActive = false;
  
    }
    
    this.currentLocation = location;
    
    //location have been choosen
    
    let currentVendor = _.find(_.cloneDeep(this.accountVendors), {'location_id': this.currentLocation ? this.currentLocation.id : null});
    
    let subscriber = this.currentVendor$
    .first()
    .subscribe((vendor:VendorModel)=>{
      
      if (!currentVendor || _.isEmpty(currentVendor)) {
        this.noAV = true;
      }
      
      this.fillForm(Object.assign(vendor,currentVendor || {}));
      //subscriber.unsubscribe();
    });
    
  }
  
  fillForm(vendor = {}) {
    
    this.oldFiles$.next(null);
    this.newFiles$.next(null);
    this.vendorFormPhone = '';
    this.vendorFormPhone2 = '';
    this.vendorFormFax = '';
    this.secondaryFormPhone = '';
    this.secondaryFormPhone2 = '';
    this.secondaryFormFax = '';
    this.vendor = new AccountVendorModel(vendor);
    console.log(this.vendor, 2222222);
    
    this.calcPriorityMargin(this.vendor.priority || 1);
    
    if (this.vendor.id) {
      this.vendor.discount_percentage = this.vendor.discount_percentage ? this.vendor.discount_percentage * 100 : null;
      this.oldFileArr = this.vendor.documents;
      this.oldFiles$.next(this.oldFileArr);
      
      this.vendorFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_office_phone);
      this.selectedCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_office_phone);
      this.vendorFormPhone2 = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_mobile_phone);
      this.selectedCountry2 = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_mobile_phone);
      this.vendorFormFax = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.rep_fax);
      this.selectedFaxCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.rep_fax);

      this.secondaryFormPhone = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.secondary_rep_office_phone);
      this.selectedSecondaryCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.secondary_rep_office_phone);
      this.secondaryFormPhone2 = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.secondary_rep_mobile_phone);
      this.selectedSecondaryCountry2 = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.secondary_rep_mobile_phone);
      this.secondaryFormFax = this.phoneMaskService.getPhoneByIntlPhone(this.vendor.secondary_rep_fax);
      this.selectedSecondaryFaxCountry = this.phoneMaskService.getCountryArrayByIntlPhone(this.vendor.secondary_rep_fax);
    }
  }
  
  changeCurrency(event) {
    let value = event.target.value;
    let currency = _.find(this.currencyArr, {'iso_code': value});
    this.currencyDirty = true;
    this.currencySign = currency ? currency['html_entity'] : '$';
  }
  
  changePriority(event) {
    let value = event.target.value;
    this.calcPriorityMargin(value);
  }
  
  calcPriorityMargin(value) {
    let fixer: number = -16;
    this.priorityMargin = 'calc(' + (value - 1) * 100 / 9 + '% + ' + fixer + 'px)';
  }
  
  onCountryChange($event) {
    this.selectedCountry = $event;
  }
  
  onCountryChange2($event) {
    this.selectedCountry2 = $event;
  }
  
  onFaxCountryChange($event) {
    this.selectedFaxCountry = $event;
  }

  onSecondaryCountryChange($event) {
    this.selectedSecondaryCountry = $event;
  }
  
  onSecondaryCountryChange2($event) {
    this.selectedSecondaryCountry2 = $event;
  }
  
  onSecondaryFaxCountryChange($event) {
    this.selectedSecondaryFaxCountry = $event;
  }
  
  // upload by input type=file
  changeListener($event): void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    let file: File = inputValue.files[0];
    this.onFileDrop(file);
  }
  
  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  
  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }
  
  addFile(file) {
    this.fileArr.push(file);
    this.newFiles$.next(this.fileArr);
  }
  
  onSubmit() {
    
    this.vendor.account_id = this.userService.selfData.account_id;
    this.vendor.rep_office_phone = this.vendorFormPhone ? this.selectedCountry[2] + ' ' + this.vendorFormPhone : '';
    this.vendor.rep_mobile_phone = this.vendorFormPhone2 ? this.selectedCountry2[2] + ' ' + this.vendorFormPhone2 : '';
    this.vendor.rep_fax = this.vendorFormFax ? this.selectedFaxCountry[2] + ' ' + this.vendorFormFax : '';
    this.vendor.secondary_rep_office_phone = this.secondaryFormPhone ? this.selectedSecondaryCountry[2] + ' ' + this.secondaryFormPhone : '';
    this.vendor.secondary_rep_mobile_phone = this.secondaryFormPhone2 ? this.selectedSecondaryCountry2[2] + ' ' + this.secondaryFormPhone2 : '';
    this.vendor.secondary_rep_fax = this.secondaryFormFax ? this.selectedSecondaryFaxCountry[2] + ' ' + this.secondaryFormFax : '';
    this.vendor.documents = null;
    this.vendor.location_id = this.currentLocation ? this.currentLocation.id : 'all';
    this.vendor.vendor_id = this.vendorId || this.vendor.id;

    _.each(this.vendor, (value, key) => {
      if (value != null) {
        this.formData.append(key, value);
      }
    });
    
    // append new files
    let i = 0;
    _.each(this.fileArr, (value, key) => {
      this.formData.append('new_documents[' + i + ']', this.fileArr[i]);
      i++;
    });
    
    
    // append old files
    let j = 0;
    _.each(this.fileArr, (value, key) => {
      this.formData.append('documents[' + j + ']', this.oldFileArr[j]);
      j++;
    });
    if (this.noAV) {
      this.vendorService.addAccountVendor(this.formData).subscribe(
        (res: any) => {
          this.goBackOneStep();
        }
      );
    } else {
      this.vendorService.editAccountVendor(this.vendor, this.formData).subscribe(
        (res: any) => {
          this.goBackOneStep();
        }
      );
    }
    
    console.log(this.vendor, 3333333);
    console.log(this.formData, 44444);

  }
  
  goBack(): void {
    this.router.navigate(['/vendors']);
  }
  goBackOneStep(): void {
    this.location.back();
  }
  
}
