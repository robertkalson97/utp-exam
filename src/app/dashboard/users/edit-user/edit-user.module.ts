import { NgModule } from '@angular/core';

import { EditUserComponent } from './edit-user.component';
import { AppSharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    EditUserComponent,
  ],
  imports: [
    AppSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [

  ],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ EditUserComponent ]
})
export class EditUserModule {
}