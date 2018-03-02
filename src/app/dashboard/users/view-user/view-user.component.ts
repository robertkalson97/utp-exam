import { Component, OnInit } from '@angular/core';
import { Location }               from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { DestroySubscribers } from 'ngx-destroy-subscribers';
import * as _ from 'lodash';

import { AccountService, UserService, ModalWindowService } from '../../../core/services/index';

import { Observable } from "rxjs";
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss']
})
@DestroySubscribers()
export class ViewUserComponent implements OnInit {
  public subscribers: any = {};
  public user: any;
  public userId: string;
  public message: any = {};
  public messageConfirm: boolean = false;
  public toSendMessage: boolean = false;
  public userLocations;
  public deleteUser$: ReplaySubject<any> = new ReplaySubject(1);

  constructor(
    public router:Router,
    public location: Location,
    public userService: UserService,
    public accountService: AccountService,
    public route: ActivatedRoute,
    public modalWindowService: ModalWindowService
  ) {
  }

  ngOnInit() {
    this.subscribers.userSubscription = Observable.combineLatest(
      this.route.params,
      this.userService.selfData$
    )
    .filter(([id, user]) => {
      return user.id;
    })
    .map(([params, selfData]) => {
      this.userId = params['id'];
      return selfData.account.users;
    })
    .subscribe(user => {
      this.user = _.find(user, (us: any) => (us.id == this.userId));
      if (!this.user) {
        this.goBack();
      } else {
        this.userLocations = _.filter(this.accountService.selfData.locations, (location: any) => {
          let userLocation: any = _.find(this.user.locations, {location_id: location.id});
          if (userLocation) {
            return userLocation.checked;
          }
          return false;
        });
      }

    });
    //ToDO
    //this.toSendMessage = userData.sendMessage || false;

    this.subscribers.deleteUserSubscription = this.deleteUser$
    .switchMap(() => this.accountService.deleteUser(this.user))
    .subscribe((res: any) =>
        this.goBack(),
      (err: any) =>
        this.goBack()
    );
  }

  deleteUser(user) {
    this.modalWindowService.confirmModal('Delete user?', {text: 'Are you sure you want to delete the user?', btn: 'Delete'}, this.deleteUserFunc.bind(this));
  }

  deleteUserFunc() {
    this.deleteUser$.next('');
  }

  confirmMessage() {
    this.messageConfirm = true;
  }

  sendNewMessage() {
    this.message = {};
    this.messageConfirm = false;
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

}
