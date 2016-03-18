/*global MIXPANEL_TOKEN*/

import mixpanel from 'mixpanel-browser';

mixpanel.init(MIXPANEL_TOKEN); // Token is defined in webpack.config

export { mixpanel as default };
