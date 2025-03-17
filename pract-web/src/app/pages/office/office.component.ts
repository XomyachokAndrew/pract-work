import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { EditNameModalComponent } from '@components/modals/edit-name-modal/edit-name-modal.component';
import { EditOfficeAddressModalComponent } from '@components/modals/edit-office-address-modal/edit-office-address-modal.component';
import { EditOfficeNameModalComponent } from '@components/modals/edit-office-name-modal/edit-office-name-modal.component';
import { Office } from '@models/office-dtos';
import { WorkerWithPostDto } from '@models/workers-dtos';
import { OfficeStateService } from '@services/states/office-state.service';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiButton, tuiDialog, TuiScrollable, TuiScrollbar } from '@taiga-ui/core';
import { catchError, Observable, of } from 'rxjs';

@Component({
  selector: 'app-office',
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    TuiScrollable,
    TuiScrollbar,
    TuiTable,
    AsyncPipe,
    TuiButton
  ],
  templateUrl: './office.component.html',
  styleUrl: './office.component.less'
})
export class OfficeComponent {
  protected office!: Office | null;
  protected workers!: Observable<WorkerWithPostDto[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private route: Router,
    private officeStateService: OfficeStateService
  ) {
    this.office = this.officeStateService.getOffice();
    const workers = this.officeStateService.getWorkersInOffices();
    if (!workers) {
      this.route.navigate(['offices']);
      return;
    }
    this.workers = workers;
  }

  private readonly dialogName = tuiDialog(EditOfficeNameModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Редактирование офиса`,
  });

  private readonly dialogAddress = tuiDialog(EditOfficeAddressModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Редактирование офиса`,
  });

  onChange(obj: string) {
    switch (obj) {
      case 'name':
        this.changeName();
        break;
      case 'address':
        this.changeAddress();
        break;
      default:
        break;
    }
  }

  changeName() {
    if (!this.office) {
      return;
    }
    this.dialogName(this.office)
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
            this.officeStateService.setName(data);
            const office = this.officeStateService.getOffice();
            if (!office) {
              return;
            }
            this.office = office;
            // this.cdr.markForCheck();
          }
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }

  changeAddress() {
    if (!this.office) {
      return;
    }
    this.dialogAddress(this.office)
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
            this.officeStateService.setAddress(data);
            const office = this.officeStateService.getOffice();
            if (!office) {
              return;
            }
            this.office = office;
            // this.cdr.markForCheck();
          }
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }

  onDelete(obj: string) {
    switch (obj) {
      case 'address':
        if (!this.office) {
          return;
        }
        this.office.address = '';
        this.officeStateService.setAddress(this.office);
        const office = this.officeStateService.getOffice();
        if (!office) {
          return;
        }
        this.office = office;
        break;
      case 'office':
        this.officeStateService.deleteOffice();
        this.route.navigate(['offices']);
        break;
      default:
        break;
    }
  }
}
