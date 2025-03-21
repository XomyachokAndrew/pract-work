import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { OfficeCardComponent } from "../../data/components/cards/office-card/office-card.component";
import { LoadingComponent } from "../../data/components/loading/loading.component";
import { CommonModule } from '@angular/common';
import { OfficesStateService } from '@services/states/offices-state.service';
import { catchError, Observable, of } from 'rxjs';
import { Office, OfficeDto, OfficeWithoutId } from '@models/office-dtos';
import { TuiButton, tuiDialog } from '@taiga-ui/core';
import { AddOfficeModalComponent } from '@components/modals/add-office-modal/add-office-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-offices',
  imports: [OfficeCardComponent, LoadingComponent, CommonModule, TuiButton],
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.less'
})
export class OfficesComponent {
  protected offices!: Observable<Office[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private officesStateService: OfficesStateService,
    private cdr: ChangeDetectorRef
  ) {
    const offices = this.officesStateService.getOffices();
    this.offices = offices;
  }
  private readonly dialog = tuiDialog(AddOfficeModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Добавление офиса`,
  });

  addOffice() {
    const office: OfficeWithoutId = {
      name: '',
      address: '',
    };

    this.dialog(office)
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
            this.officesStateService.addOffice(data);
            const offices = this.officesStateService.getOffices();
            console.log('');
            this.offices = offices;
            this.cdr.markForCheck();
          }
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }
}
