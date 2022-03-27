export class Content {
  dom = {
    el: null,
    descriptions: null,
    miniGrid: { el: null, cells: null }
  }

  constructor(element) {
    this.dom.el = element;

    // this.dom.descriptions = this.dom.el.querySelectorAll('.content__item-text');
    this.dom.descriptions = this.dom.el.querySelectorAll('.content__item__description > span');
    this.dom.miniGrid.el = this.dom.el.querySelector('.content__item-grid');
    this.dom.miniGrid.cells = this.dom.el.querySelectorAll('.content__item-grid-cell');
  }
}
