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

      window.setTimeout(() => {

        document.querySelectorAll('.bottom-widget--inner .sc-bMvGRv')[0].click();
        document.querySelectorAll('.time-range-slider__control .playback-control-button')[1].click();

        const count = document.querySelector('#count');
        if (count) {
          const money_data = [{"time":"1:00:01 AM","amount":58412},{"time":"1:01:45 AM","amount":17312},{"time":"1:00:00 AM","amount":75929},{"time":"1:02:00 AM","amount":8056},{"time":"1:02:09 AM","amount":35204},{"time":"1:00:26 AM","amount":66716},{"time":"1:02:19 AM","amount":34005},{"time":"1:00:43 AM","amount":4540},{"time":"1:00:39 AM","amount":69461},{"time":"1:00:29 AM","amount":5592},{"time":"1:03:00 AM","amount":67134},{"time":"1:00:50 AM","amount":53506},{"time":"1:00:56 AM","amount":79627},{"time":"1:00:09 AM","amount":66800},{"time":"1:00:04 AM","amount":89151},{"time":"1:00:12 AM","amount":97509},{"time":"1:01:43 AM","amount":2520},{"time":"1:00:10 AM","amount":27693},{"time":"1:02:17 AM","amount":6879},{"time":"1:02:22 AM","amount":91031},{"time":"1:02:52 AM","amount":17966},{"time":"1:02:53 AM","amount":23683},{"time":"1:01:28 AM","amount":21501},{"time":"1:01:49 AM","amount":32840},{"time":"1:00:20 AM","amount":138},{"time":"1:00:25 AM","amount":90111},{"time":"1:00:06 AM","amount":34386},{"time":"1:00:37 AM","amount":29167},{"time":"1:00:39 AM","amount":78202},{"time":"1:00:05 AM","amount":9080},{"time":"1:00:27 AM","amount":73858},{"time":"1:02:35 AM","amount":14137},{"time":"1:01:15 AM","amount":57155},{"time":"1:02:40 AM","amount":31157},{"time":"1:01:08 AM","amount":49660},{"time":"1:00:55 AM","amount":34790},{"time":"1:01:13 AM","amount":6989},{"time":"1:00:29 AM","amount":79619},{"time":"1:01:54 AM","amount":21727},{"time":"1:01:09 AM","amount":69609},{"time":"1:01:43 AM","amount":38260},{"time":"1:01:59 AM","amount":2755},{"time":"1:00:03 AM","amount":2902},{"time":"1:02:56 AM","amount":15130},{"time":"1:00:21 AM","amount":6666},{"time":"1:01:08 AM","amount":38109},{"time":"1:02:17 AM","amount":86731},{"time":"1:01:18 AM","amount":88566},{"time":"1:01:06 AM","amount":37445},{"time":"1:01:42 AM","amount":37556},{"time":"1:01:44 AM","amount":93782},{"time":"1:00:35 AM","amount":94821},{"time":"1:02:35 AM","amount":93693},{"time":"1:02:34 AM","amount":69386},{"time":"1:00:18 AM","amount":98001},{"time":"1:00:43 AM","amount":35659},{"time":"1:02:39 AM","amount":28863},{"time":"1:00:00 AM","amount":94989},{"time":"1:00:44 AM","amount":19486},{"time":"1:01:46 AM","amount":84027},{"time":"1:02:11 AM","amount":6742},{"time":"1:00:23 AM","amount":37304},{"time":"1:02:16 AM","amount":80282},{"time":"1:01:54 AM","amount":55363},{"time":"1:01:28 AM","amount":41642},{"time":"1:03:00 AM","amount":23217},{"time":"1:02:49 AM","amount":26170},{"time":"1:01:01 AM","amount":5080},{"time":"1:01:07 AM","amount":19974},{"time":"1:01:26 AM","amount":85860},{"time":"1:02:30 AM","amount":58736},{"time":"1:00:50 AM","amount":23005},{"time":"1:01:05 AM","amount":97709},{"time":"1:00:09 AM","amount":17731},{"time":"1:00:08 AM","amount":8353},{"time":"1:01:17 AM","amount":1455},{"time":"1:01:43 AM","amount":77468},{"time":"1:02:09 AM","amount":7203},{"time":"1:01:17 AM","amount":4861},{"time":"1:01:21 AM","amount":39597},{"time":"1:00:44 AM","amount":42491},{"time":"1:01:54 AM","amount":72809},{"time":"1:01:10 AM","amount":92920},{"time":"1:00:29 AM","amount":62967},{"time":"1:01:42 AM","amount":24572},{"time":"1:00:53 AM","amount":63834},{"time":"1:00:09 AM","amount":96751},{"time":"1:01:22 AM","amount":72369},{"time":"1:01:44 AM","amount":98316},{"time":"1:02:02 AM","amount":71088},{"time":"1:02:02 AM","amount":11360},{"time":"1:00:12 AM","amount":54991},{"time":"1:02:24 AM","amount":37575},{"time":"1:01:24 AM","amount":40599},{"time":"1:01:43 AM","amount":41885},{"time":"1:02:04 AM","amount":87890},{"time":"1:01:41 AM","amount":43621},{"time":"1:02:37 AM","amount":88491},{"time":"1:02:35 AM","amount":94227},{"time":"1:01:06 AM","amount":63796},{"time":"1:02:14 AM","amount":52684},{"time":"1:01:15 AM","amount":37450},{"time":"1:01:27 AM","amount":43548},{"time":"1:00:21 AM","amount":24107},{"time":"1:03:00 AM","amount":75283},{"time":"1:00:44 AM","amount":66632},{"time":"1:01:12 AM","amount":5691},{"time":"1:01:49 AM","amount":82678},{"time":"1:02:04 AM","amount":20098},{"time":"1:00:34 AM","amount":50263},{"time":"1:00:34 AM","amount":1662},{"time":"1:02:55 AM","amount":25535},{"time":"1:01:11 AM","amount":63697},{"time":"1:00:35 AM","amount":14410},{"time":"1:00:36 AM","amount":87003},{"time":"1:02:07 AM","amount":73247},{"time":"1:02:33 AM","amount":49687},{"time":"1:02:58 AM","amount":57945},{"time":"1:00:55 AM","amount":4203},{"time":"1:01:47 AM","amount":20730},{"time":"1:01:32 AM","amount":67744},{"time":"1:01:50 AM","amount":88847},{"time":"1:02:40 AM","amount":97811},{"time":"1:02:20 AM","amount":79984},{"time":"1:00:42 AM","amount":21852},{"time":"1:02:01 AM","amount":99729},{"time":"1:02:48 AM","amount":19942},{"time":"1:02:26 AM","amount":85155},{"time":"1:01:56 AM","amount":17355},{"time":"1:00:34 AM","amount":2894},{"time":"1:01:26 AM","amount":93873},{"time":"1:01:45 AM","amount":37774},{"time":"1:01:50 AM","amount":49075},{"time":"1:00:44 AM","amount":11596},{"time":"1:01:36 AM","amount":66321},{"time":"1:01:50 AM","amount":7872},{"time":"1:01:33 AM","amount":5113},{"time":"1:01:33 AM","amount":17469},{"time":"1:00:00 AM","amount":42269},{"time":"1:02:01 AM","amount":8780},{"time":"1:00:45 AM","amount":9306},{"time":"1:00:16 AM","amount":47763},{"time":"1:00:16 AM","amount":63437},{"time":"1:00:32 AM","amount":94547},{"time":"1:02:56 AM","amount":48963},{"time":"1:00:06 AM","amount":95109},{"time":"1:00:14 AM","amount":46108},{"time":"1:01:33 AM","amount":7146},{"time":"1:00:17 AM","amount":25718},{"time":"1:00:00 AM","amount":94143},{"time":"1:00:12 AM","amount":70893},{"time":"1:00:04 AM","amount":29962},{"time":"1:01:18 AM","amount":30564},{"time":"1:02:19 AM","amount":33282},{"time":"1:00:20 AM","amount":35013},{"time":"1:02:46 AM","amount":828},{"time":"1:02:18 AM","amount":57310},{"time":"1:00:54 AM","amount":6021},{"time":"1:01:09 AM","amount":94182},{"time":"1:02:35 AM","amount":62891},{"time":"1:01:45 AM","amount":87219},{"time":"1:02:13 AM","amount":14145},{"time":"1:00:47 AM","amount":5812},{"time":"1:02:59 AM","amount":93866},{"time":"1:02:48 AM","amount":48737},{"time":"1:02:31 AM","amount":59215},{"time":"1:02:11 AM","amount":29790},{"time":"1:01:05 AM","amount":32658},{"time":"1:02:20 AM","amount":48446},{"time":"1:01:43 AM","amount":26037},{"time":"1:00:22 AM","amount":46309},{"time":"1:02:43 AM","amount":3074},{"time":"1:00:46 AM","amount":23331},{"time":"1:01:48 AM","amount":74445},{"time":"1:02:07 AM","amount":92530},{"time":"1:00:24 AM","amount":58344},{"time":"1:01:23 AM","amount":4148},{"time":"1:01:33 AM","amount":95633},{"time":"1:01:08 AM","amount":80502},{"time":"1:01:23 AM","amount":33430},{"time":"1:01:14 AM","amount":60965},{"time":"1:02:56 AM","amount":65964},{"time":"1:01:59 AM","amount":29497},{"time":"1:01:48 AM","amount":84407},{"time":"1:00:45 AM","amount":32002},{"time":"1:02:30 AM","amount":26579},{"time":"1:02:24 AM","amount":39002},{"time":"1:02:34 AM","amount":78495},{"time":"1:01:41 AM","amount":47223},{"time":"1:00:25 AM","amount":74605},{"time":"1:00:13 AM","amount":8608},{"time":"1:01:49 AM","amount":36428},{"time":"1:01:52 AM","amount":23958},{"time":"1:00:54 AM","amount":26686},{"time":"1:02:46 AM","amount":86497},{"time":"1:02:05 AM","amount":79779},{"time":"1:02:32 AM","amount":82319},{"time":"1:02:09 AM","amount":83041},{"time":"1:02:18 AM","amount":91751},{"time":"1:02:07 AM","amount":74680},{"time":"1:00:48 AM","amount":48830},{"time":"1:00:29 AM","amount":77795},{"time":"1:01:57 AM","amount":64618},{"time":"1:00:43 AM","amount":69226},{"time":"1:00:14 AM","amount":64500},{"time":"1:01:49 AM","amount":76150},{"time":"1:02:44 AM","amount":89629},{"time":"1:00:45 AM","amount":89819},{"time":"1:02:01 AM","amount":6295},{"time":"1:02:21 AM","amount":20174},{"time":"1:00:46 AM","amount":66814},{"time":"1:01:26 AM","amount":31956},{"time":"1:01:10 AM","amount":71669},{"time":"1:02:28 AM","amount":62785},{"time":"1:01:55 AM","amount":37030},{"time":"1:02:08 AM","amount":22474},{"time":"1:01:39 AM","amount":81864},{"time":"1:02:28 AM","amount":29686},{"time":"1:02:45 AM","amount":24513},{"time":"1:01:57 AM","amount":34486},{"time":"1:00:13 AM","amount":50739},{"time":"1:01:44 AM","amount":49572},{"time":"1:01:50 AM","amount":83507},{"time":"1:01:22 AM","amount":15815},{"time":"1:00:32 AM","amount":68610},{"time":"1:00:05 AM","amount":25224},{"time":"1:01:18 AM","amount":15926},{"time":"1:02:28 AM","amount":22829},{"time":"1:01:30 AM","amount":64009},{"time":"1:02:25 AM","amount":53922},{"time":"1:00:58 AM","amount":88435},{"time":"1:02:58 AM","amount":17836},{"time":"1:00:53 AM","amount":35866},{"time":"1:01:21 AM","amount":10385},{"time":"1:02:15 AM","amount":7945},{"time":"1:01:56 AM","amount":54412},{"time":"1:02:00 AM","amount":34819},{"time":"1:00:35 AM","amount":15093},{"time":"1:02:12 AM","amount":61214},{"time":"1:01:16 AM","amount":67467},{"time":"1:00:26 AM","amount":14272},{"time":"1:02:57 AM","amount":21827},{"time":"1:02:26 AM","amount":27238},{"time":"1:02:19 AM","amount":49779},{"time":"1:00:03 AM","amount":13287},{"time":"1:00:45 AM","amount":53898},{"time":"1:02:15 AM","amount":28036},{"time":"1:02:03 AM","amount":11747},{"time":"1:02:25 AM","amount":41202},{"time":"1:02:27 AM","amount":84057},{"time":"1:01:21 AM","amount":62724},{"time":"1:01:06 AM","amount":37859},{"time":"1:02:02 AM","amount":78855},{"time":"1:02:26 AM","amount":44414},{"time":"1:02:50 AM","amount":95858},{"time":"1:00:23 AM","amount":12033},{"time":"1:01:15 AM","amount":61392},{"time":"1:01:03 AM","amount":19124},{"time":"1:02:11 AM","amount":93765},{"time":"1:00:31 AM","amount":2737},{"time":"1:02:13 AM","amount":42686},{"time":"1:02:19 AM","amount":68496},{"time":"1:02:58 AM","amount":65115},{"time":"1:01:22 AM","amount":94602},{"time":"1:00:55 AM","amount":42932},{"time":"1:02:28 AM","amount":36284},{"time":"1:01:33 AM","amount":65259},{"time":"1:01:47 AM","amount":22815},{"time":"1:00:02 AM","amount":88681},{"time":"1:02:51 AM","amount":19528},{"time":"1:01:42 AM","amount":74978},{"time":"1:00:45 AM","amount":41683},{"time":"1:02:46 AM","amount":93989},{"time":"1:02:46 AM","amount":64371},{"time":"1:00:21 AM","amount":57658},{"time":"1:02:28 AM","amount":30891},{"time":"1:01:21 AM","amount":25894},{"time":"1:01:58 AM","amount":57487},{"time":"1:00:25 AM","amount":46974},{"time":"1:02:33 AM","amount":57310},{"time":"1:00:38 AM","amount":9648},{"time":"1:00:22 AM","amount":79334},{"time":"1:00:05 AM","amount":48553},{"time":"1:00:18 AM","amount":78970},{"time":"1:01:12 AM","amount":32157},{"time":"1:02:42 AM","amount":87009},{"time":"1:01:32 AM","amount":96142},{"time":"1:01:07 AM","amount":99797},{"time":"1:02:15 AM","amount":84689},{"time":"1:00:46 AM","amount":89809},{"time":"1:00:00 AM","amount":80649},{"time":"1:02:53 AM","amount":5710},{"time":"1:00:27 AM","amount":84112},{"time":"1:00:31 AM","amount":11367},{"time":"1:02:59 AM","amount":3223},{"time":"1:02:02 AM","amount":29526},{"time":"1:01:32 AM","amount":73712},{"time":"1:00:15 AM","amount":96585},{"time":"1:01:38 AM","amount":41986},{"time":"1:01:47 AM","amount":14193},{"time":"1:00:17 AM","amount":66803},{"time":"1:02:11 AM","amount":8646},{"time":"1:02:09 AM","amount":7151},{"time":"1:02:29 AM","amount":65355},{"time":"1:02:30 AM","amount":51051},{"time":"1:02:17 AM","amount":56069},{"time":"1:01:00 AM","amount":9255},{"time":"1:01:02 AM","amount":52511},{"time":"1:01:02 AM","amount":88029},{"time":"1:00:42 AM","amount":80851},{"time":"1:00:34 AM","amount":17407},{"time":"1:02:59 AM","amount":86517},{"time":"1:02:48 AM","amount":6759},{"time":"1:01:23 AM","amount":68373},{"time":"1:00:16 AM","amount":78787},{"time":"1:01:52 AM","amount":33890},{"time":"1:00:15 AM","amount":7497},{"time":"1:01:12 AM","amount":44342},{"time":"1:01:03 AM","amount":36393},{"time":"1:02:17 AM","amount":82561},{"time":"1:00:31 AM","amount":97386},{"time":"1:02:39 AM","amount":54610},{"time":"1:02:21 AM","amount":32797},{"time":"1:01:30 AM","amount":82872},{"time":"1:01:48 AM","amount":83011},{"time":"1:01:32 AM","amount":37401},{"time":"1:01:54 AM","amount":74706},{"time":"1:02:17 AM","amount":94477},{"time":"1:01:20 AM","amount":90368},{"time":"1:00:29 AM","amount":74491},{"time":"1:01:06 AM","amount":40825},{"time":"1:02:55 AM","amount":30786},{"time":"1:01:01 AM","amount":65549},{"time":"1:02:35 AM","amount":1168},{"time":"1:01:08 AM","amount":2193},{"time":"1:02:34 AM","amount":66414},{"time":"1:01:39 AM","amount":44117},{"time":"1:02:00 AM","amount":86305},{"time":"1:02:39 AM","amount":57860},{"time":"1:00:48 AM","amount":81228},{"time":"1:02:03 AM","amount":87518},{"time":"1:01:24 AM","amount":1404},{"time":"1:01:46 AM","amount":87931},{"time":"1:00:39 AM","amount":4392},{"time":"1:00:49 AM","amount":7837},{"time":"1:02:24 AM","amount":99785},{"time":"1:01:04 AM","amount":78705},{"time":"1:00:53 AM","amount":72158},{"time":"1:01:39 AM","amount":76187},{"time":"1:02:37 AM","amount":98164},{"time":"1:01:53 AM","amount":31735},{"time":"1:01:43 AM","amount":81328},{"time":"1:02:20 AM","amount":67241},{"time":"1:00:43 AM","amount":47709},{"time":"1:01:25 AM","amount":90084},{"time":"1:01:54 AM","amount":45926},{"time":"1:01:03 AM","amount":74019},{"time":"1:02:29 AM","amount":29901},{"time":"1:01:38 AM","amount":7335},{"time":"1:02:19 AM","amount":78885},{"time":"1:01:28 AM","amount":21095},{"time":"1:00:49 AM","amount":90928},{"time":"1:00:56 AM","amount":66619},{"time":"1:00:28 AM","amount":76101},{"time":"1:02:28 AM","amount":45589},{"time":"1:01:39 AM","amount":16616},{"time":"1:00:32 AM","amount":94635},{"time":"1:01:44 AM","amount":25828},{"time":"1:00:37 AM","amount":13909},{"time":"1:00:18 AM","amount":61469},{"time":"1:02:11 AM","amount":39176},{"time":"1:01:02 AM","amount":15408},{"time":"1:00:10 AM","amount":91592},{"time":"1:00:56 AM","amount":22632},{"time":"1:01:29 AM","amount":55734},{"time":"1:02:09 AM","amount":56175},{"time":"1:01:43 AM","amount":84923},{"time":"1:00:04 AM","amount":99020},{"time":"1:00:31 AM","amount":97636},{"time":"1:00:15 AM","amount":4810},{"time":"1:01:20 AM","amount":93704},{"time":"1:02:11 AM","amount":57386},{"time":"1:02:09 AM","amount":72088},{"time":"1:01:52 AM","amount":28580},{"time":"1:01:44 AM","amount":50135},{"time":"1:00:08 AM","amount":74097},{"time":"1:00:57 AM","amount":51678},{"time":"1:02:58 AM","amount":98316},{"time":"1:02:04 AM","amount":90481},{"time":"1:00:08 AM","amount":97405},{"time":"1:00:47 AM","amount":77561},{"time":"1:02:57 AM","amount":72979},{"time":"1:00:06 AM","amount":54090},{"time":"1:02:51 AM","amount":79491},{"time":"1:02:25 AM","amount":60926},{"time":"1:02:59 AM","amount":42080},{"time":"1:00:08 AM","amount":55800},{"time":"1:01:57 AM","amount":71741},{"time":"1:00:51 AM","amount":1964},{"time":"1:00:20 AM","amount":37654},{"time":"1:00:22 AM","amount":618},{"time":"1:00:19 AM","amount":7553},{"time":"1:01:24 AM","amount":33833},{"time":"1:02:13 AM","amount":72939},{"time":"1:00:02 AM","amount":28421},{"time":"1:01:49 AM","amount":10201},{"time":"1:00:50 AM","amount":58147},{"time":"1:01:16 AM","amount":26596},{"time":"1:00:12 AM","amount":6089},{"time":"1:02:22 AM","amount":73821},{"time":"1:01:14 AM","amount":40618},{"time":"1:01:42 AM","amount":61551},{"time":"1:01:04 AM","amount":77111},{"time":"1:02:07 AM","amount":87707},{"time":"1:02:54 AM","amount":90451},{"time":"1:00:03 AM","amount":73629},{"time":"1:00:45 AM","amount":59008},{"time":"1:02:26 AM","amount":6353},{"time":"1:01:07 AM","amount":40291},{"time":"1:00:10 AM","amount":77509},{"time":"1:00:35 AM","amount":54906},{"time":"1:01:28 AM","amount":45714},{"time":"1:02:20 AM","amount":65207},{"time":"1:02:29 AM","amount":753},{"time":"1:02:14 AM","amount":1237},{"time":"1:01:40 AM","amount":31272},{"time":"1:01:27 AM","amount":12191},{"time":"1:00:20 AM","amount":52433},{"time":"1:02:28 AM","amount":66664},{"time":"1:02:20 AM","amount":21197},{"time":"1:00:24 AM","amount":50115},{"time":"1:02:51 AM","amount":78471},{"time":"1:00:34 AM","amount":51360},{"time":"1:01:27 AM","amount":88416},{"time":"1:01:56 AM","amount":85898},{"time":"1:02:40 AM","amount":7406},{"time":"1:00:46 AM","amount":30548},{"time":"1:00:36 AM","amount":17281},{"time":"1:02:10 AM","amount":28703},{"time":"1:00:08 AM","amount":87375},{"time":"1:02:21 AM","amount":36663},{"time":"1:01:44 AM","amount":51027},{"time":"1:00:32 AM","amount":27690},{"time":"1:02:29 AM","amount":1753},{"time":"1:02:42 AM","amount":13219},{"time":"1:02:53 AM","amount":60329},{"time":"1:00:30 AM","amount":9039},{"time":"1:02:30 AM","amount":29663},{"time":"1:01:51 AM","amount":4616},{"time":"1:01:21 AM","amount":12646},{"time":"1:02:06 AM","amount":12966},{"time":"1:00:43 AM","amount":11057},{"time":"1:00:41 AM","amount":85625},{"time":"1:00:16 AM","amount":25672},{"time":"1:02:01 AM","amount":47610},{"time":"1:01:31 AM","amount":70729},{"time":"1:02:57 AM","amount":23121},{"time":"1:00:41 AM","amount":80615},{"time":"1:00:15 AM","amount":62786},{"time":"1:01:31 AM","amount":49588},{"time":"1:00:55 AM","amount":45604},{"time":"1:01:15 AM","amount":26490},{"time":"1:00:25 AM","amount":17384},{"time":"1:02:45 AM","amount":40298},{"time":"1:02:02 AM","amount":43645},{"time":"1:01:00 AM","amount":91865},{"time":"1:01:49 AM","amount":15443},{"time":"1:00:42 AM","amount":78316},{"time":"1:00:51 AM","amount":60346},{"time":"1:02:03 AM","amount":41175},{"time":"1:01:47 AM","amount":47413},{"time":"1:00:47 AM","amount":57425},{"time":"1:00:10 AM","amount":7972},{"time":"1:02:14 AM","amount":70284},{"time":"1:00:00 AM","amount":79753},{"time":"1:01:30 AM","amount":96712},{"time":"1:01:07 AM","amount":74640},{"time":"1:02:23 AM","amount":64767},{"time":"1:01:32 AM","amount":23602},{"time":"1:01:27 AM","amount":65540},{"time":"1:00:11 AM","amount":12942},{"time":"1:01:51 AM","amount":33623},{"time":"1:00:31 AM","amount":2494},{"time":"1:01:07 AM","amount":99648},{"time":"1:01:43 AM","amount":57187},{"time":"1:00:53 AM","amount":38985},{"time":"1:02:39 AM","amount":97166},{"time":"1:01:37 AM","amount":44131},{"time":"1:02:23 AM","amount":15575},{"time":"1:00:08 AM","amount":39615},{"time":"1:00:22 AM","amount":34831},{"time":"1:00:32 AM","amount":13207},{"time":"1:00:10 AM","amount":55823},{"time":"1:00:04 AM","amount":35135},{"time":"1:01:09 AM","amount":49112},{"time":"1:02:01 AM","amount":67842},{"time":"1:00:26 AM","amount":91732},{"time":"1:01:28 AM","amount":59120},{"time":"1:02:37 AM","amount":4294},{"time":"1:02:20 AM","amount":94946},{"time":"1:01:03 AM","amount":98917},{"time":"1:01:42 AM","amount":32255},{"time":"1:00:34 AM","amount":19049},{"time":"1:02:49 AM","amount":58080},{"time":"1:01:03 AM","amount":99340},{"time":"1:02:25 AM","amount":73881},{"time":"1:01:57 AM","amount":25713},{"time":"1:01:13 AM","amount":29408},{"time":"1:00:51 AM","amount":31850},{"time":"1:00:26 AM","amount":22467},{"time":"1:02:05 AM","amount":81454},{"time":"1:01:27 AM","amount":62330},{"time":"1:00:37 AM","amount":39551},{"time":"1:01:47 AM","amount":28644},{"time":"1:00:56 AM","amount":53650},{"time":"1:02:19 AM","amount":72529},{"time":"1:02:18 AM","amount":73337},{"time":"1:01:54 AM","amount":38977},{"time":"1:02:41 AM","amount":57563},{"time":"1:00:04 AM","amount":47244},{"time":"1:01:22 AM","amount":12533},{"time":"1:01:09 AM","amount":69563},{"time":"1:01:25 AM","amount":36602},{"time":"1:00:09 AM","amount":18921},{"time":"1:01:49 AM","amount":10406},{"time":"1:00:15 AM","amount":77144},{"time":"1:02:35 AM","amount":38967},{"time":"1:01:10 AM","amount":37844},{"time":"1:02:40 AM","amount":14011},{"time":"1:00:47 AM","amount":92597},{"time":"1:01:15 AM","amount":33952},{"time":"1:01:34 AM","amount":14999},{"time":"1:02:44 AM","amount":59337},{"time":"1:00:36 AM","amount":76424},{"time":"1:01:08 AM","amount":71916},{"time":"1:01:33 AM","amount":76094},{"time":"1:02:00 AM","amount":68048},{"time":"1:02:54 AM","amount":73902},{"time":"1:01:32 AM","amount":26252},{"time":"1:00:30 AM","amount":66543},{"time":"1:02:15 AM","amount":89818},{"time":"1:03:00 AM","amount":79281},{"time":"1:00:13 AM","amount":56670},{"time":"1:00:13 AM","amount":3778},{"time":"1:02:45 AM","amount":24847},{"time":"1:01:20 AM","amount":98521},{"time":"1:02:34 AM","amount":76168},{"time":"1:01:45 AM","amount":45102},{"time":"1:00:45 AM","amount":76234},{"time":"1:01:08 AM","amount":15674},{"time":"1:00:34 AM","amount":43691},{"time":"1:00:32 AM","amount":46830},{"time":"1:02:19 AM","amount":23881},{"time":"1:01:19 AM","amount":62082},{"time":"1:00:45 AM","amount":81388},{"time":"1:01:53 AM","amount":94975},{"time":"1:02:23 AM","amount":43176},{"time":"1:01:13 AM","amount":23344},{"time":"1:01:53 AM","amount":36318},{"time":"1:00:09 AM","amount":12381},{"time":"1:02:01 AM","amount":80899},{"time":"1:01:39 AM","amount":55948},{"time":"1:00:18 AM","amount":36768},{"time":"1:01:10 AM","amount":90296},{"time":"1:02:15 AM","amount":55301},{"time":"1:01:23 AM","amount":15938},{"time":"1:01:33 AM","amount":13007},{"time":"1:01:22 AM","amount":63325},{"time":"1:00:02 AM","amount":64695},{"time":"1:01:45 AM","amount":68289},{"time":"1:01:47 AM","amount":52817},{"time":"1:01:46 AM","amount":92222},{"time":"1:00:20 AM","amount":3564},{"time":"1:02:41 AM","amount":85395},{"time":"1:02:20 AM","amount":1552},{"time":"1:00:28 AM","amount":75675},{"time":"1:02:14 AM","amount":37978},{"time":"1:01:40 AM","amount":19899},{"time":"1:01:26 AM","amount":58629},{"time":"1:02:08 AM","amount":18809},{"time":"1:01:58 AM","amount":24170},{"time":"1:00:35 AM","amount":30744},{"time":"1:02:27 AM","amount":68810},{"time":"1:02:53 AM","amount":1558},{"time":"1:01:04 AM","amount":82670},{"time":"1:01:59 AM","amount":48807},{"time":"1:02:41 AM","amount":96866},{"time":"1:00:00 AM","amount":48299},{"time":"1:01:21 AM","amount":65108},{"time":"1:01:16 AM","amount":83851},{"time":"1:02:56 AM","amount":2754},{"time":"1:01:14 AM","amount":58467},{"time":"1:00:48 AM","amount":52024},{"time":"1:01:59 AM","amount":63628},{"time":"1:02:51 AM","amount":95706},{"time":"1:00:01 AM","amount":87165},{"time":"1:00:58 AM","amount":37619},{"time":"1:01:25 AM","amount":12395},{"time":"1:01:12 AM","amount":22356},{"time":"1:01:16 AM","amount":51441},{"time":"1:02:59 AM","amount":81880},{"time":"1:01:08 AM","amount":54979},{"time":"1:02:02 AM","amount":43453},{"time":"1:01:49 AM","amount":19050},{"time":"1:02:25 AM","amount":3659},{"time":"1:01:25 AM","amount":88354},{"time":"1:00:00 AM","amount":64675},{"time":"1:01:33 AM","amount":10186},{"time":"1:00:56 AM","amount":5906},{"time":"1:01:53 AM","amount":52011},{"time":"1:00:17 AM","amount":95748},{"time":"1:01:05 AM","amount":9607},{"time":"1:00:58 AM","amount":13577},{"time":"1:00:08 AM","amount":8016},{"time":"1:01:45 AM","amount":53357},{"time":"1:00:01 AM","amount":12349},{"time":"1:02:36 AM","amount":41157},{"time":"1:00:16 AM","amount":20365},{"time":"1:00:48 AM","amount":49117},{"time":"1:00:12 AM","amount":20834},{"time":"1:01:02 AM","amount":78627},{"time":"1:00:02 AM","amount":45189},{"time":"1:00:55 AM","amount":50188},{"time":"1:01:30 AM","amount":19491},{"time":"1:02:06 AM","amount":18678},{"time":"1:01:29 AM","amount":26959},{"time":"1:01:40 AM","amount":12869},{"time":"1:00:22 AM","amount":16479},{"time":"1:01:28 AM","amount":62682},{"time":"1:01:13 AM","amount":60130},{"time":"1:00:48 AM","amount":24679},{"time":"1:01:01 AM","amount":65877},{"time":"1:00:52 AM","amount":75210},{"time":"1:01:10 AM","amount":67694},{"time":"1:01:09 AM","amount":27300},{"time":"1:00:22 AM","amount":26690},{"time":"1:00:14 AM","amount":57572},{"time":"1:02:01 AM","amount":7109},{"time":"1:01:47 AM","amount":47100},{"time":"1:02:39 AM","amount":75644},{"time":"1:01:49 AM","amount":16881},{"time":"1:02:02 AM","amount":87568},{"time":"1:01:13 AM","amount":67851},{"time":"1:01:39 AM","amount":76232},{"time":"1:01:50 AM","amount":33773},{"time":"1:02:38 AM","amount":67648},{"time":"1:01:13 AM","amount":19991},{"time":"1:01:01 AM","amount":30890},{"time":"1:00:36 AM","amount":42512},{"time":"1:01:01 AM","amount":11689},{"time":"1:02:52 AM","amount":51497},{"time":"1:02:25 AM","amount":5042},{"time":"1:01:31 AM","amount":34285},{"time":"1:02:10 AM","amount":5174},{"time":"1:01:03 AM","amount":85433},{"time":"1:02:42 AM","amount":16834},{"time":"1:00:13 AM","amount":94832},{"time":"1:02:47 AM","amount":89939},{"time":"1:00:14 AM","amount":50937},{"time":"1:00:45 AM","amount":53434},{"time":"1:00:20 AM","amount":72920},{"time":"1:02:11 AM","amount":5828},{"time":"1:01:48 AM","amount":73173},{"time":"1:00:00 AM","amount":40808},{"time":"1:01:48 AM","amount":24417},{"time":"1:01:33 AM","amount":2862},{"time":"1:02:31 AM","amount":36558},{"time":"1:01:02 AM","amount":23351},{"time":"1:02:52 AM","amount":59285},{"time":"1:02:26 AM","amount":9239},{"time":"1:00:02 AM","amount":55403},{"time":"1:02:33 AM","amount":31046},{"time":"1:00:11 AM","amount":16341},{"time":"1:02:06 AM","amount":15523},{"time":"1:00:52 AM","amount":10964},{"time":"1:02:18 AM","amount":81186},{"time":"1:02:35 AM","amount":40955},{"time":"1:02:08 AM","amount":39901},{"time":"1:02:52 AM","amount":79451},{"time":"1:02:10 AM","amount":70722},{"time":"1:01:06 AM","amount":46917},{"time":"1:01:10 AM","amount":99705},{"time":"1:01:40 AM","amount":31921},{"time":"1:01:10 AM","amount":80860},{"time":"1:02:48 AM","amount":90142},{"time":"1:01:04 AM","amount":30237},{"time":"1:02:22 AM","amount":28603},{"time":"1:00:18 AM","amount":70811},{"time":"1:00:26 AM","amount":46575},{"time":"1:02:22 AM","amount":86914},{"time":"1:00:16 AM","amount":64982},{"time":"1:01:51 AM","amount":31448},{"time":"1:02:44 AM","amount":46469},{"time":"1:01:41 AM","amount":12326},{"time":"1:02:08 AM","amount":58179},{"time":"1:02:24 AM","amount":87315},{"time":"1:00:20 AM","amount":94893},{"time":"1:02:51 AM","amount":76876},{"time":"1:01:25 AM","amount":4059},{"time":"1:00:34 AM","amount":10827},{"time":"1:00:38 AM","amount":12794},{"time":"1:02:56 AM","amount":74582},{"time":"1:02:21 AM","amount":60211},{"time":"1:02:46 AM","amount":62352},{"time":"1:01:04 AM","amount":21336},{"time":"1:02:32 AM","amount":49559},{"time":"1:02:19 AM","amount":38733},{"time":"1:01:51 AM","amount":35249},{"time":"1:00:40 AM","amount":89750},{"time":"1:00:13 AM","amount":8838},{"time":"1:00:20 AM","amount":95856},{"time":"1:01:45 AM","amount":82780},{"time":"1:00:47 AM","amount":44259},{"time":"1:00:23 AM","amount":15615},{"time":"1:00:26 AM","amount":70941},{"time":"1:01:40 AM","amount":18223},{"time":"1:00:49 AM","amount":57777},{"time":"1:01:59 AM","amount":28347},{"time":"1:02:44 AM","amount":57700},{"time":"1:00:45 AM","amount":12829},{"time":"1:00:29 AM","amount":58007},{"time":"1:01:16 AM","amount":45867},{"time":"1:01:00 AM","amount":14511},{"time":"1:01:45 AM","amount":77708},{"time":"1:01:01 AM","amount":9093},{"time":"1:00:30 AM","amount":63580},{"time":"1:02:50 AM","amount":55723},{"time":"1:02:58 AM","amount":66759},{"time":"1:00:34 AM","amount":55322},{"time":"1:01:39 AM","amount":38929},{"time":"1:02:03 AM","amount":48005},{"time":"1:01:16 AM","amount":51499},{"time":"1:01:53 AM","amount":49825},{"time":"1:00:34 AM","amount":2523},{"time":"1:00:04 AM","amount":84180},{"time":"1:00:00 AM","amount":70819},{"time":"1:00:11 AM","amount":8884},{"time":"1:00:49 AM","amount":82560},{"time":"1:01:45 AM","amount":25763},{"time":"1:01:44 AM","amount":72649},{"time":"1:01:34 AM","amount":20665},{"time":"1:01:29 AM","amount":56444},{"time":"1:01:25 AM","amount":18552},{"time":"1:01:43 AM","amount":2204},{"time":"1:02:20 AM","amount":123},{"time":"1:01:44 AM","amount":16841},{"time":"1:00:04 AM","amount":32512},{"time":"1:02:16 AM","amount":20914},{"time":"1:00:49 AM","amount":15102},{"time":"1:00:56 AM","amount":33675},{"time":"1:02:18 AM","amount":68956},{"time":"1:00:52 AM","amount":15624},{"time":"1:02:14 AM","amount":49980},{"time":"1:00:43 AM","amount":33624},{"time":"1:00:10 AM","amount":46793},{"time":"1:01:06 AM","amount":19363},{"time":"1:01:47 AM","amount":20730},{"time":"1:01:06 AM","amount":33869},{"time":"1:01:40 AM","amount":4714},{"time":"1:02:19 AM","amount":51080},{"time":"1:01:16 AM","amount":15749},{"time":"1:00:40 AM","amount":28751},{"time":"1:00:51 AM","amount":83942},{"time":"1:01:02 AM","amount":26882},{"time":"1:01:30 AM","amount":97810},{"time":"1:01:25 AM","amount":24817},{"time":"1:01:04 AM","amount":85803},{"time":"1:00:30 AM","amount":80927},{"time":"1:01:19 AM","amount":56855},{"time":"1:02:19 AM","amount":56500},{"time":"1:02:14 AM","amount":11151},{"time":"1:02:56 AM","amount":57369},{"time":"1:02:26 AM","amount":54951},{"time":"1:00:21 AM","amount":30974},{"time":"1:00:40 AM","amount":54577},{"time":"1:02:06 AM","amount":31702},{"time":"1:01:29 AM","amount":2434},{"time":"1:01:28 AM","amount":42207},{"time":"1:00:32 AM","amount":60912},{"time":"1:01:19 AM","amount":7226},{"time":"1:03:00 AM","amount":4948},{"time":"1:01:17 AM","amount":88504},{"time":"1:02:45 AM","amount":54921},{"time":"1:02:52 AM","amount":53482},{"time":"1:01:41 AM","amount":2418},{"time":"1:01:41 AM","amount":61272},{"time":"1:02:22 AM","amount":64192},{"time":"1:02:12 AM","amount":4977},{"time":"1:01:52 AM","amount":28916},{"time":"1:02:37 AM","amount":88314},{"time":"1:02:06 AM","amount":54288},{"time":"1:00:47 AM","amount":86279},{"time":"1:02:19 AM","amount":82397},{"time":"1:02:50 AM","amount":15602},{"time":"1:01:13 AM","amount":89445},{"time":"1:02:45 AM","amount":25255},{"time":"1:01:46 AM","amount":3690},{"time":"1:00:31 AM","amount":46757},{"time":"1:01:10 AM","amount":43745},{"time":"1:00:31 AM","amount":35205},{"time":"1:00:33 AM","amount":15366},{"time":"1:01:56 AM","amount":46793},{"time":"1:00:03 AM","amount":47733},{"time":"1:02:35 AM","amount":72464},{"time":"1:02:48 AM","amount":84807},{"time":"1:02:25 AM","amount":10290},{"time":"1:02:26 AM","amount":20773},{"time":"1:02:02 AM","amount":67250},{"time":"1:00:58 AM","amount":32200},{"time":"1:01:47 AM","amount":27105},{"time":"1:02:56 AM","amount":78328},{"time":"1:02:10 AM","amount":33390},{"time":"1:00:10 AM","amount":64131},{"time":"1:01:42 AM","amount":56913},{"time":"1:00:32 AM","amount":42532},{"time":"1:01:12 AM","amount":10811},{"time":"1:02:56 AM","amount":48497},{"time":"1:02:24 AM","amount":42936},{"time":"1:01:29 AM","amount":24613},{"time":"1:00:06 AM","amount":22983},{"time":"1:00:10 AM","amount":95778},{"time":"1:02:02 AM","amount":29097},{"time":"1:01:14 AM","amount":29353},{"time":"1:01:48 AM","amount":81927},{"time":"1:02:18 AM","amount":77983},{"time":"1:02:35 AM","amount":18081},{"time":"1:00:20 AM","amount":8944},{"time":"1:00:08 AM","amount":6645},{"time":"1:02:27 AM","amount":21594},{"time":"1:00:12 AM","amount":98194},{"time":"1:02:19 AM","amount":64595},{"time":"1:01:43 AM","amount":9878},{"time":"1:02:00 AM","amount":48986},{"time":"1:00:45 AM","amount":87894},{"time":"1:02:21 AM","amount":77400},{"time":"1:00:30 AM","amount":85238},{"time":"1:01:23 AM","amount":28521},{"time":"1:01:55 AM","amount":23366},{"time":"1:01:00 AM","amount":50111},{"time":"1:00:56 AM","amount":4240},{"time":"1:02:42 AM","amount":84628},{"time":"1:00:30 AM","amount":68250},{"time":"1:01:44 AM","amount":38256},{"time":"1:00:48 AM","amount":37079},{"time":"1:00:41 AM","amount":30238},{"time":"1:00:19 AM","amount":28206},{"time":"1:02:14 AM","amount":12610},{"time":"1:01:23 AM","amount":4398},{"time":"1:00:16 AM","amount":48130},{"time":"1:01:56 AM","amount":40278},{"time":"1:01:35 AM","amount":47109},{"time":"1:01:01 AM","amount":6043},{"time":"1:02:48 AM","amount":9640},{"time":"1:01:49 AM","amount":14228},{"time":"1:00:33 AM","amount":54370},{"time":"1:00:03 AM","amount":96440},{"time":"1:00:26 AM","amount":73222},{"time":"1:02:31 AM","amount":55127},{"time":"1:00:56 AM","amount":26630},{"time":"1:01:38 AM","amount":91989},{"time":"1:01:50 AM","amount":34605},{"time":"1:02:08 AM","amount":78617},{"time":"1:01:10 AM","amount":99838},{"time":"1:00:54 AM","amount":63287},{"time":"1:00:36 AM","amount":67065},{"time":"1:00:46 AM","amount":20027},{"time":"1:02:54 AM","amount":732},{"time":"1:02:38 AM","amount":3448},{"time":"1:00:31 AM","amount":17404},{"time":"1:00:23 AM","amount":48287},{"time":"1:01:12 AM","amount":50974},{"time":"1:01:05 AM","amount":46912},{"time":"1:01:48 AM","amount":53753},{"time":"1:01:55 AM","amount":30827},{"time":"1:02:54 AM","amount":91121},{"time":"1:01:56 AM","amount":13961},{"time":"1:01:35 AM","amount":25688},{"time":"1:00:00 AM","amount":33252},{"time":"1:01:39 AM","amount":72391},{"time":"1:02:49 AM","amount":53596},{"time":"1:02:50 AM","amount":14796},{"time":"1:01:44 AM","amount":90710},{"time":"1:01:09 AM","amount":33316},{"time":"1:02:51 AM","amount":38401},{"time":"1:01:04 AM","amount":89159},{"time":"1:00:59 AM","amount":9217},{"time":"1:01:57 AM","amount":98578},{"time":"1:01:37 AM","amount":92222},{"time":"1:00:26 AM","amount":6286},{"time":"1:01:49 AM","amount":18285},{"time":"1:02:35 AM","amount":48700},{"time":"1:01:23 AM","amount":21511},{"time":"1:01:06 AM","amount":52712},{"time":"1:01:45 AM","amount":62300},{"time":"1:01:23 AM","amount":31024},{"time":"1:00:30 AM","amount":12934},{"time":"1:02:10 AM","amount":31339},{"time":"1:02:42 AM","amount":79843},{"time":"1:01:58 AM","amount":46573},{"time":"1:00:12 AM","amount":44756},{"time":"1:00:39 AM","amount":64618},{"time":"1:00:05 AM","amount":72231},{"time":"1:01:37 AM","amount":481},{"time":"1:00:10 AM","amount":18275},{"time":"1:01:06 AM","amount":28113},{"time":"1:00:03 AM","amount":19058},{"time":"1:02:44 AM","amount":83729},{"time":"1:01:47 AM","amount":78312},{"time":"1:01:28 AM","amount":31418},{"time":"1:01:51 AM","amount":62109},{"time":"1:02:28 AM","amount":61573},{"time":"1:00:17 AM","amount":15919},{"time":"1:01:51 AM","amount":30219},{"time":"1:02:40 AM","amount":45772},{"time":"1:02:15 AM","amount":39510},{"time":"1:01:32 AM","amount":75776},{"time":"1:01:36 AM","amount":69163},{"time":"1:01:12 AM","amount":14160},{"time":"1:01:24 AM","amount":63375},{"time":"1:01:29 AM","amount":37772},{"time":"1:00:20 AM","amount":17619},{"time":"1:02:28 AM","amount":35111},{"time":"1:01:44 AM","amount":78892},{"time":"1:01:45 AM","amount":9945},{"time":"1:02:03 AM","amount":81239},{"time":"1:02:32 AM","amount":36727},{"time":"1:00:38 AM","amount":49336},{"time":"1:00:41 AM","amount":96583},{"time":"1:02:39 AM","amount":16747},{"time":"1:00:07 AM","amount":54256},{"time":"1:02:08 AM","amount":72598},{"time":"1:01:31 AM","amount":40989},{"time":"1:01:01 AM","amount":87239},{"time":"1:01:44 AM","amount":75073},{"time":"1:00:29 AM","amount":26913},{"time":"1:02:58 AM","amount":41206},{"time":"1:02:55 AM","amount":38487},{"time":"1:01:08 AM","amount":42279},{"time":"1:00:16 AM","amount":4773},{"time":"1:01:31 AM","amount":20787},{"time":"1:02:22 AM","amount":19221},{"time":"1:01:14 AM","amount":99636},{"time":"1:01:29 AM","amount":21300},{"time":"1:00:55 AM","amount":57716},{"time":"1:00:05 AM","amount":43694},{"time":"1:01:10 AM","amount":61971},{"time":"1:01:58 AM","amount":71796},{"time":"1:00:17 AM","amount":87734},{"time":"1:00:53 AM","amount":55265},{"time":"1:02:26 AM","amount":17022},{"time":"1:00:03 AM","amount":14865},{"time":"1:00:34 AM","amount":3400},{"time":"1:01:26 AM","amount":45453},{"time":"1:01:02 AM","amount":81752},{"time":"1:01:12 AM","amount":55428},{"time":"1:00:45 AM","amount":83389},{"time":"1:01:44 AM","amount":8334},{"time":"1:01:47 AM","amount":66616},{"time":"1:01:23 AM","amount":32149},{"time":"1:02:14 AM","amount":23425},{"time":"1:01:36 AM","amount":38303},{"time":"1:02:34 AM","amount":57017},{"time":"1:02:11 AM","amount":83108},{"time":"1:01:24 AM","amount":76805},{"time":"1:02:43 AM","amount":60506},{"time":"1:00:53 AM","amount":5103},{"time":"1:01:34 AM","amount":77246},{"time":"1:02:06 AM","amount":53806},{"time":"1:01:24 AM","amount":70646},{"time":"1:02:01 AM","amount":53740},{"time":"1:02:57 AM","amount":8786},{"time":"1:00:17 AM","amount":66643},{"time":"1:00:45 AM","amount":25100},{"time":"1:00:36 AM","amount":52634},{"time":"1:01:51 AM","amount":61444},{"time":"1:02:12 AM","amount":61897},{"time":"1:02:17 AM","amount":95567},{"time":"1:00:06 AM","amount":83655},{"time":"1:01:02 AM","amount":6476},{"time":"1:02:46 AM","amount":70847},{"time":"1:00:09 AM","amount":27696},{"time":"1:02:03 AM","amount":5693},{"time":"1:01:24 AM","amount":45145},{"time":"1:01:19 AM","amount":23068},{"time":"1:02:16 AM","amount":66331},{"time":"1:01:43 AM","amount":47580},{"time":"1:02:10 AM","amount":2561},{"time":"1:01:32 AM","amount":46207},{"time":"1:02:56 AM","amount":70425},{"time":"1:01:56 AM","amount":45894},{"time":"1:01:07 AM","amount":73614},{"time":"1:00:46 AM","amount":27589},{"time":"1:02:02 AM","amount":13826},{"time":"1:02:23 AM","amount":29527},{"time":"1:01:32 AM","amount":72119},{"time":"1:03:00 AM","amount":54533},{"time":"1:01:36 AM","amount":50367},{"time":"1:02:30 AM","amount":55679},{"time":"1:00:05 AM","amount":33263},{"time":"1:00:46 AM","amount":88560}];
          let total = 0;
          let i = 0;
          const length = 1000 / 50;

          window.setInterval( () => {
            // var plus = money_data.slice((50 *i) % length, (50 * (i + 1) % length)).map((a) => { return a.amount; }).reduce((a, b) => { return a + b; })
            // i++;
            total += Math.round(Math.random() * 1000);
            count.textContent = '  Safely transfered: ' + total;
          }, 300);
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
