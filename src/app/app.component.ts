import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { ThreeService } from './services/rendering/three.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [TopbarComponent, SidebarComponent],
})
export class AppComponent implements OnInit {
  constructor(private readonly threeService: ThreeService) {}

  ngOnInit(): void {
    this.threeService.createThreeJsBox('threeCanvas');
  }

  title = 'stickman-3D';
}
