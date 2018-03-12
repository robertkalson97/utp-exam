import { NgModule } from '@angular/core';
import { ConfirmModalService } from './confirm-modal.service';
import { ConfirmModalComponent } from './confirm-modal.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ConfirmModalComponent],
  entryComponents: [ConfirmModalComponent],
  imports: [
    CommonModule,
  ],
  providers: [ConfirmModalService],
})
export class ConfirmModalModule {

}
