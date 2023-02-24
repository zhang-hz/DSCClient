<template>
    <el-scrollbar>
        <div id="statuscard" class="controlcard">

            <el-row id="httpstatus" class="statusitem">
                <el-row class="statustitle">控制连接</el-row>
                <el-col id="httpstatusicon" class="statusicon">
                    <el-button :type="http.btnType" :icon="http.btnIcon" circle :size="Default"></el-button></el-col>
                <el-col class="statuscontrol">
                    <el-row class="statusinput">
                        <el-input v-model="http.address" placeholder="Please input" />
                    </el-row>
                    <el-row>
                        <el-button :disabled="http.connected" class="statusbutton" @click="connectBoard">连接</el-button>
                        <el-button :disabled="!http.connected" class="statusbutton">断开</el-button>
                    </el-row>
                </el-col>
            </el-row>
            <el-row id="socketstatus" class="statusitem">
                <el-row class="statustitle">数据连接</el-row>
                <el-col id="socketstatusicon" class="statusicon">
                    <el-button :type="socket.btnType" :icon="socket.btnIcon" circle :size="Default"></el-button></el-col>
                <el-col class="statuscontrol">
                    <el-row class="statusinput">
                        <el-input v-model="socket.address" placeholder="Please input" />
                    </el-row>
                    <el-row>
                        <el-button :disabled="socket.connected" class="statusbutton" @click="connectSocket">连接</el-button>
                        <el-button :disabled="!socket.connected" class="statusbutton"
                            @click="disconnectSocket">断开</el-button>
                    </el-row>
                </el-col>
            </el-row>
            <el-row class="statusitem">
                <el-row class="statustitle">读取平均电压</el-row>
                <el-row class="statusinput" id="statusavgdata">
                    <el-table :data="voltageData">
                        <el-table-column prop="channel" label="Channel" width="120px" height="40" />
                        <el-table-column prop="voltage" label="Voltage" height="40" />
                    </el-table>
                </el-row>
                <el-row>
                    <el-button :disabled="!http.connected" class="statusbutton" @click="getAvgVoltage">读取</el-button>
                </el-row>
            </el-row>
            <el-row id="manualdac" class="statusitem">
                <el-row class="statustitle">手动设置DAC</el-row>
                <el-row class="statusinput">
                    <el-input v-model="dac.voltage" placeholder="Please input" id="dacinput">
                        <template #append>
                            <el-select v-model="dac.select" placeholder="Select" style="width: 80px">
                                <el-option label="COM" value="1"></el-option>
                                <el-option label="DIF" value="0"></el-option>
                            </el-select>
                        </template>
                    </el-input>
                </el-row>
                <el-row>
                    <el-button :disabled="!http.connected" class="statusbutton dacbutton"
                        @click="getDACVoltage">读取</el-button>
                    <el-button :disabled="!http.connected" class="statusbutton dacbutton"
                        @click="manualDACVoltage">设置</el-button>
                    <el-button :disabled="!http.connected" class="statusbutton dacbutton"
                        @click="getDACVoltage">重置</el-button>
                </el-row>
            </el-row>
            <el-row id="chartcontrol" class="statusitem">
                <el-row class="statustitle">手动设置功率补偿</el-row>
                <el-row class="staterow">
                    <el-col class="statecol" id="compensatorinput">
                        <el-select v-model="manualCompensator.start" class="m-2" placeholder="Select">
                            <el-option v-for="item in manualCompensator.options" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </el-col>
                    <el-col class="statecol">
                        <el-button :disabled="false" class="compensatorbutton" @click="setupManualCompensatorLocal"
                            id="statecompensatorbutton">设定</el-button>
                    </el-col>
                </el-row>
            </el-row>
            <el-row id="chartcontrol" class="statusitem">
                <el-row class="statustitle">设置数据率</el-row>
                <el-row class="statusrow">
                    <el-select v-model="saveSpeed.downSampleRate" class="m-2" placeholder="Select" size="large">
                        <el-option v-for="item in saveSpeed.options" :key="item.value" :label="item.label"
                            :value="item.value" />
                            <template #prefix >
                                <span class="statusselectappend">保存速率</span>
                                
                            </template>
                    </el-select>
                </el-row>
                <el-row class="statusinput">
                    <el-select v-model="displaySpeed.downSampleRate" class="m-2" placeholder="Select" size="large">
                        <el-option v-for="item in displaySpeed.options" :key="item.value" :label="item.label"
                            :value="item.value" />
                            <template #prefix >
                                <span class="statusselectappend">显示速率</span>
                                
                            </template>
                    </el-select>
                    
                </el-row>
                <el-row class="staterow">
                        <el-button :disabled="false" class="statusbutton" @click="setDownSampleRate">设定</el-button>
                </el-row>

            </el-row>

        </div>
    </el-scrollbar>
</template>

<script>
import { defineComponent, ref } from "vue";
import { Select, CloseBold } from "@element-plus/icons-vue";
import { dataDownSampleRate, displayDownSampleRate } from "/@/sampleSetting.js";

const print = console

export default defineComponent({
    name: "StatusCard",
    inject: ["fetchAvgVoltage", "setDACVoltage", "httpAddress", "socketAddress", "apiPrefix", "startManualCompensator", "stopManualCompensator"],
    data() {
        return {
            socket: {
                btnType: "danger",
                btnIcon: CloseBold,
                address: this.socketAddress.value,
                connected: false,
                loading: false,
            },
            http: {
                btnType: "danger",
                btnIcon: CloseBold,
                address: this.httpAddress.value,
                connected: false,
            },
            dac: {
                voltage: 0,
                select: "1",
                label: ["TP1", "TP2"],
                storage: [0, 0],
            },
            voltageData: [{
                channel: "Channel 0",
                voltage: "0 mV"
            }, {
                channel: "Channel 1",
                voltage: "0 mV"
            }, {
                channel: "Channel 2",
                voltage: "0 mV"
            }, {
                channel: "Channel 3",
                voltage: "0 mV"
            }],
            manualCompensator: {
                start: false,
                options: [
                    {
                        label: "开启",
                        value: true
                    },
                    {
                        label: "关闭",
                        value: false
                    }
                ]
            },
            saveSpeed:{
                downSampleRate:10,
                options:[
                    {
                        label:"2500 Samples/s",
                        value:1
                    },
                    {
                        label:"1250  Samples/s",
                        value:2
                    },
                    {
                        label:"1250 Samples/s",
                        value:2
                    },
                    {
                        label:"625 Samples/s",
                        value:4
                    },
                    {
                        label:"500 Samples/s",
                        value:5
                    },
                    {
                        label:"250 Samples/s",
                        value:10
                    },
                    {
                        label:"125 Samples/s",
                        value:20
                    },
                    {
                        label:"125 Samples/s",
                        value:20
                    },
                    {
                        label:"50 Samples/s",
                        value:50
                    },
                    {
                        label:"25 Samples/s",
                        value:100
                    },
                    {
                        label:"10 Samples/s",
                        value:250
                    },
                    {
                        label:"5 Samples/s",
                        value:500
                    },
                    {
                        label:"2 Samples/s",
                        value:1250
                    },
                    {
                        label:"1 Samples/s",
                        value:2500
                    },
                    {
                        label:"0.1 Samples/s",
                        value:25000
                    }
                ]
            },
            displaySpeed:{
                downSampleRate:250,
                options:[
                    {
                        label:"50 Samples/s",
                        value:50
                    },
                    {
                        label:"25 Samples/s",
                        value:100
                    },
                    {
                        label:"10 Samples/s",
                        value:250
                    },
                    {
                        label:"5 Samples/s",
                        value:500
                    },
                    {
                        label:"2 Samples/s",
                        value:1250
                    },
                    {
                        label:"1 Samples/s",
                        value:2500
                    },
                    {
                        label:"0.1 Samples/s",
                        value:25000
                    }
                ]
            }
        };
    },
    methods: {
        connectedBoardState() {
            this.http.btnType = "success";
            this.http.btnIcon = Select;
            this.http.connected = true;
        },
        disconnectedBoardState() {
            this.http.btnType = "danger";
            this.http.btnIcon = CloseBold;
            this.http.connected = false;
        },
        connectedSocketState() {
            this.socket.btnType = "success";
            this.socket.btnIcon = Select;
            this.socket.connected = true;
        },
        disconnectedSocketState() {
            this.socket.btnType = "danger";
            this.socket.btnIcon = CloseBold;
            this.socket.connected = false;
        },
        connectSocket() {
            let self = this;
            fetch("http://" + this.httpAddress.value + this.apiPrefix.value + "/connectsocket")
                .then((response) => {
                    if (response.status == 200) {
                        self.connectedSocketState();
                    } else {
                        throw response.status;
                    }
                })
                .catch((err) => {
                    print.error(err);
                    self.disconnectedSocketState();
                });
            window.ipcRenderer.send("connectsocket", " ");
        },
        disconnectSocket() {
            let self = this;
            fetch("http://" + this.httpAddress.value + this.apiPrefix.value + "/disconnectsocket")
                .then((response) => {
                    if (response.status === 200) {
                        self.disconnectedSocketState();
                        //window.ipcRenderer.send('forceclosesocket',' ')
                    } else {
                        throw response.status;
                    }
                })
                .catch((err) => {
                    print.log(err);
                    self.connectedSocketState();
                });
        },
        connectBoard() {
            let self = this;
            print.log(this.httpAddress)
            fetch("http://" + this.httpAddress.value + this.apiPrefix.value + "/connect")
                .then((response) => {
                    if (response.status === 200) {
                        self.connectedBoardState();
                    } else {
                        throw response.status;
                    }
                })
                .catch((err) => {
                    print.log(err);
                    self.disconnectedBoardState();
                });
        },
        disconnectBoard() { },
        async getDACVoltage() {

            let target = this.dac.label[parseInt(this.dac.select)];
            try {
                var res = await fetch("http://" + this.httpAddress.value + this.apiPrefix.value + "/getdacvoltage/" + target);
            } catch (e) {
                print.error(e);
                return;
            }
            let voltage = await res.json().voltage;
            this.dac.voltage = voltage.toString();
            this.dac.storage.voltage = voltage;
        },
        async manualDACVoltage() {

            let voltage = 1e6 * parseFloat(this.dac.voltage);
            let target = this.dac.label[parseInt(this.dac.select, 10)];
            await this.setDACVoltage(target, voltage)
        },
        async getAvgVoltage() {

            let voltage = await this.fetchAvgVoltage()
            this.voltageData = []
            for (let i = 0; i < voltage.length; i++) {
                this.voltageData.push({
                    channel: "Channel " + i,
                    voltage: (voltage[i] / 1e6).toFixed(4).toString() + "mV"
                })
            }

        },
        async setupManualCompensatorLocal() {
            if (this.manualCompensator.start) {
                await this.startManualCompensator();
            } else {
                await this.stopManualCompensator();
            }
        },
        setDownSampleRate(){
            dataDownSampleRate.value = this.saveSpeed.downSampleRate;
            displayDownSampleRate.value = this.displaySpeed.downSampleRate;
        }
    },
});
</script>

<style>
.statusitem {
    padding: 12px;
    margin-bottom: 16px;
    border-radius: 6px;
    background: #f2f6fc;
}

.statusicon {
    max-width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 16px;
    margin-left: 4px;
}

.statusicon>.el-button.is-circle {
    height: 50px;
}

.statusicon>.el-button.is-circle i {
    font-size: 30px;
}

.statusicon>.el-button.is-circle svg {
    font-size: 30px;
}

.statusbutton {
    width: 94px;
}

.statustitle {
    width: 100%;
    padding-bottom: 16px;
    color: #303133;
}

.staterow {
    width: 100%;
    
}

.statecol {
    flex: 0 0 auto;
}

.statuscontrol {
    max-width: 200px;
}

.statusinput {
    padding: 0px 0 16px 0;
    width: 100%;
}

#statusavgdata {
    font-family: "Microsoft Yahei", Helvetica, sans-serif;
}

.statusinput #dacinput {}

.statusbutton.dacbutton {
    width: 80px;
}

#compensatorinput {
    width: 198px;
    margin-right: 10px;
}

.compensatorbutton {
    width: 62px;
    margin-right: 5px;
    margin-left: 0px !important;
    padding: 10px;
}

#statecompensatorbutton {
    margin: 0 0 0 10px;
}
.statusselectappend {
    background-color: var(--el-fill-color-light) !important;
    color: var(--el-text-color-regular) !important;
    padding: 0px 15px;
    margin: 0px 0px 0px -14px;
    box-shadow: 1px 0px 0px 0px var(--el-border-color-light);
}
</style>