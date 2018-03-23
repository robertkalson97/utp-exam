import { NgModule } from '@angular/core';
import { SearchFilterComponent } from './search-filter.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    SearchFilterComponent,
  ],
  exports: [SearchFilterComponent],
  imports: [AppSharedModule],
  providers: [],
})
export class SearchFilterModule {

}
