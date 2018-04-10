import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-single-checkbox-filter',
  templateUrl: './single-checkbox-filter.component.html',
})
export class SingleCheckboxFilterComponent {
  @Input() title: string;
  @Input() control: FormControl;
  @Input() className = '';
}
