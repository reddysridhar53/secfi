import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const options: Highcharts.Options = {
    chart: {
        type: 'line'
    },
    title: {
        text: 'Exchange Rates (Alpha Vantage)',
    },
    xAxis: {
        categories: [],
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Exchange Rate'
        },
        stackLabels: {
            enabled: true,
            style: {
                fontWeight: 'bold',
                color: ( // theme
                    Highcharts.defaultOptions.title.style &&
                    Highcharts.defaultOptions.title.style.color
                ) || 'gray'
            }
        }
    },
    legend: {
        align: 'right',
        x: -30,
        verticalAlign: 'top',
        y: 25,
        floating: true,
        backgroundColor:
            Highcharts.defaultOptions.legend.backgroundColor || 'white',
        borderColor: '#CCC',
        borderWidth: 1,
        shadow: false,
        useHTML: true,
        labelFormatter: function () {
            const ctx = this as unknown as Highcharts.Point;
            return `<div class='legend'>
                <div class="legend-title" title="${escape(ctx.name)}">${ctx.name}</div>
            </div>`;
        }
    },
    tooltip: {
        shared: true,
        headerFormat: '<b>{point.x}</b><br/>',
        pointFormat: '{series.name}: {point.y}<br/>',
        followPointer: true,
        outside: true,
        useHTML: true,
        formatter: function () {
            if (!this.points) {
                return '';
            }

            let tooltipText = `<div class='tooltip'><h4>Date: ${this.points?.[0].x}</h4>`;
            this.points.forEach((pt, i) => {
                tooltipText += `<div class='tooltip-series-row' >
                    <div class="square-symbol" style="background-color:${this.points[i].color}; opacity: ${
                    (pt.series as any).opacity - 0.3
                }"></div>
                    <div class='tooltip-series-name'>
                        ${pt.series.name} (${pt.y})
                    </div> 
                </div>`;
            });

            tooltipText += '</div>';
            return tooltipText;
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal',
            dataLabels: {
                enabled: true
            }
        }
    },
    series: [],
    credits: {
        enabled: false
    }
}

interface Props {
    data: any;
    dataToShow: any;
    containerElemClass: string;
    loading: boolean;
}

const seriesAvailable = ["1. open", "2. high", "3. low", "4. close"];

const Chart: React.FC<Props> = (props: Props) => {
    const [, setChartRendered] = useState(false);
    const [chartOptions, setChartOptions] = useState<Highcharts.Options>(null);
    const [chartInstance, setChartInstance] = useState<Highcharts.Chart>(null);
    const chartContainerRef = useRef<HTMLDivElement>();
    const { data, dataToShow, containerElemClass, loading } = props;

    const getChartDimensions = useCallback(() => {
        const canvasElem: HTMLElement = chartContainerRef.current;
        if (canvasElem) {
          const widgetItemContainer: Element = canvasElem.closest('.' + containerElemClass);
          const dimensions = widgetItemContainer?.getBoundingClientRect();
          if (dimensions) {
            const height = dimensions.height;
            const width = dimensions.width;
            return {
              width,
              height
            };
          }
        }
        return {
          width: -1,
          height: -1
        };
      }, [chartContainerRef, containerElemClass]);
    
      useEffect(() => {
        if (chartContainerRef.current) {
          setChartRendered(true);
        }
      }, [getChartDimensions, chartContainerRef]);
    
      // Calculate dimensions on every render
      const { width, height } = getChartDimensions();

      const constructSeries = useMemo(
            () => {
                return seriesAvailable.map((seriesName: string) => {
                    let lSeries = dataToShow?.reverse().map((d: string) => {
                        const dr = data[d];
                        return parseFloat(dr[seriesName])
                    });
                    return {
                        name: seriesName,
                        type: undefined,
                        data: lSeries,
                    }
                })
    }, [dataToShow, data])
    
      useEffect(() => {
        if (height <= 0 || !width) {
          return;
        }
        const chartOptions = {
            ...options,
            xAxis: {
                categories: dataToShow?.reverse(),
            },
            series: constructSeries,
        }
        
        setChartOptions(chartOptions);
      }, [width, height, data, dataToShow]);
    
      useEffect(() => {
        if (!chartInstance) {
          return;
        }
        chartInstance.redraw();
    
      }, [chartInstance]);
    
    const highchartsCallback = useCallback((chart) => setChartInstance(chart), []);    

    return (
        <div className="chart-container" ref={chartContainerRef}>
            {
                chartOptions &&
                    <HighchartsReact
                        callback={highchartsCallback}
                        highcharts={Highcharts}
                        options={chartOptions}
                        loadinng={loading}
                    />
            }
        </div>
    )
};

export default Chart;
