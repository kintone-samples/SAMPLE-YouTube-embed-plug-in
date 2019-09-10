/*
MIT License
Copyright (c) 2019 Cybozu
https://github.com/kintone/SAMPLE-YouTube-embed-plug-in/blob/master/LICENSE
*/
jQuery.noConflict();

(function($, PLUGIN_ID) {
  'use strict';

  // Get configuration settings
  var config = kintone.plugin.app.getConfig(PLUGIN_ID);
  var $link = $('#select_link_field'); // Drop-down with ID 'select_link_field'
  var $space = $('#select_space_field'); // Drop-down with ID 'select_space_field'
  var $width = $('#insert_width'); // Drop-down with ID 'select_link_field'
  var $height = $('#insert_height'); // Drop-down with ID 'select_link_field'
  var $ratio = $('#ratio_checkbox'); // Checkbox with ID 'ratio_checkbox'
  var appId = kintone.app.getId(); // Variable with the App ID
  var checkbox_boolean; // Last saved value of checkbox changed back from string to boolean
  var checkbox_value = 'true'; // Last saved value of the checkbox (string-version boolean)
  var newWidth; // Ratio-correct width when height is changed and aspect ratio lock enabled
  var newHeight; // Ratio-correct height when width is changed and aspect ratio lock enabled

  // Retrieve URL to App Settings page
  function getSettingsUrl() {
    return '/k/admin/app/flow?app=' + appId;
  }

  // Retrieve Link field information, then set drop-down
  function setLinkDropdown() {
    KintoneConfigHelper.getFields(['SINGLE_LINE_TEXT', 'LINK']).then(function(resp) {
      var $optionLink;

      resp.forEach(function(respField) {
        $optionLink = $('<option>');
        $optionLink.attr('value', respField.code);
        $optionLink.text(respField.label);
        $link.append($optionLink);
      });

      if (config.select_link_field) {
        $link.val(config.select_link_field);
      }
    }).catch(function(err) {
      // Error
      alert('There was an error retrieving the Link field information.');
    });
  }

  // Retrieve Blank Space field information, then set drop-down
  function setSpaceDropdown() {
    KintoneConfigHelper.getFields('SPACER').then(function(resp) {
      var $optionSpace;
      var spaceId;

      resp.forEach(function(respSpace) {
        spaceId = respSpace.elementId;
        $optionSpace = $('<option>');
        $optionSpace.attr('value', spaceId);
        $optionSpace.text(spaceId);
        $space.append($optionSpace);
      });

      if (config.select_space_field) {
        $space.val(config.select_space_field);
      }

    }).catch(function(err) {
      // Error
      alert('There was an error retrieving the Blank Space field information.');
    });
  }

  // Set saved width and height values
  if (config.insert_width) {
    $width.val(config.insert_width);
  }

  if (config.insert_height) {
    $height.val(config.insert_height);
  }

  // Set saved checkbox value
  if (config.checkbox_status === 'true') {
    checkbox_boolean = true;
  } else {
    checkbox_boolean = false;
  }

  $ratio.prop('checked', checkbox_boolean);

  // Auto-change width or height to match 16:9 ratio if aspect ratio check box is checked
  $width.change(function() {
    if ($ratio.prop('checked')) {
      newWidth = Number($width.val());
      newHeight = newWidth * (9 / 16);
      $height.val(Math.round(newHeight));
      checkbox_value = 'true';
    } else {
      checkbox_value = 'false';
    }
  });

  $height.change(function() {
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
  $('#reset_dimensions').click(function() {
    $width.val(560);
    $height.val(315);
  });

  // Run setting functions
  setLinkDropdown();
  setSpaceDropdown();

  // Go back a page when cancel button is clicked
  $('#settings-cancel').click(function() {
    history.back();
  });

  // Set input values when save button is clicked
  $('#settings-save').click(function(e) {
    var configSettings = {
      select_link_field: $link.val(),
      select_space_field: $space.val(),
      insert_width: $width.val(),
      insert_height: $height.val(),
      checkbox_status: checkbox_value
    };
    var widthNum = Number($width.val());
    var heightNum = Number($height.val());
    var maxDimension = 99999;
    e.preventDefault();

    if ($link.val() === 'not selected' || $space.val() === 'not selected') {
      // Check required fields are all filled
      alert('Please fill in all required fields.');
    } else if (!Number.isInteger(widthNum) || !Number.isInteger(heightNum) || widthNum > maxDimension || heightNum > maxDimension) {
      // Check that width and height are full numbers less than 5000
      alert('Please enter width and height as full numbers equal to or less than 99999px');
    } else {
      kintone.plugin.app.setConfig(configSettings, function() {
        // Redirect to App Settings
        alert('The plug-in settings have been saved. Please update the app!');
        window.location.href = getSettingsUrl();
      });
    }
  });
})(jQuery, kintone.$PLUGIN_ID);
