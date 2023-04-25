<template>
    <div id="chart">
		<chart-frame ref="chartFrame"></chart-frame>
    </div>
    <div id="control">
        <el-row class="mainframe">
            <el-col id="rightcol">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
                <div id="heaterstatecard" class="controlcard">
                    <heater-state></heater-state>
                </div>
            </el-col>
            <el-col id="leftcol">
                <side-nav></side-nav>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import SideNav from "/@/components/SideNav.vue";
import ChartFrame from "/@/components/ChartFrame.vue";
import HeaterState from "/@/components/HeaterState.vue";

const print = console

export default defineComponent({
    name: "App",
    components: {
        SideNav,
        ChartFrame,
        HeaterState
    },
    provide() {
        let self = this;
        return {

			chartSwitch: computed(()=>self.chart.switch),
			chartOption: computed(()=>self.chart.option),
            heaterStateEnable: computed(()=>self.heater.enable),
            heaterStateProgrammed: computed(()=>self.heater.programmed),
            heaterStateStarted: computed(()=>self.heater.started),
            heaterStateType: computed(()=>self.heater.type),
            compensatorStateEnable: computed(()=>self.compensator.enable),
            compensatorStateStarted: computed(()=>self.compensator.started),
			startChart(){
				self.chart.switch = true
				self.$refs.chartFrame.startChartEvent()
			},
			stopChart(){
				self.chart.switch = false
				self.$refs.chartFrame.stopChartEvent()
			},
			resetChart(){
				self.$refs.chartFrame.resetChartEvent()
				self.chart.switch = true
				setTimeout(function(){
					self.chart.switch = false
				},100)
			},
			settingChart(option){
				self.chart.option[option.chart] = {
					catalog:option.catalog,
					channel:option.channel,
                    name:option.name
				}
			},

			async saveData(path){
				await self.$refs.chartFrame.saveDataToFile(path)
			},

            httpAddress: computed(() => this.httpAddr),
            socketAddress: computed(() => this.socketAddr),
            apiPrefix: computed(() => this.apiPref),
            async fetchAvgVoltage() {
                try {
                    var res = await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/avgvoltage" +
                            "/50000"
                    );
                } catch (e) {
                    print.error(e);
                    return;
                }
                let body = await res.json();
                return body.Voltage;
            },
            async setDACVoltage(target, voltage) {
                try {
                    var res = await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/setdacvoltage/" +
                            target +
                            "/" +
                            voltage
                    );
                } catch (e) {
                    print.error(e);
                    return;
                }
                let check = await res.json().voltage;

                if(voltage == 0){
                    self.heater.started = false
                    self.heater.type = "manual"
                }else{
                    self.heater.started = true
                    self.heater.type = "manual"
                }
                
                return check;
            },
            async setupHeaterState(enable){
                if(enable){
                    self.heater.enable = true
                }else{
                    self.heater.enable = false
                }
            },
            async setupCompensatorState(enable){
                if(enable){
                    self.compensator.enable = true
                }else{
                    self.compensator.enable = false
                }
            },
            async setupHeaterProgram(data){

                self.heatProgram = data
                self.heater.programmed = true
                self.heater.type = "program"

            },
            async startHeaterProgram(baseVoltage){ 
                
                let process = []

                for(let i = 0; i < self.heatProgram.process.length;i++){
                    process.push({
                        processtype: self.heatProgram.process[i].type,
                        starttemperature: (typeof(self.heatProgram.process[i].startTemperature) == "string")?parseFloat(self.heatProgram.process[i].startTemperature):self.heatProgram.process[i].startTemperature,
                        stoptemperature: (typeof(self.heatProgram.process[i].stopTemperature) == "string")?parseFloat(self.heatProgram.process[i].stopTemperature):self.heatProgram.process[i].stopTemperature,
                        speed:(typeof(self.heatProgram.process[i].speed) == "string")?parseFloat(self.heatProgram.process[i].speed):self.heatProgram.process[i].speed,
                        processtime:(typeof(self.heatProgram.process[i].time) == "string")?parseFloat(self.heatProgram.process[i].time):self.heatProgram.process[i].time,
                    })
                }

                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/prog/adv/start/"+self.heatProgram.count+"/"+baseVoltage+"/"+self.heatProgram.baseTemperature+"/",{
                                method:'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body:JSON.stringify(process)
                            }
                    );
                } catch (e) {
                    print.error(e);
                    return;
                }

                self.heater.started = true
                self.heater.type = "program"

            },
            async stopHeaterProgram(){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/prog/stop"
                    );
                } catch (e) {
                    print.error(e);
                    return;
                }
                
                self.heater.started = false
                self.heater.type = "program"

            },
            async startHeaterStatic(temperature, baseVoltage){

                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/static/start/" +
                            temperature+"/"+baseVoltage
                    );
                } catch (e) {
                    print.error(e);
                    return;
                }         
                
                self.heater.started = true
                self.heater.type = "static"

            },
            async stopHeaterStatic(){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/static/stop"
                    );
                } catch (e) {
                    print.error(e);
                    return;
                }
                
                self.heater.started = false
                self.heater.type = "static"

            },
            async setupHeaterStaticTemperature(temperature){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/static/temperature/" +
                            temperature
                    );
                } catch (e) {
                    print.error(e);
                    return;
                }                
            },
            async setupHeaterPIDParameters(pidsetting){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/pid/common/parameters/" +
                            pidsetting.kp +
                            "/" +
                            pidsetting.ki +
                            "/" +
                            pidsetting.kd +
                            "/" +
                            pidsetting.tolerance +
                            "/" +
                            pidsetting.errorTolerance + 
                            "/" + 
                            pidsetting.initialValue
                    );
                } catch (e) {
                    print.error(e);
                    return;

                }
                
                self.heater.enable = true

            },
            async setupCompensatorPIDParameters(pidsetting){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/pid/compensator/parameters/" +
                            pidsetting.kp +
                            "/" +
                            pidsetting.ki +
                            "/" +
                            pidsetting.kd +
                            "/" +
                            pidsetting.tolerance +
                            "/" +
                            pidsetting.errorTolerance + 
                            "/" + 
                            pidsetting.initialValue
                    );
                } catch (e) {
                    print.error(e);
                    return;

                }
                
                self.compensator.enable = true
            },
            async startAutoCompensator(){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/compensator/auto/start"
                    );
                } catch (e) {
                    print.error(e);
                    return;

                }
                
                self.compensator.started = true
            },
            async stopAutoCompensator(){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/compensator/auto/stop"
                    );
                } catch (e) {
                    print.error(e);
                    return;

                }
                
                self.compensator.started = false
            },
            async startManualCompensator(){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/compensator/manual/start"
                    );
                } catch (e) {
                    print.error(e);
                    return;

                }
                
            },
            async stopManualCompensator(){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/compensator/manual/stop"
                    );
                } catch (e) {
                    print.error(e);
                    return;

                }                
            }
        };
    },
    data() {
        return {
			chart:{
				startTime:0,
				switch:false,
				option:{
					main:{
						catalog:"voltage",
						channel:0,
                        name:"敏感热堆输出电压(mV)"
					},
                    assistant1:{
						catalog:"voltage",
						channel:0,
                        name:"敏感热堆输出电压(mV)"
					},
                    assistant2:{
						catalog:"voltage",
						channel:0,
                        name:"敏感热堆输出电压(mV)"
					},
                    assistant3:{
						catalog:"voltage",
						channel:0,
                        name:"敏感热堆输出电压(mV)"
					}
				}
			},
            heatProgram:{
                count:0,
                baseTemperature:0,
                process:[]
            },
            heater:{
                enable:false,
                programmed:false,
                started:false,
                type:""
            },
            compensator:{
                enable:false,
                started:false,
                type:""
            },
            httpAddr: "192.168.3.1:3000",
            socketAddr: "192.168.3.1:4567",
            apiPref: "/api/v1",
			
        };
    },
});
</script>

<style>
html {
    background-color: #ffffff;
}
body {
    height: 900px;
    margin: 0;
    overflow: hidden;
}

#app {
    display: flex;
    height: 100%;
    background-color: #ebeef5;
}
#chart {
    width: 820px;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
}

#control {
    display: flex;
	flex-direction: column;
    width: 380px;
}

#app {
    font-family: Avenir, "Consolas with Yahei",Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0;
    height: 100%;
    width: 100%;
}
.controlcard {
    background-color: #ffffff;
    height: 100%;
    border-left: 2px solid #e4e7ed;
    padding: 12px;
    box-sizing: border-box;
}
.el-row.mainframe {
    height: 100%;
    justify-content: flex-end;
}
#leftcol {
    flex: 0 0 60px;
    width: 40px;
}
#rightcol {
    flex: 0 0 100%;
    max-width: 320px;
    height: 100vh;
    padding-bottom: 60px;
}
#heaterstatecard {
    height: 60px;
}
</style>
