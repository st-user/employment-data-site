import { CustomEventNames } from '../common/CustomEventNames.js';
import BasicTabulationChartView from './BasicTabulationChartView.js';
import CommonEventDispatcher from '../common/CommonEventDispatcher.js';
import ItemSelectionView from './ItemSelectionView.js';

export default class BasicTabulationView {

    #startYearMonthModel;
    #endYearMonthModel;
    #chartDataModel;
    #chartSizeModel;

    #itemSelectionView;
    #chartView;

    #isInitializing;

    constructor(startYearMonthModel, endYearMonthModel, chartDataModel, chartSizeModel) {
        this.#startYearMonthModel = startYearMonthModel;
        this.#endYearMonthModel = endYearMonthModel;
        this.#chartDataModel = chartDataModel;
        this.#chartSizeModel = chartSizeModel;

        this.#itemSelectionView = new ItemSelectionView(chartDataModel);
        this.#chartView = new BasicTabulationChartView(
            startYearMonthModel, endYearMonthModel, chartDataModel, chartSizeModel
        );
    }

    setUpEvent() {

        const renderAll = event => {
            const isIntializing = event.detail
                                    && event.detail.eventContext
                                    && event.detail.eventContext.isInitializing;
            if (isIntializing) {
                return;
            }

            this.#chartView.renderChart();
            this.#chartView.renderLines();
        };

        CommonEventDispatcher.on(
            CustomEventNames.EMPLOYMENT_DATA_SITE__RESIZE_WINDOW, event => renderAll(event)
        );

        CommonEventDispatcher.on(CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_ITEM_SELECTION, () => {
            this.#chartView.renderLines();
        });

        CommonEventDispatcher.on(
            CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH, event => renderAll(event),
            this.#startYearMonthModel.eventContextName()
        );
        CommonEventDispatcher.on(
            CustomEventNames.EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH, event => renderAll(event),
            this.#endYearMonthModel.eventContextName()
        );

        this.#itemSelectionView.setUpEvent();
    }

    load() {
        this.#isInitializing = true;
        this.#chartDataModel.load().then(yearMonthInfo => {

            this.#startYearMonthModel.setLimit(
                yearMonthInfo.minYear, yearMonthInfo.minMonth,
                yearMonthInfo.maxYear, yearMonthInfo.maxMonth
            );
            this.#endYearMonthModel.setLimit(
                yearMonthInfo.minYear, yearMonthInfo.minMonth,
                yearMonthInfo.maxYear, yearMonthInfo.maxMonth
            );
            this.#startYearMonthModel.set(
                yearMonthInfo.defaultStartYear, yearMonthInfo.defaultStartMonth,
                { isInitializing: true }
            );
            this.#endYearMonthModel.set(
                yearMonthInfo.defaultEndYear, yearMonthInfo.defaultEndMonth,
                { isInitializing: true }
            );

            this.#chartSizeModel.setWidth();
        });
    }
}
