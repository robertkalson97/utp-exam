import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-price-filter',
  templateUrl: './price-filter.component.html',
})
export class PriceFilterComponent {

  @Input() title: string;
  @Input() maxPrice: FormControl;
  @Input() minPrice: FormControl;

}
