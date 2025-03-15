import { Component, inject, DestroyRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import { TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';

import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import type { TuiContext, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiLet, tuiPure } from '@taiga-ui/cdk';
import { TuiButton, TuiDataList, TuiLoader } from '@taiga-ui/core';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { catchError, of } from 'rxjs';
import { Post } from '@models/post-dtos';
import { PostService } from '@services/post.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-edit-post-modal',
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    TuiButton,
    TuiDataList,
    TuiLet,
    TuiLoader,
    TuiSelectModule,
    TuiTextfieldControllerModule,
  ],
  templateUrl: './edit-post-modal.component.html',
  styleUrl: './edit-post-modal.component.less'
})
export class EditPostModalComponent implements OnInit {
  protected posts!: Post[];
  private destroyRef = inject(DestroyRef);
  protected selectedPost: Post | null = null;

  constructor(
    private postService: PostService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPosts();
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

  loadPosts() {
    this.postService.getPost()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке истории должностей", error);
          return of([]);
        })
      )
      .subscribe({
        next: data => {
          this.posts = data ?? [];
          this.cdr.markForCheck();
        }
      })
  }
}
