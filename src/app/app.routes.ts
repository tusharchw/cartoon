import { Routes } from '@angular/router';
import { Home } from './pages/home/home';

export const routes: Routes = [
  { path: '', component: Home, title: 'CARTRON — Premier Supercar PPF & Protective Studio' },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about-page').then((m) => m.AboutPage),
    title: 'About CARTRON | American TPU Technology Engineered for Indian Roads',
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products-page').then((m) => m.ProductsPage),
    title: 'CARTRON Products | American TPU Paint Protection Film Range',
  },
  {
    path: 'gallery',
    loadComponent: () => import('./pages/gallery/gallery-page').then((m) => m.GalleryPage),
    title: 'CARTRON // Supercar Gallery & Master PPF Portfolio',
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact-page').then((m) => m.ContactPage),
    title: 'Contact CARTRON | Dealer Network & Studio Location',
  },
  { path: '**', redirectTo: '' },
];
