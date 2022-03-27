import { Content } from './content';

export class GridItem {
  dom = {
    el: null,
    img: { outer: null, inner: null },
    moreBtn: null,
  }

  constructor(element) {
    this.dom.el = element;

    this.dom.img.outer = this.dom.el.querySelector('.grid__item-media');
    this.dom.img.inner = this.dom.el.querySelector('.grid__item-img');
    this.dom.moreBtn = document.querySelector('.grid__item__more');

    this.position = this.dom.img.outer.dataset.item;
    this.index = Number(this.dom.img.outer.dataset.item) - 1;

    this.content = new Content(document.querySelector(`#${this.position}`));
  }
}
