import { split } from './text';
import { gsap } from 'gsap';

export class TextReveal {
  dom = {
    outer: null,
    inner: null,
  }

  constructor(element) {
    this.dom.outer = element

    split({
      element: this.dom.outer,
      expression: '<br>'
    });

    // this.dom.inner = Array.isArray(element) ? element.map(outer => outer.querySelector('span')) : element.querySelector('span');
    this.dom.inner = this.dom.outer.querySelector('span');
  }

  in() {
    if (this.outTimeline && this.outTimeline.isActive()) {
      this.outTimeline.kill()
    }

    this.inTimeline = gsap.timeline({ defaults: { duration: 1.2, ease: 'expo' } })
      .set(this.dom.inner, {
        y: '150%',
        rotate: 15,
      })
      .to(this.dom.inner, {
        y: '0%',
        rotate: 0,
        stagger: 0.03,
        delay: 1
      });

    return this.inTimeline
  }

  out() {
    if (this.inTimeline && this.inTimeline.isActive()) {
      this.inTimeline.kill()
    }

    this.outTimeline = gsap.timeline({ defaults: { duration: 0.7, ease: 'expo.in' } })
      .to(this.dom.inner, {
        y: '150%',
        rotate: 10,
        stagger: 0.03
      });

    return this.outTimeline
  }
}
