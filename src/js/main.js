/*! For license information please see https://tools.ajizablg.com/employment-data-site/oss-licenses.json */

import { CustomEventContextNames } from './common/CustomEventNames.js';
import BasicTabulationView from './basic-tabulation/BasicTabulationView.js';
import ChartDataModel from './basic-tabulation/ChartDataModel.js';
import ChartSizeModel from './basic-tabulation/ChartSizeModel.js';
import debounce from './common/Debounce.js';
import YearMonthModel from './common/YearMonthModel.js';
import YearMonthRangeChecker from './common/YearMonthRangeChecker.js';
import YearMonthSelectionView from './common/YearMonthSelectionView.js';

export default function main() {

    /* Models */
    const yearMonthRangeChecker = new YearMonthRangeChecker();
    const startYearMonthModel = new YearMonthModel(
        CustomEventContextNames.START, yearMonthRangeChecker.startYearMonthSetter()
    );
    const endYearMonthModel = new YearMonthModel(
        CustomEventContextNames.END, yearMonthRangeChecker.endYearMonthSetter()
    );
    const basicTabulationChartDataModel = new ChartDataModel();
    const chartSizeModel = new ChartSizeModel();

    /* Views */
    const startYearMonthSelectionView = new YearMonthSelectionView('#startYearMonthSelection', startYearMonthModel);
    const endYearMonthSelectionView = new YearMonthSelectionView('#endYearMonthSelection', endYearMonthModel);

    startYearMonthSelectionView.setUpEvent();
    endYearMonthSelectionView.setUpEvent();

    const basictabulationView = new BasicTabulationView(
        startYearMonthModel, endYearMonthModel, basicTabulationChartDataModel, chartSizeModel
    );
    basictabulationView.setUpEvent();



    window.addEventListener('resize', debounce(() => {
        chartSizeModel.setWidth();
    }, 500));

    basictabulationView.load();
}
