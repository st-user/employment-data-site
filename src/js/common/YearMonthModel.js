import { CustomEventNames } from './CustomEventNames.js';
import CommonEventDispatcher from './CommonEventDispatcher.js';

export default class YearMonthModel {

    #year;
    #month;

    #minYear;
    #minMonth;
    #maxYear;
    #maxMonth;

    #eventContextName;
    #additionalYearMonthChecker;

    constructor(eventContextName, additionalYearMonthChecker) {
        this.#year = 2000;
        this.#month = 1;
        this.#minYear = 2000;
        this.#minMonth = 1;
        this.#maxYear = 2100;
        this.#maxMonth = 12;

        this.#eventContextName = eventContextName;
        this.#additionalYearMonthChecker = additionalYearMonthChecker;
    }

    set(year, month, eventContext) {
        if (!this.isInRange(year, month)) {
            throw `MIN:${this.#minYear}/${this.#minMonth}, MAX:${this.#maxYear}/${this.#maxMonth}, INPUt:${year}/${month}`;
        }

        if (!this.#additionalYearMonthChecker(this.#toYyyyMm(year, month))) {
            this.#dispatchEvent(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH_ERROR);
            return;
        }

        this.#year = year;
        this.#month = month;


        this.#dispatchEvent(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH, {
            year: year,
            month: month,
            eventContext: eventContext
        });
    }

    setLimit(minYear, minMonth, maxYear, maxMonth) {
        this.#minYear = minYear;
        this.#minMonth = minMonth;
        this.#maxYear = maxYear;
        this.#maxMonth = maxMonth;
        this.#dispatchEvent(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH_LIMIT);
    }

    year() {
        return this.#year;
    }

    month() {
        return this.#month;
    }

    eventContextName() {
        return this.#eventContextName;
    }

    equalTo(year, month) {
        return year === this.#year && month === this.#month;
    }

    isInRange(year, month) {
        if (this.#toYyyyMm(year, month) < this.#toYyyyMm(this.#minYear, this.#minMonth)) {
            return false;
        }
        if (this.#toYyyyMm(this.#maxYear, this.#maxMonth) < this.#toYyyyMm(year, month)) {
            return false;
        }
        return true;
    }

    toString() {
        return `${this.#year}年${this.#month}月`;
    }

    toYearMonths(endYear, endMonth) {
        const date = new Date(this.#year, this.#month - 1, 1);
        const ret = [];
        while(!(date.getFullYear() === endYear && date.getMonth() === endMonth - 1)) {
            ret.push({
                year: date.getFullYear(),
                month: date.getMonth() + 1
            });
            date.setMonth(date.getMonth() + 1);
        }
        ret.push({
            year: endYear,
            month: endMonth
        });
        return ret;
    }

    toYears() {
        const years = [];
        for (let year = this.#minYear; year <= this.#maxYear; year++) {
            years.push(year);
        }
        return years;
    }

    #toYyyyMm(year, month) {
        return year * 100 + month;
    }

    #dispatchEvent(eventName, detail) {
        CommonEventDispatcher.dispatch(eventName, detail, this.#eventContextName);
    }
}
