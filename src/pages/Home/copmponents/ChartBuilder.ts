import Highcharts, { SeriesColumnOptions, XAxisOptions } from 'highcharts';
import { escape, merge } from 'lodash';

const X_AXIS_ID = 'X-Axis';

export const FONT_STYLE: Highcharts.CSSObject = {
    color: '#4B6681',
    fontSize: '12px',
    height: 16,
    fontWeight: '500'
};

class ChartOptionsBuilder {
    chartOptions: Highcharts.Options = {};

    constructor(options?: Highcharts.Options) {
        // set basic options
        this.chartOptions.chart = {
            spacingRight: 8,
            spacingLeft: 0
        };
        this.chartOptions.credits = { enabled: false };
        this.chartOptions.boost = {
            enabled: true,
            allowForce: true,
            seriesThreshold: 20,
            usePreallocated: true
        };
        this.chartOptions.plotOptions = {
            series: {
                states: {
                    hover: {
                        enabled: true,
                        lineWidthPlus: 0
                    }
                },
                // Please don't decrease this without talking with @akshay.
                // This is causing some weird behavior of join end points in case this is quite low in case of comparisons usecase
                boostThreshold: 2880,
                marker: {
                    enabled: true,
                    radius: 0,
                    states: {
                        hover: {
                            enabled: true,
                            radius: 4,
                            radiusPlus: 0,
                            fillColor: '#FFFFFF',
                            lineWidth: 1
                        }
                    }
                }
            },
            spline: {
                lineWidth: 1
            },
            line: {
                lineWidth: 1
            },
            column: {
                borderWidth: 0
            },
            areaspline: {
                fillOpacity: 0.1,
                lineWidth: 1
            }
        };

        this.chartOptions = merge(this.chartOptions, options);
    }

    setTitle(title: string): ChartOptionsBuilder {
        this.chartOptions.title = {};
        this.chartOptions.title.text = title;
        return this;
    }

    setXAxis(title?: string): ChartOptionsBuilder {
        this.chartOptions.xAxis = merge(this.chartOptions.xAxis || {}, {
            tickmarkPlacement: 'on',
            grid: {
                enabled: false
            },
            min: 0,
            title: {
                text: title,
                style: {
                    color: '#F6F7F8',
                    marginTop: 16
                }
            },
            labels: {
                align: 'center',
                style: FONT_STYLE
            },
            visible: true,
            crosshair: true,
            minorTickLength: 0,
            tickLength: 0,
            lineColor: `#C3D1DF`,
            id: X_AXIS_ID
        } as XAxisOptions);
        return this;
    }

    setYAxis(maxValue?: number, yAxisOptions?: Highcharts.YAxisOptions[]): ChartOptionsBuilder {
        this.chartOptions.yAxis = [
            {
                id: 'yAxis1',
                endOnTick: true,
                gridLineWidth: 1,
                gridLineColor: '#F6F7F8',
                visible: false,
                tickColor: '#F6F7F8',
                title: {
                    text: ''
                },
                maxRange: maxValue,
                opposite: false,
                labels: {
                    style: FONT_STYLE,
                    format: yAxisOptions && yAxisOptions[0].labels.format
                }
            }
        ];
        return this;
    }

    clearSeriesData(): ChartOptionsBuilder {
        this.chartOptions.series = [];
        return this;
    }

    setToolTip(showAxisName?: boolean): ChartOptionsBuilder {
        this.chartOptions.tooltip = {
            enabled: true,
            shared: true,
            followPointer: true,
            outside: true,
            useHTML: true,
            formatter: function () {
                if (!this.points) {
                    return '';
                }

                let tooltipText = `<div class='tooltip'>`;
                this.points.forEach((pt, i) => {
                    tooltipText += `<div class='tooltip-series-row' >
                        <div class="square-symbol" style="background-color:${this.points[i].color}; opacity: ${
                        (pt.series as any).opacity - 0.3
                    }"></div>
                        <div class='tooltip-series-name'>
                            ${pt.series.name} ${showAxisName ? ` (${pt.x})` : ''}
                        </div> 
                    </div>`;
                });

                tooltipText += '</div>';
                return tooltipText;
            }
        };
        return this;
    }

    setLegend(showLegend: boolean): ChartOptionsBuilder {
        this.chartOptions.legend = {
            align: 'left',
            maxHeight: 80,
            margin: 16,
            symbolPadding: 0,
            symbolHeight: 0,
            symbolWidth: 0,
            squareSymbol: false,
            symbolRadius: 0,
            itemMarginBottom: 6,
            enabled: showLegend !== false,
            useHTML: true,
            itemStyle: FONT_STYLE,
            labelFormatter: function () {
                const ctx = this as unknown as Highcharts.Point;
                return `
                <div class='legend'>
                    <div class='square-symbol' style="background-color:${ctx.color}"></div>
                    <div class="legend-title" title="${escape(ctx.name)}">${ctx.name}</div>
                </div>
        `;
            }
        };
        return this;
    }

    setSeriesData(series: SeriesColumnOptions[]): ChartOptionsBuilder {
        this.chartOptions.series = series;
        return this;
    }

    build(): Highcharts.Options {
        return this.chartOptions;
    }
}

export default ChartOptionsBuilder;
