import { DestroyRef, inject, Injectable } from '@angular/core';
import { WorkerDto, WorkerOfficeDto, WorkerPostDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import { WorkerService } from '../worker.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of } from 'rxjs';
import { Office } from '@models/office-dtos';
import { OfficeService } from '@services/office.service';

@Injectable({
  providedIn: 'root'
})
export class OfficeStateService {
  private offices: Observable<Office[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private officeService: OfficeService
  ) {
    this.offices = this.loadOffices();
  }

  getOffices() {
    return this.offices;
  }

  private loadOffices(): Observable<Office[] | null> {
    return this.officeService.getOffice()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      );
  }
}
