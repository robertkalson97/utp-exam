import { NgModule } from '@angular/core';
import { AppSharedModule } from '../../../../shared/shared.module';

import { ReceiveItemComponent } from './receive-item.component';

@NgModule({
  declarations: [ReceiveItemComponent],
  exports: [ReceiveItemComponent],
  imports: [AppSharedModule],
  providers: []
})
export class ReceiveItemModule {

}
