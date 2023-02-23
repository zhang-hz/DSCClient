<template>
    <div id="echart-assistant1" class="echart-assistant"></div>
</template>

<script>
import { defineComponent, ref } from "vue";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import {dataTemp} from '/@/dataStorage.js'

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    LineChart,
    CanvasRenderer,
]);

const print = console

export default defineComponent({
    name: "AssistantChartLeft",
    inject: ["chartOption", "chartSwitch"],
    methods: {
        initChart() {
            let self = this;
            let chart = echarts.init(document.getElementById("echart-assistant1"));
            chart.setOption(self.option);
            setInterval(function () {
                if (!self.chartSwitch.value) {
                    return;
                }
                let option = self.chartOption.value.assistant1;
                chart.setOption({
                    title: {
                        text: option.name,
                    },
                    series: [
                        {
                            data: dataTemp[option.catalog][option.channel],
                        },
                    ],
                });
            }, 200);
        },
    },
    data() {
        return {
            option: {
                title: {
                    text: "Assistant Chart",
                    top: 'top',
                    left:"30%",
                    textStyle:{
                        fontSize: 14
                    }
                },
                xAxis: {
                    type: "value",
                    position: "bottom",
                    splitNumber: 4,
                    min: 0,
                    minInterval:1,
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
                        show: false,
                        splitNumber:4,
                    },
                    minorSplitLine: {
                        show: false,
                        lineStyle:{
                            color:"#CCC",
                            type:"dashed"
                        }
                    }
                },
                yAxis: {
                    type: "value",
                    scale:true,
                    minInterval:1,
                    splitLine: {
                        show: true,
                        lineStyle:{
                            color:"#666"
                        }
                    },
                    minorTick: {
                        show: false,
                        splitNumber:4,
                    },
                    minorSplitLine: {
                        show: false,
                        lineStyle:{
                            color:"#CECECE",
                            type:"dashed"
                        }
                    },
                },
                grid: {
                    show: true,
                    left: "40px",
                    right: "0px",
                    bottom:"30px",
                    top:"25px"
                },
                animation: false,
                series: [
                    {
                        name: "Voltage(mV)",
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

</style>