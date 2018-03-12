import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

export interface ConfirmButton {
  text: string;
  value: string;
  cancel?: boolean;
  red?: boolean;
}

export class ConfirmModalContext extends BSModalContext {
  public hasCancel: boolean;
  constructor(
    public title: string,
    public text: string,
    public btns: ConfirmButton[],
  ) {
    super();
    this.hasCancel = !!btns.find((btn) => btn.cancel);
  }
}
