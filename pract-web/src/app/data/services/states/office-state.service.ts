import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of } from 'rxjs';
import { Office } from '@models/office-dtos';
import { WorkerService } from '@services/worker.service';
import { WorkerWithPostDto } from '@models/workers-dtos';

@Injectable({
  providedIn: 'root'
})
export class OfficeStateService {
  protected office!: Office | null;
  protected workers!: Observable<WorkerWithPostDto[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private workerService: WorkerService,
  ) { }

  setOffice(office: Office) {
    this.office = office;
  }

  getOffice() {
    return this.office;
  }

  getWorkersInOffices() {
    if (!this.office) {
      return;
    }
    this.workers = this.getWorkersInOffice(this.office.id);
    return this.workers;
  }

  private getWorkersInOffice(id: string): Observable<WorkerWithPostDto[] | null> {
    return this.workerService.getWorkersInOffice(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при обновлении должности работника", error);
          return of([]);
        })
      );
  }
}
