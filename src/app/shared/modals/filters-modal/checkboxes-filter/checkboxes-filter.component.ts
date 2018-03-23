import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as _ from 'lodash';

export const CHECKBOXES_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CheckboxesFilterComponent),
  multi: true,
};

@Component({
  selector: 'app-checkboxes-filter',
  templateUrl: './checkboxes-filter.component.html',
  providers: [CHECKBOXES_VALUE_ACCESSOR],
})
export class CheckboxesFilterComponent implements ControlValueAccessor {

  onChange;
  onTouched;
  public selectedItemsArr: string[] = [];
  @Input() title: string;
  @Input() collection: string;
  @Input() classCol: string = '';

  writeValue(value: any): void {

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  change(event) {
    const isSelectedItem = _.find(this.selectedItemsArr, (el) => el === event.target.value);
      if (event.target.checked && !isSelectedItem) {
        this.selectedItemsArr = [...this.selectedItemsArr, event.target.value];
      } else {
        if (isSelectedItem) {
          _.remove(this.selectedItemsArr, (el) => el === event.target.value);
        }
      }
    this.onChange(this.selectedItemsArr);
  }

}
