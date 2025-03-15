import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Office } from '@models/office-dtos';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import { OfficeStateService } from '@services/states/office-state.service';
import { tuiPure, type TuiStringHandler, type TuiContext, TuiLet } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiDialogContext, TuiLoader } from '@taiga-ui/core';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { injectContext } from '@taiga-ui/polymorpheus';
import { Observable } from 'rxjs';

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
    AsyncPipe,
  ],
  templateUrl: './edit-office-modal.component.html',
  styleUrl: './edit-office-modal.component.less'
})
export class EditOfficeModalComponent {
  protected offices$!: Observable<Office[] | null>;
  protected selectedOffice: Office | null = null;

  constructor(
    private officeStateService: OfficeStateService
  ) {
    const offices = this.officeStateService.getOffices();
    this.offices$ = offices;
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
}
