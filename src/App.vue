<template>
  <div id="app">
    <div v-if="!loaded" class="cssload-thecube">
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
    <div v-if="loaded" class="graf">
      <Doughnut :chart-data="this.datacoll" :height="400" :options="this.options"></Doughnut>
      <p> {{ this.warning }} из {{ this.sum }} источников считают этот сайт опасным</p>
    </div>

    <input type="text" v-model="addres">
    <button @click="getUrl">Отправить</button>
  </div>
</template>

<script>

import axios from "axios";
import Doughnut from './DoughnutChart.js';

export default {
  name: 'app',
  data () {
    return {
      scanUrl: '',
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
          text: 'Сканирование web-страницы'
        }
      }

    }
  },
  methods: {
    // clearUrl() {
    //   let non = this.kek.indexOf('/', kek.indexOf('/') + 2) + 1;
    //   let str = this.kek.substring(0, non);
    //   console.log(str);
    // },
    getUrl() {
        axios.post('http://ovapi.ovd.su/api/post-url-scan', {
          url: 'https://learn.javascript.ru/string',
          apikey: '5ca8277fafc89da750fe37e6aa5640f8de23226b9c35592f74f876be6c020366',
          crossDomain: true,
        })
          .then(response => {
            let data = JSON.parse(response.data);
            if (data.response_code == 1) {
              axios.post('http://ovapi.ovd.su/api/post-url-report', {
                url: 'https://learn.javascript.ru/string',
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
    // chrome.tabs.getSelected(null, (tab) => {
    //   if (tab.url.length !== 0 && tab.url !== null && tab.url !== 'chrome://newtab/') {
    //     this.scanUrl = tab.url.hostname;
    //     console.log(this.scanUrl);
    //     this.getUrl(this.scanUrl);
    //   }
    // });
    // chrome.tabs.query(queryInfo, (tab) => {
    //     console.log(tab);
    //     console.log(queryInfo);
    // });
    // var tabId;
    // chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    //   console.log(tabs[0].url);
    // });
  },
  components: {
    Doughnut
  }
}


</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

#app {
  margin-top: 20px;
  min-width: 280px;
  max-width: 300px;
}

.graf {
  padding: 0 30px;
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
