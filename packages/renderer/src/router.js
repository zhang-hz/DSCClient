import {createRouter, createWebHashHistory} from 'vue-router';
import CalibrationCard from '/@/components/Calibration.vue'
import StatusCard from '/@/components/Status.vue'
import TestCard from '/@/components/Test.vue'
import HeatCard from '/@/components/Heat.vue'
import AboutCard from '/@/components/About.vue'

const routes = [
  {path: '/', name: 'Home', redirect:'/test'},
  {path: '/test', name: 'TestCard', component: TestCard},
  {path: '/heat', name: 'HeatCard', component: HeatCard},
  {path: '/calibration', name: 'CalibrationCard', component: CalibrationCard},
  {path: '/status', name: 'StatusCard', component: StatusCard},
  {path: '/about', name: 'AboutCard', component: AboutCard}
];

export default createRouter({
  routes,
  history: createWebHashHistory(),
});
