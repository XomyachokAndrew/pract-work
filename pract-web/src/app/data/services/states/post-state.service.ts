import { DestroyRef, inject, Injectable } from '@angular/core';
import { WorkerDto, WorkerOfficeDto, WorkerPostDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import { WorkerService } from '../worker.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of } from 'rxjs';
import { Post, PostWithout } from '@models/post-dtos';
import { PostService } from '@services/post.service';

@Injectable({
  providedIn: 'root'
})
export class PostStateService {
  private posts: Observable<Post[] | null>;
  private destroyRef = inject(DestroyRef);

  constructor(
    private postService: PostService
  ) {
    this.posts = this.loadPosts();
  }

  getPosts() {
    return this.posts;
  }

  addPost(post: PostWithout) {
    this.postService.addPost(post)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      )
      .subscribe();
  }

  private loadPosts(): Observable<Post[] | null> {
    return this.postService.getPost()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      );
  }
}
