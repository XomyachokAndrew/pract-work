import { Component, inject } from '@angular/core';
import { TuiAlertService, TuiButton, TuiDialogContext } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiTextfield } from '@taiga-ui/core';
import { Post } from '@models/post-dtos';

@Component({
  selector: 'app-edit-post-name-modal',
  imports: [TuiTextfield, TuiButton],
  templateUrl: './edit-post-name-modal.component.html',
  styleUrl: './edit-post-name-modal.component.less'
})
export class EditPostNameModalComponent {
  private readonly alerts = inject(TuiAlertService);

  public readonly context = injectContext<TuiDialogContext<Post, Post>>();

  protected get data(): Post {
    return this.context.data;
  }

  protected hasValue() {
    return this.data !== null;
  }

  protected onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleanedValue = input.value.replace(/[^а-яА-Яa-zA-Z0-9\s]/g, '');
    const maxLength = 200;
    const finalValue = this.checkLengthAndWarn(cleanedValue, maxLength);

    input.value = finalValue;
    this.data.name = finalValue;
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

  protected submit(): void {
    if (this.hasValue()) {
      this.context.completeWith(this.data);
    }
  }
}
