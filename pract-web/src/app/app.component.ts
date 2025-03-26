import { TuiRoot } from "@taiga-ui/core";
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "@components/header/header.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TuiRoot, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
}
