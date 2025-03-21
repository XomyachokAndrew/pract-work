import { ChangeDetectorRef, Component, DestroyRef, inject } from '@angular/core';
import { LoadingComponent } from "../../data/components/loading/loading.component";
import { AsyncPipe, CommonModule } from '@angular/common';
import { TuiButton, tuiDialog } from '@taiga-ui/core';
import { PostStateService } from '@services/states/post-state.service';
import { catchError, Observable, of } from 'rxjs';
import { Post, PostWithout } from '@models/post-dtos';
import { AddPostModalComponent } from '@components/modals/add-post-modal/add-post-modal.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostCardComponent } from "../../data/components/cards/post-card/post-card.component";

@Component({
  selector: 'app-posts',
  imports: [
    CommonModule,
    TuiButton,
    LoadingComponent,
    AsyncPipe,
    PostCardComponent
],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.less'
})
export class PostsComponent {
  protected posts!: Observable<Post[] | null>;
  private destroyRef = inject(DestroyRef);

  private readonly dialog = tuiDialog(AddPostModalComponent, {
    dismissible: true,
    size: 'm',
    label: `Добавление должности`,
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private postStateService: PostStateService
  ) {
    const posts = this.postStateService.getPosts();
    this.posts = posts;
  }

  onDelete() {

  }

  onEdit() {

  }

  addPost() {
    const post: PostWithout = {
      name: "",
    }

    this.dialog(post)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(error => {
        console.error("Ошибка при загрузке модального окна", error);
        return of([]);
      })
    )
    .subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data}`);
        if (Array.isArray(data)) {
          // Обработка случая, когда data является массивом
          console.error('Received an array instead of WorkerDto');
        } else if (data) {
          this.postStateService.addPost(data);
          const posts = this.postStateService.getPosts();
          console.log('');
          this.posts = posts;
          this.cdr.markForCheck();
        }
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }
}
