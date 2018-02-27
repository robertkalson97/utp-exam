import { Injectable } from '@angular/core';
import { toast } from 'angular2-materialize';

@Injectable()
export class ToasterService {
  constructor(
  ) {
  }
  pop(type, body){
    let classes = '';
    switch (type) {
      case 'error':
        classes = 'red darken-4';
        break;
      default:
        classes = 'white-text green accent-4';
    }
    toast(body, 5000, classes);
  }
}
