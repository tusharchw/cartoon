import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { WhatsappButton } from '../../components/whatsapp-button/whatsapp-button';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';
import { SITE_CONTACT } from '../../core/site-contact';

interface AtelierCard {
  image: string;
  alt: string;
  tags: [string, string];
  spec: string;
  title: string;
  body: string;
  footLeft: string;
  footRight: string;
}

interface FilmLayer {
  badge: string;
  title: string;
  body: string;
  metric: string;
  metricNote: string;
  core?: boolean;
  accentMetric?: boolean;
}

interface Benchmark {
  value: string;
  title: string;
  body: string;
  foot: string;
  accent?: boolean;
}

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.html',
  imports: [Navbar, Footer, WhatsappButton, RevealOnScrollDirective, RouterLink],
})
export class AboutPage {
  protected readonly contact = SITE_CONTACT;

  protected readonly stats = [
    { value: '9+', label: ['PROTECTION', 'LAYERS'], accent: true },
    { value: '7 Yrs', label: ['MAXIMUM', 'SERVICE LIFE'] },
    { value: '5 Yrs', label: ['MANUFACTURER', 'WARRANTY'] },
  ];

  protected readonly atelierCards: AtelierCard[] = [
    {
      image:
        'https://images.unsplash.com/photo-1617898528081-20d57598d40d?auto=format&fit=crop&crop=entropy&w=1200&h=750&q=80',
      alt: 'Sports car in a clean, brightly lit installation bay with paint protection film being wet-applied over the hood and bumper',
      tags: ['// CLEANROOM BAY #01 //', 'AIRFLOW: 0.3u HEPA ACTIVE'],
      spec: 'SPEC: CLASS-100 POSITIVE PRESSURE',
      title: 'Pressurized Atmospheric Bay',
      body: 'Controlled static and negative airborne lint environments avoid trapped contaminants under film, delivering crystal optical perfection on high-pigment factory clear coats.',
      footLeft: 'MONITORED CLIMATE CHAMBER',
      footRight: 'STATUS: ACTIVE // NOMINAL',
    },
    {
      image:
        'https://images.unsplash.com/photo-1632605157148-6313421c504b?auto=format&fit=crop&w=1200&h=750&q=80',
      alt: 'Close-up of a gloved installer laying paint protection film across a car hood',
      tags: ['// FLUID DISPLACEMENT: 100% BOND //', 'ASHLAND® PSA ACTIVATION'],
      spec: 'PRESSURE GRADIENT: 45° PASS',
      title: 'Micro-Tolerance Edge-Wrapping',
      body: 'Slip solution evacuation under consistent 45-degree angle passes preserves optical clarity, preventing micro-marring and yielding virtually invisible tucked seams.',
      footLeft: 'DIGITAL CAD PLOTTER SYSTEM',
      footRight: 'TOLERANCE: ±0.05MM',
    },
  ];

  protected readonly layers: FilmLayer[] = [
    {
      badge: 'LAYER 01',
      title: 'Instantaneous Ambient Heat Self-Healing Topcoat',
      body: 'Hydrogen bonding memory polymers actively close micro-swirls and surface scratches without requiring intense flame guns.',
      metric: '10µm GAUGE',
      metricNote: 'MEMORY NETWORK',
    },
    {
      badge: 'LAYER 02',
      title: 'Nano-Ceramic Hydrophobic & Oleophobic Glaze',
      body: 'Extreme water-droplet bead angles shed contaminated mud, bird lime, bitumen splatters, and hard calcium minerals instantly.',
      metric: '114° ANGLE',
      metricNote: 'CERAMIC CROSS-LINK',
      accentMetric: true,
    },
    {
      badge: 'CORE 03',
      title: 'Optical-Grade Aliphatic TPU Core',
      body: 'High-tensile virgin American aliphatic polymers guarantee 100% optical transmission with zero yellowing under continuous UV blast.',
      metric: '170µm HEAVY GAUGE',
      metricNote: 'ULTRA CLARITY',
      core: true,
    },
    {
      badge: 'LAYER 04',
      title: 'UV Stabilizer & Radiation Absorption Barrier',
      body: 'Filters harsh solar infrared and high-energy ultraviolet wavelengths that cause OEM clear coat chalking and delamination.',
      metric: '99.8% DEFLECTION',
      metricNote: 'SOLAR BARRIER',
    },
    {
      badge: 'LAYER 05',
      title: 'Ashland® Medical/Automotive-Grade Adhesive',
      body: 'Pressure-sensitive adhesive matrix allows clean repositioning and guarantees zero paint lift or sticky residue upon future removal.',
      metric: 'ZERO RESIDUE',
      metricNote: 'OEM COMPATIBLE',
    },
  ];

  protected readonly benchmarks: Benchmark[] = [
    {
      value: '48°C',
      title: 'Extreme Thermal Defense',
      body: 'Zero edge shrinkage, bubbling, or lifting along complex bumper curves during peak northern Indian summer heatwaves.',
      foot: 'THERMAL EXPANSION: <0.01%',
    },
    {
      value: '210µm',
      title: 'Expressway Debris Armor',
      body: 'Heavy gauge ballistic energy dispersal cushions high-velocity gravel impacts at 120+ km/h on open highways.',
      foot: 'IMPACT RESISTANCE: CLASS A',
      accent: true,
    },
    {
      value: 'PH 1-13',
      title: 'Monsoon & Bitumen Shield',
      body: 'High chemical cross-linking prevents tar bitumen staining, corrosive alkaline wash chemicals, and acidic monsoon downpours.',
      foot: 'CHEMICAL PASSIVITY: 100%',
    },
    {
      value: '< 3 Sec',
      title: 'Swirl Mark Reversion',
      body: 'Aggressive wash scratches and dry-wipe swirl marks automatically heal in real time under direct sunlight or warm engine heat.',
      foot: 'ACTIVATION TEMP: 28°C AMBIENT',
      accent: true,
    },
  ];
}
