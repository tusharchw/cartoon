import { Component, ElementRef, computed, signal, viewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { WhatsappButton } from '../../components/whatsapp-button/whatsapp-button';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';
import { SITE_CONTACT } from '../../core/site-contact';

interface Build {
  tab: string;
  name: string;
  image: string;
  badge: string;
  origin: string;
  bay: string;
  body: string;
  specs: { label: string; value: string; accent?: boolean }[];
  footnote: string;
}

@Component({
  selector: 'app-gallery-page',
  templateUrl: './gallery-page.html',
  imports: [Navbar, Footer, WhatsappButton, RevealOnScrollDirective, RouterLink],
})
export class GalleryPage {
  protected readonly contact = SITE_CONTACT;

  /* ---------------- Before / after laser comparison ---------------- */

  private readonly compareBox = viewChild.required<ElementRef<HTMLElement>>('compareBox');

  /** Percentage of the frame showing the "conventional" (left) layer. */
  protected readonly split = signal(50);
  protected readonly isDragging = signal(false);
  /** True while a preset button animates the divider into place. */
  protected readonly isSnapping = signal(false);
  protected readonly splitRounded = computed(() => Math.round(this.split()));
  protected readonly clipPath = computed(() => `inset(0 ${100 - this.split()}% 0 0)`);

  protected readonly presets = [
    { label: 'Conventional', value: 20 },
    { label: '50/50 Split', value: 50 },
    { label: 'Cartron Pure', value: 85 },
  ];

  protected readonly metrics = [
    { title: 'OPTICAL CLARITY', delta: '+27.4%', baseLabel: 'Conventional:', baseValue: '72.0%', baseWidth: 72, baseBar: 'bg-gray-500', baseText: 'text-white/70', ourLabel: 'Cartron X210:', ourValue: '99.4% PURE', ourWidth: 99.4 },
    { title: 'SELF-HEALING MEMORY', delta: 'RAPID ELASTIC', baseLabel: 'Conventional:', baseValue: 'Non-healing / Sluggish', baseWidth: 25, baseBar: 'bg-red-500/40', baseText: 'text-red-400', ourLabel: 'Cartron X210:', ourValue: '< 15 SECONDS', ourWidth: 96 },
    { title: 'ORANGE PEEL DISTORTION', delta: 'ZERO HAZE', baseLabel: 'Conventional:', baseValue: 'High Waviness', baseWidth: 68, baseBar: 'bg-orange-500/50', baseText: 'text-orange-400', ourLabel: 'Cartron X210:', ourValue: 'ZERO TEXTURE', ourWidth: 100 },
    { title: 'IMPACT ABSORPTION', delta: '+50% THICKNESS', baseLabel: 'Standard Film:', baseValue: '140 Micron', baseWidth: 58, baseBar: 'bg-gray-500', baseText: 'text-white/70', ourLabel: 'Cartron Heavy Gauge:', ourValue: '210 MICRON (8.3 MIL)', ourWidth: 100 },
  ];

  snapTo(value: number): void {
    this.isSnapping.set(true);
    this.split.set(value);
    setTimeout(() => this.isSnapping.set(false), 400);
  }

  onPointerDown(event: PointerEvent): void {
    this.isDragging.set(true);
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.updateFromPointer(event.clientX);
  }

  onPointerMove(event: PointerEvent): void {
    if (this.isDragging()) {
      this.updateFromPointer(event.clientX);
    }
  }

  onPointerUp(): void {
    this.isDragging.set(false);
  }

  onSliderKey(event: KeyboardEvent): void {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === 'ArrowLeft') {
      this.split.update((v) => Math.max(0, v - step));
    } else if (event.key === 'ArrowRight') {
      this.split.update((v) => Math.min(100, v + step));
    } else {
      return;
    }
    event.preventDefault();
  }

  private updateFromPointer(clientX: number): void {
    const rect = this.compareBox().nativeElement.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    this.split.set((x / rect.width) * 100);
  }

  /* ---------------- Supercar build carousel ---------------- */

  protected readonly builds: Build[] = [
    {
      tab: 'Porsche 911 GT3 RS',
      name: 'Porsche 911 GT3 RS',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCj64MDECRFvETeUtQSj4jWM-YwgHk0REgGKb6hmyNGaLtmjPmZFDNwz3B3y4UOY7cy3D62yv-sU8S3m0G0BgUMdAg3X7ZEawCYgQtWHJj_eA6NIWr2DM_Vn0IDGmgIl3H3OjP2jilE7VRKWXeNE6Nw4w4WLVX6JtkEZkWehNv__eCbzTqEa9G_vPtnrvGAg0U5l7Ix62GUScvXZRrJDwRx6nv68nQmCGAdQJjo6j7Wr9NnSaqlAA_0',
      badge: '// X210 ULTRA GLOSS //',
      origin: 'STUTTGART TRACK WEAPON',
      bay: 'BAY 01 // DELHI NCR',
      body: 'Guards Red with Exposed Carbon Aero Louvers. Fully wrapped in 210-micron optical aliphatic TPU with +15mm panel edge-tucked coverage across the swan-neck rear wing and high-velocity vents.',
      specs: [
        { label: 'FILM SPECIFICATION', value: 'Cartron X210 Gloss' },
        { label: 'TOTAL BARRIER GAUGE', value: '210 Micron (8.3 Mil)' },
        { label: 'HYDROPHOBIC CONTACT', value: '108° Super-Hydro', accent: true },
        { label: 'DIRECT WARRANTY', value: '10-Year Anti-Yellow' },
      ],
      footnote: 'Blade-Free CAD Plot',
    },
    {
      tab: 'Ferrari SF90',
      name: 'Ferrari SF90 Stradale',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB4E1Il3YVT9ut_6GxkBQEQJyE8vJ0arFBajOq5TSPujF8m6P84T-lJaCyyS6LM7pmmcXSJcHjbT3CArwudFo-U640Tf5PQdRadxVJR-ae3NjbfFTPF1RmkSKMWtGQwPtMlD1lHxq-8wI0tqLT9QRjRiRPiRllRbOOV6HhFZiQGMfoEDR3zdMJylLjmbV8JOg2enlSGEeKxv6QJEKFdfBM5h-b_kp_ebPqiXhR3vMX3XMVTFc8UHRz3',
      badge: '// X210 SHIELD //',
      origin: '1000 HP MARANELLO HYBRID',
      bay: 'BAY 02 // MUMBAI COCKPIT',
      body: 'Rosso Corsa triple-layer lacquer. Heavy-duty ballistic protection for the deep aerodynamic nose, side vortex generators, and high-temperature rear deck vents.',
      specs: [
        { label: 'FILM SPECIFICATION', value: 'Cartron X210 Gloss' },
        { label: 'HEAT REBOUND', value: 'Instant at 40°C' },
        { label: 'ADHESIVE CORE', value: 'Ashland Pressure Sensitive', accent: true },
        { label: 'DIRECT WARRANTY', value: '10-Year Guarantee' },
      ],
      footnote: 'Cleanroom Certified',
    },
    {
      tab: 'Huracán STO',
      name: 'Huracán STO',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAo5NmC3zHzKDw8xtkQIUMvt8zVafT3GXtaRjprAPcTC9B0Y6xZoKMx5ckSP139x-BeX0BvzfCzH0TwOXp9CcpPVIurjncKnHX_gOqWLZw2i3a_Vf9AKSbW7-p4DV2TF6fpnZ6ClBQTPPba7AElb7lD9bq_m_Cg5guZxB67UrW33r-gzhOuOcsbmptzWeDGapOaOfwfmN1yRsbvKsUHatGS3QTmDR9O1lV7ulxuQitYxHHk4OJ_AsP2',
      badge: '// FLAGSHIP MATTE //',
      origin: "SANT'AGATA HOMOLOGATED",
      bay: 'BAY 01 // DELHI NCR',
      body: 'Nero Nemesis matte body with Verde Scandal aero accents. Converted to satin-sheen defense with Cartron Flagship Matte, maintaining original satin light-play with zero chalkiness.',
      specs: [
        { label: 'FILM SPECIFICATION', value: 'Cartron Flagship Matte' },
        { label: 'SHEEN MEASURE', value: '55.8 GU Smooth Satin' },
        { label: 'ELONGATION RATING', value: '350% Elastic Memory', accent: true },
        { label: 'DIRECT WARRANTY', value: '8-Year Warranty' },
      ],
      footnote: 'Cofango Pre-Cut',
    },
    {
      tab: 'McLaren 720S',
      name: 'McLaren 720S Spider',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBToQjIvmty2oVM7YCU0nXqUFlMcYbJQbHe-Tup_TLqM280A5jwysavm4WFg3hHr-fuXrQEJRn0nrwFtQlQQI-fLVuORxspcE0ODLvJA4bJWDsX3B2z8SUN60uQ-gvfJrFtTn3xvtDWygXXQ5PyBi4agw_hHIYpfY6JQkkh381uN9lJrS7oS25tZuwxorN2Vcw9S3OA0eXjNel4ipzoLTzH3n5mWrp4rXAPVscjlgSwN-uIgZwHt8Ex',
      badge: '// P190 AERODYNAMIC //',
      origin: 'WOKING CARBON MONOCAGE',
      bay: 'BAY 03 // BANGALORE',
      body: 'Papaya Spark metallic paint with active dihedral doors. Engineered with Cartron P190 flexible gauge to wrap complex air-curtain channels and the high-downforce rear airbrake seamlessly.',
      specs: [
        { label: 'FILM SPECIFICATION', value: 'Cartron P190 Aero' },
        { label: 'TRANSPARENCY', value: '99.2% Optic Transmission' },
        { label: 'AIR-CURTAIN DEFENSE', value: 'Full Pre-Tuck Template', accent: true },
        { label: 'DIRECT WARRANTY', value: '8-Year Guarantee' },
      ],
      footnote: 'Active Aero Sealed',
    },
    {
      tab: 'Rolls-Royce Ghost',
      name: 'Rolls-Royce Ghost',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCpnMGbXvJQJm7S6t5NbETRq0iiIzlWdyi9LGTXu2z8x7KAEXPx6mZsLc4fyTAtDJ25_yRYVxne1mS4mlE0-Rta-7uwZyhLXCvPP2WnIxhSJ6XHfT8ywiD5omkSmMNJYavECH4Od-TxVhYhaO0eRynTViStzlQhxkvraxPOviCFDCZ-XCxn1VlVzKoDFaTQViXWtLhwt-3OrusTwRFG8pzSu_XzZCqdZZEMkSJc8uXJveVohgcnsg-v',
      badge: '// X210 PIANO SHIELD //',
      origin: 'GOODWOOD BESPOKE COACHWORK',
      bay: 'BAY 01 // DELHI NCR',
      body: 'Diamond Black coachwork. Preserves the hand-polished liquid obsidian reflection with zero peel artifacts, creating a permanent chemical barrier against bird strikes, acid rain, and road tar.',
      specs: [
        { label: 'FILM SPECIFICATION', value: 'Cartron X210 Piano Gloss' },
        { label: 'GLOSS READING', value: '98.8 GU Mirror Black' },
        { label: 'EDGE STANDARD', value: '100% Full Hand-Rolled', accent: true },
        { label: 'DIRECT WARRANTY', value: '10-Year Guarantee' },
      ],
      footnote: 'Flawless Liquid Mirror',
    },
  ];

  protected readonly current = signal(0);
  protected readonly currentBuild = computed(() => this.builds[this.current()]);

  goTo(index: number): void {
    const count = this.builds.length;
    this.current.set(((index % count) + count) % count);
  }

  next(): void {
    this.goTo(this.current() + 1);
  }

  prev(): void {
    this.goTo(this.current() - 1);
  }

  /* ---------------- Installation cycle ---------------- */

  protected readonly steps = [
    { n: '01', icon: 'cleaning_services', title: 'Optical Paint Decontamination', body: 'Micro-jewelling clay bar decontamination followed by multi-stage dual-action jewelling to ensure 100% swirl-free clearcoat before wrapping.', foot: 'TOLERANCE: ZERO SWIRLS' },
    { n: '02', icon: 'architecture', title: '3D CAD Template & +15mm Edge Wrap', body: 'Proprietary CAD plotting software generates extended patterns for complete seamless edge tucking with 100% blade-free safety on body paint.', foot: 'EDGE TUCK: +15MM REAR WRAP' },
    { n: '03', icon: 'air', title: 'Class-100 Cleanroom Laydown', body: 'Installed within positive-pressure climate bays equipped with laminar dust filtration and static ionizers to guarantee zero airborne particles.', foot: 'PURITY: < 0.03 MICRON FILTER' },
    { n: '04', icon: 'thermostat', title: 'Infrared Thermal Seal Lock', body: 'Short-wave IR heat lamps lock edge memory at 92°C, permanently sealing seam margins against track-speed aero drag and pressure washes.', foot: 'EDGE LOCK: 92°C THERMAL SET' },
  ];

  protected pad(n: number): string {
    return n.toString().padStart(2, '0');
  }
}
