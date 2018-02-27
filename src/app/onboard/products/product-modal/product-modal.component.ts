import { Component, Output } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export class ProductModalContext extends BSModalContext {
  // public num1: number;
  // public num2: number;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'app-product-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.scss']
})
export class ProductModal implements CloseGuard, ModalComponent<ProductModalContext> {
  context: ProductModalContext;
  location: any = {};
  selectTypes: any;
  selectStates: any;
  selectedType = '';
  selectedState = '';
  typeDirty: boolean = false;
  stateDirty: boolean = false;
  
  uploadedImage;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };
  
  constructor(public dialog: DialogRef<ProductModalContext>) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }
  
  closeModal() {
    this.dialog.close();
  }
  
  // beforeDismiss(): boolean {
  //   return true;
  // }
  //
  // beforeClose(): boolean {
  //   return true;
  // }
  
  changeState() {
    this.stateDirty = true;
  }
  
  changeType() {
    this.typeDirty = true;
  }
  
  // upload by input type=file
  changeListener($event): void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    var file: File = inputValue.files[0];
    var myReader: FileReader = new FileReader();
    
    myReader.onloadend = (e) => {
      this.uploadedImage = myReader.result;
    };
    myReader.readAsDataURL(file);
  }
  
  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  
  onFileDrop(file: File): void {
    this.uploadedImage = file;
  }
  
  onSubmit() {
    console.log('added onSubmit for tslint');
  }
}
