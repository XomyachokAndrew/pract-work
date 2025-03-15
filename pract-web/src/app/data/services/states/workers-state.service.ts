import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WorkerDto, WorkerOfficeDto, WorkerPostDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import { WorkerService } from '@services/worker.service';
import { catchError, Observable, of } from 'rxjs';
import { WorkerStateService } from './worker-state.service';

@Injectable({
  providedIn: 'root'
})
export class WorkersStateService {
  private workers: Observable<WorkerWithDetailsDto[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private workerService: WorkerService,
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

  addWorker(worker: WorkerWithDetailsDto) {
    const workerDto: WorkerDto = {
      surname: worker.name.surname,
      firstName: worker.name.firstName,
      patronymic: worker.name.patronymic
    }
    this.workerService.postWorker(workerDto)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      )
      .subscribe({
        next: (createdWorker) => {
          if (createdWorker && createdWorker.id) {
            const workerId = createdWorker.id; // Получаем id созданного работника

            if (worker.post) {
              const workerPost: WorkerPostDto = {
                workerId: workerId, // Используем полученный id
                postId: worker.post.id
              };
              this.putPostWorker(workerPost);
            }

            if (worker.office) {
              const workerOffice: WorkerOfficeDto = {
                workerId: workerId, // Используем полученный id
                officeId: worker.office.id
              };
              this.putOfficeWorker(workerOffice);
            }
          }
        }
      });
  }

  private putPostWorker(workerPost: WorkerPostDto) {
    this.workerService.putPostWorker(workerPost)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при обновлении должности работника", error);
          return of([]);
        })
      )
      .subscribe();
  }

  private putOfficeWorker(workerOffice: WorkerOfficeDto) {
    this.workerService.putOfficeWorker(workerOffice)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при обновлении офиса работника", error);
          return of([]);
        })
      )
      .subscribe();
  }
}
