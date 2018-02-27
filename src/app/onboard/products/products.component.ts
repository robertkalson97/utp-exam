import { Component, OnInit, ElementRef, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Overlay, overlayConfigFactory } from 'angular2-modal';
import { Modal, BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { ProductModal } from './product-modal/product-modal.component';
import { ModalWindowService } from "../../core/services/modal-window.service";
// import { UserModel } from '../../models/index';
// import { UserService } from '../../core/services/index';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  searchText: string = '';

  constructor(
      public router: Router,
      public modal: Modal,
      public modalWindowService: ModalWindowService
  ) {
  }

  ngOnInit() {
  }

  viewProductModal(){
    this.modal.open(ProductModal, this.modalWindowService.overlayConfigFactoryWithParams({ location: location }));
  }
  
  goBack(){
    this.router.navigate(['/onboard','users']);
  }
  
  goNext(){
    this.router.navigate(['/onboard','vendors']);
  }

  onSubmit(){

  }

}
