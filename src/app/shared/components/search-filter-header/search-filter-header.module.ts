import { NgModule } from '@angular/core';
import { SearchFilterHeaderComponent } from './search-filter-header.component';
import { AppSharedModule } from '../../shared.module';

@NgModule({
  declarations: [
    SearchFilterHeaderComponent,
  ],
  exports: [SearchFilterHeaderComponent],
  imports: [AppSharedModule],
  providers: [],
})
export class SearchFilterHeaderModule {

}
