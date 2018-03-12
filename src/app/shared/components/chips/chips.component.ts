import { Component, EventEmitter, Input, Output } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class ChipsComponent {
  public _chips: string[];

  @Input()
  set chips(value: string[]) {
    this._chips = _.isArray(value) ? _.uniq(value) : [];
  }

  @Output() chipsChange: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Output() chipDelete: EventEmitter<string> = new EventEmitter<string>();

  onChipDelete(chip) {
    this._chips = _.without(this._chips, chip);
    this.chipDelete.emit(chip);
    this.chipsChange.emit(this._chips);
  }

}
