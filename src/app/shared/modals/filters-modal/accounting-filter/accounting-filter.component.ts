import { Component, OnInit } from '@angular/core';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { FormControl } from '@angular/forms';

import { AccountService } from '../../../../core/services/account.service';

@Component({
  selector: 'app-accounting-filter',
  templateUrl: './accounting-filter.component.html',
})
@DestroySubscribers()
export class AccountingFilterComponent implements OnInit {

  public accountings = new FormControl([]);
  public accountingCollection = {};

  public autocompleteAccountings = {
    autocompleteOptions: {
      data: this.accountingCollection,
      limit: Infinity,
      minLength: 0,
    }
  };

  private subscribers: any = {};

  constructor(
    private accountService: AccountService,
  ) {
  }

  ngOnInit() {
    this.subscribers.getProductCategoriesSubscription = this.accountService.getProductAccounting()
    .subscribe((res: any) => {
      const categoriesData = [...res];
      categoriesData.map((accounting) =>
        this.accountingCollection[accounting] = null
      );
    });
  }

}
