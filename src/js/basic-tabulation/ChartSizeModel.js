import { CustomEventNames } from '../common/CustomEventNames.js';
import CommonEventDispatcher from '../common/CommonEventDispatcher.js';

export default class ChartSizeModel {

    #width;
    #height;

    constructor() {
        this.#setInternal(window.innerWidth);
    }

    setWidth() {
        this.#setInternal(window.innerWidth);
        CommonEventDispatcher.dispatch(CustomEventNames.EMPLOYMENT_DATA_SITE__RESIZE_WINDOW);
    }

    width() {
        return this.#width;
    }

    height() {
        return this.#height;
    }

    #setInternal(width) {
        this.#width = width * 0.98;
        this.#height = this.#width * 9 / 16;
    }
}
