ajax-form-js
============

A jQuery plugin to help with common ajax submission and response handling actions. In short, you initialize the plugin on a form and specify a trigger element which on click will send all form elements to a specified url.

```html
<html>
<head><title></title></head>
  <body>
        <form id="my-form" href="javascript:;">
            First name: <input type="text" name="fname">
            Last name: <input type="text" name="lname">
            <button id="btnTrigger" type="button">Submit</button>
        </form>
  </body>
</html>

```
### Initialize
The form element needs to first be initialized with the jQuery plugin.
```javascript
$("#my-form").gs_ajax_form({
    trigger_el: '#btnTrigger',
    target_url: 'http://host/submit.php'
});
```

### additional_data
Additional data can be used to add data to the post request that might not have been present in the form as input data. It can be defined as a function if the execution needs to wait until the request is triggered to render otherwise an object can be directly set to it.
```javascript
$("#my-form").gs_ajax_form({
    trigger_el: '#btnTrigger',
    target_url: 'http://host/submit.php',
    additional_data: {another_key: 'another_value'}
});
```

### before_request_condition
A function can be executed  passed to control whether the ajax requests is allowed to proceed. This function should return true or false.
```javascript
$("#my-form").gs_ajax_form({
    trigger_el: '#btnTrigger',
    target_url: 'http://host/submit.php',
    before_request_condition: function() {
        return true;
        // note this can work great with message-handler-js plugin like so
        // return $('#message-handler').gs_message_handler('status') == null;
    },
});
```

### before_request
A function to be executed prior to sending the ajax request.
```javascript
$("#my-form").gs_ajax_form({
    trigger_el: '#btnTrigger',
    target_url: 'http://host/submit.php',
    before_request: function() {
        console.log('this is executed before the request');
        // note this can work great with message-handler-js plugin like so
        // $('#message-handler').gs_message_handler('set', {message: 'Processing...', type: 'warning'});
    },
});
```

### after_request_success
A function to be executed after an ajax request which was succesful.
```javascript
$("#my-form").gs_ajax_form({
    trigger_el: '#btnTrigger',
    target_url: 'http://host/submit.php',
    after_request_success: function(inData) {
        console.log('this is executed after a request which was successful');
        // note this can work great with message-handler-js plugin like so
        // $('#message-handler').gs_message_handler('set', {message: inData.message, type: inData.status});
    }
});
```

### after_request_error
A function to be executed after an ajax request which produced an error.
```javascript
$("#my-form").gs_ajax_form({
    trigger_el: '#btnTrigger',
    target_url: 'http://host/submit.php',
    after_request_error: function(inData) {
        console.log('this is executed after a request which produced an error');
        // note this can work great with message-handler-js plugin like so
        // $('#message-handler').gs_message_handler('set', {message: inData.statusText, type: 'error'});
    },
});
```

### redirect_url_on_success
Instruct to which url to auto redirect after an ajax request which was succesful.
```javascript
$("#my-form").gs_ajax_form({
    trigger_el: '#btnTrigger',
    target_url: 'http://host/submit.php',
    redirect_url_on_success: 'http://host/redirect'
});
```

### redirect_url_on_error
Instruct to which url to auto redirect on an ajax request which produced an error.
```javascript
$("#my-form").gs_ajax_form({
    trigger_el: '#btnTrigger',
    target_url: 'http://host/submit.php',
    redirect_url_on_error: 'http://host/redirect'
});
``