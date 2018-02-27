import { NgModule } from '@angular/core';

import { OnboardUsersComponent } from './users.component';
import { AppSharedModule } from '../../shared/shared.module';

// import { EditUserModalModule } from '../../shared/modals/index';

@NgModule({
  declarations: [
    OnboardUsersComponent
  ],
  imports: [
    AppSharedModule,
    // EditUserModalModule
  ],
  providers: []
})
export class OnboardUsersModule {
}