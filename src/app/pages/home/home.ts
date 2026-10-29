import { Component, inject } from '@angular/core';
import { Navbar } from '../../components/navbar/navbar';
import { Hero } from '../../components/hero/hero';
import { About } from '../../components/about/about';
import { PpfLineup } from '../../components/ppf-lineup/ppf-lineup';
import { Portfolio } from '../../components/portfolio/portfolio';
import { MidCta } from '../../components/mid-cta/mid-cta';
import { Packages } from '../../components/packages/packages';
import { Ticker } from '../../components/ticker/ticker';
import { Testimonials } from '../../components/testimonials/testimonials';
import { Leadership } from '../../components/leadership/leadership';
import { Footer } from '../../components/footer/footer';
import { WhatsappButton } from '../../components/whatsapp-button/whatsapp-button';
import { Intro } from '../../components/intro/intro';
import { IntroService } from '../../core/intro.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  imports: [
    Navbar,
    Hero,
    About,
    PpfLineup,
    Portfolio,
    MidCta,
    Packages,
    Ticker,
    Testimonials,
    Leadership,
    Footer,
    WhatsappButton,
    Intro,
  ],
})
export class Home {
  protected readonly intro = inject(IntroService);
}
