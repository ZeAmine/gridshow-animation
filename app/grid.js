import { GridItem } from './gridItem';
import { TextReveal } from './textReveal';

import { calcWinsize, adjustedBoundingRect } from './utils';

import each from 'lodash/each';
import { gsap } from 'gsap';

const bodyEl = document.body;
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

export class Grid {
  dom = {
    el: null,
    gridItems: null,
    heading: [...document.querySelectorAll('.header__titles__item')],
    contentNav: document.querySelector('.content__item__nav'),
    contentNavItems: document.querySelectorAll('.content__item__nav-media'),
    // cursor: document.querySelector('.content__item__cursor'),
  }

  gridItemArr = [];
  titleItemArr = [];
  currentItem = -1;
  isAnimation = false;
  isGridView = true;
  textReveal = null;

  constructor(element) {
    this.dom.el = element;

    this.dom.gridItems = [...this.dom.el.querySelectorAll('.grid__item-mediawrap')];
    each(this.dom.gridItems, gridItem => this.gridItemArr.push(new GridItem(gridItem)));

    this.titles = [...document.querySelectorAll('.oh')];
    each(this.titles, title => this.titleItemArr.push(new TextReveal(title)));

    this.titleItemArr.map(item => item);


    this.initEvents();
  }

  initEvents() {
    each(this.gridItemArr, (gridItem, index) => {
      gridItem.dom.img.outer.addEventListener('click', _ => {
        if (!this.isGridView || this.isAnimation) return false;

        this.isGridView = false;
        this.isAnimation = true;

        this.currentItem = index;
        this.showContent(gridItem);
      })

      gridItem.content.dom.backBtn.addEventListener('click', _ => {
        if (this.isGridView || this.isAnimation) return false;

        this.isGridView = true;
        this.isAnimation = true;

        this.closeContent();
      })

      gridItem.dom.img.outer.addEventListener('mouseenter', _ => {
        if (!this.isGridView || this.isAnimation) return false;

        gsap.killTweensOf([ gridItem.dom.img.outer, gridItem.dom.img.inner ]);
        gsap.timeline({
          defaults: { duration: 1.6, ease: 'expo' },
          onComplete: () => gsap.set([ gridItem.dom.img.outer, gridItem.dom.img.inner ], { willChange: '' }),
        })
          .addLabel('start', 0)
          .set([ gridItem.dom.img.outer, gridItem.dom.img.inner ], { willChange: 'transform' }, 'start')
          .to(gridItem.dom.img.outer, { scale: 0.97 }, 'start')
          .to(gridItem.dom.img.inner, { scale: 1.15, ease: 'power4' }, 'start')
      })

      gridItem.dom.img.outer.addEventListener('mouseleave', _ => {
        if (!this.isGridView || this.isAnimation) return false;

        gsap.killTweensOf([ gridItem.dom.img.outer, gridItem.dom.img.inner ]);
        gsap.timeline({
          defaults: { duration: 1.4, ease: 'expo' },
          onComplete: () => gsap.set([ gridItem.dom.img.outer, gridItem.dom.img.inner ], { willChange: '' }),
        })
          .addLabel('start', 0)
          .set([ gridItem.dom.img.outer, gridItem.dom.img.inner ], { willChange: 'transform' }, 'start')
          .to([ gridItem.dom.img.outer, gridItem.dom.img.inner ], { scale: 1 }, 'start')
      })
    })

    window.addEventListener('resize', _ => {
      if (this.isGridView) return false;

      const imageTransform = this.calcTransformImage();
      gsap.set(this.gridItemArr[this.currentItem].dom.img.outer, {
        scale: imageTransform.scale,
        x: imageTransform.x,
        y: imageTransform.y
      })

      each(this.otherGridItems, (otherGridItem, index) => {
        const imgOuter = otherGridItem.dom.img.outer;

        gsap.set(imgOuter, {
          scale: this.getFinalScaleValue(imgOuter),
          x: this.getFinalTranslationValue(imgOuter, index).x,
          y: this.getFinalTranslationValue(imgOuter, index).y
        })
      })
    })
  }

  showContent(gridItem) {
    this.otherGridItems = this.gridItemArr.filter(el => el !== gridItem);
    this.otherGridItemsImgOuter = this.otherGridItems.map(item => item.dom.img.outer);

    this.headingCurrent = this.dom.heading[this.currentItem + 1];

    const imageTransform = this.calcTransformImage();

    gsap.killTweensOf([ gridItem.dom.img.outer, gridItem.dom.img.inner ]);
    this.timeline = gsap.timeline({
      defaults: { duration: 1.4, ease: 'expo.inOut' },
      // onStart: () => bodyEl.classList.add('overflow'),
      onComplete: () => this.isAnimation = false
    })
      .addLabel('start', 0)
      .set(gridItem.dom.el, {
        zIndex: 100,
      }, 'start')
      .to(gridItem.dom.moreBtn, {
        y: '1%',
        ease: 'expo',
        opacity: 0,
      }, 'start')
      .set([ gridItem.dom.img.outer, gridItem.dom.img.inner ], {
        willChange: 'transform, opacity'
      }, 'start')
      .to(gridItem.dom.img.outer, {
        scale: imageTransform.scale,
        x: imageTransform.x,
        y: imageTransform.y,
        onComplete: () => gsap.set(gridItem.dom.img.outer, { willChange: '' })
      }, 'start')
      .to(gridItem.dom.img.inner, {
        scale: 1,
        onComplete: () => gsap.set(gridItem.dom.img.inner, { willChange: '' })
      }, 'start')
      .to(this.dom.heading[0], {
        y: '-280%',
        scaleY: 4,
        opacity: 1,
      }, 'start')
      .add(() => this.dom.heading[0].classList.remove('current-active'), 'start')

      each(this.otherGridItems, (otherGridItem, index) => {
        const imgOuter = otherGridItem.dom.img.outer;

        this.timeline
          .to(otherGridItem.dom.img.outer, {
            scale: this.getFinalScaleValue(imgOuter),
            x: this.getFinalTranslationValue(imgOuter, index).x,
            y: this.getFinalTranslationValue(imgOuter, index).y,
            delay: 0.03 * index,
            onComplete: () => gsap.set(imgOuter, { willChange: '' }),
          }, 'start')
      })

      this.timeline
        .addLabel('showContent', 'start+=0.2')
        .to([...this.dom.contentNavItems].slice(this.otherGridItems.length + 1), {
          y: '0%',
          opacity: 1,
          delay: pos => 0.03 * pos,
        }, 'showContent')
        .add(() => {
          gridItem.content.dom.el.classList.add('current-active');
          this.headingCurrent.classList.add('current-active');
          bodyEl.classList.add('view-content');
        }, 'showContent')
        .to(gridItem.content.dom.descriptions, {
          opacity: 1,
          stagger: {
            grid: 'auto',
            amount: 0.4,
          },
        }, 'showContent+=0.2')
        .to(gridItem.content.dom.miniGrid.el, {
          opacity: 1,
        }, 'showContent')
        .to(gridItem.content.dom.miniGrid.cells, {
          opacity: 1,
          stagger: 0.1,
        }, 'showContent')
        .to(this.headingCurrent, {
          startAt: {
            y: '-290%',
            ease: 'expo',
            scaleY: 4,
          },
          y: '0%',
          scaleY: 1
        }, 'showContent')
        .add(() => {
          this.titleItemArr.map(item => item.in())
        }, 'showContent')
  }

  closeContent() {
    const gridItem = this.gridItemArr[this.currentItem];

    gsap.timeline({
      defaults: { duration: 1.4, ease: 'expo.inOut' },
      onStart: () => {
        gsap.set(this.otherGridItems, { opacity: 1 });
      },
      onComplete: () => { this.isAnimation = false }
    })
      .addLabel('start', 0)
      .to(this.headingCurrent, {
        y: '-280%',
        scaleY: 4,
        opacity: 1,
        onComplete: () => {this.headingCurrent.classList.remove('current-active')}
      }, 'start')
      .to(gridItem.content.dom.miniGrid.cells, {
        opacity: 0,
        stagger: 0.1,
      }, 'start')
      .to(gridItem.content.dom.miniGrid.el, {
        opacity: 0,
      }, 'start')
      .to(gridItem.content.dom.descriptions, {
        opacity: 0,
        stagger: {
          grid: 'auto',
          amount: 0.1,
        },
      }, 'start')
      .add(() => {
        this.titleItemArr.map(item => item.out())
      }, 'start')
      .set([ gridItem.dom.img.outer, this.otherGridItemsImgOuter ], {
        willChange: 'transform, opacity',
      }, 'start')
      .to(gridItem.dom.img.outer, {
        scale: 1,
        x: 0,
        y: 0,
        onComplete: () => {
          gsap.set(gridItem.dom.img.outer, { willChange: '' });
          gridItem.content.dom.el.classList.remove('current-active');
        }
      }, 'start+=0.5')
      .to(this.otherGridItemsImgOuter, {
        scale: 1,
        x: 1,
        y: 0,
        stagger: pos => -0.03 * pos,
        onComplete: () => {
          gsap.set(this.otherGridItemsImgOuter, { willChange: '' })
        }
      }, 'start+=0.5')
      .add(() => bodyEl.classList.remove('view-content'), 'start')
      .set(gridItem.dom.el, {
        zIndex: 1,
      }, 'start')

      .addLabel('showGrid', 'start+=1')
      .add(() => this.dom.heading[0].classList.remove('current-active'), 'showGrid')
      .to(this.dom.heading[0], {
        startAt: {
          y: '-290%',
          ease: 'expo',
          scaleY: 4,
        },
        y: '0%',
        scaleY: 1
      }, 'showGrid')
  }


  /**
   *  Utils
   **/

  getFinalScaleValue(gridItemImageOuter) {
    return this.dom.contentNavItems[0].offsetHeight / gridItemImageOuter.offsetHeight;
  }

  getFinalTranslationValue(gridItemImageOuter, position) {
    const imgrect = adjustedBoundingRect(gridItemImageOuter);
    const navrect = adjustedBoundingRect(this.dom.contentNavItems[position]);
    return {
      x: (navrect.left + navrect.width/2) - (imgrect.left + imgrect.width/2),
      y: (navrect.top + navrect.height/2) - (imgrect.top + imgrect.height/2)
    };
  }

  calcTransformImage() {
    const imgrect = adjustedBoundingRect(this.gridItemArr[this.currentItem].dom.img.outer);
    return {
      scale: winsize.height * 0.564 / imgrect.height,
      x: winsize.width * 0.504 - (imgrect.left + imgrect.width/2),
      y: winsize.height * 0.522 - (imgrect.top + imgrect.height/2)
    };
  }
}
