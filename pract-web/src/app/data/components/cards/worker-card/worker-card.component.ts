import { Component, Input, input } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import { WorkerStateService } from '@services/states/worker-state.service';
import { TuiAppearance, TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-worker-card',
  imports: [
    TuiCardLarge,
    TuiHeader,
    TuiAppearance,
    TuiButton,
    TuiTitle
  ],
  templateUrl: './worker-card.component.html',
  styleUrl: './worker-card.component.less'
})
export class WorkerCardComponent {
  @Input() worker!: WorkerWithDetailsDto;

  constructor(
    private router: Router,
    private workerStateService: WorkerStateService
  ) { }

  onClick(workerData: WorkerWithDetailsDto) {
    this.workerStateService.setWorker(workerData);
    this.router.navigate(['/worker']);
  }
}
