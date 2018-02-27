import { Injectable } from '@angular/core';
import { Modal } from 'angular2-modal/plugins/bootstrap';
import { ModalWindowService } from '../../../core/services/modal-window.service';
import { ConfirmModalComponent, ConfirmModalContext } from './confirm-modal.component';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfirmModalService {
  
  constructor(
    public modal: Modal,
    public modalWindowService: ModalWindowService,
  ) {
  }
  
  confirmModal(title, content: any = ''): Observable<{success?: boolean, canceled?: boolean}> {
    const data: ConfirmModalContext = new ConfirmModalContext(title, content);
    
    return Observable.fromPromise(
      this.modal.open(ConfirmModalComponent, this.modalWindowService.overlayConfigFactoryWithParams(data, true))
    )
    .switchMap(({result}) =>
      Observable.fromPromise(result)
      .catch(() => {
        return Observable.of({canceled: true});
      })
    );
    }
  
}
