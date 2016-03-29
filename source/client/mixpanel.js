/*global MIXPANEL_TOKEN*/
import mixpanel from 'mixpanel-browser';

let mix = mixpanel;

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN); // Token is defined in webpack.config
} else {
  let mixpanelStub = {};
  mixpanelStub.identify = function() {};
  mixpanelStub.track = function() {};

  mix = mixpanelStub;
}

export { mix as default };
