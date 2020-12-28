import * as d3 from 'd3';

export default class BasicTabulation_ {



    constructor() {

        const data = [
            [ 2020, 1, 3.4 ],
            [ 2020, 2, 3.1 ],
            [ 2020, 3, 2.9 ],
            [ 2020, 4, 2.1 ],
            [ 2020, 5, 3.5 ],
            [ 2020, 6, 4.1 ],
            [ 2020, 7, 4.1 ],
            [ 2020, 8, 1.1 ],
            [ 2020, 9, 2.1 ],
            [ 2020, 10, 3.0 ],
        ];
        const values = data.map(d => d[2]);

        const CHART_SIZE = {
            width: 400,
            height: 225
        };

        const MARGIN = {
            top: 20, right: 30, bottom: 30, left: 40
        };

        const x = d3.scaleLinear()
            .domain([ 0, data.length - 1 ])
            .range([ MARGIN.left, CHART_SIZE.width - MARGIN.right ]);

        const dataMin = values.reduce((a, b) => a < b ? a : b);
        const dataMax = values.reduce((a, b) => a > b ? a : b);
        const yLeft = d3.scaleLinear()
            .domain([ dataMax + 1, Math.max(dataMin - 1, 0)])
            .range([ MARGIN.top, CHART_SIZE.height - MARGIN.bottom ])

        console.log(x(0))
        console.log(x.invert(x(100)))

        const svg = d3.select('#mainChart')
                          .append('svg')
                          .attr('width', CHART_SIZE.width)
                          .attr('height', CHART_SIZE.height);

        console.log(d3.axisBottom(x));
        svg.append('g')
            .attr('class', 'hoge')
            .attr('transform', `translate(0, ${CHART_SIZE.height - MARGIN.bottom})`)
            .call(
                    d3.axisBottom(x)
                        .tickFormat(d => {
                            return `${data[d][0]}/${data[d][1]}`;
                        })
                 );

       svg.append('g')
           .attr('transform', `translate(${MARGIN.left} ,0)`)
           .call(d3.axisLeft(yLeft));

       const draw = context => {
           context.moveTo(x(0), yLeft(values[0]));
           for (let valueIndex = 1; valueIndex < values.length; valueIndex++) {
               context.lineTo(x(valueIndex), yLeft(values[valueIndex]));
           }
           return context;
       };
       svg.append('g')
           .append('path')
           .style('stroke', 'black')
           .style('fill', 'none')
           .attr('d', draw(d3.path()).toString());

       const xCoordinates = data.map((d, i) => x(i));
       const nearestXIndexSearcher = d3.bisector(x => x).left;
       console.log(xCoordinates);
       svg.append('g')
           .append('rect')
           .attr('x', '0')
           .attr('y', '0')
           .attr('width', CHART_SIZE.width)
           .attr('height', CHART_SIZE.height)
           .attr('fill', 'none')
           .attr('pointer-events', 'all')
           .attr('stroke', 'black')
           .on('mousemove', event => {
               console.log(d3.pointer(event));
               const x = d3.pointer(event)[0];
               const nearestXIndex = nearestXIndexSearcher(xCoordinates, x);
               console.log(`${x} -> ${nearestXIndex}`);

           })

    }
}
