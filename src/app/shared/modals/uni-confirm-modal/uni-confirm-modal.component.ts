import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash';

import { DialogRef, ModalComponent, CloseGuard, Modal } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';

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
@DestroySubscribers()
export class UniConfirmModal implements OnInit, CloseGuard, ModalComponent<UniConfirmModalContext> {
  context: UniConfirmModalContext;
  
  constructor(
    public dialog: DialogRef<UniConfirmModalContext>,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  ngOnInit() {
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
  
  closeModal(data = true) {
    this.dialog.close(data);
  }

  confirm(){
    this.dialog.context.fn();
    this.dismissModal();
  }
}
