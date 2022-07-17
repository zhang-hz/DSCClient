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
            </el-col>
            <el-col id="leftcol">
                <side-nav></side-nav>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import SideNav from "/@/components/Nav.vue";
import ChartFrame from "/@/components/ChartFrame.vue";

const print = console

export default defineComponent({
    name: "App",
    components: {
        SideNav,
        ChartFrame,
    },
    provide() {
        let self = this;
        return {

			chartSwitch: computed(()=>this.chart.switch),
			chartOption: computed(()=>this.chart.option),
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
					channel:option.channel
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
                return check;
            },
            async startHeaterProgram(baseVoltage,heatingSpeed,baseTemperature){

                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/prog/start/" +
                            baseVoltage+"/"+heatingSpeed+"/"+baseTemperature
                    );
                } catch (e) {
                    print.error(e);
                    return;
                }                
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
            },
            async setupHeaterTemperature(temperature){
                try {
                    await fetch(
                        "http://" +
                            self.httpAddr +
                            self.apiPref +
                            "/heater/pid/temperature/" +
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
                            "/heater/pid/parameters/" +
                            pidsetting.kp +
                            "/" +
                            pidsetting.ki +
                            "/" +
                            pidsetting.kd +
                            "/" +
                            pidsetting.tolerance +
                            "/" +
                            pidsetting.errorTolerance
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
						channel:0
					}
				}
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
}
</style>
