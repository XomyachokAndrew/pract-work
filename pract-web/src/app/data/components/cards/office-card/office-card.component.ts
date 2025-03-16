import { Component, Input } from '@angular/core';
import { Office } from '@models/office-dtos';
import { TuiAppearance, TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiCardLarge, TuiHeader } from '@taiga-ui/layout';

@Component({
  selector: 'app-office-card',
  imports: [
    TuiCardLarge,
    TuiHeader,
    TuiAppearance,
    TuiButton,
    TuiTitle
  ],
  templateUrl: './office-card.component.html',
  styleUrl: './office-card.component.less'
})
export class OfficeCardComponent {
  @Input() office!: Office;

}
