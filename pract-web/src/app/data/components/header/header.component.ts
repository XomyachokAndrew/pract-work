import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TuiHeader, TuiNavigation } from '@taiga-ui/layout';
import { FormsModule } from '@angular/forms';
import { TuiGroup } from '@taiga-ui/core';

@Component({
  selector: 'app-header',
  imports: [TuiHeader, TuiNavigation, FormsModule, TuiGroup],
  templateUrl: './header.component.html',
  styleUrl: './header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
}
