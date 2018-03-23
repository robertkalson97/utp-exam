import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Observable } from 'rxjs/Rx';
import { IOption } from 'ng-select';
import * as moment from 'moment';
import * as _ from 'lodash';

import { VendorModel } from '../../../models/index';
import { UserService, AccountService } from '../../../core/services/index';

export class ReportsFilterModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-reports-filter-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './reports-filter-modal.component.html',
  styleUrls: ['./reports-filter-modal.component.scss']
})
export class ReportsFilterModal implements OnInit, ModalComponent<ReportsFilterModalContext> {
  public subscribers: any = {};
  public context: ReportsFilterModalContext;
  public vendors: Array<IOption> = [
    {label: 'Acme LLC', value: 'acme'},
    {label: 'Bay Suppliers', value: 'bay'},
    {label: 'Cataman Incdustries', value: 'castaman'},
    {label: 'Dearborn Systems', value: 'dearborn'},
    {label: 'Frankies Inc', value: 'frankies'},
    {label: 'Harry\'s Mechanical', value: 'harry'},
    {label: 'ITC', value: 'itc'},
    {label: 'JJES Systems', value: 'jjes'}
  ]
  public catetories: Array<IOption> = [
    {label: 'Cat1', value: 'cat1'},
    {label: 'Cat2', value: 'cat2'},
    {label: 'Cat3', value: 'cat3'},
    {label: 'Cat4', value: 'cat4'},
    {label: 'Cat5', value: 'cat5'},
    {label: 'Cat6', value: 'cat6'},
    {label: 'Cat7', value: 'cat7'},
    {label: 'Cat8', value: 'cat8'},
  ]
  public daterange: any = {}
  public dateOptions: any = {
    locale: { format: 'MMM D, YYYY' },
    alwaysShowCalendars: false,
    ranges: {
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    }
  }
  public minPrice: string;
  public maxPrice: string;
  public minAvgPrice: string;
  public maxAvgPrice: string;

  constructor(
      public dialog: DialogRef<ReportsFilterModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {
    // this.vendor = new VendorModel(this.context.product);
    // this.locations$ = this.accountService.locations$.map((res: any) => {
    //   this.primaryLocation = _.find(res, {'location_type': 'Primary'}) || res[0];
    //   let secondaryLocations = _.filter(res, (loc) => {
    //     return this.primaryLocation != loc;
    //   });
    //   return secondaryLocations;
    // });
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  OnDate(value: any, datepicker?: any) {
    console.log(value);
  }
}
