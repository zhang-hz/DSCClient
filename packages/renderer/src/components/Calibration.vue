<template>
  <div id="calibrationcard" class="controlcard">
    <el-row id="calibrationalert">
      <el-alert
        :title="alertTitle"
        :type="alertType"
        :closable="false"
        show-icon
        center
      >
      </el-alert>
    </el-row>
    <el-row id="calibrationcontol">
      <el-col id="calibrationstep">
        <el-steps
          direction="vertical"
          :active="activeStep"
          finish-status="success"
        >
          <el-step title="校准信号通道" description="插入A面"></el-step>
          <el-step title="校准功率通道" description="插入B面"></el-step>
          <el-step title="校准反馈通道" description="插入A面"></el-step>
        </el-steps>
      </el-col>
      <el-col id="calibrationaction">
        <el-row class="calibrationbtn"
          ><el-button
            plain
            :type="btnType[0]"
            :loading="loading[0]"
            :disabled="disabled[0]"
            @click="calistep(0)"
            >校准</el-button
          ></el-row
        >
        <el-row class="calibrationbtn"
          ><el-button
            plain
            :type="btnType[1]"
            :loading="loading[1]"
            :disabled="disabled[1]"
            @click="calistep(1)"
            >校准</el-button
          ></el-row
        >
        <el-row class="calibrationbtn"
          ><el-button
            plain
            :type="btnType[2]"
            :loading="loading[2]"
            :disabled="disabled[2]"
            @click="calistep(2)"
            >校准</el-button
          ></el-row
        >
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";

const print = console

export default defineComponent({
  name: "CalibrationCard",
  inject:["fetchAvgVoltage","setDACVoltage","httpAddress","socketAddress","apiPrefix"],
  data() {
    return {
      calibrationStatus: 0,
      loading: [false, false, false],
      disabled: [false, true, true],
      btnType: ["default", "default", "default"],
      activeStep: 0,
      alertType: "warning",
      alertTitle: "未校准",
    };
  },
  methods: {
    resetStatus() {
      this.calibrationStatus = 0;
      this.loading = [false, false, false];
      this.disabled = [false, true, true];
      this.btnType = ["default", "default", "default"];
      this.activeStep = 0;
      this.alertType = "warning";
      this.alertTitle = "未校准";
    },
    finishCalibration() {
      this.calibrationStatus = 1;
      this.alertType = "success";
      this.alertTitle = "已校准";
      this.disabled = [false, true, true];
    },
    async calistep(step) {

        if (this.calibrationStatus === 1) {
            this.resetStatus();
        }
        this.loading[step] = true;
        let self = this;

        let check = 0

        const getAvgVoltageData = async function(ch) {

            let avgvoltage = [];
            let result = 0;

            const fetchData = async function (channel) {
                let voltage = await self.fetchAvgVoltage()
                return voltage[channel];
            };

            avgvoltage.push(await fetchData(ch));
            avgvoltage.push(await fetchData(ch));

            if (Math.abs(avgvoltage[0] - avgvoltage[1]) > 4000) {
                avgvoltage.push(await fetchData(ch));
                avgvoltage.push(await fetchData(ch));
            }

            for (let i = 0; i < avgvoltage.length; i++) {
                result += avgvoltage[i];
            }
            result = result / avgvoltage.length;

            return result;
        }

        const setADCOffset = async function(ch,number) {
            try{
                await fetch("http://" + self.httpAddress.value + self.apiPrefix.value + "/setadcvos/" + ch+'/'+number)
            }catch(e){
                print.error(e)
            }
        
        }

        const setDACOffset = async function(target,voltage) {
            try{
                await fetch("http://" + self.httpAddress.value + self.apiPrefix.value + "/setdacoffset/" + target+'/'+voltage)
            }catch(e){
                print.error(e)
            }
        
        }

        const calibrateADC = async function(channel,range,direction) {

            let offset = await getAvgVoltageData(channel);
            let fix = 0
            await setADCOffset(channel,direction*offset);

            for( let i=0;i <20;i++){
                fix = await getAvgVoltageData(channel);
                console.log(fix)
                offset = offset + direction*fix
                if(Math.abs(fix) < range){
                    return true
                }
                await setADCOffset(channel,offset);
            }

            return false

        }

        const calibrateDAC = async function(dacChannel,adcChannel,direction) {

            await setDACOffset(dacChannel,0);
            await self.setDACVoltage(dacChannel,0);
            let offset = await getAvgVoltageData(adcChannel);

            for(let i = 0.6;i < 1.8; i = i+0.1){
                await setDACOffset(dacChannel,direction*i*offset);
                await self.setDACVoltage(dacChannel,0);
                check = await getAvgVoltageData(adcChannel);
                if( Math.abs(check) < 150000){
                    return true
                }
            }
            return false
        }

        const finishStep = function(self,step) {
            self.activeStep = step + 1;
            self.loading[step] = false;
            self.btnType[step] = "success";
            if (step < 2) {
                self.disabled[step + 1] = false;
            } else {
                self.finishCalibration();
            }
        }

        switch (step) {
            case 0:
                let resultadc0 = await calibrateADC(0,2000,-1);
                let resultadc1 = await calibrateADC(1,2000,-1);
                
                if(resultadc0 && resultadc1){
                    finishStep(self,step)
                }else{
                    self.loading[step] = false;
                    self.btnType[step] = "danger";                    
                }
                break;

            case 1:

                let resultdac0 = await calibrateDAC("TP1",0,-1)
                let resultdac1 = await calibrateDAC("TP2",1,-1)

                if( resultdac0 && resultdac1) {
                    let resultadc2 = await calibrateADC(2,2000,1)
                    let resultadc3 = await calibrateADC(3,2000,1)
                    finishStep(self,step)
                }else{
                    await setDACOffset("TP1",0);
                    await setDACOffset("TP2",0);
                    self.loading[step] = false;
                    self.btnType[step] = "danger";   
                }

                await self.setDACVoltage("TP1",0)
                await self.setDACVoltage("TP2",0)
                
                break;

            case 2:
                finishStep(self,step)
        }
    }
  },
});
</script>

<style>
#calibrationcard {
  padding: 12px;
}
#calibrationalert {
  margin-bottom: 40px;
}
#calibrationstep {
  height: 250px;
  width: 200px;
  max-width: 200px;
  padding-left: 10px;
}
#calibrationaction {
  max-width: 80px;
}
.calibrationbtn {
  padding: 6px 0 66px 10px;
}
</style>
