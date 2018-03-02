import { NgModule } from '@angular/core';

import { ReceiveComponent } from './receive.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ReceiveItemModule } from './receive-item/receive-item.module';
import { ReceiveService } from './receive.service';

@NgModule({
  declarations: [
    ReceiveComponent,

  ],
  imports: [
    AppSharedModule,
    FormsModule,
    ReactiveFormsModule,
    ReceiveItemModule,
  ],
  providers: [ReceiveService],
})
export class ReceiveModule {

}
