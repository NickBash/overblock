import { Doughnut, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  props: ['chartData', 'options'],
  mounted () {
    Chart.defaults.doughnut.cutoutPercentage='0',
    // Chart.defaults.doughnut.animation.animateRotate=false,
      Chart.defaults.global.legend.position='bottom',

      this.renderChart(this.chartData, this.options)
  }

}
