<template>
  <div id="app">
    <div v-if="loaded" class="cssload-thecube">
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
    <div>
        <h2>Скан web-ресурса</h2>
        <div>
          <h3 v-if="!safeBrow" class="text-g">Безопасен</h3>
          <h3 v-else class="text-w">Опасен</h3>
        </div>
        <a class="analysis" href="#">Провести полный анализ?</a>
      <h1>{{ safeBrow }}</h1>
    </div>
    <!--<div v-if="loaded" class="graf">-->
      <!--<Doughnut :chart-data="this.datacoll" :height="400" :options="this.options"></Doughnut>-->
      <!--<p> {{ this.warning }} из {{ this.sum }} источников считают этот сайт опасным</p>-->
    <!--</div>-->

    <!--<input type="text">-->
    <!--<button @click="getUrlYandex">Отправить</button>-->
  </div>
</template>

<script>

import axios from "axios";
import Doughnut from './DoughnutChart.js';

export default {
  name: 'app',
  data () {
    return {
      safeBrow: false,
      scanUrlFull: '',
      clean: 0,
      unrated: 0,
      warning: 0,
      sum: null,
      loaded: false,
      datacoll: '',
      options: {
        responsive: true,
        maintainAspectRatio: true,
        layout: {
          padding: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }
        },
        legend: {
          labels: {
            boxWidth: 20
          }
        },
        title: {
          display: true,
          text: 'Результаты сканирования VirusTotal'
        }
      }

    }
  },
  methods: {
    clearUrl(scan) {
      let non = scan.indexOf('/', scan.indexOf('/') + 2) + 1;
      let str = scan.substring(0, non);
      return str;
    },
    getUrlYandex(safe) {
      axios.post('http://localhost/api/post-url-scan-yandex', {
        url: safe,
        apikey: '',
        crossDomain: true,
      })
        .then(response => {
          let data = JSON.parse(response.data);
          if (data == false) {
            this.safeBrow = false;
            console.log('Ok');
          } else {
            this.safeBrow = true;
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    getUrl() {
        axios.post('http://ovapi.ovd.su/api/post-url-scan', {
          url: 'next-money.info',
          apikey: '5ca8277fafc89da750fe37e6aa5640f8de23226b9c35592f74f876be6c020366',
          crossDomain: true,
        })
          .then(response => {
            let data = JSON.parse(response.data);
            if (data.response_code == 1) {
              axios.post('http://ovapi.ovd.su/api/post-url-report', {
                url: 'next-money.info',
                apikey: '5ca8277fafc89da750fe37e6aa5640f8de23226b9c35592f74f876be6c020366',
                crossDomain: true,
              })
                .then(response => {
                  this.sum = response.data.clean + response.data.warning + response.data.unrated;
                  this.warning = response.data.warning;
                  this.loaded = true;
                  this.datacoll = {
                    labels: ["Безопасная", "Опасная", "Нет результатов"],
                    datasets: [{
                      data: [response.data.clean, response.data.warning, response.data.unrated],
                      backgroundColor: [
                        'rgba(66, 184, 131, 0.8)',
                        'rgba(255, 99, 132, 0.8)',
                        'rgba(71, 74, 81, 0.8)',
                      ],
                      borderWidth: 0,
                    }]
                  };
                })
                .catch(error => {
                  console.log(error)
                })
            }
          })
          .catch(function (error) {
            console.log(error);
          })

    }
  },
  created() {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      this.getUrlYandex(this.clearUrl(tabs[0].url));
    });
  },
  components: {
    Doughnut
  }
}


</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 20px;
  min-width: 280px;
  max-width: 300px;
}

h1, h2 {
  font-weight: normal;
}

a{
  text-decoration: none;
}

.text-g {
  color: white;
  background: rgb(66, 184, 131);
  padding: 5px 5px;
  border-radius: 5px;
  margin: 20px 30px;
}

.text-w {
  color: white;
  background: rgb(255, 49, 57);
  padding: 5px 5px;
  border-radius: 5px;
  margin: 20px 30px;
}

.analysis {
  color: gray;
  display: inline-block;
  border: 1px solid gray;
  padding: 8px 20px;
  border-radius: 5px;
  margin: 0px 30px 20px;
  transition: .3s;
}

.analysis:hover {
  background: gray;
  color: white;
}

.spinner {
  margin: 100px auto;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}

.spinner > div {
  background-color: #42b883;
  height: 100%;
  width: 6px;
  display: inline-block;

  -webkit-animation: sk-stretchdelay 1.2s infinite ease-in-out;
  animation: sk-stretchdelay 1.2s infinite ease-in-out;
}

.spinner .rect2 {
  -webkit-animation-delay: -1.1s;
  animation-delay: -1.1s;
}

.spinner .rect3 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

.spinner .rect4 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

.spinner .rect5 {
  -webkit-animation-delay: -0.8s;
  animation-delay: -0.8s;
}

@-webkit-keyframes sk-stretchdelay {
  0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
  20% { -webkit-transform: scaleY(1.0) }
}

@keyframes sk-stretchdelay {
  0%, 40%, 100% {
    transform: scaleY(0.4);
    -webkit-transform: scaleY(0.4);
  }  20% {
       transform: scaleY(1.0);
       -webkit-transform: scaleY(1.0);
     }
}


</style>
