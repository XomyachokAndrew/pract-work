import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Office } from '@models/office-dtos';
import { OfficeStateService } from '@services/states/office-state.service';
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

  constructor(
    private router: Router,
    private officeStateService: OfficeStateService
  ) { }

  onClick(officeData: Office) {
    this.officeStateService.setOffice(officeData);
    this.router.navigate(['/office']);
  }
}
