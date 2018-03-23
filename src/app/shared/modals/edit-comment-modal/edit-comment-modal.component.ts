import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
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

export class EditCommentModalContext extends BSModalContext {
  public comment: any;
}

@Component({
  selector: 'app-change-password-user-modal',
  // TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './edit-comment-modal.component.html',
  styleUrls: ['./edit-comment-modal.component.scss']
})
@DestroySubscribers()
export class EditCommentModal implements OnInit, ModalComponent<EditCommentModalContext> {
  public subscribers: any = {};
  context: EditCommentModalContext;

  public comment;


  constructor(public zone: NgZone,
              public dialog: DialogRef<EditCommentModalContext>,
              public userService: UserService,
              public accountService: AccountService,
              public phoneMaskService: PhoneMaskService,
              public toasterService: ToasterService,
              public fileUploadService: FileUploadService,
              public modal: Modal,
              public modalWindowService: ModalWindowService) {
    this.context = dialog.context;
  }

  ngOnInit() {
    this.comment = this.context.comment;
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }

  onSubmit() {
    this.dialog.close(this.comment)
  }
}
