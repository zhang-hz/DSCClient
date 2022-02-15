<template>
  <el-menu
    default-active="test"
    :background-color="color.navbgcolor"
    :text-color="color.naviconcolor"
    class="nav-vertical"
    router="false"
  >
    <el-menu-item index="test" class="nav-item">
        <el-icon :size="40"><video-play /></el-icon>
    </el-menu-item>
    <el-menu-item index="calibration" class="nav-item">
      <el-icon ><location /></el-icon>
    </el-menu-item>
    <el-menu-item index="status" class="nav-item">
      <el-icon ><setting /></el-icon>
    </el-menu-item>
  </el-menu>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {
  Location,
  VideoPlay,
  Setting,
} from '@element-plus/icons-vue'

const print = console

export default defineComponent({
  name: 'SideNav',
  components: {
    Location,
    VideoPlay,
    Setting
  },
  setup(){
    const color = {
      navbgcolor: "#303133",
      naviconcolor:"#FFFFFF"
    }
    return {
      color
    }
  }
});
</script>

<style>
.nav-vertical{
  width: 60px;
  height: 100%;
  border: 0;
}
.nav-item{
  width: 100%;
  height: 60px;
}
.nav-item [class^=el-icon] {
  font-size:25px;
  text-align: center;
}
</style>
