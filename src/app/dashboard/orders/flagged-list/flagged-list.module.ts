import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { OrderTableModule } from '../directives/order-table/order-table.module';
import { FlaggedListComponent } from './flagged-list.component';

@NgModule({
  declarations: [
    FlaggedListComponent,
  ],
  exports: [FlaggedListComponent],
  imports: [
    AppSharedModule,
    OrderTableModule,
  ],
  providers: [],
})
export class FlaggedListModule {

}
