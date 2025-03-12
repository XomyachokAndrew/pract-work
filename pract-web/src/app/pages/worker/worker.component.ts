import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import {
  CdkFixedSizeVirtualScroll,
  CdkVirtualForOf,
  CdkVirtualScrollViewport,
} from '@angular/cdk/scrolling';
import { } from '@angular/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiButton, tuiDialog, TuiScrollable, TuiScrollbar } from '@taiga-ui/core';
import { PostService } from '@services/post.service';
import { OfficeService } from '@services/office.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, isObservable, Observable, of } from 'rxjs';
import { PostHistoryDto } from '@models/post-dtos';
import { OfficeHistoryDto } from '@models/office-dtos';
import { AsyncPipe, DatePipe } from '@angular/common';
import { EditWorkerModalComponent } from '@components/edit-worker-modal/edit-worker-modal.component';
import { WorkerService } from '@services/worker.service';

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
    TuiButton
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
    private officeService: OfficeService,
    private workerService: WorkerService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    if (!history.state.worker) {
      this.route.navigate(['workers']);
      return;
    }
    this.worker = history.state.worker;
    this.loadHistory(this.worker.id);
  }

  /**
   * Метод получающй историю определенного работника
   * @param workerId Уникальный индетификатор работника
   */
  async loadHistory(workerId: string) {
    this.postHistories = this.loadPostHistory(workerId);
    this.officeHistories = this.loadOfficeHistory(workerId);
  }

  /**
   * Метод получающй историю должностей определенного работника
   * @param id Уникальный индетификатор работника
   * @returns История должностей
   */
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

  /**
   * Метод получающй историю офисов определенного работника
   * @param id Уникальный индетификатор работника
   * @returns История офисов
   */
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

  private readonly dialog = tuiDialog(EditWorkerModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Редактирование работника`,
  });

  onChange() {
    this.dialog(this.worker.name)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке модального окна", error);
          return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          console.info(`Dialog emitted data = ${data}`);
          if (Array.isArray(data)) {
            // Обработка случая, когда data является массивом
            console.error('Received an array instead of WorkerDto');
          } else if (data) {
            const workerName: WorkerDto = data;
            this.putWorker(workerName);
            history.state.worker.name = workerName;
            this.worker = history.state.worker;
            this.cdr.markForCheck();
          }
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }

  putWorker(workerName: WorkerDto) {
    this.workerService.putWorker(this.worker.id, workerName).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error("Ошибка при обновлении имени работника", error);
        return of([]);
      })
    )
    .subscribe();
  }
}
