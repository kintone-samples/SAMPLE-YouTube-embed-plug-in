/*
MIT License
Copyright (c) 2019 Cybozu
https://github.com/kintone/SAMPLE-YouTube-embed-plug-in/blob/master/LICENSE
*/
(function(PLUGIN_ID) {
  'use strict';
  // Record details event
  kintone.events.on('app.record.detail.show', function(event) {
    var CONFIG = kintone.plugin.app.getConfig(PLUGIN_ID); // Get plug-in setting configuration
    var VIDEO_LINK, VIDEO_WIDTH, VIDEO_HEIGHT, VIDEO_BLANK_SPACE;
    var videoId = '';
    var fullUrl;
    var ytiframe = document.createElement('iframe');
    var urlExampleFull = 'https://www.youtube.com/watch?v=OOOOOOOOOOO';
    var urlExampleShort = 'https://youtu.be/OOOOOOOOOOO';
    var noVideoErrorFirstHalf = 'The Youtube URL could not be read.<br>Insert the URL either as <b>';
    var noVideoErrorSecondHalf = '</b>. If the format is correct, check that the correct URL field has been selected in the settings.';
    var createYTiframe = function() {
      // Create iFrame HTML element
      ytiframe.setAttribute('width', VIDEO_WIDTH);
      ytiframe.setAttribute('height', VIDEO_HEIGHT);
      ytiframe.setAttribute('src', 'https://www.youtube.com/embed/' + videoId);
      ytiframe.setAttribute('frameborder', '0');
      ytiframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
      ytiframe.setAttribute('allowfullscreen', 'allowfullscreen');
      kintone.app.record.getSpaceElement(VIDEO_BLANK_SPACE).appendChild(ytiframe);
    };
    var createNoVideoError = function() {
      // Create no video error message
      var noVideoError = document.createElement('div');
      noVideoError.innerHTML = noVideoErrorFirstHalf + urlExampleFull + '</b><br>or <b>' + urlExampleShort + noVideoErrorSecondHalf;
      kintone.app.record.getSpaceElement(VIDEO_BLANK_SPACE).appendChild(noVideoError);
    };

    if (!CONFIG) {
      return false;
    }

    VIDEO_LINK = CONFIG.link;
    VIDEO_WIDTH = CONFIG.width;
    VIDEO_HEIGHT = CONFIG.height;
    VIDEO_BLANK_SPACE = CONFIG.space;
    fullUrl = event.record[VIDEO_LINK].value;

    if (fullUrl.slice(0, 32) === 'https://www.youtube.com/watch?v=') {
      videoId = fullUrl.slice(32);
      createYTiframe();
    } else if (fullUrl.slice(0, 17) === 'https://youtu.be/') {
      videoId = fullUrl.slice(17);
      createYTiframe();
    } else {
      createNoVideoError();
    }
  });
})(kintone.$PLUGIN_ID);
