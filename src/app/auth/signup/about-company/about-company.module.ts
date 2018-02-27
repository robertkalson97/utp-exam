import { NgModule } from '@angular/core';

import { AboutCompanyComponent } from './about-company.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    AboutCompanyComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class AboutCompanyModule {
}