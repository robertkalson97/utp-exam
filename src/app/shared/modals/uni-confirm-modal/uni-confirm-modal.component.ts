import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class UniConfirmModalContext extends BSModalContext {
  public title:string;
  public content:any;
  public fn:any;
  constructor(t,c,f){
   super();
    this.title = t ? t :'Please confirm:';
    this.content = c ? c : 'Are You sure?';
    this.fn = f ? f : function(){};
  }
}

@Component({
  selector: 'app-change-password-user-modal',
  templateUrl: './uni-confirm-modal.component.html',
  styleUrls: ['./uni-confirm-modal.component.scss']
})
export class UniConfirmModal implements OnInit, ModalComponent<UniConfirmModalContext> {
  context: UniConfirmModalContext;

  constructor(
    public dialog: DialogRef<UniConfirmModalContext>,
  ) {
    this.context = dialog.context;
  }

  ngOnInit() {}

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data = true) {
    this.dialog.close(data);
  }

  confirm() {
    this.dialog.context.fn();
    this.dismissModal();
  }
}
