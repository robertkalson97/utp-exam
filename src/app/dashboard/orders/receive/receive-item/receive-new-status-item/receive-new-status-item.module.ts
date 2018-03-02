import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../../shared/shared.module';
import { ReceiveNewStatusItemComponent } from './receive-new-status-item.component';

@NgModule({
  declarations: [ReceiveNewStatusItemComponent],
  exports: [ReceiveNewStatusItemComponent],
  imports: [AppSharedModule],
  providers: []
})
export class ReceiveNewStatusItemModule {

}
