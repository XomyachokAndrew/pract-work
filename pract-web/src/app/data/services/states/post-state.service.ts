import { DestroyRef, inject, Injectable } from '@angular/core';
import { WorkerDto, WorkerOfficeDto, WorkerPostDto, WorkerWithDetailsDto } from '@models/workers-dtos';
import { WorkerService } from '../worker.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, Observable, of } from 'rxjs';
import { Post, PostDto, PostWithoutId } from '@models/post-dtos';
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

  deletePost(id: string) {
    this.postService.deletePost(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      )
      .subscribe();
    this.posts = this.loadPosts();
  }

  putPost(post: PostDto) {
    this.postService.putPost(post)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      )
      .subscribe();
    this.posts = this.loadPosts();
  }

  addPost(post: PostWithoutId) {
    this.postService.addPost(post)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(error => {
          console.error("Ошибка при загрузке данных о рабочих", error);
          return of(null);
        })
      )
      .subscribe();
    this.posts = this.loadPosts();
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
