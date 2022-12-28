import {Component, OnInit} from '@angular/core';
import {derivative, evaluate, parser, pi, pow, round, sqrt} from 'mathjs';
import {Chart, registerables} from 'chart.js';
import {AlertController} from '@ionic/angular';

Chart.register(...registerables);


@Component({
  selector: 'app-waves',
  templateUrl: './waves.component.html',
  styleUrls: ['./waves.component.scss'],
})
export class WavesComponent implements OnInit {
  modes=[];
  myChart;
  isCalculated = false;
  tanm0=[];
  tanm1=[];
  sin=[];
  aux = [];
  criticAngle=0;
  numModes=0;
  values = {
    a: '',
    lambda: '',
    n1: '',
    n2: '',
    iter: '',
    decimals: ''
  };
  constructor(public alertController: AlertController) { }

  ngOnInit() {}
  async calculate(){
    if(this.values.a === '' || this.values.n2 === '' || this.values.n1 === '' || this.values.lambda === ''){
      const alert = await this.alertController.create({
        cssClass: 'waves.component.scss',
        header: 'Error',
        subHeader: 'Incomplete fields.',
        message: 'Please fill the incomplete fields',
        buttons: ['OK']
      });

      await alert.present();

    }else{
      this.isCalculated = true;
      if(this.myChart){
        this.myChart.destroy();
      }
      this.tanm0=[];
      this.tanm1=[];
      this.sin=[];
      this.aux = [];
      this.modes=[];
      if(this.values.iter === '' || this.values.iter === null){
        this.values.iter = '200';
      }
      if(this.values.decimals === '' || this.values.decimals === null){
        this.values.decimals = '5';
      }
      const aNumber: number = (+this.values.a)*0.000001;
      const lambdaNumber: number = +this.values.lambda*0.000000001;
      const n1Number: number = +this.values.n1;
      const n2Number: number = +this.values.n2;
      const v = ((2*pi*aNumber/2)/lambdaNumber)*sqrt(n1Number*n1Number-n2Number*n2Number);
      this.numModes = Math.trunc(2*v/pi)+1;
      this.newtonRaphson(aNumber, n1Number, n2Number, lambdaNumber, +this.values.iter);
      this.generatePoints(aNumber, n1Number, n2Number, lambdaNumber);
      console.log(this.values.decimals);
      this.myChart = new Chart('myChart', {
        type: 'line',
        data: {
          labels: this.aux,
          datasets: [{
            label: 'm odd',
            data: this.tanm1,
            fill: false,
            borderColor: 'rgb(210,8,8)',
            tension: 0.3
          },
            {
              label: 'm even',
              data: this.tanm0,
              fill: false,
              borderColor: 'rgb(5,29,157)',
              tension: 0.3
            },
            {
              label: 'TIR',
              data: this.sin,
              fill: false,
              borderColor: 'rgb(32,77,23)',
              tension: 0.3
            }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Modenwinkel θ'
              }
            },
            y: {
              beginAtZero: true,
              min: 0,
              max: 16,
            }
          }
        },
      });
    }
  }
  delete(){
    this.values = {
      a: '',
      lambda: '',
      n1: '',
      n2: '',
      iter: '',
      decimals: ''
    };
  }
  generatePoints(a, n1, n2, lambda){
    let evM1 = '';
    let evM0 = '';
    let evSin = '';
    this.criticAngle = round(Math.asin(n2/n1)*180/pi, +this.values.decimals);
    let angle = round(Math.asin(n2/n1)*180/pi, 0)-1;
    const iter = (90-angle)/0.05;
    for (let x = 0; x <= iter; x+=1){
      const theta = (angle*pi)/180;
      const b = ((a/2)*((2*pi*n1)/lambda));
      const c = ((pi / 2));
      evM1 = 'tan(' + b + '*cos('+ theta +')-' + c +')';
      evM0 = 'tan(' + b + '*cos('+ theta +'))';
      evSin = 'sqrt(pow(sin('+ theta +'), 2)-' + pow(n2/n1, 2) + ')/cos(' + theta + ')';
      const numM1: number = evaluate(evM1);
      const numM0: number = evaluate(evM0);
      const numSin: number = evaluate(evSin);
      this.aux.push(angle.toString()+'°');
      //numM1 < 16
      if (numM1 >= 0){
        this.tanm1.push(numM1);
      }else{
        this.tanm1.push(NaN);
      }
      if (numM0 >= 0){
        this.tanm0.push(numM0);
      }else{
        this.tanm0.push(NaN);
      }
      if (numSin >= 0){
        this.sin.push(numSin);
      }else{
        this.sin.push(NaN);
      }
      angle = round(angle + 0.05, 2);
    }
  }
  newtonRaphson(a, n1, n2, lambda, iter){
    const parserEvM1 = parser();
    const parserDerM1 = parser();
    const parserEvM0 = parser();
    const parserDerM0 = parser();
    const evSin = 'sqrt(sin(x)^2-' + pow(n2/n1, 2) + ')/cos(x)';
    const evM1 = 'tan(' + ((a/2)*((2*pi*n1)/lambda)) + '*cos(x)-' + ((pi/2)) +')-' + evSin;
    const evM0 = 'tan(' + ((a/2)*((2*pi*n1)/lambda)) + '*cos(x))-' + evSin;
    const derM1 = derivative(evM1, 'x').toString();
    const derM0 = derivative(evM0, 'x').toString();
    const tan0 = parser();
    const tan1 = parser();
    const sin = parser();
    tan0.evaluate('f(x) = ' + 'tan(' + ((a/2)*((2*pi*n1)/lambda)) + '*cos(x))');
    tan1.evaluate('f(x) = ' + 'tan(' + ((a/2)*((2*pi*n1)/lambda)) + '*cos(x)-' + ((pi/2)) +')');
    sin.evaluate('f(x) = ' + 'sqrt(sin(x)^2-' + pow(n2/n1, 2) + ')/cos(x)');
    parserEvM1.evaluate('f(x) = ' + evM1);
    parserDerM1.evaluate('f(x) = ' + derM1);
    parserEvM0.evaluate('f(x) = ' + evM0);
    parserDerM0.evaluate('f(x) = ' + derM0);
    let x1 = 80;
    for (let angle = 0; angle <= 100; angle++){
      const x0 = x1 * pi/180;
      let m0 = x0 - (parserEvM0.evaluate('f('+ x0 +')')/parserDerM0.evaluate('f('+ x0 +')'));
      let m1 = x0 - (parserEvM1.evaluate('f('+ x0 +')')/parserDerM1.evaluate('f('+ x0 +')'));
      for(let i = 0; i <= iter; i++){
        if(!isNaN(m0)){
          m0 = m0 - (parserEvM0.evaluate('f('+ m0 +')')/parserDerM0.evaluate('f('+ m0 +')'));
          if(this.modes.includes(round(m0*180/pi, +this.values.decimals))){
            break;
          }
        }
        if(!isNaN(m1)){
          m1 = m1 - (parserEvM1.evaluate('f('+ m1 +')')/parserDerM1.evaluate('f('+ m1 +')'));
          if(this.modes.includes(round(m1*180/pi, +this.values.decimals))){
            break;
          }
        }
      }
      const angleM0 = round(m0*180/pi, +this.values.decimals);
      const angleM1 = round(m1*180/pi, +this.values.decimals);
      if(!this.modes.includes(angleM0) && !isNaN(m0)){
        if(round(tan0.evaluate('f('+m0+')'), +this.values.decimals) === round(sin.evaluate('f('+m0+')'), +this.values.decimals)){
          this.modes.unshift(angleM0);
        }
        //console.log(m0);
      }
      if(!this.modes.includes(angleM1) && !isNaN(m1)){
        if(round(tan1.evaluate('f('+m1+')'), +this.values.decimals) === round(sin.evaluate('f('+m1+')'), +this.values.decimals)){
          this.modes.unshift(angleM1);
        }
        //console.log(m1);
      }
      x1 = x1 + 0.1;
    }
    console.log(iter);
  }
}



