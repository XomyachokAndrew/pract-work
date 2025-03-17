import { Component, inject } from '@angular/core';
import { TuiAlertService, TuiDialogContext, TuiTextfield } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiButton, TuiDataList, TuiLoader } from '@taiga-ui/core';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Office } from '@models/office-dtos';
import { WorkerWithDetailsDto } from '@models/workers-dtos';
import { tuiPure, type TuiStringHandler, type TuiContext, TuiLet } from '@taiga-ui/cdk';
import { TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { Post } from '@models/post-dtos';
import { OfficeStateService } from '@services/states/office-state.service';
import { PostStateService } from '@services/states/post-state.service';
import { Observable } from 'rxjs';
import { OfficesStateService } from '@services/states/offices-state.service';

@Component({
  selector: 'app-add-worker-modal',
  imports: [
    TuiButton,
    TuiTextfield,
    FormsModule,
    NgForOf,
    NgIf,
    TuiDataList,
    TuiLet,
    TuiLoader,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    AsyncPipe,
  ],
  templateUrl: './add-worker-modal.component.html',
  styleUrl: './add-worker-modal.component.less'
})
export class AddWorkerModalComponent {
  private readonly alerts = inject(TuiAlertService);
  public readonly context = injectContext<TuiDialogContext<WorkerWithDetailsDto, WorkerWithDetailsDto>>();
  protected offices$!: Observable<Office[] | null>;
  protected selectedOffice: Office | null = null;
  protected posts$!: Observable<Post[] | null>;
  protected selectedPost: Post | null = null;

  constructor (
    private officesStateService: OfficesStateService,
    private postStateService: PostStateService
  ) {
    const offices = this.officesStateService.getOffices();
    this.offices$ = offices;
    const posts = this.postStateService.getPosts();
    this.posts$ = posts;
  }

  @tuiPure
  protected stringify(items: readonly any[]): TuiStringHandler<TuiContext<any>> {
    const map = new Map(items.map(({ id, name }) => [id, name] as [string, string]));

    return ({ $implicit }: TuiContext<any>) => map.get($implicit.id) || '';
  }

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
      if (this.selectedOffice && this.data.office) {
        const selectedOfficeId = this.selectedOffice;
        this.data.office.id = selectedOfficeId.id;
        this.data.office.name = selectedOfficeId.name
      }
      console.log(this.data);
      
      this.context.completeWith(this.data);
    }
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanedValue = input.value.replace(/[^а-яА-Яa-zA-Z0-9]/g, '');
    const maxLength = 200;
    const finalValue = this.checkLengthAndWarn(cleanedValue, maxLength);

    input.value = finalValue;
    switch (input.name) {
      case 'surname':
        this.data.name.surname = finalValue;
        break;
      case 'firstName':
        this.data.name.firstName = finalValue;
        break;
      case 'patronymic':
        this.data.name.patronymic = finalValue;
        break;
      default:
        break;
    }
  }

  private showError(message: string): void {
    this.alerts
      .open(message, {
        label: 'Ошибка',
        appearance: 'negative',
        autoClose: 5000,
      })
      .subscribe();
  }

  private showWarning(message: string): void {
    this.alerts
      .open(message, {
        label: 'Предупреждение',
        appearance: 'warning',
        autoClose: 5000,
      })
      .subscribe();
  }

  private checkLengthAndWarn(value: string, maxLength: number, warningThreshold: number = 15): string {
    if (value.length > maxLength) {
      this.showError(`Вы превышаете допустимую длину в ${maxLength} символов, добавление новых символов невозможно.`);
      return value.slice(0, maxLength);
    } else if (value.length > maxLength - warningThreshold) {
      this.showWarning(`Вы приближаетесь к границе по длине символов. Осталось ${maxLength - value.length} символов.`);
    }
    return value;
  }
}
