<template>
<el-scrollbar>
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
            <el-row class="testtitle">功率补偿</el-row>
            <el-row class="testrow">
                <el-col class="testcol" id="saverinput">
                    <el-select v-model="compensator.start" class="m-2" placeholder="Select">
                    <el-option
                        v-for="item in compensator.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-col>
                <el-col class="testcol">
                <el-button
                    :disabled="!compensator.enable"
                    class="testbutton"
                    @click="setupAutoCompensatorLocal"
                    id="testsaverbutton"

                    >设定</el-button
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
                    @click="setupHeaterStaticTemperatureLocal" >
                    设定
                </el-button>
            </el-row>
        </el-row>
        <el-row id="chartcontrol" class="testitem">
            <el-row class="testtitle">程序升温</el-row>
            <el-row class="testrow">
                <el-row class="testinput">                
                    <el-input
                    v-model="progHeater.speed"
                    placeholder="升温速率"
                    id="progheaterspeed"
                ><template #prepend class="testinputappend">升温速率</template>
                <template #append class="testinputappend">℃/s</template>
                </el-input>
                <el-input
                    v-model="progHeater.cool"
                    placeholder="降温速率"
                    id="progcoolspeed"
                ><template #prepend class="testinputappend">降温速率</template>
                <template #append class="testinputappend">℃/s</template>
                </el-input>
                <el-input
                    v-model="progHeater.maxTemperature"
                    placeholder="最高温度"
                    id="progheatermaxtemperature"
                ><template #prepend class="testinputappend">最高温度</template>
                <template #append class="testinputappend">&nbsp℃&nbsp</template>
                </el-input>
                <el-input
                    v-model="progHeater.baseTemperature"
                    placeholder="基础温度"
                    id="progheaterbasetemperature"
                ><template #prepend class="testinputappend">基础温度</template>
                <template #append class="testinputappend">&nbsp℃&nbsp</template>
                </el-input></el-row>

            </el-row>
            <el-row class="testrow">
                <el-button
                    :disabled="!progHeater.enable||progHeater.started"
                    class="testbutton"
                    @click="startHeaterProgramLocal" >
                    启动
                </el-button>
                <el-button
                    :disabled="!progHeater.started"
                    class="testbutton"
                    @click="stopHeaterProgramLocal">
                    停止
                </el-button>
            </el-row>
        </el-row>
        <el-row id="chartcontrol" class="testitem">
            <el-row class="testtitle">闭环控温PID设定</el-row>
            <el-row class="testrow">
                <el-row class="testinput">
                <el-input v-model="heaterPID.kp" placeholder="Kp">
                    <template #prepend class="testinputappend">P</template>
                </el-input>
                <el-input v-model="heaterPID.ki" placeholder="Ki">
                    <template #prepend class="testinputappend">I</template>
                </el-input>
                <el-input v-model="heaterPID.kd" placeholder="Kd">
                    <template #prepend class="testinputappend">D</template>
                </el-input>
                <el-input v-model="heaterPID.tolerance" placeholder="Tolerence">
                    <template #prepend class="testinputappend">Tr</template>
                </el-input>
                <el-input v-model="heaterPID.errorTolerance" placeholder="ErrorTolerance">
                    <template #prepend class="testinputappend">ET</template>
                </el-input>
                <el-input v-model="heaterPID.initialValue" placeholder="InitialValue">
                    <template #prepend class="testinputappend">IV</template>
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
                <el-button
                    class="testbutton"
                    id="testpidsetting" 
                    @click="getHeaterPIDParametersLocal">
                    获取
                </el-button>
                </el-row>
        </el-row>

        <el-row id="chartcontrol" class="testitem">
            <el-row class="testtitle">功率补偿PID设定</el-row>
            <el-row class="testrow">
                <el-row class="testinput">
                <el-input v-model="compensatorPID.kp" placeholder="Kp">
                    <template #prepend class="testinputappend">P</template>
                </el-input>
                <el-input v-model="compensatorPID.ki" placeholder="Ki">
                    <template #prepend class="testinputappend">I</template>
                </el-input>
                <el-input v-model="compensatorPID.kd" placeholder="Kd">
                    <template #prepend class="testinputappend">D</template>
                </el-input>
                <el-input v-model="compensatorPID.tolerance" placeholder="Tolerence">
                    <template #prepend class="testinputappend">Tr</template>
                </el-input>
                <el-input v-model="compensatorPID.errorTolerance" placeholder="ErrorTolerance">
                    <template #prepend class="testinputappend">ET</template>
                </el-input>
                <el-input v-model="compensatorPID.initialValue" placeholder="InitialValue">
                    <template #prepend class="testinputappend">IV</template>
                </el-input>
                </el-row>
                
            </el-row>
            <el-row class="testrow">
                <el-button
                    class="testbutton"
                    id="testpidsetting" 
                    @click="setupCompensatorPIDParametersLocal">
                    设定
                </el-button>
                <el-button
                    class="testbutton"
                    id="testpidsetting" 
                    @click="getCompensatorPIDParametersLocal">
                    获取
                </el-button>
                </el-row>
        </el-row>
    </div>
</el-scrollbar>
</template>

<script>
import { defineComponent } from "vue";

const print = console

export default defineComponent({
    name: "TestCard",
    inject: [
        "setDACVoltage",
        "chartSwitch",
        "startChart",
        "stopChart",
        "resetChart",
        "settingChart",
        "saveData",
        "fetchAvgVoltage",
        "startHeaterProgram",
        "stopHeaterProgram",
        "startHeaterStatic",
        "stopHeaterStatic",
        "setupHeaterStaticTemperature",
        "setupHeaterPIDParameters",
        "getHeaterPIDParameters",
        "setupCompensatorPIDParameters",
        "getCompensatorPIDParameters",
        "startAutoCompensator",
        "stopAutoCompensator",
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
            let catalogName = "";
            let chanelName = ["敏感热堆","参考热堆","敏感加热器","参考加热器","器件差分"]
            switch(this.chart.catalog.channel){
                case "voltage":
                    catalogName = "输出电压(mV)"
                    break;
                case "heater":
                    catalogName = "加热电压(mV)"
                    break;
                case "power":
                    catalogName = "加热功率(mW)"
                    break;
                default:
                    catalogName = "输出电压(mV)"
            }
            this.settingChart({
                chart: this.chart.postion.value,
                catalog: this.chart.catalog.value,
                channel: this.chart.channel.value,
                name:chanelName[this.chart.channel.value]+catalogName
            });
        },
        async startHeaterProgramLocal(){
            await this.setDACVoltage("TP2", 0)
            let baseVoltage = await this.fetchAvgVoltage();
            await this.startHeaterProgram(baseVoltage[1],this.progHeater.speed,this.progHeater.cool,this.progHeater.maxTemperature,this.progHeater.baseTemperature)
            this.progHeater.started= true
        },
        async stopHeaterProgramLocal(){
            await this.stopHeaterProgram()
            this.progHeater.started= false
        },
        async startHeaterStaticLocal(){
            await this.setDACVoltage("TP2", 0)
            let baseVoltage = await this.fetchAvgVoltage();
            await this.startHeaterStatic(this.heater.temperature, baseVoltage[1])
            this.heater.started= true
        },
        async stopHeaterStaticLocal(){
            await this.stopHeaterStatic()
            this.heater.started= false
        },
        async setupHeaterStaticTemperatureLocal(){
            await this.setupHeaterStaticTemperature(this.heater.temperature)
        },
        async setupAutoCompensatorLocal(){
            if (this.compensator.start){
                await this.startAutoCompensator();
            }else{
                await this.stopAutoCompensator();
            }
        },
        async setupHeaterPIDParametersLocal(){
            this.heater.enable = true
            this.progHeater.enable = true
            await this.setupHeaterPIDParameters({
                kp: this.heaterPID.kp,
                ki: this.heaterPID.ki,
                kd: this.heaterPID.kd,
                tolerance: this.heaterPID.tolerance,
                errorTolerance: this.heaterPID.errorTolerance,
                initialValue: this.heaterPID.initialValue
            })
        },
        async getHeaterPIDParametersLocal(){
            const {kp, ki, kd, tolerance, errorTolerance,initialValue} = await this.getHeaterPIDParameters()
            this.heaterPID.kp = kp
            this.heaterPID.ki = ki
            this.heaterPID.kd = kd
            this.heaterPID.tolerance = tolerance
            this.heaterPID.errorTolerance = errorTolerance
            this.heaterPID.initialValue = initialValue
        },

        async setupCompensatorPIDParametersLocal(){
            this.compensator.enable = true
            await this.setupCompensatorPIDParameters({
                kp: this.compensatorPID.kp,
                ki: this.compensatorPID.ki,
                kd: this.compensatorPID.kd,
                tolerance: this.compensatorPID.tolerance,
                errorTolerance: this.compensatorPID.errorTolerance,
                initialValue: this.compensatorPID.initialValue
            })
        },
        async getCompensatorPIDParametersLocal(){
            const {kp, ki, kd, tolerance, errorTolerance,initialValue} = await this.getCompensatorPIDParameters()
            this.compensatorPID.kp = kp
            this.compensatorPID.ki = ki
            this.compensatorPID.kd = kd
            this.compensatorPID.tolerance = tolerance
            this.compensatorPID.errorTolerance = errorTolerance
            this.compensatorPID.initialValue = initialValue
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
            compensator: {
                start:false,
                enable:false,
                options:[
                    {
                        label:"开启",
                        value:true
                    },
                    {
                        label:"关闭",
                        value:false
                    }
                ]
            },
            heater:{
                temperature:120,
                enable:false,
                started:false
            },
            progHeater:{
                speed:10,
                cool:10,
                maxTemperature:400,
                baseTemperature:23,
                enable:false,
                started:false
            },
            heaterPID: {
                kp: 9e-4,
                ki: 0,
                kd: 0,
                tolerance: 600000,
                errorTolerance: 1200000,
                initialValue:500
            },
            compensatorPID: {
                kp: 9e-4,
                ki: 0,
                kd: 0,
                tolerance: 600000,
                errorTolerance: 1200000,
                initialValue:500
            },
            chart: {
                postion: {
                    value: "",
                    options: [
                        {
                            value: "main",
                            label: "Main",
                        },
                        {
                            value: "assistant1",
                            label: "S1",
                        },
                        {
                            value: "assistant2",
                            label: "S2",
                        },
                        {
                            value: "assistant3",
                            label: "S3",
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
                        {
                            value: "heater",
                            label: "加热电压",
                        },
                        {
                            value: "power",
                            label: "加热功率",
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
#chartcontrol > div:nth-child(3) > button:nth-child(1) {
    margin-left: 2px!important;
}
.testrow .el-input-group__prepend {
    width: 40px;
}
#testchartselect {
    width: 40px;
}
#testcatalogselect {
    width: 58px;
}
#testchannelselect {
    width: 40px;
}
#saverinput{
    width: 198px;
    margin-right:10px;
}
#testchartselect.el-input__inner {
    padding: 0 2px;
}
#saverfilename.el-input__inner {
    padding: 0 5px;
}
#savepathselector {
    width: 80px;
    padding: 0;
}
#testsaverbutton{
    margin: 0 0 0 10px;
}
</style>
