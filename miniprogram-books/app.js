const { createChapterUnlock } = require('./utils/unlock');

App({
  globalData: {
    site: 'https://toolset.site',
    chapterUnlock: createChapterUnlock(),
  },
  onLaunch() {
    if (wx.cloud) {
      wx.cloud.init({
        env: 'cloud1-d7glmnr303314e696',
        traceUser: true,
      });
    }
  },
});
