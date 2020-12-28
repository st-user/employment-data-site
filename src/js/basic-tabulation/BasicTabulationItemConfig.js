const BasicTabulationItemConfig = {

    LABOUR_FORCE: {
        columnName: 'Labour force',
        index: 2,
        isAxisLeft: true,
        description: '労働力人口',
        color: '#CC3E3E',
        isDefault: false
    },

    EMPLOYED_PERSON: {
        columnName: 'Employed person',
        index: 5,
        isAxisLeft: true,
        description: '就業者',
        color: '#CCC03D',
        isDefault: false
    },

    EMPLOYEE: {
        columnName: 'Employee',
        index: 8,
        isAxisLeft: true,
        description: '雇用者',
        color: '#4ECC3D',
        isDefault: false
    },

    UNEMPLOYED_PERSON: {
        columnName: 'Unemployed person',
        index: 11,
        isAxisLeft: true,
        description: '完全失業者',
        color: '#3DCCBB',
        isDefault: false
    },

    NOT_IN_LABOUR_FORCE: {
        columnName: 'Not in labour force',
        index: 14,
        isAxisLeft: true,
        description: '非労働力人口',
        color: '#3D4ECC',
        isDefault: false
    },

    UNEMPLOYMENT_RATE_PERCENT: {
        columnName: 'Unemployment rate  (percent)',
        index: 17,
        isAxisLeft: false,
        description: '完全失業率（％）',
        color: '#C03DCC',
        isDefault: true
    }

}
for (const [key, value] of Object.entries(BasicTabulationItemConfig)) {
    value['_key'] = key;
}

export default BasicTabulationItemConfig;
