// Copyright (c) 2018 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import React, {Component} from 'react';
import styled from 'styled-components';
import window from 'global/window';
import {connect} from 'react-redux';
import Banner from './components/banner';
import Announcement from './components/announcement';

import {loadSampleConfigurations} from './actions';
import {replaceLoadDataModal} from './factories/load-data-modal';

const KeplerGl = require('kepler.gl/components').injectComponents([
  replaceLoadDataModal()
]);

const MAPBOX_TOKEN = 'pk.eyJ1IjoidXNlcm5hbWUyNTUiLCJhIjoiY2puaDlsaWFpMGFwNzNrdGxtOTgwNzI4dyJ9.42pNBH5m8CQTjAdWi66obQ'; // eslint-disable-line

// Sample data
/* eslint-disable no-unused-vars */
// import sampleTripData from './data/sample-trip-data';
// import sampleGeojson from './data/sample-geojson.json';
import transferwiseData from './data/transferwise_sample_mod.json';
// import twDataCsv from './data/transferwise_dataset_mod.csv';
import config from './configurations/config.json';
// import sampleH3Data from './data/sample-hex-id-csv';
// import sampleIconCsv, {config as savedMapConfig} from './data/sample-icon-csv';
import {updateVisData, addDataToMap} from 'kepler.gl/actions';
import Processors from 'kepler.gl/processors';

import store from './store';
/* eslint-enable no-unused-vars */

const BannerHeight = 30;
const BannerKey = 'kgHideBanner-iiba';

const GlobalStyleDiv = styled.div`
  font-family: ff-clan-web-pro, 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 400;
  font-size: 0.875em;
  line-height: 1.71429;

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
`;

class App extends Component {
  state = {
    showBanner: false,
    width: window.innerWidth,
    height: window.innerHeight
  };

  componentWillMount() {
    // if we pass an id as part of the url
    // we ry to fetch along map configurations
    const {params: {id: sampleMapId} = {}} = this.props;
    this.props.dispatch(loadSampleConfigurations(sampleMapId));
    window.addEventListener('resize', this._onResize);
    this._onResize();
  }

  componentDidMount() {
    // delay 2s to show the banner
    // if (!window.localStorage.getItem(BannerKey)) {
    //   // window.setTimeout(this._showBanner, 3000);
    // }
    // load sample data
    this._loadSampleData();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
  }

  _onResize = () => {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  _showBanner = () => {
    this.setState({showBanner: true});
  };

  _hideBanner = () => {
    this.setState({showBanner: false});
  };

  _disableBanner = () => {
    this._hideBanner();
    window.localStorage.setItem(BannerKey, 'true');
  };

  getMapConfig() {
    // retrieve kepler.gl store
    const {keplerGl} = this.props;
    // retrieve current kepler.gl instance store
    const {map} = keplerGl;

    // create the config object
    return KeplerGlSchema.getConfigToSave(map);
  }

  _bubble_message(msg) {
    const bubbles = document.querySelector('#bubbles');
    const el = document.querySelector('.bubble-x-y-z').cloneNode();
    el.id = 'x-' + Date.now();
    el.textContent = msg;
    bubbles.appendChild(el);
    el.style.top = "80%";
    window.setTimeout(() => { document.querySelector('#x-' + el.id).remove(); }, 4000);
  }

  _run_counter_updates(total) {

    // amounts converted to eur
    const money_data = [775,2740,75929,1871,1,886,3289,0,8738,703,7,3,10016,75920,89151,12266,0,3484,0,1209,17966,184,285,4131,32,5479,457,3669,42,2109,1199,3284,13276,353,7,940,879,10015,288,60697,38260,85,0,15130,839,506,1151,42133,32651,4724,93782,82681,2506,69386,98001,1,28863,10053,1776,10570,2141,4693,3,92,16,1,1,137,324,5,3,1,75,2230,10,0,1258,2,7,4981,2,6637,5,7921,13,4,4,1175,641,71088,351,2126,4727,5107,5269,1099,43621,11131,1066,495,52684,2,43548,5676,75283,493,5691,10400,2528,33628,1662,3212,6,14410,10944,9214,75,7289,14,336,1,2749,1588,40892,1992,23482,6,1382,4086,1480,1524,4752,3,359,101,990,0,1,5317,9799,151,6008,7980,94547,650,22091,46108,2,22425,2252,2193,29962,496,4187,6213,50,22,6021,11847,62891,5,1779,94,1524,11320,959,2716,1010,48446,1,3,387,1,9365,1502,58344,21,5,5,7871,2357,6381,1140,955,7535,26579,4906,78495,85,3401,7506,8682,23958,26686,20091,3,5,235,91751,1212,1888,18317,15215,69226,1543,9579,59966,77324,102,4686,563,19853,16647,16418,492,1,10298,3734,3084,34486,4908,49572,127,210,1114,335,2003,22829,850,53922,20823,26,476,10385,769,6845,53,200,4,209,232,290,2,11721,1671,716,3527,20,53,19792,2425,13,1047,1062,36,6126,190,1,93765,74,2,194,8191,94602,570,7608,866,303,11155,1,7935,553,2908,420,33,3886,3257,651,5909,12017,1,3067,607,78970,42,5,6,32183,9427,77315,1071,48,84112,1,125,2168,979,96585,682,3342,4,1088,7151,6009,5683,7053,1164,6605,33,1073,283,3944,850,15881,4039,4263,58,5578,591,10385,97386,460,32797,643,64,37401,74706,8613,4119,9370,5135,2,15225,245,276,4,372,10856,7274,10218,5,0,133,1034,7837,774,626,6980,9584,23113,3992,18890,17583,6001,11332,13,983,2,446,5,2654,2175,25,127,337,16616,11904,3249,13909,13,4928,702,16253,5257,443,7066,21045,99020,1585,115,93704,1535,1170,2,50135,15537,6501,9510,26,6,18262,9180,1447,1055,809,36693,8,556,456,3642,8,292,33833,206,879,930,6472,206,6089,2284,460,14297,2386,2098,183,2278,86,5540,72,4,891,3,25,20,156,3025,471,52433,6449,2666,3,8735,13430,11122,5,1720,30548,17281,35044,10991,36663,51027,2,221,1279,92,11,3731,1087,1591,14471,1,1475,3229,773,70729,23121,80615,834,11518,1411,211,17384,263,368,21630,1943,4,14025,3754,770,5555,7972,592,964,1570,9389,8147,6172,8244,8040,1724,314,9639,759,4,1290,44131,482,34104,2,1,5400,2,6178,4,11539,141,133,16848,281,4057,19049,943,128,573,1,29408,2,2826,26267,14676,13,465,3,9124,4,517,7241,47244,5,586,594,1,1007,77144,38967,4760,1762,1503,29605,244,1836,9613,71916,76094,80,4,6865,19,11298,69131,7129,50,3,12393,9581,107,3475,17814,5496,11026,18,6005,1321,94975,2,379,2,201,528,55948,127,107,127953,1,4,113,2501,68289,149,10623,448,2642,76,18,504,19899,952,29,1,4138,1841,71,26660,1168,96866,11372,65108,83851,0,50333,5506,1719,22230,20246,2,12395,5264,57413,10300,6916,43453,868,460,11114,8136,79,743,52011,5,1208,1708,1008,2432,7,41157,4730,3,8,20560,600,389,259,1,358,171,268,1018,7564,5732,746,110,899,362,41,57572,22,24080,75644,1,87568,67851,8068,60,4,4954,3886,564,11689,1991,5042,82,548,294,2118,5,587,50937,3,63832,0,73173,2,3071,2862,126,2129,3,9239,55403,535,46,3655,10964,41613,5152,3637,9994,1148,46917,12542,31921,80860,5,936,8,20,5859,1411,64982,3042,23757,19,38925,87315,94893,67034,185,259,145,3400,3,461,510,384,4,943,2270,7706,95856,19491,3,15615,70941,2292,103,28347,486,1,58007,10800,3794,9775,880,7998,3,66759,11600,38929,48005,6478,11573,2523,2605,940,118,82560,3241,4,1999,2573,210,277,17,16841,32512,749,13001,29364,68956,1,811,2045,46793,97,4881,4260,37,6425,6,467,1363,1635,4,594,19930,10180,13206,86,1403,57369,54951,7293,6865,7464,8,28239,60912,259,1,114,426,1279,304,61272,852,32,82,210,721,74276,19401,603,21060,10997,7,1808,285,1261,4,1252,6004,2801,5,1294,276,15620,427,20,579,2030,55209,7159,5350,657,6101,570,24613,6,95778,3660,1505,7925,18362,1749,8944,836,0,1304,478,1,6162,87894,9736,10722,3588,1065,50111,533,20169,3328,32934,62,3804,1,1586,157,639,9356,765,0,116,1790,6839,12131,9211,6935,6185,5,45,52599,1621,33,44870,20027,732,902,283,1729,50974,6314,46275,3878,5,185,3231,12,17045,6742,396,1204,17,4831,5,9217,1309,12413,83,153,11312,5065,20,31932,3001,1,3031,10044,3,44756,858,9086,419,27,373,1159,83729,9851,417,3758,4,104,3801,45772,5318,66074,4,49,18,4751,148,4417,1281,2342,8,1420,1527,1568,1,9628,72598,2,10974,75073,3385,669,38487,1308,128,2011,2418,773,346,7260,125484,5995,1166,11036,1,1647,1573,428,1406,18989,3,10490,1936,493,2,200,4818,757,644,9661,33,642,117,3,6834,5198,930,1594,1,6621,53577,1005,22777,4080,86,8912,368,5693,4367,2902,66331,5985,322,3,6812,745,4,448,13826,3714,9072,11435,6336,5386,4184,1313];
    // let total = 0;
    let i = 0;
    const parts_total = 20;

    window.setInterval( () => {
      var plus;
      if ((i + 1) % parts_total) {
        plus = money_data.slice((i % parts_total) * 50, (((i + 1) % parts_total) * 50)).reduce((a, b) => { return a + b; })
      } else {
        plus = money_data.slice(950, 999).reduce((a, b) => { return a + b; });
        this._run_counter_updates(total);
      }
      i++;
      // total += Math.round(Math.random() * 1000);
      total += plus;
      count.textContent = 'Safely transfered: ' + total + '💰 ';
      // console.log(money_data.length);
      // this._bubble_message('test!');
    }, 1500);

  }



  _loadSampleData() {

    const data = Processors.processGeojson(transferwiseData);

    const dataset = {
      data,
      info: {
        id: 'my_data'
        // this is used to match the dataId defined in nyc-config.json. For more details see API documentation.
        // It is paramount that this id mathces your configuration otherwise the configuration file will be ignored.
      }
    };
    // const config = this.getMapConfig();
    this.props.dispatch(addDataToMap({datasets: dataset,
      options: {
          centerMap: true,
          readOnly: true
        },
      config}));

      const count = document.querySelector('#count');

      window.setTimeout(() => {

        document.querySelectorAll('.bottom-widget--inner .sc-bMvGRv')[0].click();
        document.querySelectorAll('.time-range-slider__control .playback-control-button')[1].click();

        if (count) {

          this._run_counter_updates(0);

        } else {
          console.log('counter won\'t be displayed, sorry');
        }

      }, 3000);

  }

  render() {
    const {showBanner, width, height} = this.state;
    return (
      <GlobalStyleDiv>
        {/* <Banner
          show={this.state.showBanner}
          height={BannerHeight}
          bgColor="#82368c"
          onClose={this._hideBanner}
        >
          <Announcement onDisable={this._disableBanner}/>
        </Banner> */}
        <div
          style={{
            transition: 'margin 1s, height 1s',
            position: 'absolute',
            width: '100%',
            height: showBanner ? `calc(100% - ${BannerHeight}px)` : '100%',
            minHeight: `calc(100% - ${BannerHeight}px)`,
            marginTop: showBanner ? `${BannerHeight}px` : 0
          }}
        >
          <KeplerGl
            mapboxApiAccessToken={MAPBOX_TOKEN}
            id="map"
            /*
             * Specify path to keplerGl state, because it is not mount at the root
             *
             * height={height - (showBanner ? BannerHeight : 0)}
             */
            getState={state => state.demo.keplerGl}
            width={width}
            height={height}
          />
        </div>
      </GlobalStyleDiv>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({dispatch});

export default connect(
  mapStateToProps,
  dispatchToProps
)(App);
