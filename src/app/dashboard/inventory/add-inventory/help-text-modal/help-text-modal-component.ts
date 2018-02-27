import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class HelpTextModalContext extends BSModalContext {
  public text: any;
}


@Component({
  selector: 'app-help-text-modal',
  templateUrl: './help-text-modal.component.html',
  styleUrls: ['./help-text-modal.component.scss']
})
export class HelpTextModal implements OnInit, CloseGuard {
  
  constructor(
    public dialog: DialogRef<HelpTextModalContext>,
  ) {
    dialog.setCloseGuard(this);
  }
  ngOnInit() {
  
  }
  
  dismissModal() {
    this.dialog.dismiss();
  }
}