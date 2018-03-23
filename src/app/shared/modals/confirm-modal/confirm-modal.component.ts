import { Component } from '@angular/core';
import { DialogRef, ModalComponent } from 'angular2-modal';
import { ConfirmModalContext } from './confirm-modal-context';


@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements ModalComponent<ConfirmModalContext> {
  context: ConfirmModalContext;

  constructor(
    public dialog: DialogRef<ConfirmModalContext>,
  ) {
    this.context = dialog.context;
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  closeModal(data) {
    this.dialog.close(data);
  }
}
