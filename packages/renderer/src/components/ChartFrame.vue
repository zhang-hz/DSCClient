<template>
    <div class="chartrow">
        <main-chart></main-chart>
    </div>
    <div class="chartrow">
        <div
            class="chartcol"
            id="echart-assist1"
            style="width: 350px; height: 240px"
        ></div>
        <div
            class="chartcol"
            id="echart-assist2"
            style="width: 350px; height: 240px"
        ></div>
        <div
            class="chartcol"
            id="echart-assist3"
            style="width: 350px; height: 240px"
        ></div>
    </div>
</template>

<script>
import { computed, defineComponent } from "vue";
import MainChart from "/@/components/MainChart.vue";
import {dataTemp, dataStorage} from '/@/dataStorage.js'

const print = console

export default defineComponent({
    name: "ChartFrame",
    components: {
        MainChart,
    },
    inject:["timeOffset","chartSwitch"],
    provide(){
        return{
        }
    },
    mounted() {
        let self = this

        window.ipcRenderer.on("socketData", (event, message) => {
            if(!self.chartSwitch.value){
                return
            }
            let startTime = event.time.getTime() + event.time_ns / 1000000;
            if(self.justStart){
                self.resetData()
                self.data.timeOffset = startTime
                dataTemp.timeOffset = startTime
                dataStorage.timeOffset = startTime
                self.justStart = false
            }

            let timeOffset = self.data.timeOffset
            let voltage = event.voltage;
            let time = 0;
            let vtemp = 0;
            for(let n = 0;n < voltage.length; n++){
                for (let i = 0; i < voltage[n].length; i++) {
                    time = startTime + i * 0.02 - timeOffset
                    vtemp = voltage[n][i]/1e6
                    if(i == 0||i==250){
                        dataTemp.voltage[n].push([time, vtemp])
                    }
                    if( i%10 == 0 ){
                        dataStorage.voltage[n].push([time, vtemp])
                    }
                }
            }
            
            return
        });
    },
    data(){
        return{
            data:{
                timeOffset:0
            },
            justStart:true,

        }
    },
    methods:{
        startChartEvent(){
            this.resetData()
            this.justStart = true
        },
        stopChartEvent(){
        },
        resetChartEvent(){
            this.resetData()
        },
        async saveDataToFile(path){
            await window.dataSaver.excel({
                setting:{
                    timeOffset:dataStorage.timeOffset
                },
                sheet:{
                    voltage:dataStorage.voltage
                }
            },path)
        },
        resetData(){
            dataTemp.voltage = [[],[],[],[],[]]
            dataTemp.timeOffset = 0
            this.data.timeOffset = 0
            dataStorage.voltage = [[],[],[],[],[]]
            dataStorage.timeOffset = 0
        }
    }
});
</script>

<style>
.chartrow {
    display: flex;
    flex-direction: row;
    justify-content: center;
    padding: 20px 0 0 0;
}
.chartcol {
    display: flex;
}
</style>