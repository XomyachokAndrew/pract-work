import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkerDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import { WorkerService } from '@services/worker.service';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkersStateService {
  private workers: Observable<WorkerWithDetailsDto[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private workerService: WorkerService
  ) {
    this.workers = this.loadWorkers();
  }

  getWorkers(): Observable<WorkerWithDetailsDto[] | null> {
    this.workers = this.loadWorkers();
    return this.workers;
  }

  private loadWorkers(): Observable<WorkerWithDetailsDto[] | null> {
    return this.workerService.getWorkers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      );
  }

  addWorker(worker: WorkerDto) {
    this.workerService.postWorker(worker)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      )
      .subscribe();
  }
}
