import { Grid } from './grid';
import { preloadImages } from "./utils";

preloadImages("grid__item-img", "content__item__center-img").then(() => {
  new Grid(document.querySelector('.grid'));
})

