import { OnDestroy } from "@angular/core";

import { Subject, Subscription } from "rxjs";

export class AutoUnsubscribe implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private subjects: Subject<any>[] = [];

  ngOnDestroy() {
    this.unsubscribeAll();
    this.completeAll();
  }

  protected addSubscription(...subs: Subscription[]) {
    subs.filter((sub) => sub != null).forEach((sub) => this.subscriptions.push(sub));
  }

  protected addSubjects(...subs: Subject<any>[]) {
    subs.filter((sub) => sub != null).forEach((sub) => this.subjects.push(sub));
  }

  private unsubscribeAll() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions = [];
  }

  private completeAll() {
    this.subjects.forEach((sub) => sub.complete());
    this.subjects = [];
  }
}
