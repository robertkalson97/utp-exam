import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { isArray } from 'lodash';

export class OrderFlagModalContext extends BSModalContext {
  public flagged_comment: FlaggedComment[];
}

export interface FlaggedComment {
  comment: string;
  user_id: string;
  user_name: string;
  date: string;
}

@Component({
  selector: 'app-order-flag-modal',
  templateUrl: './order-flag-modal.component.html',
  styleUrls: ['./order-flag-modal.component.scss'],
})
export class OrderFlagModalComponent implements ModalComponent<OrderFlagModalContext> {
  context;
  public comments: FlaggedComment[];
  public form: FormGroup;

  constructor(
    public dialog: DialogRef<OrderFlagModalContext>,
  ) {
    this.context = dialog.context;
    this.comments = isArray(this.context.flagged_comment) ? this.context.flagged_comment : [];
    this.form = new FormGroup({
      comment: new FormControl('', [Validators.required, Validators.maxLength(280)])
    });
  }

  get commentControl() {
    return this.form.get('comment');
  }

  dismissModal() {
    this.dialog.dismiss();
  }

  onSubmit() {
    if (this.form.valid) {
      this.dialog.close(this.form.value);
    }
  }
}
