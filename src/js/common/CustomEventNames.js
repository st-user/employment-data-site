const createNames = () => {
    const names = {
        set: (key, value) => {
            Object.keys(names).forEach(existingKey => {
                if (existingKey === key) {
                    throw `CustomEventNamesのキーが重複しています : ${key}`;
                }
            });
            Object.values(names).forEach(existingValue => {
                if (existingValue === value) {
                    throw `CustomEventNamesの値が重複しています : ${value}`;
                }
            });
            names[key] = value;
            return names;
        }
    };
    return names;
};

const CustomEventNames = createNames();
const CustomEventContextNames = createNames();

CustomEventNames
    .set('EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH', 'employee-data-site/change-year-month')
    .set('EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH_ERROR', 'employee-data-site/change-year-month-error')
    .set('EMPLOYMENT_DATA_SITE__CHANGE_YEAR_MONTH_LIMIT', 'employee-data-site/change-year-month-limit')
    .set('EMPLOYMENT_DATA_SITE__FOCUS_YEAR_MONTH_SELECTION', 'employee-data-site/focus-year-month-selection')
    .set('EMPLOYMENT_DATA_SITE__RESIZE_WINDOW', 'employee-data-site/resize-window')
    .set('EMPLOYMENT_DATA_SITE__CHANGE_ITEM_SELECTION', 'employee-data-site/change-item-selection')
;

CustomEventContextNames
    .set('START', 'start')
    .set('END', 'end')
;


export { CustomEventNames, CustomEventContextNames };
