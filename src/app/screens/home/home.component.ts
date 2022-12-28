import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  infos = [
    {
      link: 'waves',
      img: '../../assets/images/waves.png',
      subtitle: 'Waves',
      title: 'Angle of the modes',
      description: 'This method works to find the angle for the modes following some complex formulas, This is done by graphing' +
        'these formulas and then finding the intersection between these formulas.'
    },
    {
      link: 'effective-refractive-index-method',
      img: '../../assets/images/index.png',
      subtitle: 'Refraction',
      title: 'Effective index of refraction',
      description: 'This method uses certain data to try to find the effective index of refraction total, using some complex functions' +
        ' finding the intersection between these functions.'
    },
    {
      link: 'general-graphing',
      img: '../../assets/images/graph.png',
      subtitle: 'General graphing',
      title: 'Plot and Intersections',
      description: 'On this page you can plot multiples functions, customizing those graphs and manipulating the scale. ' +
        'You can also find the intersection between those functions.'
    }
  ];
  constructor() { }

  ngOnInit() {}

}
