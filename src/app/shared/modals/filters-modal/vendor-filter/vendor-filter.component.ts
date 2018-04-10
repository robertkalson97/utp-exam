import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { VendorService } from '../../../../core/services/vendor.service';

@Component({
  selector: 'app-vendor-filter',
  templateUrl: './vendor-filter.component.html',
})
@DestroySubscribers()
export class VendorFilterComponent implements OnInit {

  public vendors$;
  public vendorsData: any[];
  public vendorsCollection = {};
  public vendorsNameControl = new FormControl();
  @Input() vendorsControl: FormControl;

  public autocompleteVendors = {
    autocompleteOptions: {
      data: this.vendorsCollection,
      limit: Infinity,
      minLength: 0,
    }
  };

  private subscribers: any = {};

  constructor(
    private vendorService: VendorService,
  ) {
    this.vendors$ = this.vendorService.getVendors();
  }

  ngOnInit() {
    this.subscribers.getVendorsSubscription = this.vendors$
    .subscribe((res: any) => {
      this.vendorsData = _.flatten(res.data.vendors);
      this.vendorsData.map((vendor: any) => {
        this.vendorsCollection[vendor.name] = null;
      });
    });

    this.subscribers.changeVendorsValueSubscription = this.vendorsNameControl.valueChanges
    .subscribe((vendors: string[]) => {
      const VendorsIds = vendors.map((item) => {
        const vendorId = _.find(this.vendorsData, ['name', item]);
        return vendorId.id;
      });
      this.vendorsControl.setValue(VendorsIds);
    });

  }

}
