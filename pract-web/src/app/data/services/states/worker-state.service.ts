import { DestroyRef, inject, Injectable } from '@angular/core';
import { WorkerDto, WorkerOfficeDto, WorkerPostDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import { WorkerService } from '../worker.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkerStateService {
  private worker: WorkerWithDetailsDto | null = null;
  private destroyRef = inject(DestroyRef);


  constructor(private workerService: WorkerService) { }

  setWorker(worker: WorkerWithDetailsDto): void {
    this.worker = worker;
  }

  setWorkerName(id: string, worker: WorkerDto) {
    const workerName: WorkerDto = worker;
            this.putWorker(id, workerName);
    if (this.worker) {
      this.worker.name = worker;
    }
  }

  setWorkerPost(worker: WorkerWithDetailsDto) {
    const workerPost: WorkerPostDto =
    {
      workerId: worker.id,
      postId: worker.post?.id ?? '',
    }
    this.putPostWorker(workerPost);
    if (this.worker && this.worker.post && worker.post) {
      this.worker.post.id = worker.post.id;
      this.worker.post.name = worker.post.name
    }
  }

  setWorkerOffice(worker: WorkerWithDetailsDto) {
    const workerOffice: WorkerOfficeDto =
    {
      workerId: worker.id,
      officeId: worker.office?.id ?? '',
    }
    this.putOfficeWorker(workerOffice);
    if (this.worker && this.worker.office && worker.office) {
      this.worker.office.id = worker.office.id;
      this.worker.office.name = worker.office.name
    }
  }

  getWorker(): WorkerWithDetailsDto | null {
    return this.worker;
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

  private putWorker(id: string, workerName: WorkerDto) {
    this.workerService.putWorker(id, workerName).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error("Ошибка при обновлении имени работника", error);
        return of([]);
      })
    )
      .subscribe();
  }

  clearWorker(): void {
    this.worker = null;
  }
}
