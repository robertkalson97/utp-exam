import { NgModule } from '@angular/core';

import { InviteComponent } from './invite.component';
import { AppSharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    InviteComponent,
  ],
  imports: [
    AppSharedModule
  ],
  providers: []
})
export class InviteModule {
}