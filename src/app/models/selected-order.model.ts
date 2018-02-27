export class selectedOrderModel {
  order_id: number = null;
  items_ids: any[] = [];
  
  constructor(obj?:any) {
    for (let field in obj) {
      if (typeof this[field] !== 'undefined') {
        this[field] = obj && obj[field];
      }
    }
  }
}
