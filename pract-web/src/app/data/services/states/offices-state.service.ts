import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Office, OfficeDto, OfficeWithoutId } from '@models/office-dtos';
import { OfficeService } from '@services/office.service';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OfficesStateService {
  private offices: Observable<Office[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(private officeService: OfficeService) {
    this.offices = this.loadOffices();
  }

  addOffice(office: OfficeWithoutId) {
    this.officeService.addOffice(office)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      )
      .subscribe();
    this.offices = this.loadOffices();
  }

  getOffices(): Observable<Office[] | null> {
    this.offices = this.loadOffices();
    return this.offices;
  }

  private loadOffices(): Observable<Office[] | null> {
    return this.officeService.getOffices()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      );
  }
}
