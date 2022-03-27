export class Content {
  dom = {
    el: null,
    descriptions: null,
    backBtn: null,
    miniGrid: { el: null, cells: null }
  }

  constructor(element) {
    this.dom.el = element;

    this.dom.backBtn = this.dom.el.querySelector('.content__item-btn');
    this.dom.descriptions = this.dom.el.querySelectorAll('.content__item__description > span');
    this.dom.miniGrid.el = this.dom.el.querySelector('.content__item-grid');
    this.dom.miniGrid.cells = this.dom.el.querySelectorAll('.content__item-grid-cell');
  }
}
