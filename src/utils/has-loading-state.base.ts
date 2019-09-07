// tslint:disable: variable-name
import { ChangeDetectorRef, Input } from "@angular/core";

import { AutoUnsubscribe } from "./auto-unsubscribe.base";

export class HasLoadingState extends AutoUnsubscribe {
  @Input()
  get loading() {
    return this._loading;
  }
  set loading(value: boolean) {
    if (this._loading !== value) {
      this._loading = value;
      this._cdr.markForCheck();
    }
  }
  private _loading = this.initialLoadingState;

  constructor(protected readonly _cdr: ChangeDetectorRef, protected readonly initialLoadingState = false) {
    super();
  }
}
