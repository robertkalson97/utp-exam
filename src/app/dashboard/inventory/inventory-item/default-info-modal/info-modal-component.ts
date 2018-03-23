import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class InfoModalContext extends BSModalContext {
  public text: any;
}


@Component({
  selector: 'app-info-modal',
  templateUrl: './info-modal.component.html',
  styleUrls: ['./info-modal.component.scss']
})
export class InfoModal implements OnInit, ModalComponent<InfoModalContext> {
  context;
  constructor(
    public dialog: DialogRef<InfoModalContext>,
  ) {
    this.context = dialog.context.text;
  }

  ngOnInit() {}
  
  dismissModal() {
    this.dialog.dismiss();
  }
}