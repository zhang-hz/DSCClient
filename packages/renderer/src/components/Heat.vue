<template>
    <el-scrollbar>
        <div id="heatcard" class="controlcard">

            <el-row id="chartcontrol" class="heatitem">
                <el-row class="heattitle">快速设置</el-row>
                <el-row class="heatrow">
                    <el-row class="heatinput">
                        <el-input v-model="progHeaterQuick.speed" placeholder="升温速率" id="progheaterspeed"><template #prepend
                                class="heatinputappend">升温速率</template>
                            <template #append class="heatinputappend">℃/s</template>
                        </el-input>
                        <el-input v-model="progHeaterQuick.cool" placeholder="降温速率" id="progcoolspeed"><template #prepend
                                class="heatinputappend">降温速率</template>
                            <template #append class="heatinputappend">℃/s</template>
                        </el-input>
                        <el-input v-model="progHeaterQuick.holdTime" placeholder="保持时间" id="progheaterholdtime"><template
                                #prepend class="heatinputappend">保持时间</template>
                            <template #append class="heatinputappend">&nbsp秒&nbsp</template>
                        </el-input>
                        <el-input v-model="progHeaterQuick.maxTemperature" placeholder="最高温度"
                            id="progheatermaxtemperature"><template #prepend class="heatinputappend" >最高温度</template>
                            <template #append class="heatinputappend">&nbsp℃&nbsp</template>
                        </el-input>
                        <el-input v-model="progHeaterQuick.baseTemperature" placeholder="基础温度"
                            id="progheaterbasetemperature"><template #prepend class="heatinputappend" >基础温度</template>
                            <template #append class="heatinputappend">&nbsp℃&nbsp</template>
                        </el-input></el-row>

                </el-row>
                <el-row class="heatrow">
                    <el-button class="heatbutton" @click="setupHeaterProgramQuick">
                        设定
                    </el-button>
                </el-row>
            </el-row>

            <el-row id="chartcontrol" class="heatitem">
                <el-row class="heattitle">高级控温设定</el-row>
                <el-row class="heatrowpad">
                    <el-input v-model="progHeaterAdv.baseTemperature" placeholder="基础温度"
                        id="progheaterbasetemperature"><template #prepend class="heatinputappend">基础温度</template>
                        <template #append class="heatinputappend">&nbsp℃&nbsp</template>
                    </el-input>
                </el-row>
                <el-row class="heatrowpad">
                    <el-col class="heatcol" id="advheatinput">
                        <el-input v-model="progHeaterAdv.filename" placeholder="温控程序文件" id="advheatfilename">
                        </el-input>
                    </el-col>
                    <el-col class="heatcol">
                        <el-button class="heatbutton" @click="loadAdvancedProgram" id="heatadvheatbutton">加载</el-button>
                    </el-col>
                </el-row>
                <el-row class="heatrowpad">
                    <el-table :data="progHeaterAdvTable" border style="width: 100%" class="heatprogtable">
                        <el-table-column prop="type" label="Type" width="54" />
                        <el-table-column prop="startTemperature" label="Start" width="54" />
                        <el-table-column prop="stopTemperature" label="End" width="54" />
                        <el-table-column prop="speed" label="Speed" width="54" />
                        <el-table-column prop="time" label="Time" width="54" />
                    </el-table>
                </el-row>
                <el-row class="heatrowpad">
                    <el-button class="heatbutton" @click="setupHeaterProgramAdv">
                        设定
                    </el-button>
                </el-row>
            </el-row>

            <el-row id="chartcontrol" class="heatitem">
                <el-row class="heattitle">闭环控温PID设定</el-row>
                <el-row class="heatrow">
                    <el-row class="heatinput">
                        <el-input v-model="heaterPID.kp" placeholder="Kp">
                            <template #prepend class="heatinputappend">P</template>
                        </el-input>
                        <el-input v-model="heaterPID.ki" placeholder="Ki">
                            <template #prepend class="heatinputappend">I</template>
                        </el-input>
                        <el-input v-model="heaterPID.kd" placeholder="Kd">
                            <template #prepend class="heatinputappend">D</template>
                        </el-input>
                        <el-input v-model="heaterPID.tolerance" placeholder="Tolerence">
                            <template #prepend class="heatinputappend">Tr</template>
                        </el-input>
                        <el-input v-model="heaterPID.errorTolerance" placeholder="ErrorTolerance">
                            <template #prepend class="heatinputappend">ET</template>
                        </el-input>
                        <el-input v-model="heaterPID.initialValue" placeholder="InitialValue">
                            <template #prepend class="heatinputappend">IV</template>
                        </el-input>
                    </el-row>

                </el-row>
                <el-row class="heatrow">
                    <el-button class="heatbutton" id="heatpidsetting" @click="setupHeaterPIDParametersLocal">
                        设定
                    </el-button>
                    <el-button class="heatbutton" id="heatpidsetting" @click="getHeaterPIDParametersLocal">
                        获取
                    </el-button>
                </el-row>
            </el-row>

            <el-row id="chartcontrol" class="heatitem">
                <el-row class="heattitle">功率补偿PID设定</el-row>
                <el-row class="heatrow">
                    <el-row class="heatinput">
                        <el-input v-model="compensatorPID.kp" placeholder="Kp">
                            <template #prepend class="heatinputappend">P</template>
                        </el-input>
                        <el-input v-model="compensatorPID.ki" placeholder="Ki">
                            <template #prepend class="heatinputappend">I</template>
                        </el-input>
                        <el-input v-model="compensatorPID.kd" placeholder="Kd">
                            <template #prepend class="heatinputappend">D</template>
                        </el-input>
                        <el-input v-model="compensatorPID.tolerance" placeholder="Tolerence">
                            <template #prepend class="heatinputappend">Tr</template>
                        </el-input>
                        <el-input v-model="compensatorPID.errorTolerance" placeholder="ErrorTolerance">
                            <template #prepend class="heatinputappend">ET</template>
                        </el-input>
                        <el-input v-model="compensatorPID.initialValue" placeholder="InitialValue">
                            <template #prepend class="heatinputappend">IV</template>
                        </el-input>
                    </el-row>

                </el-row>
                <el-row class="heatrow">
                    <el-button class="heatbutton" id="heatpidsetting" @click="setupCompensatorPIDParametersLocal">
                        设定
                    </el-button>
                    <el-button class="heatbutton" id="heatpidsetting" @click="getCompensatorPIDParametersLocal">
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
    name: "HeatCard",
    inject: [
        "setupHeaterProgram",
        "setupHeaterPIDParameters",
        "getHeaterPIDParameters",
        "setupCompensatorPIDParameters",
        "getCompensatorPIDParameters",
        "startAutoCompensator",
        "stopAutoCompensator",
        "setupHeaterState"
    ],
    methods: {
        setupHeaterProgramQuick() {

            this.setupHeaterProgram({
                count: 3,
                baseTemperature: this.progHeaterQuick.baseTemperature,
                process: [{
                    type: "heat",
                    startTemperature: this.progHeaterQuick.baseTemperature,
                    speed: this.progHeaterQuick.speed,
                    stopTemperature: this.progHeaterQuick.maxTemperature,
                    time: 0
                }, {
                    type: "hold",
                    startTemperature: this.progHeaterQuick.maxTemperature,
                    speed: 0,
                    stopTemperature: this.progHeaterQuick.maxTemperature,
                    time: this.progHeaterQuick.holdTime
                }, {
                    type: "cool",
                    startTemperature: this.progHeaterQuick.maxTemperature,
                    speed: this.progHeaterQuick.cool,
                    stopTemperature: this.progHeaterQuick.baseTemperature,
                    time: 0
                }]
            })

        },
        async loadAdvancedProgram() {

            let path = await window.heatProgramReader.selectPath(window.heatProgramReader.path.join(this.progHeaterAdv.path, (this.progHeaterAdv.filename != "" ? this.progHeaterAdv.filename : "TemperatureProgramFile") + ".json"))
            if (path.canceled) {
                this.progHeaterAdv.path = ""
                return
            }

            this.progHeaterAdv.path = window.heatProgramReader.path.dirname(path.filePaths[0])
            this.progHeaterAdv.filename = window.heatProgramReader.path.basename(path.filePaths[0], ".json")
            let file = await window.heatProgramReader.readTemperatureProgramFile(path.filePaths[0])

            let heatingProgram = JSON.parse(file)

            this.progHeaterAdv.count = heatingProgram.count
            this.progHeaterAdv.process = heatingProgram.process

            if (this.progHeaterAdv.process.length > 0) {
                this.progHeaterAdv.process[0].startTemperature = (this.progHeaterAdv.baseTemperature == 0) ? this.progHeaterAdv.process[0].startTemperature : this.progHeaterAdv.baseTemperature
            }

            this.progHeaterAdvTable = []

            for (let i = 0; i < this.progHeaterAdv.count; i++) {
                this.progHeaterAdvTable.push({
                    type: (this.progHeaterAdv.process[i].type == "heat") ? "升温" : ((this.progHeaterAdv.process[i].type == "cool") ? "降温" : "恒温"),
                    startTemperature: this.progHeaterAdv.process[i].startTemperature,
                    stopTemperature: this.progHeaterAdv.process[i].stopTemperature,
                    speed: this.progHeaterAdv.process[i].speed,
                    time: (this.progHeaterAdv.process[i].time == 0) ? (Math.abs((this.progHeaterAdv.process[i].stopTemperature - this.progHeaterAdv.process[i].startTemperature) / this.progHeaterAdv.process[i].speed)) : this.progHeaterAdv.process[i].time
                })
            }


        },
        async setupHeaterProgramAdv() {

            this.setupHeaterProgram({
                count: this.progHeaterAdv.count,
                baseTemperature: this.progHeaterAdv.baseTemperature,
                process: this.progHeaterAdv.process
            })

        },
        async setupHeaterPIDParametersLocal() {
            await this.setupHeaterPIDParameters({
                kp: this.heaterPID.kp,
                ki: this.heaterPID.ki,
                kd: this.heaterPID.kd,
                tolerance: this.heaterPID.tolerance,
                errorTolerance: this.heaterPID.errorTolerance,
                initialValue: this.heaterPID.initialValue
            })
        },
        async getHeaterPIDParametersLocal() {
            const { kp, ki, kd, tolerance, errorTolerance, initialValue } = await this.getHeaterPIDParameters()
            this.heaterPID.kp = kp
            this.heaterPID.ki = ki
            this.heaterPID.kd = kd
            this.heaterPID.tolerance = tolerance
            this.heaterPID.errorTolerance = errorTolerance
            this.heaterPID.initialValue = initialValue
        },

        async setupCompensatorPIDParametersLocal() {
            await this.setupCompensatorPIDParameters({
                kp: this.compensatorPID.kp,
                ki: this.compensatorPID.ki,
                kd: this.compensatorPID.kd,
                tolerance: this.compensatorPID.tolerance,
                errorTolerance: this.compensatorPID.errorTolerance,
                initialValue: this.compensatorPID.initialValue
            })
        },
        async getCompensatorPIDParametersLocal() {
            const { kp, ki, kd, tolerance, errorTolerance, initialValue } = await this.getCompensatorPIDParameters()
            this.compensatorPID.kp = kp
            this.compensatorPID.ki = ki
            this.compensatorPID.kd = kd
            this.compensatorPID.tolerance = tolerance
            this.compensatorPID.errorTolerance = errorTolerance
            this.compensatorPID.initialValue = initialValue
        }

    },
    data() {
        return {
            progHeaterQuick: {
                speed: 10,
                cool: 10,
                maxTemperature: 400,
                holdTime: 10,
                baseTemperature: 23
            },
            progHeaterAdv: {
                filename: "",
                path: window.heatProgramReader.defaultPath(),
                baseTemperature: 23,
                table: []
            },
            progHeaterAdvTable: [],
            heaterPID: {
                kp: 0.3,
                ki: 0.004,
                kd: 0.001,
                tolerance: 400000,
                errorTolerance: 100000,
                initialValue: 0
            },
            compensatorPID: {
                kp: -1.5,
                ki: -0.09,
                kd: -0.05,
                tolerance: 300000,
                errorTolerance: 100000,
                initialValue: 500
            }
        };
    },
});
</script>

<style>
.heatitem {
    padding: 12px 12px;
    margin-bottom: 20px;
    border-radius: 6px;
    background: #f2f6fc;
}

.heattitle {
    width: 100%;
    padding-bottom: 16px;
    color: #303133;
}

.heatrow {
    width: 100%;
}

.heatrowpad {
    width: 100%;
    padding: 0px 0 10px 0;
}

.heatcol {
    flex: 0 0 auto;
}

.heatinput {
    padding-bottom: 20px;
    width: 100%;
}

.heatbutton {
    width: 62px;
    margin-right: 5px;
    margin-left: 0px !important;
    padding: 10px;
}

#chartcontrol>div:nth-child(3)>button:nth-child(1) {
    margin-left: 2px !important;
}

.heatrow .el-input-group__prepend {
    width: 40px;
}

#heatchartselect {
    width: 40px;
}

#heatcatalogselect {
    width: 58px;
}

#heatchannelselect {
    width: 40px;
}

#advheatinput {
    width: 198px;
    margin-right: 10px;
}

#heatchartselect.el-input__inner {
    padding: 0 2px;
}

#advheatfilename.el-input__inner {
    padding: 0 5px;
}

#savepathselector {
    width: 80px;
    padding: 0;
}

#heatadvheatbutton {
    margin: 0 0 0 10px;
}

.heatprogtable .cell {
    padding-left: 8px;
    padding-right: 6px;
}
</style>