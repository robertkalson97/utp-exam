import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../../shared/shared.module';
import { OrderTableComponent } from './order-table.component';
import { OrderTableHeaderActionComponent } from './components/order-table-header-action.component';
import { OrderTableItemActionComponent } from './components/order-table-item-action/order-table-item-action.component';
import { OrderTableResetService } from './order-table-reset.service';
import { AddCommentModalModule } from '../../../../shared/modals/add-comment-modal/add-comment-modal.module';


@NgModule({
  declarations: [
    OrderTableComponent,
    OrderTableHeaderActionComponent,
    OrderTableItemActionComponent,
  ],
  exports: [OrderTableComponent],
  imports: [
    AppSharedModule,
    AddCommentModalModule,
  ],
  providers: [
    OrderTableResetService,
  ],
})
export class OrderTableModule {

}
