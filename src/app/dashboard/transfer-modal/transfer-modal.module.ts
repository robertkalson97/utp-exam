import { NgModule } from '@angular/core';
import { TransferModal } from './transfer-modal.component';
import { AppSharedModule } from '../../shared/shared.module';
import { RangeSliderModule } from '../../shared/components/range-slider/range-slider.module';

@NgModule({
  declarations: [
    TransferModal
  ],
  imports: [
    AppSharedModule,
    RangeSliderModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ TransferModal ]
})
export class TransferModalModule {}
