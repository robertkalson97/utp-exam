import { NgModule } from '@angular/core';
import { ConfirmModalService } from './confirm-modal.service';
import { ConfirmModalComponent } from './confirm-modal.component';

@NgModule({
  declarations: [ConfirmModalComponent],
  entryComponents: [ConfirmModalComponent],
  imports: [],
  providers: [ConfirmModalService],
})
export class ConfirmModalModule {

}
