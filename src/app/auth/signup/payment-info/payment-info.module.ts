import { NgModule } from '@angular/core';

import { PaymentInfoComponent } from './payment-info.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    PaymentInfoComponent,
    
  ],
  imports: [
    AppSharedModule,
  ],
  providers: []
})
export class PaymentInfoModule {
}