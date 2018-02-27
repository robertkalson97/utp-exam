import { NgModule } from '@angular/core';

import { LocationsComponent } from './locations.component';
import { AppSharedModule } from '../../shared/shared.module';
import { ViewLocationModule } from './view-location/view-location.module';
import { EditLocationModule } from './edit-location/edit-location.module';


@NgModule({
  declarations: [
    LocationsComponent,
  ],
  imports: [
    AppSharedModule,
    ViewLocationModule,
    EditLocationModule
  ],
  providers: [],
})
export class LocationsModule {
}