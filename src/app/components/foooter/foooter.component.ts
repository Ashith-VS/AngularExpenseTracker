import { Component } from '@angular/core';

@Component({
  selector: 'app-foooter',
  standalone: true,
  imports: [],
  templateUrl: './foooter.component.html',
  styleUrl: './foooter.component.css'
})
export class FoooterComponent {
  currentYear: number =new Date().getFullYear();

  handleFocusTop(){
    window.scroll({top: 0, behavior: "smooth"});
  }
}
