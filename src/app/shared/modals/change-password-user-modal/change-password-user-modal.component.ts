import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import * as _ from 'lodash';

import {
  UserService,
  AccountService,
  PhoneMaskService,
  ToasterService,
  FileUploadService,
  ModalWindowService
} from '../../../core/services/index';
import { UserModel } from '../../../models/index';

export class ChangePasswordUserModalContext extends BSModalContext {
  public user: any;
}

@Component({
  selector: 'app-change-password-user-modal',
  // TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './change-password-user-modal.component.html',
  styleUrls: ['./change-password-user-modal.component.scss']
})
@DestroySubscribers()
export class ChangePasswordUserModal implements OnInit, CloseGuard, ModalComponent<ChangePasswordUserModalContext> {
  public subscribers: any = {};
  context: ChangePasswordUserModalContext;

  public user;

  public changePass: any = {};
  public passConfirmation: boolean = true;



  constructor(public zone: NgZone,
              public dialog: DialogRef<ChangePasswordUserModalContext>,
              public userService: UserService,
              public accountService: AccountService,
              public phoneMaskService: PhoneMaskService,
              public toasterService: ToasterService,
              public fileUploadService: FileUploadService,
              public modal: Modal,
              public modalWindowService: ModalWindowService) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit() {
    let userData = this.context.user;
    this.user = new UserModel(userData);
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }

  onSubmit() {
    if(this.changePass.password != this.changePass.password_confirmation) {
      this.passConfirmation = false;
      return false;
    }
    if(this.changePass.password && this.changePass.password_confirmation) {
      this.subscribers.changePasswordSubscriber = this.accountService.changeUserPassword(this.user.id, this.changePass).subscribe(res => {
        this.dismissModal();
      })
    }

  }
}
