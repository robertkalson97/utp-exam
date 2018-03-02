import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { EditUserModal } from '../../shared/modals/index';
import { UserService, AccountService } from '../../core/services/index';
import { ModalWindowService } from "../../core/services/modal-window.service";
import { InviteUserModal } from './invite-user-modal/invite-user-modal.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
@DestroySubscribers()
export class UsersComponent implements OnInit {
  public userArr: any = [];
  public subscribers: any = {};
  public searchKey: string = null;
  public searchKey$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public total: number;
  public users$: Observable<any> = new Observable<any>();
  public sortBy: string;
  public sortBy$: any = new BehaviorSubject('relevance');

  constructor(
    public modal: Modal,
    public userService: UserService,
    public accountService: AccountService,
    public modalWindowService: ModalWindowService
  ) {
  }

  ngOnInit() {

    // this.subscribers.getUsersSubscription
    this.users$ = Observable
    .combineLatest(
      this.userService.selfData$,
      this.searchKey$.debounceTime(1000),
      this.sortBy$,
      this.accountService.dashboardLocation$
    )
    // filter for emitting only if user account exists (for logout user updateSelfData)
    .filter(([user, searchKey, sortBy, location]) => {
      return user.account;
    })
    .map(([user, searchKey, sortBy, location]) => {

      this.total = user.account.users.length;

      let allLocations = user.account.locations;

      let filteredUsers = _.filter(user.account.users, (user: any) => {
        let key = new RegExp(searchKey, 'i');

        //check if user has checked this location
        let userLocation: any = _.filter(user.locations, (item: any) => item.checked);
        userLocation = _.map(userLocation, (item: any) => item.location_id);
        let userIsFromCurrentLocation: boolean = !location || userLocation.indexOf(location.id) >= 0 || allLocations.length < 2;
        return ((!searchKey || key.test(user.name)) && userIsFromCurrentLocation);
      });
      let key = (sortBy=="relevance") ? "name" : sortBy;
      return _.sortBy(filteredUsers, [key]);
    });

    this.sortBy$
    .subscribe(
      (r) => {
        this.sortBy = r;
      }
    );

  }

  sortChange($event){
    this.sortBy$.next($event.target.value);
  }

  sendMessageToUser(user = null) {
    // check not to send message to self
    let sendMessage = this.accountService.selfData.account_owner == user.id ? false : true;
    this.viewUserModal(Object.assign(user, {sendMessage: sendMessage}));
  }

  viewUserModal(user = null) {
    //this.modal
    //    .open(ViewUserModal, this.modalWindowService.overlayConfigFactoryWithParams({ user: user}))
    //    .then((resultPromise)=>{
    //      resultPromise.result.then(
    //          (res) => {
    //            this.editUserModal(res);
    //          },
    //          (err)=>{}
    //      );
    //    });
  }

  editUserModal(user = null) {
    //this.modal.open(EditUserModal, this.modalWindowService.overlayConfigFactoryWithParams({ user: user}));
  }

  usersFilter(event) {
    // replace forbidden characters
    let value = event.target.value.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
    this.searchKey$.next(value);
  }

  resetFilters() {
    this.searchKey$.next('');
    this.searchKey = '';
  }

  inviteUser(){
    this.modal.open(InviteUserModal, this.modalWindowService.overlayConfigFactoryWithParams({},true));
  }
}
