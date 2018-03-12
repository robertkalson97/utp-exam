import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MaterializeModule } from "angular2-materialize";
import { FileDropModule } from 'angular2-file-drop';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';


import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';

// import { CoreModule } from "../core/core.module";

import { IterablePipe } from "./pipes/iterable/iterable.pipe";
import { InputValueSearch } from "./pipes/input-value-search/input-value-search.pipe";
import * as directives from "./index";
import { TextMaskModule } from 'angular2-text-mask';
import { AgmCoreModule } from "angular2-google-maps/core";
import { GooglePlacesInputModule, HasClassModule } from "./directives";

let directivesArr = [
  directives.IntlPhoneMaskDirective,
  directives.UserDropdownMenuDirective,
];


let pipesArr = [
  IterablePipe,
  InputValueSearch,
];

// resolvers
import {
  MAIN_RESOLVER_PROVIDERS,
  ACCOUNT_RESOLVER_PROVIDERS
} from './resolves/index';

// modals
import { EditUserModal } from './modals/edit-user-modal/edit-user-modal.component';
import { EditLocationModal } from './modals/edit-location-modal/edit-location-modal.component';
import { ChangePasswordUserModal } from "./modals/change-password-user-modal/change-password-user-modal.component";
import { EditCommentModal } from "./modals/edit-comment-modal/edit-comment-modal.component";
import { UniConfirmModal } from './modals/uni-confirm-modal/uni-confirm-modal.component';
import { APP_DI_CONFIG } from '../../../env';
import { NguiAutoCompleteModule } from '@ngui/auto-complete';
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AddVendorModalComponent } from './modals/add-vendor-modal/add-vendor-modal.component';
import { ChipsInputModule } from './components/chips-input/chips-input.module';
import { ChipsModule } from './components/chips/chips.module';

const modalsArr = [
  EditUserModal,
  EditLocationModal,
  ChangePasswordUserModal,
  EditCommentModal,
  UniConfirmModal,
  AddVendorModalComponent,
];

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  //suppressScrollX: true
};

@NgModule({
  imports: [
    BootstrapModalModule,
    ModalModule,

    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,

    MaterializeModule,
    FileDropModule,
    TextMaskModule,
    Angular2FontawesomeModule,
    AgmCoreModule.forRoot({
      apiKey: APP_DI_CONFIG.googlePlaces.apiKey,
      libraries: ["places"]
    }),
    GooglePlacesInputModule,
    NguiAutoCompleteModule,
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
  ],
  declarations: [
    ...directivesArr,
    ...pipesArr,
    ...modalsArr,
  ],
  exports: [
    BootstrapModalModule,
    ModalModule,

    RouterModule,

    FormsModule,
    CommonModule,
    ReactiveFormsModule,

    MaterializeModule,
    FileDropModule,
    TextMaskModule,
    Angular2FontawesomeModule,
    GooglePlacesInputModule,
    NguiAutoCompleteModule,
    PerfectScrollbarModule,

    HasClassModule,
    ChipsInputModule,
    ChipsModule,

    ...directivesArr,
    ...pipesArr,
    ...modalsArr
  ],
  providers: [
    ...MAIN_RESOLVER_PROVIDERS,
    ...ACCOUNT_RESOLVER_PROVIDERS,
  ],
  entryComponents: [
    ...modalsArr
  ]
})
export class AppSharedModule {
}
