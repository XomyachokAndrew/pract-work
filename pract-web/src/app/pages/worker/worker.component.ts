import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiScrollable, TuiScrollbar } from '@taiga-ui/core';
import { PostService } from '@services/post.service';
import { OfficeService } from '@services/office.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of } from 'rxjs';
import { PostHistoryDto } from '@models/post-dtos';
import { OfficeHistoryDto } from '@models/office-dtos';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-worker',
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    TuiScrollable,
    TuiScrollbar,
    TuiTable,
    DatePipe,
    AsyncPipe,
  ],
  templateUrl: './worker.component.html',
  styleUrl: './worker.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkerComponent implements OnInit {
  protected worker!: WorkerWithDetailsDto;
  protected postHistories!: Observable<PostHistoryDto[]>;
  protected officeHistories!: Observable<OfficeHistoryDto[]>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: Router,
    private postService: PostService,
    private officeService: OfficeService
  ) { }

  ngOnInit(): void {
    this.worker = history.state.worker;
    this.loadHistory(this.worker.id);
  }

  async loadHistory(workerId: string) {
    this.postHistories = this.loadPostHistory(workerId);
    this.officeHistories = this.loadOfficeHistory(workerId);
  }

  loadPostHistory(id: string): Observable<PostHistoryDto[]> {
    return this.postService.getHistoryPostForWorker(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке истории должностей", error);
          return of([]);
        })
      );
  }

  loadOfficeHistory(id: string): Observable<OfficeHistoryDto[]> {
    return this.officeService.getHistoryOfficeForWorker(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке истории офисов", error);
          return of([]);
        })
      );
  }
}
