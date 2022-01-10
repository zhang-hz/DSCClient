<template>
    <div id="echart-main"></div>
</template>

<script>
import { defineComponent, ref } from "vue";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    ToolboxComponent,
    DataZoomComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import {dataTemp} from '/@/dataStorage.js'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    ToolboxComponent,
    DataZoomComponent,
    LineChart,
    CanvasRenderer,
]);

const print = console

export default defineComponent({
    name: "MainChart",
    inject: ["chartOption", "chartSwitch"],
    methods: {
        initChart() {
            let self = this;
            let chart = echarts.init(document.getElementById("echart-main"));
            chart.setOption(self.option);
            setInterval(function () {
                if (!self.chartSwitch.value) {
                    return;
                }
                let option = self.chartOption.value.main;
                chart.setOption({
                    series: [
                        {
                            data: dataTemp[option.catalog][option.channel],
                        },
                    ],
                });
            }, 60);
        },
    },
    data() {
        return {
            option: {
                title: {
                    text: "Driect Voltage CH0",
                },
                xAxis: {
                    type: "value",
                    position: "bottom",
                    splitNumber: 10,
                    min: 0,
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    },
                    splitLine: {
                        show: true,
                        lineStyle:{
                            color:"#666"
                        }
                    },
                    minorTick: {
                        show: true,
                        splitNumber:4,
                    },
                    minorSplitLine: {
                        show: true,
                        lineStyle:{
                            color:"#CCC",
                            type:"dashed"
                        }
                    },
                },
                yAxis: {
                    type: "value",
                    splitLine: {
                        show: true,
                        lineStyle:{
                            color:"#666"
                        }
                    },
                    minorTick: {
                        show: true,
                        splitNumber:4,
                    },
                    minorSplitLine: {
                        show: true,
                        lineStyle:{
                            color:"#CECECE",
                            type:"dashed"
                        }
                    },
                },
                grid: {
                    show: true,
                    left: "45px",
                    right: "45px",
                    bottom:"70px",
                    top:"45px"
                },
                toolbox: {
                    show: true,
                    orient: "horizontal",
                    showTitle: true,
                    feature: {
                        saveAsImage: {
                            type: "png",
                            show: true,
                            pixelRatio: 2,
                        },
                        restore: {},
                        dataZoom: {},
                    },
                },
                dataZoom: [
                    {
                        type: "slider",
                        xAxisIndex: 0,
                        filterMode: "none",
                    },
                    {
                        type: "slider",
                        yAxisIndex: 0,
                        filterMode: "none",
                        right:"10px"
                    },
                    {
                        type: "inside",
                        xAxisIndex: 0,
                        filterMode: "none",
                    },
                    {
                        type: "inside",
                        yAxisIndex: 0,
                        filterMode: "none",
                    },
                ],
                animation: false,
                series: [
                    {
                        name: "Voltage(nV)",
                        type: "line",
                        showSymbol: false,
                        data: [],
                    },
                ],
            },
            data: [],
        };
    },
    mounted() {
        this.initChart();
    },
});
</script>

<style>
#echart-main {
    width: 100%;
    height: 500px;
}
</style>