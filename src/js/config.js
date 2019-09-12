/*
MIT License
Copyright (c) 2019 Cybozu
https://github.com/kintone/SAMPLE-YouTube-embed-plug-in/blob/master/LICENSE
*/
jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  // Get configuration settings
  var CONF = kintone.plugin.app.getConfig(PLUGIN_ID);
  var $form = $('.js-submit-settings');
  var $cancelButton = $('.js-cancel-button');
  var $link = $('select[name="js-select-link-field"]');
  var $space = $('select[name="js-select-space-field"]');
  var $width = $('input[name="js-insert-width"]');
  var $height = $('input[name="js-insert-height"]');
  var $ratio = $('input[name="js-ratio-enabled"]'); // Checkbox with ID 'ratio_checkbox'
  var $reset = $('#js-reset-dimensions'); // Button to reset default ratios
  var checkbox_boolean; // Last saved value of checkbox changed back from string to boolean
  var checkbox_value = 'true'; // Last saved value of the checkbox (string-version boolean)
  var newWidth; // Ratio-correct width when height is changed and aspect ratio lock enabled
  var newHeight; // Ratio-correct height when width is changed and aspect ratio lock enabled

  // Retrieve Link field information, then set drop-down
  function setDropDown() {
    KintoneConfigHelper.getFields(['SINGLE_LINE_TEXT', 'LINK', 'SPACER']).then(function(resp) {
      var $linkDropDown = $link;
      var $spaceDropDown = $space;

      resp.forEach(function(respField) {
        var $option = $('<option></option>');
        switch (respField.type) {
          case 'SINGLE_LINE_TEXT':
          case 'LINK':
            $option.attr('value', respField.code);
            $option.text(respField.label);
            $linkDropDown.append($option.clone());
            break;
          case 'SPACER':
            if (!respField.elementId) {
              break;
            }
            $option.attr('value', respField.elementId);
            $option.text(respField.elementId);
            $spaceDropDown.append($option.clone());
            break;
          default:
            break;
        }
      });

      // Set default values
      if (CONF.link) {
        $linkDropDown.val(CONF.link);
      }
      if (CONF.space) {
        $spaceDropDown.val(CONF.space);
      }
    }, function() {
      // Error
      return alert('There was an error retrieving the Link field information.');
    });
  }

  $(document).ready(function() {

    // Set saved width and height values
    if (CONF.width) {
      $width.val(CONF.width);
    }

    if (CONF.height) {
      $height.val(CONF.height);
    }

    // Set saved checkbox value
    if (CONF.checkbox === 'true') {
      checkbox_boolean = true;
    } else {
      checkbox_boolean = false;
    }

    $ratio.prop('checked', checkbox_boolean);

    // Auto-change width or height to match 16:9 ratio if aspect ratio check box is checked
    $width.on('change', function() {
      if ($ratio.prop('checked')) {
        newWidth = Number($width.val());
        newHeight = newWidth * (9 / 16);
        $height.val(Math.round(newHeight));
        checkbox_value = 'true';
      } else {
        checkbox_value = 'false';
      }
    });

    $height.on('change', function() {
      if ($ratio.prop('checked')) {
        newHeight = Number($height.val());
        newWidth = newHeight * (16 / 9);
        $width.val(Math.round(newWidth));
        checkbox_value = 'true';
      } else {
        checkbox_value = 'false';
      }
    });

    // Reset default dimensions when reset button is clicked
    $reset.on('click', function() {
      $width.val(560);
      $height.val(315);
    });

    // Run setting functions
    setDropDown();

    // Set input values when save button is clicked
    $form.on('submit', function(e) {
      var widthNum = Number($width.val());
      var heightNum = Number($height.val());
      var maxDimension = 99999;
      var config = [];

      config.link = $link.val();
      config.space = $space.val();
      config.width = $width.val();
      config.height = $height.val();
      config.checkbox = checkbox_value;

      e.preventDefault();

      if (!Number.isInteger(widthNum) || !Number.isInteger(heightNum) || widthNum > maxDimension || heightNum > maxDimension) {
        // Check that width and height are full numbers less than 5000
        alert('Please enter width and height as full numbers equal to or less than 99999px');
      } else {
        kintone.plugin.app.setConfig(config, function() {
          // Redirect to App Settings
          alert('The plug-in settings have been saved. Please update the app!');
          window.location.href = '/k/admin/app/flow?app=' + kintone.app.getId();
        });
      }
      // Go back a page when cancel button is clicked
      $cancelButton.on('click', function() {
        window.location.href = '/k/admin/app/' + kintone.app.getId() + '/plugin/';
      });
    });
  });
})(jQuery, kintone.$PLUGIN_ID);
