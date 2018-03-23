import { Component, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { Modal } from 'angular2-modal/plugins/bootstrap';

import { UserService, StateService, AccountService } from '../core/services/index';
import { Observable } from "rxjs";
import { DashboardService } from '../core/services/dashboard.service';
import { ModalWindowService } from '../core/services/modal-window.service';
import { DashboardFilterModal } from './dashboard-filter-modal/dashboard-filter-modal.component';

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./dashboard.style.scss'],
  templateUrl: './dashboard.template.html'
})
@DestroySubscribers()
export class DashboardComponent implements OnInit, OnDestroy {
  public subscribers: any = {};
  public selectedLocation: string = '';
  public locations$: any;
  public locationArr: any;
  public showLocSelect: boolean = true;
  
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
    public userService: UserService,
    public accountService: AccountService,
    public stateService: StateService,
    public dashboardService: DashboardService
  ) {
    this.locations$ = Observable.combineLatest(
      this.accountService.locations$,
      this.stateService.navigationEndUrl$
    )
    .map(([locations, navigationEndUrl]): any => locations)
    .do((res: any) => {
      this.locationArr = res;
      console.log('location arr', res);
    });
    
  }
  
  ngOnInit() {
    
  }
  
  ngOnDestroy() {
    this.subscribers.dashboardLocationSubscription.unsubscribe();
    this.subscribers.dashboardLocationProductSubscription.unsubscribe();
  }
  
  addSubscribers() {
    this.subscribers.dashboardLocationSubscription = this.accountService.dashboardLocation$
    .subscribe((res: any) => {
      this.selectedLocation = res ? res.id : '';
    });
    this.subscribers.dashboardLocationProductSubscription = this.accountService.locations$
    .subscribe(res => {
      this.showLocSelect = false;
      this.locationArr = res;
      if (this.locationArr.length <2) {
        this.selectedLocation = this.locationArr[0].id;
        this.accountService.dashboardLocation$.next(this.locationArr[0]);
      }
      // setTimeout because list with locations doesn't change dynamically
      setTimeout(() => {
        this.showLocSelect = true;
      }, 1)
    });
  }

  changeLocation(event) {
    this.accountService.dashboardLocation$.next(_.find(this.locationArr, {'id': event.target.value}));
  }

  showFiltersModal() {
    this.modal
    .open(DashboardFilterModal, this.modalWindowService.overlayConfigFactoryWithParams({}))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          // this.filterProducts();
        },
        (err) => {
        }
      );
    });
  }
}
