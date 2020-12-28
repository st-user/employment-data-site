import * as d3 from 'd3';

const MARGIN = {
    top: 30, right: 30, bottom: 30, left: 40
};

const CLASS_REMOVE_BEFORE_RENDER = 'basic-tabulation-chart__remove-bofore-render';
const CLASS_REMOVE_BEFORE_RENDER_LINES = 'basic-tabulation-chart__remove-bofore-render-lines';

const toolTimeTemplate = data => {

    let lines = '';
    for (const item of data.items) {
        lines += `
            <tr>
                <td style="color: ${item.color}">■</td>
                <td id="mainChartTooltipName_${item.id}">${item.name}</td>
                <td id="mainChartTooltipValue_${item.id}">${item.value}</td>
            </tr>
        `;
    }

    return `
        <div style="display: none" id="mainChartTooltip" class="chart__contents-tooltip">
            <div id="mainChartTooltipYearMonth">${data.year}年${data.month}月</div>
            <table><tbody>${lines}</tbody></table>
        </div>
    `;
};

export default class BasicTabulationChartView {

    #startYearMonthModel;
    #endYearMonthModel;
    #chartDataModel;
    #chartSizeModel;

    #$mainChart;
    #chartSvg;
    #nearestDataIndexSearcherLeft;

    /*Chart全体を描画する時にクリアが必要なフィールド*/
    #chartX;
    #yearMonths;

    /*表示する項目を変更する時にクリアが必要なフィールド*/
    #currentItemsData;
    #$tooltip;

    constructor(startYearMonthModel, endYearMonthModel, chartDataModel, chartSizeModel) {

        this.#startYearMonthModel = startYearMonthModel;
        this.#endYearMonthModel = endYearMonthModel;
        this.#chartDataModel = chartDataModel;
        this.#chartSizeModel = chartSizeModel;

        this.#$mainChart = document.querySelector('#mainChart');
        this.#chartSvg = d3.select('#mainChart').append('svg');
        this.#nearestDataIndexSearcherLeft = d3.bisector(x => x).left;

        this.#clearSelectedItemsInfo();
    }

    renderChart() {

        this.#clearSelectedItemsInfo();
        this.#setUp();

        const yearMonths = this.#yearMonths;
        const width  = this.#chartSizeModel.width();
        const height = this.#chartSizeModel.height();
        const svg = this.#chartSvg
            .attr('width', width)
            .attr('height', height);

        svg.selectAll(`.${CLASS_REMOVE_BEFORE_RENDER}`).remove();

        const tickCount = Math.min(yearMonths.length - 1, Math.floor(width / 80));
        svg.append('g')
            .attr('class', CLASS_REMOVE_BEFORE_RENDER)
            .attr('transform', `translate(0, ${height - MARGIN.bottom})`)
            .call(
                d3.axisBottom(this.#chartX)
                    .ticks(tickCount)
                    .tickFormat(d => {
                        return `${yearMonths[d].year}/${yearMonths[d].month}`;
                    })
            );
    }



    renderLines() {

        this.#clearSelectedItemsInfo();

        const svg = this.#chartSvg;
        const x = this.#chartX;
        const width = this.#chartSizeModel.width();
        const height = this.#chartSizeModel.height();
        const yearMonths = this.#yearMonths;
        const yearMonthsLastIndex = yearMonths.length - 1;
        const { startIndex, endIndex } = this.#chartDataModel.startEndIndexInclusive(
            yearMonths[0].year, yearMonths[0].month,
            yearMonths[yearMonthsLastIndex].year, yearMonths[yearMonthsLastIndex].month
        );

        svg.selectAll(`.${CLASS_REMOVE_BEFORE_RENDER_LINES}`).remove();

        const getMinMax = itemData => {
            const reduce = reducer => itemData.flatMap(
                eachData => eachData.data(startIndex, endIndex)
            ).reduce(reducer);

            return {
                min: reduce((a, b) => Math.min(a, b)),
                max: reduce((a, b) => Math.max(a, b))
            };
        };

        const renderEachLine = (scaler, eachItem) => {
            const values = eachItem.data(startIndex, endIndex);
            const config = eachItem.config();
            const draw = context => {
                context.moveTo(x(0), scaler(values[0]));
                for (let valueIndex = 1; valueIndex < values.length; valueIndex++) {
                    context.lineTo(x(valueIndex), scaler(values[valueIndex]));
                }
                return context;
            };
            svg.append('g')
                .attr('class', CLASS_REMOVE_BEFORE_RENDER_LINES)
                .append('path')
                .style('stroke', config.color)
                .style('fill', 'none')
                .attr('d', draw(d3.path()).toString());
        };

        const itemsDataLeft = this.#chartDataModel.selectedItemsDataLeft();
        itemsDataLeft.forEach(item => this.#currentItemsData.push(item));

        if (0 < itemsDataLeft.length) {
            const { min, max } = getMinMax(itemsDataLeft);
            const yLeft = d3.scaleLinear()
                .domain([ max + 1, Math.max(min - 1, 0)])
                .range([ MARGIN.top, height - MARGIN.bottom ]);

            svg.append('g')
                .attr('class', CLASS_REMOVE_BEFORE_RENDER_LINES)
                .attr('transform', `translate(${MARGIN.left} ,0)`)
                .call(d3.axisLeft(yLeft));

            svg.append('g')
                .attr('class', CLASS_REMOVE_BEFORE_RENDER_LINES)
                .attr('transform', 'translate(6 ,18)')
                .append('text')
                .attr('font-size', '12')
                .text('(万人)');

            itemsDataLeft.forEach(each => renderEachLine(yLeft, each));
        }
        const itemsDataRight = this.#chartDataModel.selectedItemsDataRight();
        itemsDataRight.forEach(item => this.#currentItemsData.push(item));

        if (0 < itemsDataRight.length) {
            const { min, max }  = getMinMax(itemsDataRight);
            const yRight = d3.scaleLinear()
                .domain([ max + 1, Math.max(min - 1, 0)])
                .range([ MARGIN.top, height - MARGIN.bottom ]);

            svg.append('g')
                .attr('class', CLASS_REMOVE_BEFORE_RENDER_LINES)
                .attr('transform', `translate(${width - MARGIN.right} ,0)`)
                .call(d3.axisRight(yRight));

            svg.append('g')
                .attr('class', CLASS_REMOVE_BEFORE_RENDER_LINES)
                .attr('transform', `translate(${width - MARGIN.right} ,18)`)
                .append('text')
                .attr('font-size', '12')
                .text('(%)');

            itemsDataRight.forEach(each => renderEachLine(yRight, each));
        }

        svg.append('g')
            .attr('class', CLASS_REMOVE_BEFORE_RENDER_LINES)
            .append('rect')
            .attr('x', '0')
            .attr('y', '0')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'none')
            .attr('pointer-events', 'all')
            .attr('stroke', 'black')
            .on('mousemove', event => this.#showTooltip(event))
            .on('mouseout', () => {
                if (this.#$tooltip) {
                    this.#$tooltip.style.display = 'none';
                }
            });
    }

    #showTooltip(event) {

        const yearMonths = this.#yearMonths;
        const xCoord = d3.pointer(event)[0];
        const xCoordinates = yearMonths.map((d, i) => this.#chartX(i));
        const nearestDataIndex = this.#nearestDataIndexSearcherLeft(xCoordinates, xCoord);

        const yearMonth = yearMonths[nearestDataIndex];
        if (!yearMonth) {
            return;
        }

        const height = this.#chartSizeModel.height();
        const width = this.#chartSizeModel.width();
        const dataIndex = this.#chartDataModel.dataIndex(yearMonth.year, yearMonth.month);
        const itemsSorted = this.#currentItemsData.sort(
            (a, b) => a.config().index - b.config().index
        );
        const items = itemsSorted.map((currentItem, i) => {
            const config = currentItem.config();
            return {
                id: i,
                color: config.color,
                name: config.description,
                value: currentItem.datum(dataIndex)
            };
        });

        if(!this.#$tooltip) {

            const tooltipTempl = toolTimeTemplate({
                year: yearMonth.year,
                month: yearMonth.month,
                items: items
            });
            this.#$mainChart.insertAdjacentHTML('beforeend', tooltipTempl);
            this.#$tooltip = this.#$mainChart.querySelector('#mainChartTooltip');

        } else {

            const $yearMonth = this.#$tooltip.querySelector('#mainChartTooltipYearMonth');
            $yearMonth.textContent = `${yearMonth.year}年${yearMonth.month}月`;
            items.forEach(item => {
                const $value = this.#$tooltip.querySelector(`#mainChartTooltipValue_${item.id}`);
                $value.textContent = item.value;
            });
        }
        let left = xCoord + 12;
        if (width / 2 < xCoord) {
            left = xCoord - this.#$tooltip.clientWidth - 12;
        }
        this.#$tooltip.style.display = 'block';
        this.#$tooltip.style.top = `${height / 2 - 20}px`;
        this.#$tooltip.style.left = `${left}px`;
    }


    #setUp() {

        const yearMonths = this.#startYearMonthModel.toYearMonths(
            this.#endYearMonthModel.year(), this.#endYearMonthModel.month()
        );
        this.#yearMonths = yearMonths;

        const width = this.#chartSizeModel.width();
        const x = d3.scaleLinear()
            .domain([ 0, yearMonths.length - 1 ])
            .range([ MARGIN.left, width - MARGIN.right ]);

        this.#chartX = x;
    }

    #clearSelectedItemsInfo() {
        if (this.#$tooltip) {
            this.#$tooltip.remove();
        }
        this.#$tooltip = undefined;
        this.#currentItemsData = [];
    }
}
