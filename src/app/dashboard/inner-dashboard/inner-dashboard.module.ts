import { NgModule } from '@angular/core';

import { InnerDashboardComponent } from './inner-dashboard.component';
import { AppSharedModule } from '../../shared/shared.module';
import { NewsModalModule } from './news-modal/news-modal.module';

@NgModule({
  declarations: [
    InnerDashboardComponent
  ],
  imports: [
    AppSharedModule,
    NewsModalModule
  ],
  providers: []
})
export class InnerDashboardModule {
}