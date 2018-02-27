import { Component } from '@angular/core';

import { StateService } from '../core/services/state.service';

@Component({
  selector: 'app-onboard',
  styleUrls: [ './onboard.style.scss' ],
  templateUrl: './onboard.template.html'
})
export class OnboardComponent {

  constructor(
      public stateService: StateService
  ) {
  }

}
