import { Component, OnInit, Input, ViewContainerRef } from '@angular/core';

import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';

import { EditUserModal } from '../../modals/index';
import { UserService } from '../../../core/services/index';
import { ModalWindowService } from "../../../core/services/modal-window.service";
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'user-dropdown-menu',
  templateUrl: './user-dropdown-menu.component.html',
  styleUrls: ['./user-dropdown-menu.component.scss']
})
@DestroySubscribers()
export class UserDropdownMenuDirective implements OnInit {
  @Input() onlyLogout;
  
  public subscribers: any = {};
  public user: any;
  //public userName: string;
  public userShortName: string;
  public showMenu: boolean;

  public constructor(
    public userService: UserService,
    public accountService: AccountService,
    public modal: Modal,
    public modalWindowService: ModalWindowService
  ) {
  }

  ngOnInit(){
    this.showMenu = !this.onlyLogout;
    this.subscribers.gerSelfDataSubscription = this.userService.selfData$
      .filter((res: any) => {
        return !this.userService.isGuest();
      })
      .subscribe((res: any) => {
        this.user = res;
        let nameArr = this.user.name.split(" ");
        let firstname = nameArr[0];
        this.userShortName = firstname.split("")[0];
        let lastname = null;
        if (nameArr.length > 1) {
          lastname = nameArr[nameArr.length-1];
          let shortLastname = lastname.split("")[0];
          this.userShortName += shortLastname;
        }
      });
  }

  editUserModal(){
    this.modal.open(EditUserModal,  this.modalWindowService.overlayConfigFactoryWithParams({user: this.user}));
  }

  logOut(){
    this.userService.logout().subscribe();
    this.updateDashboardLocation();
  }
  
  updateDashboardLocation() {
    this.accountService.dashboardLocation$.next(null);
  }
}
