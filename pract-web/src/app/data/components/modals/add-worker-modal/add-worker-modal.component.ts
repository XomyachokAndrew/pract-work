import { Component, inject } from '@angular/core';
import { WorkerDto } from '@models/workers-dtos';
import { TuiAlertService, TuiDialogContext, TuiTextfield } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiButton } from '@taiga-ui/core';

@Component({
  selector: 'app-add-worker-modal',
  imports: [
    TuiButton,
    TuiTextfield,
  ],
  templateUrl: './add-worker-modal.component.html',
  styleUrl: './add-worker-modal.component.less'
})
export class AddWorkerModalComponent {
  private readonly alerts = inject(TuiAlertService);
  public readonly context = injectContext<TuiDialogContext<WorkerDto, WorkerDto>>();

  protected get data(): WorkerDto {
    return this.context.data;
  }

  protected hasValue() {
    return this.data !== null;
  }

  protected submit(): void {
    if (this.hasValue()) {
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
        this.data.surname = finalValue;
        break;
      case 'firstName':
        this.data.firstName = finalValue;
        break;
      case 'patronymic':
        this.data.patronymic = finalValue;
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
