import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of } from 'rxjs';
import { Office } from '@models/office-dtos';
import { WorkerService } from '@services/worker.service';
import { WorkerWithPostDto } from '@models/workers-dtos';
import { OfficeService } from '@services/office.service';

@Injectable({
  providedIn: 'root'
})
export class OfficeStateService {
  protected office!: Office | null;
  protected workers!: Observable<WorkerWithPostDto[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private workerService: WorkerService,
    private officeService: OfficeService,
  ) { }

  setOffice(office: Office) {
    this.office = office;
  }

  setName(office: Office) {
    if (!this.office) {
      return;
    }
    this.putOffice(office);
    this.office.name = office.name;
  }

  setAddress(office: Office) {
    if (!this.office) {
      return;
    }
    this.putOffice(office);
    this.office.address = office.address;
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

  deleteOffice() {
    if (!this.office) {
      return;
    }
    this.officeService.deleteOffice(this.office.id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при обновлении должности работника", error);
          return of([]);
        })
      )
      .subscribe();
    this.office = null;
  }

  private putOffice(office: Office) {
    if (!this.office) {
      return;
    }
    this.officeService.putOffice(this.office.id, office)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при обновлении должности работника", error);
          return of([]);
        })
      )
      .subscribe();
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
