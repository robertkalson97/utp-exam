import { NgModule } from '@angular/core';

import { ShoppingListSettingsModal } from './shopping-list-settings.component';
import { AppSharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    ShoppingListSettingsModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  // IMPORTANT:
  // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
  // we must tell angular about it.
  entryComponents: [ ShoppingListSettingsModal ]
})
export class ShoppingListSettingsModalModule {
}