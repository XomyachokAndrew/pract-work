import { Component } from '@angular/core';
import { TuiAppearance, TuiButton, TuiTitle } from '@taiga-ui/core';
import {TuiCardLarge, TuiHeader} from '@taiga-ui/layout';

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

}
