import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-filter.component.html',
})
export class DateFilterComponent {

  @Input() title: string;
  @Input() className = '';
  @Input() orderedFrom: FormControl;
  @Input() orderedTo: FormControl;
}
