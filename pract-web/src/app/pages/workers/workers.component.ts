import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { WorkerCardComponent } from '@components/worker-card/worker-card.component';
import { WorkerService } from '@services/worker.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workers',
  imports: [
    WorkerCardComponent,
    CommonModule
  ],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkersComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  protected workers!: WorkerWithDetailsDto[];

  constructor(
    private workerService: WorkerService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.loadWorkers();
  }

  loadWorkers() {
    this.workerService.getWorkers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      )
      .subscribe({
        next: (data) => {
          this.workers = data ?? [];
          this.cdr.markForCheck();
        }
      });
  }
}
