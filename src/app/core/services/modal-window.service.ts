import { Injectable, ViewContainerRef, ComponentRef, Injector } from '@angular/core';
import { Overlay, overlayConfigFactory, DOMOverlayRenderer, DialogRef, ModalOverlay } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { Subject } from 'rxjs/Rx';
import {
  UniConfirmModal,
  UniConfirmModalContext
} from '../../shared/modals/uni-confirm-modal/uni-confirm-modal.component';


@Injectable()
export class CustomRenderer extends DOMOverlayRenderer {
  customClass: string = 'abnormal';
  
  render(dialog: DialogRef<any>, vcRef: ViewContainerRef, injector?: Injector, size: string = 'normal'): ComponentRef<ModalOverlay> {
    let cmpRef = super.render(dialog, vcRef, injector);
    (<any>cmpRef)._viewRef.rootNodes[0].className += 'transparent-bg ' + this.customClass + '-custom-class';
    
    return cmpRef;
  }
}


@Injectable()
export class ModalWindowService {
  public scrollTop$: Subject<any> = new Subject<any>();
  public scrollTop: number;
  
  constructor(
    public modal: Modal,
    public overlay: Overlay,
    public _modalRenderer: CustomRenderer
  ) {
  }
  
  confirmModal(title, content: any = '', fn = () => {
  }) {
    let data: UniConfirmModalContext = new UniConfirmModalContext(title, content, fn);
    this.modal
    .open(UniConfirmModal, this.overlayConfigFactoryWithParams(data, true))
    .then((resultPromise) => {
      resultPromise.result.then(
        (comment) => {
        },
        (err) => {
        }
      );
    });
  }
  
  saveScrollPosition() {
    this.scrollTop = document.body.scrollTop;
    this.scrollTop$.next(document.body.scrollTop);
  }
  
  setScrollPosition() {
    document.body.scrollTop = this.scrollTop || 0;
  }
  
  customModal(vcRef: ViewContainerRef, modal, data, fn = null) {
    this.saveScrollPosition();
    this.modal
    .open(modal, overlayConfigFactory(data, BSModalContext))
    .then((resultPromise) => {
      resultPromise.result.then(
        (res) => {
          this.setScrollPosition();
          if (!fn) return;
          
          fn(res);
        },
        (err) => {
          this.setScrollPosition();
        }
      );
    });
  }
  
  overlayConfigFactoryWithParams(object, isTransparentBg = false, size: string = 'normal') {
    if (!object.keyboard) {
      Object.assign(object, {keyboard: []})
    }
    
    let o = overlayConfigFactory(object, BSModalContext);
    if (isTransparentBg) {
      this._modalRenderer.customClass = size;
      o.renderer = this._modalRenderer;
    }
    return o;
  }
}
