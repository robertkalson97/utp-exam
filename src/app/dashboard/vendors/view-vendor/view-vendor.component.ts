import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Location }                 from '@angular/common';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
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
  public vendor: VendorModel = new VendorModel();
  public locationData = new AccountVendorModel();
  public accountVendors: any;
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
  
  @ViewChild('secondary') secondaryLocationLink: ElementRef;
  @ViewChild('all') allLocationLink: ElementRef;
  @ViewChild('primary') primaryLocationLink: ElementRef;
  public vendorId: string;
  
  
  constructor(
    public route: ActivatedRoute,
    public accountService: AccountService,
    public vendorService: VendorService,
    public location: Location,
  ) {
    this.globalVendor$ = this.vendorService.globalVendor$;
    this.all_locations$ = this.accountService.locations$;
  }
  
  ngOnInit() {}
  
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
    this.subscribers.getCurrenciesSubscription = this.accountService.getCurrencies()
    .subscribe((res: any) =>
      this.currencyArr = res
    );
  }
  
  ngAfterViewInit() {
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$
    .subscribe((res: any) => {
      if (this.secondaryLocationArr.length) {
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

    this.subscribers.globalVendorSubscription = this.globalVendor$
    .subscribe(vendor => {
      this.vendor = new VendorModel(vendor);
      this.vendorId = this.vendor.id;
    });
  }
  
  chooseTabLocation(location = null) {
    this.vendorService.selectedTab = location;
    this.locVendorChosen = !!location;
    if (location && location != this.primaryLocation) {
      this.sateliteLocationActive = true;
      this.secondaryLocation = location;
    } else if (!location && this.secondaryLocationArr.length) {
      this.allLocationLink.nativeElement.click();
    } else {
      this.sateliteLocationActive = false;
    }
    this.currentLocation = location;
    if (this.currentLocation && this.currentLocation.id) {
      let location = this.vendor.locations.find(v => v.location_id === this.currentLocation.id);
      this.locationData = location ? location : new AccountVendorModel();
    }
    
    if (this.currencyArr.length) {
      let currentVendorCurrency: any = _.find(this.currencyArr, {'iso_code': this.vendor.currency ? this.vendor.currency : "USD"});
      this.currencySign = currentVendorCurrency.symbol;
    }
  }
  
  goBack(): void {
    this.location.back();
  }
}
