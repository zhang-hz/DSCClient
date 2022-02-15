<template>
    <div id="testcard" class="controlcard">
        <el-row id="chartcontrol" class="testitem">
            <el-row class="testtitle">图表</el-row>
            <el-row class="testinput">
                <el-select
                    v-model="chart.postion.value"
                    placeholder="图表"
                    id="testchartselect"
                >
                    <el-option
                        v-for="item in chart.postion.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    ></el-option>
                </el-select>
                <el-select
                    v-model="chart.catalog.value"
                    class="m-2"
                    placeholder="数据类型"
                    id="testcatalogselect"
                >
                    <el-option
                        v-for="item in chart.catalog.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
                <el-select
                    v-model="chart.channel.value" class="m-2"
                    placeholder="通道"
                    id="testchannelselect"
                >
                    <el-option
                        v-for="item in chart.channel.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                    >
                    </el-option>
                </el-select>
            </el-row>
            <el-row>
                <el-button
                    :disabled="chartSwitch.value"
                    class="testbutton"
                    @click="startMonitor"
                    >开始</el-button
                >
                <el-button
                    :disabled="!chartSwitch.value"
                    class="testbutton"
                    @click="stopMonitor"
                    >停止</el-button
                >
                <el-button
                    :disabled="chartSwitch.value"
                    class="testbutton"
                    @click="resetMonitor"
                    >清空</el-button
                >
                <el-button
                    :disabled="chartSwitch.value"
                    class="testbutton"
                    @click="setMonitor"
                    >设定</el-button
                >
            </el-row>
        </el-row>
        <el-row id="chartcontrol" class="testitem">
            <el-row class="testtitle">保存数据</el-row>
            <el-row class="testrow">
                <el-col class="testcol" id="saverinput">
                <el-input
                    v-model="saver.filename"
                    placeholder="文件名"
                    id="saverfilename"
                >
                </el-input>
                </el-col>
                <el-col class="testcol">
                <el-button
                    :disabled="chartSwitch.value"
                    class="testbutton"
                    @click="saveDataToFile"
                    id="testsaverbutton"

                    >保存</el-button
                >
                </el-col>
            </el-row>
        </el-row>
        <el-row id="chartcontrol" class="testitem">
            <el-row class="testtitle">温度控制</el-row>
            <el-row class="testrow">
                <el-row class="testinput">                
                    <el-input
                    v-model="heater.temperature"
                    placeholder="温度"
                    id="heatertemperature"
                >
                </el-input></el-row>

            </el-row>
            <el-row class="testrow">
                <el-button
                    :disabled="!heater.enable||heater.started"
                    class="testbutton"
                    @click="startHeaterStaticLocal" >
                    启动
                </el-button>
                <el-button
                    :disabled="!heater.started"
                    class="testbutton"
                    @click="stopHeaterStaticLocal">
                    停止
                </el-button>
                <el-button
                    :disabled="!heater.enable&&!heater.started"
                    class="testbutton"
                    id="testsaverbutton"
                    @click="setupHeaterTemperatureLocal" >
                    设定
                </el-button>
            </el-row>
        </el-row>
                <el-row id="chartcontrol" class="testitem">
            <el-row class="testtitle">控制器设定</el-row>
            <el-row class="testrow">
                <el-row class="testinput">
                <el-input v-model="pid.kp" placeholder="Kp">
                    <template #prepend class="testinputappend">P</template>
                </el-input>
                <el-input v-model="pid.ki" placeholder="Ki">
                    <template #prepend class="testinputappend">I</template>
                </el-input>
                <el-input v-model="pid.kd" placeholder="Kd">
                    <template #prepend class="testinputappend">D</template>
                </el-input>
                <el-input v-model="pid.tolerance" placeholder="Tolerence">
                    <template #prepend class="testinputappend">Tr</template>
                </el-input>
                <el-input v-model="pid.kd" placeholder="ErrorTolerence">
                    <template #prepend class="testinputappend">ET</template>
                </el-input>
                </el-row>
                
            </el-row>
            <el-row class="testrow">
                <el-button
                    class="testbutton"
                    id="testpidsetting" 
                    @click="setupHeaterPIDParametersLocal">
                    设定
                </el-button>
                </el-row>
        </el-row>
    </div>
</template>

<script>
import { defineComponent } from "vue";

const print = console

export default defineComponent({
    name: "TestCard",
    inject: [
        "chartSwitch",
        "startChart",
        "stopChart",
        "resetChart",
        "settingChart",
        "saveData",
        "startHeaterStatic",
        "stopHeaterStatic",
        "setupHeaterTemperature",
        "setupHeaterPIDParameters",
        "getHeaterPIDParameters",
    ],
    methods: {
        startMonitor() {
            window.ipcRenderer.send("startsendtochart", " ");
            this.startChart();
        },
        stopMonitor() {
            window.ipcRenderer.send("stopsendtochart", " ");
            this.stopChart();
        },
        resetMonitor() {
            this.resetChart();
        },
        setMonitor() {
            this.settingChart({
                chart: this.chart.postion.value,
                catalog: this.chart.catalog.value,
                channel: this.chart.channel.value,
            });
        },
        async startHeaterStaticLocal(){
            await this.startHeaterStatic(this.heater.temperature)
            this.heater.started= true
        },
        async stopHeaterStaticLocal(){
            await this.stopHeaterStatic()
            this.heater.started= false
        },
        async setupHeaterTemperatureLocal(){
            await this.setupHeaterTemperature(this.heater.temperature)
        },
        async setupHeaterPIDParametersLocal(){
            this.heater.enable = true
            await this.setupHeaterPIDParameters({
                kp: this.pid.kp,
                ki: this.pid.ki,
                kd: this.pid.kd,
                tolerance: this.pid.tolerance,
                errorTolerance: this.pid.errorTolerance,
            })
        },
        async getHeaterPIDParametersLocal(){
            const {kp, ki, kd, tolerance, errorTolerance} = await this.getHeaterPIDParameters()
            this.pid.kp = kp
            this.pid.ki = ki
            this.pid.kd = kd
            this.pid.tolerance = tolerance
            this.pid.errorTolerance = errorTolerance
        },
        async saveDataToFile(){

            let path = await window.dataSaver.selectPath(window.dataSaver.path.join(this.saver.path, (this.saver.filename!=""?this.saver.filename:"Untitled")+".csv"))
            if(path.canceled){
                this.saver.path = ""
                return
            }

            this.saver.path = window.dataSaver.path.dirname(path.filePath)
            await this.saveData(path.filePath)
            
        }

    },
    data() {
        return {
            saver: {
                filename: "",
                path: window.dataSaver.defaultPath(),
            },
            heater:{
                temperature:120,
                enable:false,
                started:false
            },
            pid: {
                kp: 9e-4,
                ki: 0,
                kd: 0,
                tolerance: 600000,
                errorTolerance: 50000,
            },
            chart: {
                postion: {
                    value: "",
                    options: [
                        {
                            value: "main",
                            label: "Main",
                        },
                    ],
                },
                catalog: {
                    value: "",
                    options: [
                        {
                            value: "voltage",
                            label: "电压信号",
                        },
                    ],
                },
                channel: {
                    value: "",
                    options: [
                        {
                            value: 0,
                            label: "CH 0",
                        },
                        {
                            value: 1,
                            label: "CH 1",
                        },
                        {
                            value: 2,
                            label: "CH 2",
                        },
                        {
                            value: 3,
                            label: "CH 3",
                        },
                        {
                            value: 4,
                            label: "差分输出",
                        },
                    ],
                },
            },
        };
    },
});
</script>

<style>
.testitem {
    padding: 12px 12px;
    margin-bottom: 20px;
    border-radius: 6px;
    background: #f2f6fc;
}
.testtitle {
    width: 100%;
    padding-bottom: 16px;
    color: #303133;
}
.testrow{
    width: 100%;
}
.testcol{
    flex: 0 0 auto;
}
.testinput {
    padding-bottom: 20px;
    width: 100%;
}
.testbutton {
    width: 62px;
    margin-right: 5px;
    margin-left: 0px!important;
    padding: 10px;
}
.testrow .el-input-group__prepend {
    width: 40px;
}
#testchartselect {
    width: 70px;
}
#testcatalogselect {
    width: 100px;
}
#testchannelselect {
    width: 100px;
}
#saverinput{
    width: 198px;
    margin-right:10px;
}
#testchartselect.el-input__inner {
    padding: 0 10px;
}
#saverfilename.el-input__inner {
    padding: 0 10px;
}
#savepathselector {
    width: 80px;
    padding: 0;
}
#testsaverbutton{
    margin: 0 0 0 10px;
}
</style>
