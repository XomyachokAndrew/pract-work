import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
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
import { catchError, Observable, of } from 'rxjs';
import { PostHistoryDto } from '@models/post-dtos';
import { OfficeHistoryDto } from '@models/office-dtos';
import { AsyncPipe, DatePipe } from '@angular/common';
import { EditNameModalComponent } from '@components/modals/edit-name-modal/edit-name-modal.component';
import { EditPostModalComponent } from '@components/modals/edit-post-modal/edit-post-modal.component';
import { WorkerStateService } from '@services/states/worker-state.service';
import { EditOfficeModalComponent } from '@components/modals/edit-office-modal/edit-office-modal.component';

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
    private cdr: ChangeDetectorRef,
    private workerStateService: WorkerStateService,
  ) { }

  ngOnInit(): void {
    const worker = this.workerStateService.getWorker();
    if (!worker) {
      this.route.navigate(['workers']);
      return;
    }
    this.worker = worker;
    
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

  private readonly dialogName = tuiDialog(EditNameModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Редактирование работника`,
  });

  private readonly dialogPost = tuiDialog(EditPostModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Редактирование работника`,
  });

  private readonly dialogOffice = tuiDialog(EditOfficeModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Редактирование работника`,
  });

  onChange(obj: string) {
    console.log(obj);

    switch (obj) {
      case 'name':
        this.changeName();
        break;
      case 'post':
        this.changePost();
        break;
      case 'office':
        this.changeOffice();
        break;
      default:
        break;
    }

  }

  changeName() {
    this.dialogName(this.worker.name)
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
            this.workerStateService.setWorkerName(this.worker.id, data);
            const worker = this.workerStateService.getWorker();
            if (!worker) {
              return;
            } 
            this.worker = worker;
            this.cdr.markForCheck();
          }
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }

  changePost() {
    this.dialogPost(this.worker)
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
            this.workerStateService.setWorkerPost(data);
            const worker = this.workerStateService.getWorker();
            if (!worker) {
              return;
            } 
            this.worker = worker;
            this.postHistories = this.loadPostHistory(this.worker.id);
            this.cdr.markForCheck();
          }
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }

  changeOffice() {
    this.dialogOffice(this.worker)
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
            this.workerStateService.setWorkerOffice(data);
            const worker = this.workerStateService.getWorker();
            if (!worker) {
              return;
            } 
            this.worker = worker;
            this.officeHistories = this.loadOfficeHistory(this.worker.id);
            this.cdr.markForCheck();
          }
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }
}
