import BasicTabulation_ from './basic-tabulation/BasicTabulation_.js';
import YearMonthSelectionView from './common/YearMonthSelectionView.js';
import YearMonthModel from './common/YearMonthModel.js';
import BasicTabulationView from './basic-tabulation/BasicTabulationView.js'
import ChartDataModel from './basic-tabulation/ChartDataModel.js';
import YearMonthRangeChecker from './common/YearMonthRangeChecker.js';
import ChartSizeModel from './basic-tabulation/ChartSizeModel.js';
import debounce from './common/Debounce.js';
import { CustomEventContextNames } from './common/CustomEventNames.js';

export default function main() {

    // new BasicTabulation_();

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
