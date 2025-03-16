import { Component } from '@angular/core';
import { OfficeCardComponent } from "../../data/components/cards/office-card/office-card.component";
import { LoadingComponent } from "../../data/components/loading/loading.component";
import { CommonModule } from '@angular/common';
import { OfficesStateService } from '@services/states/offices-state.service';
import { Observable } from 'rxjs';
import { Office } from '@models/office-dtos';

@Component({
  selector: 'app-offices',
  imports: [OfficeCardComponent, LoadingComponent, CommonModule],
  templateUrl: './offices.component.html',
  styleUrl: './offices.component.less'
})
export class OfficesComponent {
  protected offices!: Observable<Office[] | null>;
  constructor(private officesStateService: OfficesStateService) {
    const offices = this.officesStateService.getOffices();
    this.offices = offices;
  }
}
