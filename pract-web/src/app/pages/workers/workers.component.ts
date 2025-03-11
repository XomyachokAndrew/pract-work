import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkerCardComponent } from '@components/worker-card/worker-card.component';

@Component({
  selector: 'app-workers',
  imports: [
    WorkerCardComponent
  ],
  templateUrl: './workers.component.html',
  styleUrl: './workers.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkersComponent {

}
