import BasicTabulationItemConfig from './BasicTabulationItemConfig.js';
import { CustomEventNames } from '../common/CustomEventNames.js';
import CommonEventDispatcher from '../common/CommonEventDispatcher.js';

class EachItemData {

    #config;
    #data;

    constructor(config) {
        this.#config = config;
        this.#data = [];
    }

    chooseData(csvRow, rowIndex) {
        this.#data[rowIndex] = parseFloat(csvRow[this.#config.index]);
    }

    data(startIndex, endIndex) {
        return this.#data.slice(startIndex, endIndex + 1);
    }

    datum(index) {
        return this.#data[index];
    }

    config() {
        return this.#config;
    }
}

const CSV_YEAR_COLUMN_INDEX = 0;
const CSV_MONTH_COLUMN_INDEX = 1;
const CSV_DATA_START_ROW_INDEX = 0;

export default class ChartDataModel {

    #selectedItemKeys;
    #chartData;
    #yearMonthIndexMapping;

    constructor() {
        this.#selectedItemKeys = new Set();
        this.#chartData = new Map();
        this.#yearMonthIndexMapping = new Map();

        for (const [key, value] of Object.entries(BasicTabulationItemConfig)) {
            this.#chartData.set(key, new EachItemData(value));
            if (value.isDefault) {
                this.#selectedItemKeys.add(key);
            }
        }
    }

    load() {
        return fetch(`./data/basic-tabulation-0.csv`)
            .then(response => response.text())
            .then(responseText => responseText.split(/\r?\n/).map(row => row.split(',')))
            .then(_csvRows => {

                const csvRows = []
                for (let rowIndex = 0; rowIndex < _csvRows.length; rowIndex++) {
                    if (rowIndex < CSV_DATA_START_ROW_INDEX) {
                        continue;
                    }
                    const row = _csvRows[rowIndex];
                    if (!row[CSV_YEAR_COLUMN_INDEX] || !row[CSV_MONTH_COLUMN_INDEX]) {
                        continue;
                    }
                    if (!row[BasicTabulationItemConfig.LABOUR_FORCE.index]) {
                        continue;
                    }
                    csvRows.push(row);
                }
                console.log(csvRows);

                csvRows.forEach((line, rowIndex) => {
                    for (const [_key, holder] of this.#chartData) {
                      holder.chooseData(line, rowIndex);
                    }
                    this.#yearMonthIndexMapping.set(
                        this.#toYearMonthStringKey(line[CSV_YEAR_COLUMN_INDEX], line[CSV_MONTH_COLUMN_INDEX]),
                        rowIndex
                    );
                });

                const lastRowIndex = csvRows.length - 1;
                const minYear = csvRows[CSV_DATA_START_ROW_INDEX][CSV_YEAR_COLUMN_INDEX];
                const minMonth = csvRows[CSV_DATA_START_ROW_INDEX][CSV_MONTH_COLUMN_INDEX];
                const maxYear = csvRows[lastRowIndex][CSV_YEAR_COLUMN_INDEX];
                const maxMonth = csvRows[lastRowIndex][CSV_MONTH_COLUMN_INDEX];

                const defaultStartDate = new Date(maxYear, maxMonth - 1, 1);
                defaultStartDate.setMonth(defaultStartDate.getMonth() - 6);
                const parseInt10 = value => parseInt(value, 10);

                return {
                    defaultStartYear: defaultStartDate.getFullYear(),
                    defaultStartMonth: defaultStartDate.getMonth() + 1,
                    defaultEndYear: parseInt10(maxYear),
                    defaultEndMonth: parseInt10(maxMonth),
                    minYear: parseInt10(minYear),
                    minMonth: parseInt10(minMonth),
                    maxYear: parseInt10(maxYear),
                    maxMonth: parseInt10(maxMonth)
                };
            })
            .catch(error => {
                alert('データのロードに失敗しました。');
                console.log(error);
            });
    }

    addSelectedItemKey(key) {
        this.#selectedItemKeys.add(key);
        CommonEventDispatcher.dispatch(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_ITEM_SELECTION);
    }

    removeSelectedItemKey(key) {
        this.#selectedItemKeys.delete(key);
        CommonEventDispatcher.dispatch(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_ITEM_SELECTION);
    }

    selectedItemsDataLeft() {
        return this.#selectedItemsData(true);
    }

    selectedItemsDataRight() {
        return this.#selectedItemsData(false);
    }

    dataIndex(year, month) {
        return this.#yearMonthIndexMapping.get(this.#toYearMonthStringKey(year, month));
    }

    startEndIndexInclusive(startYear, startMonth, endYear, endMonth) {

        return {
            startIndex: this.dataIndex(startYear, startMonth),
            endIndex: this.dataIndex(endYear, endMonth)
        };
    }

    #selectedItemsData(isLeft) {
        const ret = [];
        for (const key of this.#selectedItemKeys.values()) {
            const itemData = this.#chartData.get(key);
            const config = itemData.config();
            if (isLeft) {
                if (config.isAxisLeft) {
                    ret.push(itemData);
                }
            } else {
                if (!config.isAxisLeft) {
                    ret.push(itemData);
                }
            }
        }
        return ret;
    }

    #toYearMonthStringKey(year, month) {
        return `${year}_${month}`;
    }
}
