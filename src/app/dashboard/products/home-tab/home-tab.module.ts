import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { HomeTabComponent } from './home-tab.component';

@NgModule({
  declarations: [
    HomeTabComponent,
  ],
  exports: [HomeTabComponent],
  imports: [
    AppSharedModule,
  ],
  providers: [],
})
export class HomeTabModule {

}
