import { Component, Input, input } from '@angular/core';
import { Router } from '@angular/router';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
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

  constructor(private router: Router) {
  }

  onClick(workerData: WorkerWithDetailsDto) {
    this.router.navigate(['/worker'], { state: { worker: workerData } });
  }
}
