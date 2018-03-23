import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../shared/shared.module';
import { ReportsComponent } from './reports.component';
import { SearchFilterModule } from '../../shared/components/search-filter/search-filter.module';
import { ReportsFilterModalModule } from './reports-filter-modal/reports-filter-modal.module';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    AppSharedModule,
    SearchFilterModule,
    ReportsFilterModalModule
  ],
  providers: []
})
export class ReportsModule {
}