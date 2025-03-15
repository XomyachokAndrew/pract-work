import { Component, inject, DestroyRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import { TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { TuiContext, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiLet, tuiPure } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiLoader } from '@taiga-ui/core';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { catchError, Observable, of } from 'rxjs';
import { Post } from '@models/post-dtos';
import { PostService } from '@services/post.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostStateService } from '@services/states/post-state.service';
import { LoadingComponent } from "../../loading/loading.component";

@Component({
  selector: 'app-edit-post-modal',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TuiButton,
    TuiDataList,
    TuiLet,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    AsyncPipe,
    LoadingComponent
  ],
  templateUrl: './edit-post-modal.component.html',
  styleUrl: './edit-post-modal.component.less'
})
export class EditPostModalComponent {
  protected posts!: Observable<Post[] | null>;
  protected selectedPost: Post | null = null;

  constructor(
    private postStateService: PostStateService,
  ) {
    const posts = this.postStateService.getPosts();
    this.posts = posts;
  }

  @tuiPure
  protected stringify(items: readonly Post[]): TuiStringHandler<TuiContext<Post>> {
    const map = new Map(items.map(({ id, name }) => [id, name] as [string, string]));

    return ({ $implicit }: TuiContext<Post>) => map.get($implicit.id) || '';
  }

  public readonly context = injectContext<TuiDialogContext<WorkerWithDetailsDto, WorkerWithDetailsDto>>();

  protected get data(): WorkerWithDetailsDto {
    return this.context.data;
  }

  protected hasValue() {
    return this.data !== null;
  }

  protected submit(): void {
    if (this.hasValue()) {
      if (this.selectedPost) {
        const selectedPostId = this.selectedPost;

        if (this.data.post) {
          this.data.post.id = selectedPostId.id;
          this.data.post.name = selectedPostId.name
        }
      }
      this.context.completeWith(this.data);
    }
  }
}
