import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  public loading: boolean;

  private unsubscribe = new Subject();

  constructor(
    private loadingSrv: LoadingService,
  ) { }

  ngOnInit() {
    this.initLoading();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  private initLoading() {
    this.loadingSrv.status.pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.loading = status;
      });
  }

}