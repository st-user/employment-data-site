import CustomEventNames from './CustomEventNames.js';

export default class ItemSetModel {

    #selectedItems;

    #eventContext;

    constructor(eventContext) {
        this.#selectedItems = Set();

        this.#eventContext = eventContext;
    }

    reset(items) {
        this.#selectedItems.clear();
        items.forEach(item => this.#selectedItems.add(item));

        this.#eventContext.dispatch(CustomEventNames.EMPLOYMENT_DATA_SITE__RESET_SELECTED_ITEMS, {
            items: items
        });
    }
}
