import { Component } from '@angular/core';
import { RevealOnScrollDirective } from '../../core/reveal-on-scroll.directive';

interface Founder {
  name: string;
  role: string;
  image: string;
}

@Component({
  selector: 'app-leadership',
  templateUrl: './leadership.html',
  imports: [RevealOnScrollDirective],
})
export class Leadership {
  protected readonly founders: Founder[] = [
    {
      name: 'Kashish Chugh',
      role: 'Master PPF Specialist & Founder',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBKmnTvZ5udXkqA8u337QVc6TsIfvlrOa_31wexgqrFI02I6VA1rUiLXdsM-0gvRG53Z7y8A59qjEhbjE8MyEetc3s60-rFbNH4xwaKcFHj3_xS79q1emzaJiw73MfBjwN40LQZ3gHrNigIQ_Sx5iedbUkIVr4zZLnDoFAuhMqT7wZ58KF9bTGhNGredcl6Njh1tuCqDAhJkv1ZsZg1fHYKZ9rV_H-UoWTtmwLAzVZ2CF_crLLyz5Im',
    },
    {
      name: 'Garv Jha',
      role: 'Technical Lead & Co-Founder',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBRXYDqgxlcCW2WNSnlCYjZXcsYebRdCTBig_I-WnzMPKVCurG5gKRRaHLBAdlww9HxfZ4b-cXWXyDAzvcxvqJYlAD-oxy2wVi3oATWABkd9Hcwh0bAml55UipnjGjXyZVZQddbwdmOMAhu0Fihjff-8rfVsR8iFf2uSD53Wn97KZvVPGSxKhz4rwz3s0Sk3SQAVqNfkDQRzFZM_5alprKaNOZCFTHQkTWzFY5Zby5Do1SCTJAq_9pC',
    },
  ];
}
