import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import * as _ from 'lodash';

import { EditLocationModal } from '../../shared/modals/index';
import { UserService, AccountService } from '../../core/services/index';
import { ModalWindowService } from "../../core/services/modal-window.service";

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
@DestroySubscribers()
export class LocationsComponent implements OnInit {
  public subscribers: any = {};
  public searchKey: string = null;
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public sortBy: string = 'relevance';
  public sortBy$: any = new BehaviorSubject('relevance');
  public total: number;
  public locations$: Observable<any>;
  
  constructor(
    public modal: Modal,
    public userService: UserService,
    public accountService: AccountService,
    public modalWindowService: ModalWindowService
  ) {
  }
  
  ngOnInit() {
    this.locations$ = Observable
    .combineLatest(
      this.userService.selfData$,
      this.sortBy$,
      this.searchKey$.debounceTime(1000)
    )
    
    // filter for emitting only if user account exists (for logout user updateSelfData)
    .filter(([user, sortBy, searchKey]) => {
      return user.account;
    })
    .map(([user, sortBy, searchKey]) => {
      
      this.total = user.account.locations.length;
      let filteredLocations = user.account.locations;
      if (searchKey && searchKey != '') {
        filteredLocations = _.reject(filteredLocations, (loc: any) => {
          let key = new RegExp(searchKey, 'i');
          return !key.test(loc.name);
        });
      }
      return _.sortBy(filteredLocations, [sortBy]);
    });

    this.sortBy$
    .subscribe(
      (r) => {
        this.sortBy = r;
      }
    );
  
  }
  
  viewLocationModal(location = null) {
  }
  
  editLocationModal(location = null) {
    this.modal.open(EditLocationModal, this.modalWindowService.overlayConfigFactoryWithParams({location: location}));
  }
  
  locationsSort(event) {
    let value = event.target.value;
    this.sortBy$.next(value);
  }
  
  locationsFilter(event) {
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }
  
  
  resetFilters() {
    this.sortBy = '';
    this.searchKey = '';
    this.sortBy$.next('');
    this.searchKey$.next('');
  }
}
