import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { ClosedListComponent } from './closed-list.component';
import { OrderTableModule } from '../directives/order-table/order-table.module';

@NgModule({
  declarations: [
    ClosedListComponent,
  ],
  exports: [ClosedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
})
export class ClosedListModule {

}
