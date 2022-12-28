import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './screens/home/home.component';
import { OptionCardComponent } from './components/option-card/option-card.component';
import { WavesComponent } from './screens/waves/waves.component';
import { GeneralGraphingComponent } from './screens/general-graphing/general-graphing.component';
import {FormsModule} from '@angular/forms';
import { EffectiveRefractiveComponent } from './screens/effective-refractive/effective-refractive.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    OptionCardComponent,
    WavesComponent,
    GeneralGraphingComponent,
    EffectiveRefractiveComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
