import { NgModule } from '@angular/core';
import { UpdateStockModal } from './update-stock-modal.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    UpdateStockModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ UpdateStockModal ]
})
export class UpdateStockModalModule {}
