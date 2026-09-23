import { Component, computed, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { WhatsappButton } from '../../components/whatsapp-button/whatsapp-button';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';
import { SITE_CONTACT, SITE_LOCATIONS, SiteLocation } from '../../core/site-contact';
import { SmoothScrollService } from '../../core/smooth-scroll.service';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.html',
  imports: [Navbar, Footer, WhatsappButton, RevealOnScrollDirective, UpperCasePipe],
})
export class ContactPage {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly smoothScroll = inject(SmoothScrollService);

  protected readonly contact = SITE_CONTACT;
  protected readonly locations = SITE_LOCATIONS;

  protected readonly heroStats = [
    { label: 'DISPATCH LATENCY', value: '< 24 HOURS', note: 'Priority Freight Network' },
    { label: 'DEALER MARGINS', value: 'TIER-1 OEM', note: 'Direct Manufacturer Rate' },
    { label: 'MASTER ROLLS', value: '15M / 30M', note: 'Optical Grade Clear TPU' },
    { label: 'CORE WARRANTY', value: '10-YR CORE', note: 'Anti-Yellowing Guarantee', gradient: true },
  ];

  protected readonly entityTypes = [
    { value: 'Authorized Dealership', title: 'Authorized Dealership', note: 'Exclusive Territory Rights', icon: 'verified' },
    { value: 'Detailing Studio Chain', title: 'Detailing Studio Chain', note: 'Multi-Bay Studio Network', icon: 'auto_awesome' },
    { value: 'Regional Wholesaler / Distributor', title: 'Regional Distributor', note: 'State-Level Inventory Supply', icon: 'inventory_2' },
    { value: 'Film Installer Hub', title: 'Certified Installer Hub', note: 'CAD Plotter Film Access', icon: 'build_circle' },
  ];

  protected readonly volumes = [
    { value: '5-10 Rolls', title: '5–10 Rolls/mo', note: 'Studio Pilot Tier' },
    { value: '10-25 Rolls', title: '10–25 Rolls/mo', note: 'Pro Studio Tier' },
    { value: '25+ Rolls', title: '25+ Rolls/mo', note: 'Distributor Tier' },
    { value: 'Bulk Container', title: 'Bulk Container', note: 'OEM Master Contract' },
  ];

  protected readonly corridors: Record<SiteLocation['id'], { label: string; value: string }[]> = {
    plant: [
      { label: 'Noida-Gr Noida Expwy:', value: '10 Minutes Access' },
      { label: 'Central Delhi / NCR Freight:', value: '15 Minutes Access' },
      { label: 'Loading Dock Bay:', value: 'Heavy Inter-State Transport' },
    ],
    studio: [
      { label: 'Neighbourhood:', value: 'East of Kailash, South Delhi' },
      { label: 'Vehicle Intake:', value: 'Class-100 Cleanroom Bays' },
      { label: 'Visits:', value: 'By Appointment' },
    ],
  };

  /* ---------------- Dealer application ---------------- */

  protected readonly submitted = signal(false);

  submitApplication(event: Event): void {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    this.submitted.set(true);
    form.reset();
  }

  /* ---------------- Live location map ---------------- */

  protected readonly activeLocationId = signal<SiteLocation['id']>('plant');
  protected readonly activeLocation = computed(
    () => this.locations.find((l) => l.id === this.activeLocationId()) ?? this.locations[0],
  );
  protected readonly mapLoading = signal(true);

  /** Google Maps embed — no API key needed, fully interactive (pan / zoom / street view). */
  protected readonly mapEmbedUrl = computed(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://maps.google.com/maps?q=${encodeURIComponent(this.activeLocation().mapQuery)}&z=15&hl=en&output=embed`,
    ),
  );

  protected readonly directionsUrl = computed(
    () => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(this.activeLocation().mapQuery)}`,
  );

  protected readonly openInMapsUrl = computed(
    () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(this.activeLocation().mapQuery)}`,
  );

  selectLocation(id: SiteLocation['id']): void {
    if (id === this.activeLocationId()) {
      return;
    }
    this.mapLoading.set(true);
    this.activeLocationId.set(id);
  }

  showOnMap(id: SiteLocation['id']): void {
    this.selectLocation(id);
    this.smoothScroll.scrollTo('#location');
  }
}
