export function DefaultOptions (params:any){
  return function (target: any) {
    params.childClassName = target.name;
    target.prototype.defaultOptions = params;
    return target;
  }
}