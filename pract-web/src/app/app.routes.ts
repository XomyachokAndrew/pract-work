import { Routes } from '@angular/router';
import { WorkerComponent } from '@pages/worker/worker.component';
import { WorkersComponent } from '@pages/workers/workers.component';

export const routes: Routes = [
    {path: "workers", component: WorkersComponent},
    {path: "worker", component: WorkerComponent},
];
