import { Component, OnInit } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {Chart, registerables} from 'chart.js';
import {derivative, parser, pi, round, sqrt} from 'mathjs';

Chart.register(...registerables);

@Component({
  selector: 'app-effective-refractive',
  templateUrl: './effective-refractive.component.html',
  styleUrls: ['./effective-refractive.component.scss'],
})
export class EffectiveRefractiveComponent implements OnInit {
  cot = [];
  tan = [];
  circle = [];
  circleV2 = [];
  v2 = [];
  v1 = [];
  labels = [];
  myChart;
  isCalculated = false;
  n1;
  n0;
  values = {
    a: '',
    b: '',
    lambda: '',
    n1: '',
    n2: ''
  };
  funcCot = '';
  funcTan = '';
  funcCircle = '';
  funcV = 0;
  funcV2 = 0;

  constructor(public alertController: AlertController) {
  }

  ngOnInit() {
  }

  async calculate() {
    if (this.values.a === '' || this.values.n2 === '' || this.values.n1 === '' || this.values.lambda === '') {
      const alert = await this.alertController.create({
        cssClass: 'waves.component.scss',
        header: 'Error',
        subHeader: 'Incomplete fields.',
        message: 'Please fill the incomplete fields',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      this.isCalculated = true;
      if (this.myChart) {
        this.myChart.destroy();
      }
      this.cot = [];
      this.tan = [];
      this.circle = [];
      this.labels = [];
      this.funcCot = '';
      this.funcTan = '';
      this.funcCircle = '';
      this.funcV = 0;
      this.funcV2 = 0;
      this.circleV2 = [];
      this.v2 = [];
      this.v1 = [];
      const aNumber: number = (+this.values.a) * 0.000001;
      const lambdaNumber: number = +this.values.lambda * 0.000000001;
      const n1Number: number = +this.values.n1;
      const n2Number: number = +this.values.n2;
      this.generateGraphics(aNumber, n1Number, n2Number, lambdaNumber);
      this.myChart = new Chart('myChart', {
        type: 'line',
        data: {
          labels: this.labels,
          datasets: [{
            label: 'm even',
            data: this.tan,
            fill: false,
            borderColor: 'rgb(210,8,8)',
            tension: 0.3
          },
            {
              label: 'm odd',
              data: this.cot,
              fill: false,
              borderColor: 'rgb(5,29,157)',
              tension: 0.3
            },
            {
              label: 'V1',
              data: this.circle,
              fill: false,
              borderColor: 'rgb(32,77,23)',
              tension: 0.3
            },
            {
              label: 'V0',
              data: this.circleV2,
              fill: false,
              borderColor: '#4c1072',
              tension: 0.3
            }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'aκ(Radians)'
              }
            },
            y: {
              beginAtZero: true,
              min: 0,
              max: this.funcV + 3,
              title: {
                display: true,
                text: 'aα(Radians)'
              }
            }
          }
        },
      });
    }
  }

  generateGraphics(a, n1, n2, lambda) {
    this.funcV = ((2 * pi * a / 2) / lambda) * sqrt(n1 * n1 - n2 * n2);
    this.funcCot = 'f(x) = -(x) * cot(x)';
    this.funcTan = 'f(x) = x * tan(x)';
    this.funcCircle = 'f(x) = sqrt(' + this.funcV * this.funcV + ' - (x)^2)';
    const parserCot = parser();
    const parserTan = parser();
    const parserCircle = parser();
    const parserCircleV2 = parser();
    parserCot.evaluate(this.funcCot);
    parserTan.evaluate(this.funcTan);
    parserCircle.evaluate(this.funcCircle);
    const limit = (round(this.funcV, 0) + 3) * 100;
    let angle = 0;
    this.intersection();
    const funcCircleV2 = 'f(x) = sqrt(' + this.funcV2 * this.funcV2 + ' - (x)^2)';
    parserCircleV2.evaluate(funcCircleV2);
    for (let x = 0; x <= limit; x += 1) {
      const cot: number = parserCot.evaluate('f(' + angle + ')');
      const tan: number = parserTan.evaluate('f(' + angle + ')');
      const circle: number = parserCircle.evaluate('f(' + angle + ')');
      const circleV2: number = parserCircleV2.evaluate('f(' + angle + ')');
      this.labels.push(angle.toString());
      //numM1 < 16
      if (cot >= 0) {
        this.cot.push(cot);
      } else {
        this.cot.push(NaN);
      }
      if (tan >= 0) {
        this.tan.push(tan);
      } else {
        this.tan.push(NaN);
      }
      if (circle >= -20) {
        this.circle.push(circle);
      } else {
        this.circle.push(NaN);
      }
      if (circleV2 >= -20) {
        this.circleV2.push(circleV2);
      } else {
        this.circleV2.push(NaN);
      }
      angle = round(angle + 0.01, 2);
    }
  }

  delete() {
    this.values = {
      a: '',
      b: '',
      lambda: '',
      n1: '',
      n2: ''
    };
  }

  intersection() {
    let aux = '-sqrt(' + this.funcV * this.funcV + ' - (x)^2)';

    let cot = parser();
    let tan = parser();
    let derCot = parser();
    let derTan = parser();
    let x1 = 0;
    cot.evaluate(this.funcCot + aux);
    tan.evaluate(this.funcTan + aux);
    derCot.evaluate('f(x) = ' + derivative('-(x) * cot(x)' + aux, 'x').toString());
    derTan.evaluate('f(x) = ' + derivative('x * tan(x)' + aux, 'x').toString());
    for (let i = 0; i <= 100; i++) {
      let itCot = x1 - (cot.evaluate('f(' + x1 + ')') / derCot.evaluate('f(' + x1 + ')'));
      let itTan = x1 - (tan.evaluate('f(' + x1 + ')') / derTan.evaluate('f(' + x1 + ')'));
      for (let j = 0; j <= 100; j++) {
        if (!isNaN(itCot)) {
          itCot = itCot - (cot.evaluate('f(' + itCot + ')') / derCot.evaluate('f(' + itCot + ')'));
        }
        if (!isNaN(itTan)) {
          itTan = itTan - (tan.evaluate('f(' + itTan + ')') / derTan.evaluate('f(' + itTan + ')'));
        }
        if (isNaN(itTan) && isNaN(itCot)) {
          break;
        }
      }
      const cotV1 = round(itCot, 5);
      const tanV1 = round(itTan, 5);
      if (!isNaN(cotV1)) {
        this.v1.unshift(cotV1);
        break;
        //console.log(m0);
      }
      if (!isNaN(tanV1)) {
        this.v1.unshift(tanV1);
        break;
        //console.log(m0);
      }
      x1 = x1 + 0.1;
    }
    const aNumber: number = (+this.values.a) * 0.000001;
    const lambdaNumber: number = +this.values.lambda * 0.000000001;
    const k0 = this.v1[0] / (aNumber / 2);
    const b0 = sqrt(((2 * pi * (+this.values.n1)) / (lambdaNumber)) * ((2 * pi * (+this.values.n1)) / (lambdaNumber)) - k0 * k0);
    this.n1 = b0 / ((2 * pi) / (lambdaNumber));
    this.funcV2 = (pi * (+this.values.b*0.000001) / (lambdaNumber)) * sqrt(this.n1 * this.n1 - (+this.values.n2) * (+this.values.n2));

    cot = parser();
    tan = parser();
    derCot = parser();
    derTan = parser();
    aux = '-sqrt(' + this.funcV2 * this.funcV2 + ' - (x)^2)';
    x1 = 0;
    tan.evaluate(this.funcTan + aux);
    cot.evaluate(this.funcCot + aux);
    derCot.evaluate('f(x) = ' + derivative('-(x) * cot(x)' + aux, 'x').toString());
    derTan.evaluate('f(x) = ' + derivative('x * tan(x)' + aux, 'x').toString());
    for (let i = 0; i <= 100; i++) {
      let itTan = x1 - (tan.evaluate('f(' + x1 + ')') / derTan.evaluate('f(' + x1 + ')'));
      let itCot = x1 - (cot.evaluate('f(' + x1 + ')') / derCot.evaluate('f(' + x1 + ')'));
      for (let k = 0; k <= 200; k++) {
        if (!isNaN(itTan)) {
          itTan = itTan - (tan.evaluate('f(' + itTan + ')') / derTan.evaluate('f(' + itTan + ')'));
        }
        if (!isNaN(itCot)) {
          itCot = itCot - (cot.evaluate('f(' + itCot + ')') / derCot.evaluate('f(' + itCot + ')'));
        }
        if (isNaN(itTan) && isNaN(itCot)) {
          break;
        }
      }
      const cotV1 = round(itCot, 7);
      const tanV1 = round(itTan, 7);
      if (!isNaN(cotV1)) {
        this.v2.unshift(cotV1);
        break;
        //console.log(m0);
      }
      if (!isNaN(tanV1)) {
        this.v2.unshift(tanV1);
        break;
        //console.log(m0);
      }
      x1 = x1 + 0.1;
    }
    const k1 = this.v2[0] / (+this.values.b*0.000001 / 2);
    const b1 = sqrt(((2 * pi * (+this.n1)) / (lambdaNumber)) * ((2 * pi * (+this.n1)) / (lambdaNumber)) - k1 * k1);
    this.n0 = b1 / ((2 * pi) / (lambdaNumber));
  }
}
    /*const aux = '-sqrt(' + this.funcV*this.funcV +' - (x)^2)';
    const aux2 = '-sqrt(' + this.funcV2*this.funcV2 +' - (x)^2)';
    this.newtonRaphson(aux, this.funcV, this.v1);
    const aNumber: number = (+this.values.a)*0.000001;
    const lambdaNumber: number = +this.values.lambda*0.000000001;
    const k0 = this.v1[0]/(aNumber/2);
    const b0 = sqrt(((2*pi*(+this.values.n1))/(lambdaNumber))*((2*pi*(+this.values.n1))/(lambdaNumber))-k0*k0);
    const n = b0/((2*pi)/(lambdaNumber));
    this.funcV2 = (pi*(aNumber)/(lambdaNumber))*sqrt(n*n-(+this.values.n2)*(+this.values.n2));
    this.newtonRaphson(aux2, this.funcV2, this.v2);
    console.log(this.v1);
    console.log(this.v2);

    newtonRaphson(aux, v, data){
    const cot = parser();
    const tan = parser();
    const derCot = parser();
    const derTan = parser();
    let x1 = 0;
    cot.evaluate(this.funcCot+aux);
    tan.evaluate(this.funcTan+aux);
    derCot.evaluate('f(x) = ' + derivative('-(x) * cot(x)' + aux, 'x').toString());
    derTan.evaluate('f(x) = ' + derivative('x * tan(x)' + aux, 'x').toString());
    for (let i = 0; i <= 100; i++){
      let itCot = x1 - (cot.evaluate('f(' + x1 + ')')/derCot.evaluate('f(' + x1 + ')'));
      let itTan = x1 - (tan.evaluate('f(' + x1 + ')')/derTan.evaluate('f(' + x1 + ')'));
      for(let j = 0; j <= 100; j++){
        if(!isNaN(itCot)){
          itCot = itCot - (cot.evaluate('f(' + itCot + ')')/derCot.evaluate('f(' + itCot + ')'));
        }
        if(!isNaN(itTan)){
          itTan = itTan - (tan.evaluate('f(' + itTan + ')')/derTan.evaluate('f(' + itTan + ')'));
        }
        if(isNaN(itTan) && isNaN(itCot)){
          break;
        }
      }
      const cotV1 = round(itCot, 5);
      const tanV1 = round(itTan, 5);
      if(!isNaN(cotV1)){
        data.unshift(cotV1);
        break;
        //console.log(m0);
      }
      if(!isNaN(tanV1)){
        data.unshift(tanV1);
        break;
        //console.log(m0);
      }
      x1 = x1 + 0.1;
    }
  }*/

