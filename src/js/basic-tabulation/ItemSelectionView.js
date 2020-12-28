import BasicTabulationItemConfig from './BasicTabulationItemConfig.js';

const eachItemSelectionTemplate = data => {
    const checked = data.isDefault ? 'checked' : '';
    return `
        <div>
            <label>
                <input type="checkbox" name="mainChartItemSelection_${data.key}" value="${data.key}" ${checked}/>
                <span style="color: ${data.color}">■</span>
                <span>${data.description}<span>
            </label>
        </div>
    `;

};


export default class ItemSelectionView {

    #chartDataModel;

    #$mainChartItemSelection;

    constructor(chartDataModel) {

        this.#chartDataModel = chartDataModel;

        this.#$mainChartItemSelection = document.querySelector('#mainChartItemSelection');

        const configsSorted = Object.values(BasicTabulationItemConfig).sort(
                (a, b) => a.index - b.index
        );
        configsSorted.forEach(config => {
            const html = eachItemSelectionTemplate({
                key: config._key,
                color: config.color,
                description: config.description,
                isDefault: config.isDefault
            });

            this.#$mainChartItemSelection.insertAdjacentHTML('beforeend', html);
        });
    }

    setUpEvent() {
        const $checkboxes = this.#$mainChartItemSelection.querySelectorAll('input[type="checkbox"]');
        $checkboxes.forEach($checkbox => {
            $checkbox.addEventListener('click', event => {
                const key = $checkbox.value;
                if ($checkbox.checked) {
                    this.#chartDataModel.addSelectedItemKey(key);
                } else {
                    this.#chartDataModel.removeSelectedItemKey(key);
                }
            });
        });
    }
}
