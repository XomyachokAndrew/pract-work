import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TuiAppearance, TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiCardMedium } from '@taiga-ui/layout';

@Component({
  selector: 'app-post-card',
  imports: [
    TuiCardMedium,
    TuiAppearance,
    TuiButton,
    TuiTitle
  ],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.less'
})
export class PostCardComponent {
  @Input() post: any; // Принимаем объект post из родительского компонента
  @Output() edit = new EventEmitter<any>(); // Событие для редактирования
  @Output() delete = new EventEmitter<any>(); // Событие для удаления

  onEdit() {
    this.edit.emit(this.post); // Вызываем событие редактирования
  }

  onDelete() {
    this.delete.emit(this.post); // Вызываем событие удаления
  }

}
