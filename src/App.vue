<template>
  <div id="app">
    <div>
        <transition name="fade" mode="out-in">
          <div class="cont">
            <div v-if="select == 1" key="1">
              <h2 class="title"><img class="logo" src="./assets/img/protection_128.png" alt=""><span class="title_t">Overblock</span><a
                href="#"><img class="setting" src="./assets/img/settings.png" alt=""></a></h2>
              <div id="count">
                <h3 id="sc1" style="text-align: center" :class="[text_class]">{{ googleScan }}</h3>
              </div>
              <a class="analysis" @click="selectCheck" href="#"><b>Провести полный анализ</b></a>
            </div>
            <div v-if="select === 2" key="2" class="cssload-thecube">
              <div><a href="#" class="prev" @click="prev">Назад</a></div>
              <div class="spinner">
                <div class="rect1"></div>
                <div class="rect2"></div>
                <div class="rect3"></div>
                <div class="rect4"></div>
                <div class="rect5"></div>
              </div>
            </div>
            <div v-if="select == 3" key="3" class="graf">
              <div><a href="#" class="prev" @click="prev">Назад</a></div>
              <Doughnut :chart-data="this.datacoll" :height="400" :options="this.options"></Doughnut>
              <p> {{ this.warning }} из {{ this.sum }} источников считают этот сайт опасным</p>
            </div>
          </div>
        </transition>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import Doughnut from './DoughnutChart.js';

export default {
  name: 'app',
  data () {
    return {
      googleScan: 'Нет информации',
      select: 1,
      text_class: 'text_n',
      scanUrl: '',
      scanUrlFull: '',
      content_url: '',
      clean: 0,
      unrated: 0,
      warning: 0,
      sum: null,
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
    prev() {
      this.select = 1
    },
    getUrl(url) {
        axios.post('https://ovapi.ovd.su/api/post-url-scan', {
          url: url,
          apikey: '5ca8277fafc89da750fe37e6aa5640f8de23226b9c35592f74f876be6c020366',
          crossDomain: true,
        })
          .then(response => {
            let data = JSON.parse(response.data);
            if (data.response_code == 1) {
              axios.post('http://ovapi.ovd.su/api/post-url-report', {
                url: url,
                apikey: '5ca8277fafc89da750fe37e6aa5640f8de23226b9c35592f74f876be6c020366',
                crossDomain: true,
              })
                .then(response => {
                  this.sum = response.data.clean + response.data.warning + response.data.unrated;
                  this.warning = response.data.warning;
                  this.select = 3;
                  console.log(' Супер');
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
                  console.log(error);
                })
            }
          })
          .catch(function (error) {
            console.log(error);
          })

    },
    selectCheck() {
      this.select = 2;
      this.getUrl(this.scanUrl);

    }
  },
  mounted() {

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
        let result = JSON.parse(localStorage.getItem('overblock'))
        console.log(result)
        console.log(response.farewell)
        let status
          if (result) {
            status = result.find(arr => arr.url == response.farewell).status;
          } else {
            status = 4
          }
          console.log(status)
          if (status == 1) {
            document.getElementById('sc1').remove();
            document.getElementById('count').innerHTML = `
                <h3 id="sc1" style="text-align: center" class="text_g">Безопасно!</h3>
            `;
          } else if(status == 2) {
            document.getElementById('sc1').remove();
            document.getElementById('count').innerHTML = `
                <h3 id="sc1" style="text-align: center" class="text_y">Нежелательное ПО!</h3>
            `;
          } else if(status == 3) {
            document.getElementById('sc1').remove();
          document.getElementById('count').innerHTML = `
                <h3 id="sc1" style="text-align: center" class="text_w">Опасность!</h3>
            `;
          } else {
            document.getElementById('sc1').remove();
            document.getElementById('count').innerHTML = `
                <h3 id="sc1" style="text-align: center" class="text_n">Нет данных</h3>
            `;
          }
      });
    });

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      this.scanUrl = tabs[0].url.substring(0, tabs[0].url.indexOf('/', tabs[0].url.indexOf('/') + 2) + 1);

    })
  },
  components: {
    Doughnut
  }
}


</script>

<style>
#app {
  font-family: 'Play', sans-serif;
  color: #2c3e50;
  margin-top: 20px;
  min-width: 270px;
  max-width: 330px;
  padding: 0 30px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

.cont {
  width: 270px;
}
.prev {
  color: #4e91ff;
}

.logo {
  width: 30px;
  height: 30px;
  padding-right: 10px;
  float: left;
}

.title {
  width: 270px;
  height: 30px;
  color: black;
  font-size: 24px;
  font-weight: 700;
  letter-spacing: 1px;
  font-family: 'Play', sans-serif;
}

.title_t {
  float: left;
}

.graf {
  padding: 0 20px;
}

h1, h2 {
  font-weight: normal;
}

a{
  text-decoration: none;
}

.setting {
  width: 30px;
  height: auto;
  float: right;
  opacity: 0.5;
}

.text_n {
  font-size: 20px;
  width: 270px;
  color: #6c757d;
  background: #f8f9fa;
  border: 2px solid #6c757d;
  padding: 5px 0 8px;
  border-radius: 5px;
  margin: 30px 0 10px;
}

.text_g {
  font-size: 20px;
  width: 270px;
  color: #5EAC24;
  background: #5EAC2421;
  border: 2px solid #5EAC24;
  padding: 5px 0 8px;
  border-radius: 5px;
  margin: 30px 0 10px;
}

.text_w {
  font-size: 20px;
  width: 270px;
  color: rgb(255, 24, 17);
  background: rgba(255, 24, 17, 0.1);
  border: 2px solid rgb(255, 24, 17);
  padding: 5px 0 8px;
  border-radius: 5px;
  margin: 30px 0 10px;
}

.text_y {
  font-size: 20px;
  width: 270px;
  color: #deac16;
  background: #deac1623;
  border: 2px solid #deac16;
  padding: 5px 0 8px;
  border-radius: 5px;
  margin: 30px 0 10px;
}

.analysis {
  font-size: 16px;
  width: 270px;
  color: black;
  text-align: center;
  display: inline-block;
  border: 2px solid black;
  padding: 8px 0px;
  border-radius: 5px;
  margin: 0px 0 20px;
  transition: .3s;
}

.analysis:hover {
  border: 2px solid #5EAC24;
  background: #C9EEAE;
  color: #5EAC24;
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
