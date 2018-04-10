import { Pipe, PipeTransform } from '@angular/core';
import { comparator, equals, gt, prop, sort, sortBy, toLower } from 'ramda';

@Pipe({ name: 'sortProducts' })
export class SortProductsPipe implements PipeTransform {
  transform(products, value) {
    if (equals(value, 'A-Z')) {
      const ascComparator = comparator((a, b) => gt(prop('title', b), prop('title', a)));
      products = sort(ascComparator, products);
    } else {
      const desComparator = comparator((a, b) => gt(prop('title', a), prop('title', b)));
      products = sort(desComparator, products);
    }
    return products;
  }
}
