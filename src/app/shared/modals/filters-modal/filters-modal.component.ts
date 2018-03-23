import { Component, OnInit } from '@angular/core';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DialogRef, ModalComponent } from 'angular2-modal';

import * as _ from 'lodash';

import { AccountService } from '../../../core/services/account.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { VendorService } from '../../../core/services/vendor.service';

export class FiltersModalContext extends BSModalContext {
  public filters: any;
}

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
})
@DestroySubscribers()
export class FiltersModalComponent implements OnInit, ModalComponent<FiltersModalContext> {
  context;
  private subscribers: any = {};

  public discounts = ['Bogo', 'Percent Off', 'Rewards Points Used'];

  public filterForm: FormGroup;
  public departmentCollection$: Observable<any> = this.accountService.getDepartments();

  public vendorsCollection = {};
  public autocompleteVendors = {
    autocompleteOptions: {
      data: this.vendorsCollection,
      limit: Infinity,
      minLength: 0,
    }
  };

  constructor(
    public dialog: DialogRef<FiltersModalContext>,
    private accountService: AccountService,
    private vendorService: VendorService,
  ) {
    this.context = dialog.context;
    this.filterForm = new FormGroup({
      departments: new FormControl(),
      discounts: new FormControl(),
      vendors: new FormControl(),
      myFavorite: new FormControl(),
      maxPrice: new FormControl(),
      minPrice: new FormControl(),
      orderedFrom: new FormControl(),
      orderedTo: new FormControl(),
    });

  }

  get departmentsControl() {
    return this.filterForm.get('departments');
  }
  get discountsControl() {
    return this.filterForm.get('discounts');
  }
  get vendorsControl() {
    return this.filterForm.get('vendors');
  }
  get maxPriceControl() {
    return this.filterForm.get('maxPrice');
  }
  get minPriceControl() {
    return this.filterForm.get('minPrice');
  }
  get myFavoriteControl() {
    return this.filterForm.get('myFavorite');
  }
  get orderedFromControl() {
    return this.filterForm.get('orderedFrom');
  }
  get orderedToControl() {
    return this.filterForm.get('orderedTo');
  }

  ngOnInit() {
    this.subscribers.getVendorsSubscription = this.vendorService.getVendors()
    .subscribe((res: any) => {
      const vendorsData = _.flattenDeep(res.data.vendors);
      vendorsData.map((vendor: any) => {
        this.vendorsCollection[vendor.name] = null;
      });
    });
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  applyFilters() {
    console.log(this.filterForm.controls);
  }

}
