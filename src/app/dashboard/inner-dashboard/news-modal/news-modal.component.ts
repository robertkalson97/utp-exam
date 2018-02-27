import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { UserService } from '../../../core/services/user.service';

export class NewsModalContext extends BSModalContext {
  text:string;
}

@Component({
  selector: 'news-modal',
  templateUrl: './news-modal.component.html',
  styleUrls: ['./news-modal.component.scss']
})
export class NewsModal implements OnInit, CloseGuard, ModalComponent<NewsModalContext> {
  context: NewsModalContext;
  
  constructor(
      public dialog: DialogRef<NewsModalContext>,
      public userService: UserService,
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
  }

  ngOnInit(){
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
  
}
