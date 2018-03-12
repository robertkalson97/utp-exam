import { Injectable } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ConfirmModalComponent } from './confirm-modal.component';
import { Observable } from 'rxjs/Observable';
import { ConfirmButton, ConfirmModalContext } from './confirm-modal-context';

export interface ConfirmResponse {
  success?: boolean;
  canceled?: boolean;
  data?: string;
}

@Injectable()
export class ConfirmModalService {

  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
  ) {
  }

  confirmModal(title: string, text: string = '', btns: ConfirmButton[]): Observable<ConfirmResponse> {
    const context: ConfirmModalContext = new ConfirmModalContext(title, text, btns);

    return Observable.fromPromise(
      this.modal.open(ConfirmModalComponent, this.modalWindowService.overlayConfigFactoryWithParams(context, true))
    )
    .switchMap(({result}) =>
      Observable.fromPromise(result)
      .map((data) => ({success: true, data}))
      .catch(() => {
        return Observable.of({canceled: true});
      })
    );
  }

}
