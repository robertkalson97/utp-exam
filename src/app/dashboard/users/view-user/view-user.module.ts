import { NgModule } from '@angular/core';

import { ViewUserComponent } from './view-user.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ViewUserComponent
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ViewUserComponent ]
})
export class ViewUserModule {
}