import { CustomEventNames } from './CustomEventNames.js';
import CommonEventDispatcher from './CommonEventDispatcher.js';

const yearsTemplate = data => {
    let yearList = '';
    for (const year of data.years) {
        yearList += `
            <div class="year-month-selection__year-row" data-year="${year}">
                <div class="year-month-selection__year-row-text">
                    ${year}年
                </div>
                <div class="year-month-selection__year-row-calendar" style="display: none;">
                </div>
            </div>
        `;
    }
    return `
        <div class="year-month-selection__picker-wrapper">
            <div class="year-month-selection__window">${yearList}</div>
        </div>
    `;
};

const monthsTemplate = () => {
    let months = '';
    for (let monthIndex = 1; monthIndex <= 12; monthIndex++) {
        if (monthIndex % 4 == 1) {
            months += '<tr>';
        }
        months += `<td class="year-month-selection__calendar-each-month" data-month="${monthIndex}">${monthIndex}月</td>`;
        if (monthIndex % 4 == 0) {
            months += '</tr>';
        }
    }
    return `
        <table class="year-month-selection__calendar"><tbody>${months}</tbody></table>
    `;
};

const YEAR_ROWS_TOP_MARGIN = 6;
const YEAR_ROW_MARGIN = 2;
const YEAR_ROW_HEIGHT = 24;

export default class YearMonthSelectionView {

    #yearMonthModel;

    #$main;
    #$input;
    #$wrapper;
    #$calendar;

    #openedYear;

    constructor(selector, yearMonthModel) {

        this.#yearMonthModel = yearMonthModel;

        this.#$main = document.querySelector(selector);
        this.#$input = this.#$main.querySelector('input[type="text"]');
        this.#$calendar = document.createElement('div');
        this.#$calendar.insertAdjacentHTML('beforeend', monthsTemplate());

        this.#renderValue();
    }

    setUpEvent() {
        this.#$input.addEventListener('focus', () => this.#show());
        window.addEventListener('click', () => this.#hide());
        this.#$main.addEventListener('click', event => event.stopPropagation());

        this.#$calendar.querySelectorAll('.year-month-selection__calendar-each-month').forEach($month => {
            const selectedMonth = parseInt($month.dataset.month);
            $month.addEventListener('click', () => {
                if (!this.#yearMonthModel.isInRange(this.#openedYear, selectedMonth)) {
                    return;
                }
                this.#yearMonthModel.set(this.#openedYear, selectedMonth);
            });
            $month.addEventListener('mouseover', () => {
                if (!this.#yearMonthModel.isInRange(this.#openedYear, selectedMonth)) {
                    return;
                }
                $month.classList.add('is-selected');
            });
            $month.addEventListener('mouseout', () => {
                $month.classList.remove('is-selected');
            });
        });

        this.#on(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH, () => {
            this.#renderValue();
            this.#hide();
        });

        this.#on(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH_ERROR, () => {
            alert('対象期間は、開始年月＜終了年月で選択してください。');
        });

        this.#on(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH_LIMIT, () => {
            this.#$wrapper = undefined;
        });
    }

    #show() {

        if (!this.#$wrapper) {
            const years = this.#yearMonthModel.toYears();
            const yearsHtml = yearsTemplate({
                years: years
            });
            this.#$main.insertAdjacentHTML('beforeend', yearsHtml);
            this.#$wrapper = this.#$main.querySelector('.year-month-selection__picker-wrapper');
            const $allYearRows = this.#$wrapper.querySelectorAll('.year-month-selection__year-row');

            $allYearRows.forEach($yearRow => {

                $yearRow.addEventListener('click', () => {

                    $allYearRows.forEach(_$yearRow => {
                        const year = parseInt(_$yearRow.dataset.year);
                        const $caldendarRow = _$yearRow.querySelector('.year-month-selection__year-row-calendar');
                        if (year === this.#openedYear) {
                            this.#$calendar = $caldendarRow.removeChild(this.#$calendar);
                            $caldendarRow.style.display = 'none';
                        }
                    });

                    this.#showCalendarRow($yearRow);

                });
            });
        }
        this.#$wrapper.style.display = 'block';

        this.#$wrapper.querySelectorAll('.year-month-selection__year-row').forEach(($yearRow, i) => {
            const year = parseInt($yearRow.dataset.year);
            if (this.#yearMonthModel.year() === year) {
                this.#showCalendarRow($yearRow);
                if (1 < i) {
                    const $scrollWrapper = this.#$wrapper.querySelector('.year-month-selection__window');
                    $scrollWrapper.scrollTop = (i - 1) * (YEAR_ROW_HEIGHT + YEAR_ROW_MARGIN) + YEAR_ROWS_TOP_MARGIN;
                }
            }
        });
    }

    #showCalendarRow($yearRow) {
        const year = parseInt($yearRow.dataset.year);
        const $caldendarRow = $yearRow.querySelector('.year-month-selection__year-row-calendar');

        this.#openedYear = year;
        $caldendarRow.appendChild(this.#$calendar);
        $caldendarRow.style.display = 'block';

        this.#$calendar.querySelectorAll('.year-month-selection__calendar-each-month').forEach($month => {
            const month = parseInt($month.dataset.month);
            if (this.#yearMonthModel.equalTo(year, month)) {
                $month.classList.add('is-selected');
            } else {
                $month.classList.remove('is-selected');
            }
            if (this.#yearMonthModel.isInRange(year, month)) {
                $month.classList.remove('is-out-of-range');
            } else {
                $month.classList.add('is-out-of-range');
            }
        });
    }

    #hide() {
        if (!this.#$wrapper) {
            return;
        }
        this.#$wrapper.style.display = 'none';
    }

    #renderValue() {
        this.#$input.value = this.#yearMonthModel.toString();
    }

    #on(eventName, handler) {
        CommonEventDispatcher.on(eventName, handler, this.#yearMonthModel.eventContextName());
    }
}
