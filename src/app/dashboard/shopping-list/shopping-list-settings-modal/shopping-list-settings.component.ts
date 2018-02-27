import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Rx';
import * as _ from 'lodash';

import { UserService, AccountService } from '../../../core/services/index';

export class ShoppingListSettingsModalContext extends BSModalContext {
  public product: any;
}

@Component({
  selector: 'app-shopping-list-settings-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  templateUrl: './shopping-list-settings.component.html',
  styleUrls: ['./shopping-list-settings.component.scss']
})
@DestroySubscribers()
export class ShoppingListSettingsModal implements OnInit, CloseGuard, ModalComponent<ShoppingListSettingsModalContext> {
  public subscribers: any = {};
  context: ShoppingListSettingsModalContext;
  public settings:any = {'priority':1, 'vendor':'', 'only':false};
  public priorityMargin: string;


  constructor(
      public dialog: DialogRef<ShoppingListSettingsModalContext>,
      public userService: UserService,
      public accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
    this.calcPriorityMargin(1);
  }
  
  changePriority(event){
    let value = event.target.value;
    this.calcPriorityMargin(value);
  }
  
  calcPriorityMargin(value){
    let fixer: number = -16;
    this.priorityMargin = 'calc(' + (value-1)*100/9 + '% + ' + fixer + 'px)';
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
}
