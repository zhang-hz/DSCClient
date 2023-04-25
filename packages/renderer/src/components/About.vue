<template>
    <div id="aboutcard" class="controlcard">
        <el-row class="abouttitle">
            DSC Laboratory Kit
        </el-row>
        <el-row class="aboutsubtitle">
            For DSC / DTA Measurement and Hydrogen Sesing
        </el-row>
        <el-divider class="aboutdivder" />
        <el-row class="aboutshow">
            <el-scrollbar>
                <div>
                    <el-timeline class="abouttimeline">
                        <el-timeline-item timestamp="2023" placement="top">
                            <el-card class="abouttimelinecard" href="https://doi.org">
                                <h4>1ppm-detectable hydrogen gas sensors by using highly sensitive P+/N+ single-crystalline
                                    silicon thermopiles</h4>
                            </el-card>
                        </el-timeline-item>
                        <el-timeline-item timestamp="2023" placement="top">
                            <el-card class="abouttimelinecard">
                                <h4>Ultra-Responsive MEMS Sensing Chip for Differential Thermal Analysis (DTA)</h4>
                            </el-card>
                        </el-timeline-item>
                        <el-timeline-item timestamp="2023" placement="top">
                            <el-card class="abouttimelinecard">
                                <h4>And More</h4>
                            </el-card>
                        </el-timeline-item>
                    </el-timeline>
                </div>

            </el-scrollbar>
        </el-row>
        <el-row class="aboutfooter" id="aboutfooter1">
            
        </el-row>
        <el-row class="aboutfooter">
            Developed by Zhang Haozhi in SIMIT, CAS
        </el-row>
        <el-row class="aboutfooter">
            Version 2.0&nbsp;&nbsp;Check Update on &nbsp; <a href="https://github.com/zhang-hz/DSCClient" class="abouthref">Github</a>
        </el-row>
    </div>
</template>

<script>
import { defineComponent } from "vue";

const print = console

export default defineComponent({
    name: "AboutCard",
    methods: {},
    data() {
        return {};
    },
});
</script>

<style>
.abouttitle {
    width: 100%;
    font-size: 30px;
    font-weight: bold;
    font-family: calibria;
    color: #303133;
    margin: 10px 0px 20px 0px;
    justify-content: center;
}

.aboutsubtitle {
    width: 100%;
    font-size: 16px;
    font-family: calibria;
    color: #303133;
    margin: 10px 0px 20px 0px;
    justify-content: center;
}

.aboutdivder {
    width: 100%;
    margin: 10px 0px 10px 0px;
}

.aboutshow {
    height: 500px;
}

.abouttimeline {
    padding: 0px 12px;
}

.abouttimelinecard {
    padding: 0px 10px;
    
}

.abouttimelinecard .el-card__body {
    padding: 0px;

}

.abouttimelinecard h4{
    margin: 12px 0px;
    font-weight: normal;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
    
}

.abouttimeline div.el-timeline-item__timestamp {
    text-align: start;
    font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;
}

.aboutfooter{
    width: 100%;
    font-size: 12px;
    font-family: calibria;
    color: #303133;
    margin: 0;
    justify-content: center;
}
#aboutfooter1{
    margin: 6px 0px 0px 0px;
}
.abouthref{
    color: #303133;
}
</style>