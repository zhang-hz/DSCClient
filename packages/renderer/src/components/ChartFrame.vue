<template>
    <div class="chartrow">
        <main-chart></main-chart>
    </div>
    <div class="chartrow">
        <div class="chartcol">
            <assistant-chart-left></assistant-chart-left>
        </div>
        <div class="chartcol">
            <assistant-chart-mid></assistant-chart-mid>
        </div>
        <div class="chartcol">
            <assistant-chart-right></assistant-chart-right>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent } from "vue";
import MainChart from "/@/components/MainChart.vue";
import AssistantChartLeft from "/@/components/AssistantChartLeft.vue";
import AssistantChartMid from "/@/components/AssistantChartMid.vue";
import AssistantChartRight from "/@/components/AssistantChartRight.vue";
import { dataTemp, dataStorage } from "/@/dataStorage.js";
import { dataDownSampleRate, displayDownSampleRate } from "/@/sampleSetting.js";

const print = console;

export default defineComponent({
    name: "ChartFrame",
    components: {
        MainChart,AssistantChartLeft,AssistantChartMid,AssistantChartRight
    },
    inject: ["timeOffset", "chartSwitch"],
    provide() {
        return {};
    },
    mounted() {
        let self = this;

        window.ipcRenderer.on("socketData", (event, message) => {
            if (!self.chartSwitch.value) {
                return;
            }
            let startTime = event.time.getTime() + event.time_ns / 1000000;
            if (self.justStart) {
                self.resetData();
                self.data.timeOffset = startTime;
                dataTemp.timeOffset = startTime;
                dataStorage.timeOffset = startTime;
                self.justStart = false;
            }

            let timeOffset = self.data.timeOffset;
            let dataLength = event.dataLength;
            let interval = event.interval;
            let voltage = event.voltage;
            let heater = event.heater;
            let power = event.power;
            let time = 0;
            let vtemp = 0;
            let htemp = 0;
            let ptemp = 0;


            let n = 0;

            for (let i = 0; i < dataLength; i++) {

                time = (startTime + i * interval/1e6 - timeOffset)/1000;
                n = 0;

                let dataDSR = dataDownSampleRate.value;
                let displayDSR = displayDownSampleRate.value;
                
                for (n = 0; n < voltage.length; n++) {
                    vtemp = voltage[n][i] / 1e6;
                    if (i % displayDSR == 0) {
                        dataTemp.voltage[n].push([time, vtemp]);
                    }
                    if(i % dataDSR == 0) {
                        dataStorage.voltage[n].push([time, vtemp]);
                    }
                }

                for (n = 0; n < heater.length; n++) {
                    htemp = heater[n][i] / 1e6;
                    if (i % displayDSR == 0) {
                        dataTemp.heater[n].push([time, htemp]);
                    }
                    if(i % dataDSR == 0) {
                        dataStorage.heater[n].push([time, htemp]);
                    }
                }

                for (n = 0; n < power.length; n++) {
                    ptemp = power[n][i] / 1e6;
                    if (i % displayDSR == 0) {
                        dataTemp.power[n].push([time, ptemp]);
                    }
                    if(i % dataDSR == 0) {
                        dataStorage.power[n].push([time, ptemp]);
                    }
                }
            }

            return;
        });
    },
    data() {
        return {
            data: {
                timeOffset: 0,
            },
            justStart: true,
        };
    },
    methods: {
        startChartEvent() {
            this.resetData();
            this.justStart = true;
        },
        stopChartEvent() {},
        resetChartEvent() {
            this.resetData();
        },
        async saveDataToFile(path) {
            await window.dataSaver.csv(
                {
                    setting: {
                        timeOffset: dataStorage.timeOffset,
                    },
                    sheet: {
                        voltage: dataStorage.voltage,
                        heater:dataStorage.heater,
                        power:dataStorage.power
                    },
                },
                path
            );
        },
        resetData() {
            dataTemp.voltage = [[], [], [], [], []];
            dataTemp.heater = [[], [], []];
            dataTemp.power = [[], [], []];
            dataTemp.timeOffset = 0;
            this.data.timeOffset = 0;
            dataStorage.voltage = [[], [], [], [], []];
            dataStorage.heater = [[], [], []];
            dataStorage.power = [[], [], []];
            dataStorage.timeOffset = 0;
        },
    },
});
</script>

<style>
.chartrow {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 5px 0 0 0;
}
.chartcol {
    display: flex;
}
.echart-assistant {
    width: 270px;
    height: 275px;
}
</style>