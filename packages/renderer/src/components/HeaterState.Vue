<template>
    <div class="heaterstaterow">
        <el-divider class="statedivder" />
        <el-button-group class="stategroup">
            <el-button :type="heaterIconType" class="heaterstatebtn">{{ heaterText }}</el-button>
            <el-button :type="compensatorIconType" class="heaterstatebtn">闭环补偿</el-button>
        </el-button-group>
    </div>
</template>

<script>
import { defineComponent } from "vue";

const print = console;

export default defineComponent({
    name: "HeaterState",
    inject: [
        "heaterStateEnable",
        "heaterStateType",
        "heaterStateStarted",
        "heaterStateProgrammed",
        "compensatorStateEnable",
        "compensatorStateStarted"],
    data() {
        return {
            
        };
    },
    computed: {
        heaterIconType(){
            let type = ""
            if(!this.heaterStateEnable.value){
                type = "info"
            }else{
                if(!this.heaterStateStarted.value){
                     type = "success"
                }else{
                    type = "danger"
                }
            }
            return type
        },
        heaterText(){
            let text = ""
            if(!this.heaterStateEnable.value){
                text = "温控PID未设定"
            }else{
                if(this.heaterStateType.value == "manual"){
                    text = "手动设置"
                }else if(this.heaterStateType.value == "program"){
                    text = "程序控温"
                }else if(this.heaterStateType.value == "static"){
                    text = "恒温控制"
                }else{
                    text = "温控类型未设定"
                }
            }

            return text
        },
        compensatorIconType(){
            let type = ""
            if(!this.compensatorStateEnable.value){
                type = "info"
            }else{
                if(!this.compensatorStateStarted.value){
                     type = "success"
                }else{
                    type = "danger"
                }
            }
            return type
        }
    },
});
</script>

<style>
.heaterstaterow {
    height: 60px;
}

.statedivder {
    margin: 0;
}

.stategroup {
    padding: 6px 0px;
    display: flex;
}

.heaterstatebtn {
    width: 100%;
}
</style>