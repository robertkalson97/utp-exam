import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../../shared/shared.module';
import { ReceiveAddNewStatusItemComponent } from './receive-add-new-status-item.component';

@NgModule({
  declarations: [ReceiveAddNewStatusItemComponent],
  exports: [ReceiveAddNewStatusItemComponent],
  imports: [AppSharedModule],
  providers: []
})
export class ReceiveAddNewStatusItemModule {

}
