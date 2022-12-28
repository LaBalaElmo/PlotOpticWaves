import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-option-card',
  templateUrl: './option-card.component.html',
  styleUrls: ['./option-card.component.scss'],
})
export class OptionCardComponent implements OnInit {
  @Input() info = {
    link: '',
    img: '',
    title: '',
    subtitle: '',
    description: ''
  };
  constructor() { }

  ngOnInit() {}

}
