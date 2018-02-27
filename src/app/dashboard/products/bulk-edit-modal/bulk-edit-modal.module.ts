import {NgModule} from '@angular/core';

import {  BulkEditModal } from './bulk-edit-modal.component';
import {AppSharedModule} from '../../../shared/shared.module';

@NgModule({
    declarations: [
        BulkEditModal,
    ],
    imports: [
        AppSharedModule
    ],
    providers: [],
    // IMPORTANT:
    // Since 'AdditionCalculateWindow' is never explicitly used (in a template)
    // we must tell angular about it.
    entryComponents: [BulkEditModal]
})
export class BulkEditModalModule {
}