import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

import { Modal } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { PastOrderService } from '../../core/services/pastOrder.service';

import { Router } from '@angular/router';
import { ModalWindowService } from '../../core/services/modal-window.service';
import { ToasterService } from '../../core/services/toaster.service';
import { OrderTableResetService } from './directives/order-table/order-table-reset.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
@DestroySubscribers()
export class OrdersComponent implements OnInit, OnDestroy, AfterViewInit {
  public subscribers: any = {};
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public orders$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public searchKey: string;
  public sortBy: string;
  public sortBy$: BehaviorSubject<any> = new BehaviorSubject(null);
  public visible: boolean[] = [];
  
  constructor(
      public modal: Modal,
      public router: Router,
      public pastOrderService: PastOrderService,
      public modalWindowService: ModalWindowService,
      public toasterService: ToasterService,
      public orderTableResetService: OrderTableResetService,
  ) {
  
  }

  ngOnInit() {
  
  }
  
  ngAfterViewInit() {
  }
  
  ngOnDestroy() {
    console.log('for unsubscribing');
  }

  searchOrders(event) {
    // replace forbidden characters
    const value = event.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  };
  
  showFiltersModal() {
  
  }
  
  resetFilters() {
    this.orderTableResetService.resetFilters();
  }
  
}
