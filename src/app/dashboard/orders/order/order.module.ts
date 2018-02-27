import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrderComponent } from './order.component';
@NgModule({
  declarations: [
    OrderComponent,
  ],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class OrderModule {

}