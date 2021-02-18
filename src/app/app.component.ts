import { Component, OnInit } from '@angular/core';
import { LoadingService } from './services/loading.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  public loading: boolean;

  private unsubscribe = new Subject();
  
  constructor(
    private loadingSrv: LoadingService
  ) {}

  ngOnInit() {

    this.loadingSrv.status.pipe(takeUntil(this.unsubscribe))
      .subscribe(status => {
        this.loading = status;
      });

  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}