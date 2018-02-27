import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Location }                 from '@angular/common';

import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { VendorModel, AccountVendorModel } from '../../../models/index';
import { UserService, AccountService } from '../../../core/services/index';
import { ActivatedRoute, Params } from '@angular/router';
import { VendorService } from '../../../core/services/vendor.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-view-vendor',
  templateUrl: './view-vendor.component.html',
  styleUrls: ['./view-vendor.component.scss']
})
@DestroySubscribers()
export class ViewVendorComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  
  public globalVendor$;
  public vendor: any = {};
  public basicnfo: any = {};
  public accountVendors: any;
  public locationArr: any = [];
  public all_locations$: Observable<any>;
  public currentLocation: any;
  public sateliteLocationActive: boolean = false;
  public primaryLocation: any;
  public secondaryLocation: any;
  public secondaryLocationArr: any = [];
  public locVendorChosen: boolean = false;
  public currencyArr: any = [];
  public currencySign: string = '$';
  public body = document.getElementsByTagName("body")[0];
  
  //public displayingVendor$: BehaviorSubject<any> = new BehaviorSubject({});
  public accauntVendors$: Observable<any>;
  
  @ViewChild('secondary') secondaryLocationLink: ElementRef;
  @ViewChild('all') allLocationLink: ElementRef;
  @ViewChild('primary') primaryLocationLink: ElementRef;
  public vendorId: string;
  
  generalVendor;
  locationAccountVendors;
  
  constructor(
    public userService: UserService,
    public route: ActivatedRoute,
    public accountService: AccountService,
    public vendorService: VendorService,
    public location: Location,
  ) {
    this.globalVendor$ = this.vendorService.globalVendor$;
    this.all_locations$ = this.accountService.locations$;
  }
  
  ngOnInit() {
    
    this.accauntVendors$ = Observable.combineLatest(
      this.globalVendor$,
      this.vendorService.getAccountVendors()
    )
    .map(([globalVendor,vendors]: any) => {
       return _.filter(vendors, {'vendor_id': globalVendor['id']})
      }
    );

  }
  
  ngOnDestroy() {
    this.subscribers.allLocationsSubscription.unsubscribe();
  }
  
  addSubscribers() {
  
    this.subscribers.allLocationsSubscription = this.all_locations$
    .subscribe((res: any) => {
    
      this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
    
      this.secondaryLocationArr = _.filter(res, (loc) => {
        return this.primaryLocation != loc;
      });
    
      if (this.secondaryLocationArr.length > 0) {
        this.secondaryLocation = this.secondaryLocationArr[0];
      }
    console.log(res);
      return this.secondaryLocationArr;
    
    });
    
    this.subscribers.accauntVendorsSubscription = this.accauntVendors$
    .subscribe((accauntVendors: AccountVendorModel[]) => {
      
      this.accountVendors = accauntVendors;
      
      this.generalVendor = _.find(this.accountVendors, {'location_id': null});
      
      this.locationAccountVendors = _.filter(this.accountVendors, 'location_id');
      console.log(accauntVendors);
    });
    
    this.subscribers.globalVendorSubscription = this.globalVendor$
    .subscribe(vendor => {
  
      this.vendor = new VendorModel(vendor);
  
      this.basicnfo = _.cloneDeep(new VendorModel(vendor));
  
      this.vendorId = this.vendor.id;
    });
  
    this.subscribers.getCurrenciesSubscription = this.accountService.getCurrencies()
    .subscribe((res: any) =>
      this.currencyArr = res
    );
    
  }
  
  ngAfterViewInit() {

    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$
    .subscribe((res: any) => {
      
        if (this.secondaryLocationArr.length) {
    
          //if (this.secondaryLocationArr.length == 1) return;
    
          if (res ? res.id != this.primaryLocation.id : null) {
            this.secondaryLocationLink.nativeElement.click();
            this.body.click();
          }
    
          if (res && res.id == this.primaryLocation.id ) {
            this.primaryLocationLink.nativeElement.click();
          }
    
          if (!res) {
            this.allLocationLink.nativeElement.click();
          }
          this.chooseTabLocation(res);
        } else {
          this.chooseTabLocation();
        }
        
      
    });
    // observer to detect class change
    
    //if (this.secondaryLocationLink) {
    //  // observer to detect class change
    //  let observer = new MutationObserver((mutations) => {
    //    mutations.forEach((mutation: any) => {
    //      if (mutation.attributeName === "class" && mutation.oldValue == 'active' && mutation.target.className == '') {
    //         //this.secondaryLocationLink.nativeElement.click();
    //        this.chooseTabLocation(this.secondaryLocation);
    //      }
    //    });
    //  });
    //
    //  observer.observe(this.secondaryLocationLink.nativeElement, {
    //    attributes: true,
    //    attributeOldValue: true
    //  });
    //}
    
    //this.currentLocation = this.vendorService.selectedTab;
    
  }
  
  editVendor(vendor = null) {
    this.accountService.dashboardLocation$.next(this.currentLocation);
    this.goBack();
  }
  
  chooseTabLocation(location = null) {
   
    this.vendorService.selectedTab = location;
    this.locVendorChosen = !!location;
    //if (!this.secondaryLocation) {
    //  this.locVendorChosen = false;
    //}
    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      this.secondaryLocation = location;
    }
    else if (!location && this.secondaryLocationArr.length) {
      this.allLocationLink.nativeElement.click();
    } else {
      this.sateliteLocationActive = false;
    }
    this.currentLocation = location;
    // account vendor general info
    let generalAccountVendor: any = _.cloneDeep(_.find(this.accountVendors, {'location_id': null}));

    this.vendor = new VendorModel(this.basicnfo);

    // account vendor info for specific location

    let locationAccountVendor: AccountVendorModel = new AccountVendorModel(_.find(this.accountVendors, {'location_id': this.currentLocation ? this.currentLocation.id : null}) || null);
    // fill vendor info for modal view vendor
    
    _.each(locationAccountVendor, (value, key) => {
      if (generalAccountVendor && generalAccountVendor[key]) {
        this.vendor[key] = generalAccountVendor[key];
      }
      if (value)
        this.vendor[key] = value;
    });
    
    if (this.currencyArr.length) {
      let currentVendorCurrency: any = _.find(this.currencyArr, {'iso_code': this.vendor.currency ? this.vendor.currency : "USD"});
      this.currencySign = currentVendorCurrency.symbol;
    }
    
  }
  
  goBack(): void {
    this.location.back();
  }
  
}
