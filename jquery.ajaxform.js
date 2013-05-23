/**
 * jQuery Ajax Form
 * https://github.com/garagesocial/ajax-form-js
 *
 * Licensed under the MIT license.
 * Copyright 2013 Garagesocial, Inc.
 */

(function($) {
  if (!$.GS) {
    $.GS = {};
  }

  /**
    * @param {string}            options.trigger_el                       Required. The element that should trigger the ajax request
    * @param {string}            options.target_url                       Required. The url where to submit the request
    * @param {function}          options.before_request_condition()       Optional. A function that has to return true for the ajax to be submitted
    * @param {function}          options.before_request()                 Optional. Action to perform prior to performing request
    * @param {function}          options.after_request_success(inData)    Optional. Action to perform on request success, argument is the server response
    * @param {function}          options.after_request_error(inData)      Optional. Action to perform on request failure, argument is the server response
    * @param {function}          options.redirect_url_on_success(inData)  Optional. A url to redirect to if the request is a success
    * @param {function}          options.redirect_url_on_error(inData)    Optional. A url to redirect to if the request is a failure
    * @param {function|object}   options.additional_data(inData)          Optional. Object or function containing data to append
    */
  $.GS.ajax_form = function(el, options) {
    /* To avoid scope issues, use 'base' instead of 'this' */
    /* to reference this class from internal events and functions. */
    var base = this;

    /* Access to jQuery and DOM versions of element */
    base.$el = $(el);
    base.el = el;

    /* Add a reverse reference to the DOM object */
    base.$el.data('GS.ajax_form', base);

    base.init = function() {
      base.options = $.extend({}, $.GS.ajax_form.defaultOptions, options);

      /* Set the input parameters as keys to options */
      $.each(base.options, function(key, val) {
        base[key] = val;
      });

      /* Required options */
      var required_options = new Array('trigger_el', 'target_url');
      /* Check if they all have been defined */
      $.each(required_options, function(current_option) {
        if (typeof(base.options[required_options[current_option]]) === 'undefined' || base.options[required_options[current_option]] === null) {
          console.log("you have not defined option: " + required_options[current_option]);
          /* exit here if any of the required options are missing */
          return;
        }
      });

      /* from the trigger_element name get a handle on the element */
      base.trigger_el = $(base.trigger_el);
      base.trigger_el.on('click', function(e) {
        e.preventDefault();
        base.submitForm();
      });
    };

    /**
     * Submit form
     */
    base.submitForm = function() {
      var form_data, add_data, data;

      /* Run before_request_condition and continue only if true */
      if (base.before_request_condition && base.isFunction(base.before_request_condition)) {
        if (!base.before_request_condition()) {
          return;
        }
      }

      /* Run before_request before ajax request, if this one is set and is a function */
      if (base.isFunction(base.before_request)) {
        base.before_request();
      }
      /* Get data from form */
      form_data = base.getFormData(base.el);
      /* Get additional data */
      add_data = base.isFunction(base.additional_data) ? base.additional_data() : base.additional_data;
      /* Merge objects */
      data = $.extend(form_data, add_data);

      $.ajax({
        type: 'POST',
        url: base.target_url,
        data: data,
        dataType: 'json',
        success: function(data) {
          /* after_request_success */
          if (base.isFunction(base.after_request_success)) {
            base.after_request_success(data);
          }
          /* redirect */
          if (base.redirect_url_on_success) {
            var url = base.isFunction(base.redirect_url_on_success) ? base.redirect_url_on_success() : base.redirect_url_on_success;
            window.location.replace(url);
          } else if (data.redirect_url) {
            window.location.replace(data.redirect_url);
          }
        },
        error: function(data) {
          /* after_request_error */
          if (base.isFunction(base.after_request_error)) {
            base.after_request_error(data);
          }
          /* redirect */
          if (base.redirect_url_on_error) {
            var url = base.isFunction(base.redirect_url_on_error) ? base.redirect_url_on_error() : base.redirect_url_on_error;
            window.location.replace(url);
          } else if (data.redirect_url) {
            window.location.replace(data.redirect_url);
          }
        }
      });
    };

    /**
     * Retrieve all input fields inside form
     * @param  {string}   Form ID from which to look for form elements
     * @return {object}   Key/value pairs of input fields with their values
     */
    base.getFormData = function(inputElement) {
      var data = {};

      var serializedData = $(inputElement).serializeArray();
      $.each(serializedData, function(i, val) {
        data[val.name] = val.value;
      });

      return data;
    };

    /**
     * Check whether object is a function
     * @param  {object}   Variable to check if content is a function
     * @return {boolean}  True or False whether the content is a function
     */
    base.isFunction = function(functionToCheck) {
      var getType = {};
      return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    };

    /* Set options after initialization */
    base.option = function(key, value) {
      if ($.isPlainObject(key)) {
        this.options = $.extend(true, this.options, key);
      }
    };

    // Run initializer
    base.init();
  };

  /**
   * Default Options
   */
  $.GS.ajax_form.defaultOptions = {
    /* Function that must return true for ajax request to be submitted */
    before_request_condition: null,
    /* Function to run prior to ajax request */
    before_request: null,
    /* Function to run on ajax success */
    after_request_success: null,
    /* Function to run on ajax failure */
    after_request_error: null,
    /* A url to redirect to if the request is a success */
    redirect_url_on_success: null,
    /* A url to redirect to if the request is a failure */
    redirect_url_on_error: null,
    /* Object or function containing data to append */
    additional_data: null
  };

  /**
   * Constructor
   */
  $.fn.gs_ajax_form = function(options) {
    return this.each(function() {
      (new $.GS.ajax_form(this, options));
    });
  };

  /* This function breaks the chain, but returns */
  /* the GS.ajax_form if it has been attached to the object. */
  $.fn.getGS_ajax_form = function() {
    this.data('GS.ajax_form');
  };

})(jQuery);