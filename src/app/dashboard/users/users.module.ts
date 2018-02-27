import { NgModule } from '@angular/core';

import { UsersComponent } from './users.component';
import { AppSharedModule } from '../../shared/shared.module';

import { ViewUserModule } from './view-user/view-user.module';
import { EditUserModule } from './edit-user/edit-user.module';
import { InviteUserModalModule } from './invite-user-modal/invite-user-modal.module';

@NgModule({
  declarations: [
    UsersComponent,
  ],
  imports: [
    AppSharedModule,
    ViewUserModule,
    EditUserModule,
    InviteUserModalModule
  ],
  providers: [],
})
export class UsersModule {
}