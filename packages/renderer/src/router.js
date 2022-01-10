import {createRouter, createWebHashHistory} from 'vue-router';
import CalibrationCard from '/@/components/Calibration.vue'
import StatusCard from '/@/components/Status.vue'
import TestCard from '/@/components/Test.vue'

const routes = [
  {path: '/', name: 'Home', redirect:'/test'},
  {path: '/test', name: 'TestCard', component: TestCard},
  {path: '/calibration', name: 'CalibrationCard', component: CalibrationCard},
  {path: '/status', name: 'StatusCard', component: StatusCard},
];

export default createRouter({
  routes,
  history: createWebHashHistory(),
});
