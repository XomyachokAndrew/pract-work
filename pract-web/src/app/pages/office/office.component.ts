import { CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Office } from '@models/office-dtos';
import { WorkerPostDto, WorkerWithPostDto } from '@models/workers-dtos';
import { OfficeStateService } from '@services/states/office-state.service';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiScrollable, TuiScrollbar } from '@taiga-ui/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-office',
  imports: [
    CdkFixedSizeVirtualScroll,
    CdkVirtualForOf,
    CdkVirtualScrollViewport,
    TuiScrollable,
    TuiScrollbar,
    TuiTable,
    AsyncPipe
  ],
  templateUrl: './office.component.html',
  styleUrl: './office.component.less'
})
export class OfficeComponent {
  protected office!: Office | null;
  protected workers!: Observable<WorkerWithPostDto[] | null>;
  constructor(
    private route: Router,
    private officeStateService: OfficeStateService
  ) {
    this.office = this.officeStateService.getOffice();
    const workers = this.officeStateService.getWorkersInOffices();
    if (!workers) {
      this.route.navigate(['offices']);
      return;
    }
    this.workers = workers;
  }
}
