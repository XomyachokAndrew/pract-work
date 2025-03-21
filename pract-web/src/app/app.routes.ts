import { Routes } from '@angular/router';
import { OfficeComponent } from '@pages/office/office.component';
import { OfficesComponent } from '@pages/offices/offices.component';
import { WorkerComponent } from '@pages/worker/worker.component';
import { WorkersComponent } from '@pages/workers/workers.component';

export const routes: Routes = [
    {path: "workers", component: WorkersComponent},
    {path: "worker", component: WorkerComponent},
    {path: "offices", component: OfficesComponent},
    {path: "office", component: OfficeComponent},
];
