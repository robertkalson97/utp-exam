import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class HelpTextModalContext extends BSModalContext {
  public text: any;
}


@Component({
  selector: 'app-help-text-modal',
  templateUrl: './help-text-modal.component.html',
  styleUrls: ['./help-text-modal.component.scss']
})
export class HelpTextModal implements OnInit {
  constructor(
    public dialog: DialogRef<HelpTextModalContext>,
  ) {}

  ngOnInit() {}

  dismissModal() {
    this.dialog.dismiss();
  }
}