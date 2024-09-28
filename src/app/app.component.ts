import { Component, OnInit } from '@angular/core';
import { ThreeService } from './services/rendering/three.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private readonly threeService: ThreeService) {}

  ngOnInit(): void {
    this.threeService.createThreeJsBox();
  }

  title = 'stickman-3D';
}
