import { Component, OnInit } from '@angular/core';

import { DialogRef, ModalComponent } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ngx-destroy-subscribers';
import { UserService } from '../../../core/services/user.service';
import { ToasterService } from '../../../core/services/toaster.service';

export class InviteUserModalContext extends BSModalContext {
}

@Component({
  selector: 'app-invite-user-modal',
  templateUrl: './invite-user-modal.component.html',
  styleUrls: ['./invite-user-modal.component.scss']
})
@DestroySubscribers()
export class InviteUserModal implements OnInit, ModalComponent<InviteUserModalContext> {
  context: InviteUserModalContext;
  email:string;
  name:string;
  efoc:boolean = true;
  nfoc:boolean = true;

  private subscribers: any = {};

  constructor(
      public dialog: DialogRef<InviteUserModalContext>,
      public userService: UserService,
      public toasterService: ToasterService
  ) {}

  ngOnInit(){
  }

  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }

  invite(){
    this.subscribers.inviteSubscribtion = this.userService.inviteUser(this.name,this.email)
    .subscribe((res:any)=>{
      this.toasterService.pop("", res.message);
      this.dismissModal();
    },(err:any)=>{
    })
  }
}
