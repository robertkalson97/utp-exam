import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared/shared.module';
import { AssetsComponent } from './assets.component';

@NgModule({
  declarations: [
    AssetsComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class AssetsModule {
}