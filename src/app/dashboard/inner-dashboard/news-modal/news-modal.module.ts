import { NgModule } from '@angular/core';

import { AppSharedModule } from '../../../shared/shared.module';
import { NewsModal } from './news-modal.component';

@NgModule({
  declarations: [
    NewsModal
  ],
  imports: [
    AppSharedModule
  ],
  providers: [],
  entryComponents: [ NewsModal ]
})
export class NewsModalModule {
}