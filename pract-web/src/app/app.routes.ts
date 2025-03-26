import { Routes } from '@angular/router';
import { PostsComponent } from '@pages/posts/posts.component';
import { OfficeComponent } from '@pages/office/office.component';
import { OfficesComponent } from '@pages/offices/offices.component';
import { WorkerComponent } from '@pages/worker/worker.component';
import { WorkersComponent } from '@pages/workers/workers.component';

export const routes: Routes = [
    {path: "", component: OfficesComponent},
    {path: "offices", component: OfficesComponent},
    {path: "workers", component: WorkersComponent},
    {path: "posts", component: PostsComponent},
    {path: "office", component: OfficeComponent},
    {path: "worker", component: WorkerComponent},
];
