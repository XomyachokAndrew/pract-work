import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { WorkerCardComponent } from '@components/cards/worker-card/worker-card.component';
import { WorkerService } from '@services/worker.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of } from 'rxjs';
import { WorkerDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import { AsyncPipe, CommonModule } from '@angular/common';
import { TuiButton, tuiDialog } from '@taiga-ui/core';
import { AddWorkerModalComponent } from '@components/modals/add-worker-modal/add-worker-modal.component';
import { WorkersStateService } from '@services/states/workers-state.service';
import { LoadingComponent } from "../../data/components/loading/loading.component";

@Component({
  selector: 'app-workers',
  imports: [
    WorkerCardComponent,
    CommonModule,
    TuiButton,
    AsyncPipe,
    LoadingComponent
  ],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkersComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  protected workers!: Observable<WorkerWithDetailsDto[] | null>;
  private readonly dialog = tuiDialog(AddWorkerModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Редактирование работника`,
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private workersStateService: WorkersStateService
  ) { }

  ngOnInit() {
    const workers = this.workersStateService.getWorkers();
    this.workers = workers;
  }

  addWorker() {
    const worker: WorkerWithDetailsDto = {
      id: '',
      name: {
        firstName: '',
        surname: '',
        patronymic: ''
      },
      post: {
        id: '',
        name: ''
      },
      office: {
        id: '',
        name: '',
        address: ''
      }
    };

    this.dialog(worker)
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
            this.workersStateService.addWorker(data);
            const workers = this.workersStateService.getWorkers();
            console.log('');
            this.workers = workers;
            this.cdr.markForCheck();
          }
        },
        complete: () => {
          console.info('Dialog closed');
        },
      });
  }
}
