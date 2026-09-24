import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { WhatsappButton } from '../../components/whatsapp-button/whatsapp-button';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';
import { SITE_CONTACT } from '../../core/site-contact';
import { ScrollTextRevealDirective } from '../../core/scroll-text-reveal.directive';

type MatrixCell = string | boolean;

interface MatrixRow {
  feature: string;
  x210: MatrixCell;
  p190: MatrixCell;
  e170: MatrixCell;
}

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.html',
  imports: [ScrollTextRevealDirective, Navbar, Footer, WhatsappButton, RevealOnScrollDirective, RouterLink],
})
export class ProductsPage {
  protected readonly contact = SITE_CONTACT;

  protected readonly metrics = [
    { icon: 'layers', tag: '// GAUGE', title: '210 Micron', label: 'Max Density Shielding', note: 'High-mass stone rebound protection' },
    { icon: 'auto_fix_high', tag: '// AMBIENT', title: 'Instant Healing', label: 'Elastomeric Memory', note: 'Neutralizes wash swirls & abrasions' },
    { icon: 'lens_blur', tag: '// OPTICAL', title: 'Ultra-Gloss & Matte', label: 'Zero Texture Distortion', note: 'Factory-finish clarity with zero orange peel', compact: true },
    { icon: 'verified', tag: '// BONDED', title: '5-Year Warranty', label: 'Factory Direct Bond', note: 'Zero peeling, bubbling, or yellowing' },
  ];

  protected readonly x210Specs = [
    ['Core Material:', 'American Aliphatic TPU'],
    ['Top Coating:', 'Instant Optical Self-Healing'],
    ['Surface Finish:', 'Ultra Gloss (Zero Peel)'],
    ['Stone Chip Defense:', 'Maximum Tier Grade'],
    ['Contact Angle:', '108° Super-Hydrophobic'],
    ['Warranty:', '5-Year Manufacturer Bound'],
  ];

  protected readonly p190Specs = [
    ['Core Material:', 'American Aliphatic TPU'],
    ['Self-Healing:', 'Heat & Ambient Activated'],
    ['Surface Finish:', 'High Gloss Optical Clarity'],
    ['Stone Chip Defense:', 'High Precision Grade'],
    ['Chemical Shield:', 'Acid Rain & Solvent Shield'],
    ['Warranty:', '5-Year Manufacturer Bound'],
  ];

  protected readonly matteSpecs = [
    ['Adhesive:', 'Ashland® PSA 25±2 Micron'],
    ['Surface Gloss:', '55.8 GU (Haze 32±5%)'],
    ['Tensile Strength:', '3916 psi (27.0 MPa)'],
    ['Elongation Break:', '≥265% Multi-directional'],
    ['Peel Strength:', '69.1 oz/in (768 N/m)'],
    ['Operating Temp:', '-40°C to 116°C Extreme'],
  ];

  protected readonly matrix: MatrixRow[] = [
    { feature: 'Thickness', x210: '210 Micron', p190: '190 Micron', e170: '170 Micron' },
    { feature: 'TPU Material', x210: true, p190: true, e170: true },
    { feature: 'Self-Healing', x210: true, p190: true, e170: false },
    { feature: 'Hydrophobic', x210: true, p190: true, e170: false },
    { feature: 'Anti-Yellowing', x210: true, p190: true, e170: false },
    { feature: 'UV Protection', x210: true, p190: true, e170: true },
    { feature: 'Chemical Resistance', x210: true, p190: true, e170: true },
    { feature: 'High Gloss Finish', x210: 'Ultra Gloss', p190: 'High Gloss', e170: 'High Gloss' },
    { feature: 'Stone Chip Protection', x210: 'Maximum', p190: 'High', e170: 'Standard' },
    { feature: 'Warranty', x210: '5 Years', p190: '5 Years', e170: '5 Years' },
    { feature: 'Expected Service Life', x210: 'Up to 7 Years', p190: 'Up to 5 Years', e170: 'Up to 5 Years' },
  ];

  protected readonly filmLayers = [
    { tag: 'Layer 01 // 7 Micron', title: 'Self-Healing Topcoat', body: 'Fluorocarbon instant self-healing elastomeric topcoat. Repels water, road oils, bug splatter, and bird droppings.' },
    { tag: 'Layer 02 // 150-170 Micron', title: 'American Aliphatic TPU', body: '100% pure aliphatic polyurethane core with superior tensile resistance, zero yellowing, and optical clarity.', core: true },
    { tag: 'Layer 03 // 25-30 Micron', title: 'Ashland® High-Tack PSA', body: 'Pressure-sensitive adhesive system that anchors firmly to curved body panels without residue upon removal.' },
    { tag: 'Layer 04 // 50 Micron', title: 'Polyester Release Liner', body: 'Ultra-smooth optical release sheet maintaining zero surface orange peel texture prior to installation.' },
  ];

  protected readonly telemetry = [
    { value: '27.0 MPa', label: 'Tensile Strength (3916 psi)' },
    { value: '≥265%', label: 'Elongation at Break' },
    { value: '116°C', label: 'Thermal Resistance Rating' },
    { value: '108°', label: 'Water Droplet Contact Angle' },
  ];

  /** Roll authenticity check: format-validates the serial printed on the roll core. */
  protected readonly rollStatus = signal<'idle' | 'valid' | 'invalid'>('idle');

  verifyRoll(event: Event, input: HTMLInputElement): void {
    event.preventDefault();
    const serial = input.value.trim().toUpperCase();
    this.rollStatus.set(/^CRT-[A-Z]\d{2}-\d{5}$/.test(serial) ? 'valid' : 'invalid');
  }

  isText(cell: MatrixCell): cell is string {
    return typeof cell === 'string';
  }
}
