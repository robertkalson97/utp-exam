import { Component } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { ConfirmModalContext } from './confirm-modal-context';


@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements CloseGuard, ModalComponent<ConfirmModalContext> {
  context: ConfirmModalContext;

  constructor(
    public dialog: DialogRef<ConfirmModalContext>,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }

}
