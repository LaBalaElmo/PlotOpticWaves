import { Component, OnInit } from '@angular/core';
import {AlertController} from '@ionic/angular';
import {Chart, registerables} from 'chart.js';
import {derivative, parser, round} from 'mathjs';

Chart.register(...registerables);

@Component({
  selector: 'app-general-graphing',
  templateUrl: './general-graphing.component.html',
  styleUrls: ['./general-graphing.component.scss'],
})
export class GeneralGraphingComponent implements OnInit {
  values= {
    functions: '',
    yLimit: '',
    xLimit: '',
    numPoints: '',
    colors: '',
    intersection: ''
  };
  isCalculated: boolean;
  myChart;
  colors=[];
  functions=[];
  points=[];
  labels=[];
  yOptions;
  xOptions;
  xAxis;
  dataSet=[];
  intersection=[];
  interFunctions='';
  constructor(public alertController: AlertController) {
  }

  ngOnInit() {}
  async plot() {
    if (this.values.functions === '') {
      const alert = await this.alertController.create({
        cssClass: 'waves.component.scss',
        header: 'Error',
        subHeader: 'Incomplete fields.',
        message: 'Please fill the incomplete fields',
        buttons: ['OK']
      });
      await alert.present();
    } else {
      try {
        if (this.myChart) {
          this.myChart.destroy();
        }
        this.labels = [];
        this.points = [];
        this.colors = [];
        this.functions = [];
        this.dataSet = [];
        this.yOptions = {};
        this.xOptions = {};
        this.intersection = [];
        this.interFunctions = '';
        this.generatePoints();
        this.myChart = new Chart('myChart', {
          type: 'line',
          data: {
            labels: this.labels,
            datasets: this.dataSet
          },
          options: {
            scales: {
              x: this.xOptions,
              y: this.yOptions
            }
          },
        });
      } catch (error) {
        const alert = await this.alertController.create({
          cssClass: 'waves.component.scss',
          header: 'Error',
          subHeader: 'Can\'t plot the functions.',
          message: 'Please, enter valid information.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }
  generatePoints(){
    this.optionsAxis();
    let point = +this.xAxis[0];
    if(this.values.numPoints === '' || this.values.numPoints === null){
      this.values.numPoints = '100';
    }
    const interval = (+this.xAxis[1]-(+this.xAxis[0]))/+this.values.numPoints;
    const pars = parser();
    const aux = this.values.functions.replace(/ /g, '');
    const arrayFunctions = aux.split(',');
    for(let i = 0; i <= arrayFunctions.length-1; i++){
      this.functions.push('f(x)='+arrayFunctions[i]);
      this.points.push([]);
    }
    const hasYLimit = !(this.values.yLimit === '' || this.values.yLimit === null);
    const arrayY = [];
    if(hasYLimit){
      arrayY.push(this.values.yLimit.replace(/ /g, '').toString().split(',')[0]);
      arrayY.push(this.values.yLimit.replace(/ /g, '').toString().split(',')[1]);
    }
    for(let i = 0; i <= +this.values.numPoints; i++){
      this.labels.push(round(point, 3).toString());
      for(let j = 0; j <= this.functions.length-1; j++){
        pars.evaluate(this.functions[j]);
        if(!isNaN(pars.evaluate('f(' + point +')'))){
          if(hasYLimit){
            if(pars.evaluate('f(' + point +')')>= arrayY[0] && pars.evaluate('f(' + point +')') <= arrayY[1]){
              this.points[j].push(pars.evaluate('f(' + point +')'));
            }else{
              this.points[j].push(NaN);
            }
          }else{
            this.points[j].push(pars.evaluate('f(' + point +')'));
          }
        }else {
          this.points[j].push(NaN);
        }
      }
      point = point + interval;
    }
    let arrayColors: any[];
    if(this.values.colors !== '' && this.values.colors !== null){
      arrayColors = this.values.colors.replace(/ /g, '').toString().split(',');
    }else{
      arrayColors = [this.getRandomHexadecimalCode(0, 16777215)];
    }
    if(arrayColors.length < this.points.length){
      for (let i = 0; i <= this.points.length; i++){
        arrayColors.push(this.getRandomHexadecimalCode(0, 16777215));
      }
    }
    for (let i = 0; i <= this.points.length-1; i++){
      this.dataSet.push({
        label: arrayFunctions[i],
        data: this.points[i],
        fill: false,
        borderColor: '#'+arrayColors[i],
        tension: 0.1
      });
    }
  }
  optionsAxis(){
    if(this.values.xLimit !== '' && this.values.xLimit !== null){
      const aux: string = this.values.xLimit.replace(/ /g, '');
      this.xAxis = aux.toString().split(',');
      this.xOptions = {
        title: {
          display: true,
          text: 'x'
        }
      };
    }else{
      this.xAxis = '-10,10'.split(',');
      this.xOptions = {
        title: {
          display: true,
          text: 'x'
        }
      };
    }
    if(this.values.yLimit !== '' && this.values.yLimit !== null){
      this.values.yLimit.replace(/ /g, '');
      this.yOptions = {
        title: {
          display: true,
          text: 'y'
        }
      };
    }else{
      this.yOptions = {
        title: {
          display: true,
          text: 'y'
        }
      };
    }
  }
  delete(){
    this.values = {
      functions: '',
      yLimit: '',
      xLimit: '',
      numPoints: '',
      colors: '',
      intersection: ''
    };
  }
  newtonRaphson(func, iteration, functions){
    const pars = parser();
    const parsDer = parser();
    pars.evaluate('f(x)=' + func);
    parsDer.evaluate('f(x)=' + derivative(func, 'x').toString());
    const iter = (+this.xAxis[1]-(+this.xAxis[0]))*10;
    let x0 = +this.xAxis[0];
    for(let i = 0; i <= iter; i++){
      let x1 = x0 - (pars.evaluate('f(' + x0 + ')')/parsDer.evaluate('f(' + x0 + ')'));
      for (let j = 0; j <= iteration; j++){
        if(isNaN(x1) || this.intersection.includes(round(x1, 5))){
          break;
        }else{
          x1 = x1 - (pars.evaluate('f(' + x1 + ')')/parsDer.evaluate('f(' + x1 + ')'));
        }
      }
      const value = round(x1, 5);
      let isEqual = true;
      const funcEqual1 = parser();
      const funcEqual2 = parser();
      for(let k = 0; k <= functions.length-2; k++){
        funcEqual1.evaluate(functions[k]);
        funcEqual2.evaluate(functions[k+1]);
        if(round(funcEqual1.evaluate('f(' + value + ')'), 3) !== round(funcEqual2.evaluate('f(' + value + ')'), 3)){
          isEqual = false;
        }
      }
      if(!this.intersection.includes(value) && isEqual){
        this.intersection.push(value);
      }
      x0 = x0 + 0.1;
    }
  }
  getRandomHexadecimalCode(min, max){
    let aux = (Math.floor(Math.random()* (max-min)) +min).toString(16);
    if (aux.length < 6){
      for(let i = aux.length; i <= 5; i++){
        aux = '0' + aux;
      }
      return aux;
    }else{
      return aux;
    }
  }
  async findIntersections(){
    const aux = this.values.intersection.replace(/ /g, '');
    if (this.values.intersection === '' || this.values.intersection.length <= 2) {
      const alert = await this.alertController.create({
        cssClass: 'waves.component.scss',
        header: 'Error',
        subHeader: 'Can\'t find intersections.',
        message: 'Please choose more than one function',
        buttons: ['OK']
      });
      await alert.present();
    } else if(this.values.functions === ''){
      const alert = await this.alertController.create({
        cssClass: 'waves.component.scss',
        header: 'Error',
        subHeader: 'Can\'t find intersections.',
        message: 'Please, first fill the function field.',
        buttons: ['OK']
      });
      await alert.present();
    }else{
      try {
        this.optionsAxis();
        this.isCalculated = true;
        const func = this.values.functions.replace(/ /g, '').split(',');
        const arrayPosition = aux.split(',');
        const arrayFunctions = [this.functions[+arrayPosition[0]-1]];
        let inter = func[+arrayPosition[0]-1];
        this.interFunctions = this.functions[+arrayPosition[0]-1];
        for(let i = 1; i <= arrayPosition.length-1; i++){
          inter = inter + '-(' + func[+arrayPosition[i]-1] + ')';
          this.interFunctions = this.interFunctions + ', ' + this.functions[+arrayPosition[i]-1];
          arrayFunctions.push(this.functions[+arrayPosition[i]-1]);
        }
        this.newtonRaphson(inter, 200, arrayFunctions);
      } catch (error) {
        const alert = await this.alertController.create({
          cssClass: 'waves.component.scss',
          header: 'Error',
          subHeader: 'Can\'t find intersections.',
          message: 'Please, enter valid information.',
          buttons: ['OK']
        });
        await alert.present();
      }
    }
  }
  /*maxNumber(numbers: number[]){
    let max = numbers[0];
    for (let i = 1; i <= numbers.length-1; i++){
      if(numbers[i]>max){
        max = numbers[i];
      }
    }
    return max;
  }*/

}
