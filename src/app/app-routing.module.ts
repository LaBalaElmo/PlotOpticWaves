import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './screens/home/home.component';
import { WavesComponent } from './screens/waves/waves.component';
import {GeneralGraphingComponent} from './screens/general-graphing/general-graphing.component';
import {EffectiveRefractiveComponent} from './screens/effective-refractive/effective-refractive.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
    //loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    //component:HomePage,
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'waves',
    component: WavesComponent
  },
  {
    path: 'general-graphing',
    component: GeneralGraphingComponent
  },
  {
    path: 'effective-refractive-index-method',
    component: EffectiveRefractiveComponent
  },
  {
    path: '**',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
