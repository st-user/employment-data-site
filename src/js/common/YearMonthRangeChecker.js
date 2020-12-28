export default class YearMonthRangeChecker {

    #startYearMonth;
    #endYearMonth;

    startYearMonthSetter() {
        return yearMonth => {
            if (this.#endYearMonth <= yearMonth) {
                return false;
            }
            this.#startYearMonth = yearMonth;
            return true;
        };
    }

    endYearMonthSetter() {
        return yearMonth => {
            if (yearMonth <= this.#startYearMonth) {
                return false;
            }
            this.#endYearMonth = yearMonth;
            return true;
        };
    }

}
