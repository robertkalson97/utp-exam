import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { MarisListTabComponent } from './maris-list-tab.component';

@NgModule({
  declarations: [
    MarisListTabComponent,
  ],
  exports: [MarisListTabComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class MarisListTabModule {

}
