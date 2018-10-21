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

  _run_counter_updates(total) {

    const money_data = [58412,17312,75929,8056,35204,66716,34005,4540,69461,5592,67134,53506,79627,66800,89151,97509,2520,27693,6879,91031,17966,23683,21501,32840,138,90111,34386,29167,78202,9080,73858,14137,57155,31157,49660,34790,6989,79619,21727,69609,38260,2755,2902,15130,6666,38109,86731,88566,37445,37556,93782,94821,93693,69386,98001,35659,28863,94989,19486,84027,6742,37304,80282,55363,41642,23217,26170,5080,19974,85860,58736,23005,97709,17731,8353,1455,77468,7203,4861,39597,42491,72809,92920,62967,24572,63834,96751,72369,98316,71088,11360,54991,37575,40599,41885,87890,43621,88491,94227,63796,52684,37450,43548,24107,75283,66632,5691,82678,20098,50263,1662,25535,63697,14410,87003,73247,49687,57945,4203,20730,67744,88847,97811,79984,21852,99729,19942,85155,17355,2894,93873,37774,49075,11596,66321,7872,5113,17469,42269,8780,9306,47763,63437,94547,48963,95109,46108,7146,25718,94143,70893,29962,30564,33282,35013,828,57310,6021,94182,62891,87219,14145,5812,93866,48737,59215,29790,32658,48446,26037,46309,3074,23331,74445,92530,58344,4148,95633,80502,33430,60965,65964,29497,84407,32002,26579,39002,78495,47223,74605,8608,36428,23958,26686,86497,79779,82319,83041,91751,74680,48830,77795,64618,69226,64500,76150,89629,89819,6295,20174,66814,31956,71669,62785,37030,22474,81864,29686,24513,34486,50739,49572,83507,15815,68610,25224,15926,22829,64009,53922,88435,17836,35866,10385,7945,54412,34819,15093,61214,67467,14272,21827,27238,49779,13287,53898,28036,11747,41202,84057,62724,37859,78855,44414,95858,12033,61392,19124,93765,2737,42686,68496,65115,94602,42932,36284,65259,22815,88681,19528,74978,41683,93989,64371,57658,30891,25894,57487,46974,57310,9648,79334,48553,78970,32157,87009,96142,99797,84689,89809,80649,5710,84112,11367,3223,29526,73712,96585,41986,14193,66803,8646,7151,65355,51051,56069,9255,52511,88029,80851,17407,86517,6759,68373,78787,33890,7497,44342,36393,82561,97386,54610,32797,82872,83011,37401,74706,94477,90368,74491,40825,30786,65549,1168,2193,66414,44117,86305,57860,81228,87518,1404,87931,4392,7837,99785,78705,72158,76187,98164,31735,81328,67241,47709,90084,45926,74019,29901,7335,78885,21095,90928,66619,76101,45589,16616,94635,25828,13909,61469,39176,15408,91592,22632,55734,56175,84923,99020,97636,4810,93704,57386,72088,28580,50135,74097,51678,98316,90481,97405,77561,72979,54090,79491,60926,42080,55800,71741,1964,37654,618,7553,33833,72939,28421,10201,58147,26596,6089,73821,40618,61551,77111,87707,90451,73629,59008,6353,40291,77509,54906,45714,65207,753,1237,31272,12191,52433,66664,21197,50115,78471,51360,88416,85898,7406,30548,17281,28703,87375,36663,51027,27690,1753,13219,60329,9039,29663,4616,12646,12966,11057,85625,25672,47610,70729,23121,80615,62786,49588,45604,26490,17384,40298,43645,91865,15443,78316,60346,41175,47413,57425,7972,70284,79753,96712,74640,64767,23602,65540,12942,33623,2494,99648,57187,38985,97166,44131,15575,39615,34831,13207,55823,35135,49112,67842,91732,59120,4294,94946,98917,32255,19049,58080,99340,73881,25713,29408,31850,22467,81454,62330,39551,28644,53650,72529,73337,38977,57563,47244,12533,69563,36602,18921,10406,77144,38967,37844,14011,92597,33952,14999,59337,76424,71916,76094,68048,73902,26252,66543,89818,79281,56670,3778,24847,98521,76168,45102,76234,15674,43691,46830,23881,62082,81388,94975,43176,23344,36318,12381,80899,55948,36768,90296,55301,15938,13007,63325,64695,68289,52817,92222,3564,85395,1552,75675,37978,19899,58629,18809,24170,30744,68810,1558,82670,48807,96866,48299,65108,83851,2754,58467,52024,63628,95706,87165,37619,12395,22356,51441,81880,54979,43453,19050,3659,88354,64675,10186,5906,52011,95748,9607,13577,8016,53357,12349,41157,20365,49117,20834,78627,45189,50188,19491,18678,26959,12869,16479,62682,60130,24679,65877,75210,67694,27300,26690,57572,7109,47100,75644,16881,87568,67851,76232,33773,67648,19991,30890,42512,11689,51497,5042,34285,5174,85433,16834,94832,89939,50937,53434,72920,5828,73173,40808,24417,2862,36558,23351,59285,9239,55403,31046,16341,15523,10964,81186,40955,39901,79451,70722,46917,99705,31921,80860,90142,30237,28603,70811,46575,86914,64982,31448,46469,12326,58179,87315,94893,76876,4059,10827,12794,74582,60211,62352,21336,49559,38733,35249,89750,8838,95856,82780,44259,15615,70941,18223,57777,28347,57700,12829,58007,45867,14511,77708,9093,63580,55723,66759,55322,38929,48005,51499,49825,2523,84180,70819,8884,82560,25763,72649,20665,56444,18552,2204,123,16841,32512,20914,15102,33675,68956,15624,49980,33624,46793,19363,20730,33869,4714,51080,15749,28751,83942,26882,97810,24817,85803,80927,56855,56500,11151,57369,54951,30974,54577,31702,2434,42207,60912,7226,4948,88504,54921,53482,2418,61272,64192,4977,28916,88314,54288,86279,82397,15602,89445,25255,3690,46757,43745,35205,15366,46793,47733,72464,84807,10290,20773,67250,32200,27105,78328,33390,64131,56913,42532,10811,48497,42936,24613,22983,95778,29097,29353,81927,77983,18081,8944,6645,21594,98194,64595,9878,48986,87894,77400,85238,28521,23366,50111,4240,84628,68250,38256,37079,30238,28206,12610,4398,48130,40278,47109,6043,9640,14228,54370,96440,73222,55127,26630,91989,34605,78617,99838,63287,67065,20027,732,3448,17404,48287,50974,46912,53753,30827,91121,13961,25688,33252,72391,53596,14796,90710,33316,38401,89159,9217,98578,92222,6286,18285,48700,21511,52712,62300,31024,12934,31339,79843,46573,44756,64618,72231,481,18275,28113,19058,83729,78312,31418,62109,61573,15919,30219,45772,39510,75776,69163,14160,63375,37772,17619,35111,78892,9945,81239,36727,49336,96583,16747,54256,72598,40989,87239,75073,26913,41206,38487,42279,4773,20787,19221,99636,21300,57716,43694,61971,71796,87734,55265,17022,14865,3400,45453,81752,55428,83389,8334,66616,32149,23425,38303,57017,83108,76805,60506,5103,77246,53806,70646,53740,8786,66643,25100,52634,61444,61897,95567,83655,6476,70847,27696,5693,45145,23068,66331,47580,2561,46207,70425,45894,73614,27589,13826,29527,72119,54533,50367,55679,33263,88560];
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
