;(function(undefined) {
  'use strict';

  /**
   * artoo initialization
   * =====================
   *
   * Launch artoo's init hooks.
   */

  // Script evaluation function
  function exec() {
    if (artoo.settings.eval) {
      artoo.log.verbose('evaluating and executing the script given to artoo.');
      eval(JSON.parse(artoo.settings.eval));
    }
    else if (artoo.settings.scriptUrl) {
      artoo.log.verbose('executing script at "' +
                        artoo.settings.scriptUrl + '"');
      artoo.injectScript(artoo.settings.scriptUrl);
    }
  }

  // Initialization function
  function main() {

    // Triggering countermeasures
    artoo.hooks.trigger('countermeasures');

    // Retrieving settings from script tag
    artoo.dom = document.getElementById('artoo_injected_script');

    if (artoo.dom) {
      var ns = JSON.parse(artoo.dom.getAttribute('settings')),
          s = artoo.settings,
          k;

      if (ns) {
        for (k in ns) {
          if (artoo.helpers.isPlainObject(ns[k]))
            s[k] = artoo.helpers.extend(ns[k], s[k]);
          else
            s[k] = ns[k];
        }
      }
    }

    // Welcoming user
    this.log.welcome();

    // Should we greet the user with a joyful beep?
    if (artoo.settings.log.beeping)
      artoo.beep();


    // Indicating we are injecting artoo from the chrome extension
    if (artoo.settings.chromeExtension)
      artoo.log.verbose('artoo has automatically been injected ' +
                        'by the chrome extension.');

    // Starting instructions recording
    if (artoo.settings.instructions.autoRecord)
      artoo.instructions.startRecording();

    // Injecting jQuery
    this.jquery.inject(function() {
      artoo.log.info('artoo is now good to go!');

      // Applying jQuery plugins
      artoo.jquery.plugins.map(function(p) {
        p(artoo.$);
      });

      // Triggering exec
      if (artoo.settings.autoExec)
        artoo.exec();

      // Triggering ready
      artoo.hooks.trigger('ready');
    });

    // Deleting artoo's dom element
    if (artoo.dom)
      artoo.dom.parentNode.removeChild(artoo.dom);

    // Updating artoo state
    this.loaded = true;
  }

  // Adding functions to hooks
  artoo.hooks.init.unshift(main);
  artoo.hooks.exec.unshift(exec);

  // artoo initialization
  artoo.init = function() {
    artoo.hooks.trigger('init');
  };

  // artoo exectution
  artoo.exec = function() {
    artoo.hooks.trigger('exec');
  };

  // Init?
  if (artoo.settings.autoInit)
    artoo.init();
}).call(this);
