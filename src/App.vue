<template>
  <div id="app">
    <div class="graf">
      <Doughnut :chart-data="this.datacoll" :height="400" :options="this.options"></Doughnut>
      <p v-if="loaded"> {{ this.warning }} из {{ this.sum }} считают этот сайт опасным</p>
    </div>
    <input type="text" v-model="addres">
    <button @click="get">Отправить</button>
  </div>
</template>

<script>

import axios from "axios";
import Doughnut from './DoughnutChart.js';

export default {
  name: 'app',
  data () {
    return {
      kek: 'https://learn.javascript.ru/string',
      scanUrl: '',
      addres: '',
      clean: 0,
      unrated: 0,
      warning: 0,
      sum: null,
      loaded: false,
      datacoll: {
        labels: ["Нет данных"],
        datasets: [{
          data: [100],
          backgroundColor: [
            'rgba(71, 74, 81, 0.5)',
          ],
          borderWidth: 0,
        }]
      },
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
    clearUrl() {
      let non = this.kek.indexOf('/', kek.indexOf('/') + 2) + 1;
      let str = this.kek.substring(0, non);
      console.log(str);
    },
    getUrl(url) {
      if (url) {
        axios.post('http://localhost/api/post-url-scan', {
          url: url,
          apikey: '5ca8277fafc89da750fe37e6aa5640f8de23226b9c35592f74f876be6c020366',
          crossDomain: true,
        })
          .then(response => {
            let data = JSON.parse(response.data);
            if (data.response_code == 1) {
              axios.post('http://localhost/api/post-url-report', {
                url: url,
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
                        'rgba(75, 192, 192, 0.8)',
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
      } else {
        console.log("no -> ")
      }

    }
  },
  mounted() {

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

.logo {
  width: 120px;
}

#app {
  margin-top: 20px;
  min-width: 280px;
  max-width: 300px;
}

.graf {
  padding: 0 30px;
}

.card-panel p{
  font-size: 40px;
  margin: 0;
  font-weight: 700;
  color: white;
}


</style>
