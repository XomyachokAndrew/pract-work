import { NgForOf, NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Office } from '@models/office-dtos';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import { OfficeService } from '@services/office.service';
import { tuiPure, type TuiStringHandler, type TuiContext, TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiDialogContext, TuiLoader } from '@taiga-ui/core';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-edit-office-modal',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TuiButton,
    TuiDataList,
    TuiLet,
    TuiLoader,
    TuiSelectModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './edit-office-modal.component.html',
  styleUrl: './edit-office-modal.component.less'
})
export class EditOfficeModalComponent {
  protected offices!: Office[];
  private destroyRef = inject(DestroyRef);
  protected selectedOffice: Office | null = null;

  constructor(
    private officeService: OfficeService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadOffice();
  }

  @tuiPure
  protected stringify(items: readonly Office[]): TuiStringHandler<TuiContext<Office>> {
    const map = new Map(items.map(({ id, name }) => [id, name] as [string, string]));

    return ({ $implicit }: TuiContext<Office>) => map.get($implicit.id) || '';
  }

  public readonly context = injectContext<TuiDialogContext<WorkerWithDetailsDto, WorkerWithDetailsDto>>();

  protected get data(): WorkerWithDetailsDto {
    return this.context.data;
  }

  protected hasValue() {
    return this.data !== null;
  }

  protected submit(): void {
    if (this.hasValue()) {
      if (this.selectedOffice && this.data.office) {
        const selectedOfficeId = this.selectedOffice;
        this.data.office.id = selectedOfficeId.id;
        this.data.office.name = selectedOfficeId.name
      }
      this.context.completeWith(this.data);
    }
  }

  loadOffice() {
    this.officeService.getOffice()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке истории должностей", error);
          return of([]);
        })
      )
      .subscribe({
        next: data => {
          this.offices = data ?? [];
          this.cdr.markForCheck();
        }
      })
  }

}
