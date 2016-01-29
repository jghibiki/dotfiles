// Generated by CoffeeScript 1.10.0
(function() {
  var BackgroundCompleter, Vomnibar, VomnibarUI, root,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Vomnibar = {
    vomnibarUI: null,
    getUI: function() {
      return this.vomnibarUI;
    },
    completers: {},
    getCompleter: function(name) {
      var base;
      return (base = this.completers)[name] != null ? base[name] : base[name] = new BackgroundCompleter(name);
    },
    activate: function(userOptions) {
      var completer, options;
      options = {
        completer: "omni",
        query: "",
        newTab: false,
        selectFirst: false,
        keyword: null
      };
      extend(options, userOptions);
      extend(options, {
        refreshInterval: options.completer === "omni" ? 150 : 0
      });
      completer = this.getCompleter(options.completer);
      if (this.vomnibarUI == null) {
        this.vomnibarUI = new VomnibarUI();
      }
      completer.refresh(this.vomnibarUI);
      this.vomnibarUI.setInitialSelectionValue(options.selectFirst ? 0 : -1);
      this.vomnibarUI.setCompleter(completer);
      this.vomnibarUI.setRefreshInterval(options.refreshInterval);
      this.vomnibarUI.setForceNewTab(options.newTab);
      this.vomnibarUI.setQuery(options.query);
      this.vomnibarUI.setKeyword(options.keyword);
      return this.vomnibarUI.update(true);
    },
    hide: function() {
      var ref;
      return (ref = this.vomnibarUI) != null ? ref.hide() : void 0;
    },
    onHidden: function() {
      var ref;
      return (ref = this.vomnibarUI) != null ? ref.onHidden() : void 0;
    }
  };

  VomnibarUI = (function() {
    function VomnibarUI() {
      this.update = bind(this.update, this);
      this.onInput = bind(this.onInput, this);
      this.onKeydown = bind(this.onKeydown, this);
      this.refreshInterval = 0;
      this.postHideCallback = null;
      this.initDom();
    }

    VomnibarUI.prototype.setQuery = function(query) {
      return this.input.value = query;
    };

    VomnibarUI.prototype.setKeyword = function(keyword) {
      return this.customSearchMode = keyword;
    };

    VomnibarUI.prototype.setInitialSelectionValue = function(initialSelectionValue) {
      this.initialSelectionValue = initialSelectionValue;
    };

    VomnibarUI.prototype.setRefreshInterval = function(refreshInterval) {
      this.refreshInterval = refreshInterval;
    };

    VomnibarUI.prototype.setForceNewTab = function(forceNewTab) {
      this.forceNewTab = forceNewTab;
    };

    VomnibarUI.prototype.setCompleter = function(completer1) {
      this.completer = completer1;
      return this.reset();
    };

    VomnibarUI.prototype.setKeywords = function(keywords) {
      this.keywords = keywords;
    };

    VomnibarUI.prototype.hide = function(postHideCallback) {
      var ref;
      this.postHideCallback = postHideCallback != null ? postHideCallback : null;
      UIComponentServer.postMessage("hide");
      this.reset();
      return (ref = this.completer) != null ? ref.reset() : void 0;
    };

    VomnibarUI.prototype.onHidden = function() {
      if (typeof this.postHideCallback === "function") {
        this.postHideCallback();
      }
      return this.postHideCallback = null;
    };

    VomnibarUI.prototype.reset = function() {
      this.clearUpdateTimer();
      this.completionList.style.display = "";
      this.input.value = "";
      this.completions = [];
      this.previousInputValue = null;
      this.customSearchMode = null;
      this.selection = this.initialSelectionValue;
      this.keywords = [];
      return this.seenTabToOpenCompletionList = false;
    };

    VomnibarUI.prototype.updateSelection = function() {
      var i, j, queryTerms, ref, results1;
      if (this.lastReponse.isCustomSearch && (this.customSearchMode == null)) {
        queryTerms = this.input.value.trim().split(/\s+/);
        this.customSearchMode = queryTerms[0];
        this.input.value = queryTerms.slice(1).join(" ");
      }
      if (0 <= this.selection && (this.completions[this.selection].insertText != null)) {
        if (this.previousInputValue == null) {
          this.previousInputValue = this.input.value;
        }
        this.input.value = this.completions[this.selection].insertText;
      } else if (this.previousInputValue != null) {
        this.input.value = this.previousInputValue;
        this.previousInputValue = null;
      }
      results1 = [];
      for (i = j = 0, ref = this.completionList.children.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        results1.push(this.completionList.children[i].className = (i === this.selection ? "vomnibarSelected" : ""));
      }
      return results1;
    };

    VomnibarUI.prototype.actionFromKeyEvent = function(event) {
      var key;
      key = KeyboardUtils.getKeyChar(event);
      if (KeyboardUtils.isEscape(event)) {
        return "dismiss";
      } else if (key === "up" || (event.shiftKey && event.keyCode === keyCodes.tab) || (event.ctrlKey && (key === "k" || key === "p"))) {
        return "up";
      } else if (event.keyCode === keyCodes.tab && !event.shiftKey) {
        return "tab";
      } else if (key === "down" || (event.ctrlKey && (key === "j" || key === "n"))) {
        return "down";
      } else if (event.keyCode === keyCodes.enter) {
        return "enter";
      } else if (event.keyCode === keyCodes.backspace || event.keyCode === keyCodes.deleteKey) {
        return "delete";
      }
      return null;
    };

    VomnibarUI.prototype.onKeydown = function(event) {
      var action, completion, isCustomSearchPrimarySuggestion, openInNewTab, query, ref, ref1;
      this.lastAction = action = this.actionFromKeyEvent(event);
      if (!action) {
        return true;
      }
      openInNewTab = this.forceNewTab || (event.shiftKey || event.ctrlKey || event.altKey || KeyboardUtils.isPrimaryModifierKey(event));
      if (action === "dismiss") {
        this.hide();
      } else if (action === "tab" || action === "down") {
        if (action === "tab" && this.completer.name === "omni" && !this.seenTabToOpenCompletionList && this.input.value.trim().length === 0) {
          this.seenTabToOpenCompletionList = true;
          this.update(true);
        } else {
          this.selection += 1;
          if (this.selection === this.completions.length) {
            this.selection = this.initialSelectionValue;
          }
          this.updateSelection();
        }
      } else if (action === "up") {
        this.selection -= 1;
        if (this.selection < this.initialSelectionValue) {
          this.selection = this.completions.length - 1;
        }
        this.updateSelection();
      } else if (action === "enter") {
        isCustomSearchPrimarySuggestion = ((ref = this.completions[this.selection]) != null ? ref.isPrimarySuggestion : void 0) && (((ref1 = this.lastReponse.engine) != null ? ref1.searchUrl : void 0) != null);
        if (this.selection === -1 || isCustomSearchPrimarySuggestion) {
          query = this.input.value.trim();
          if (!(0 < query.length)) {
            return;
          }
          if (isCustomSearchPrimarySuggestion) {
            query = Utils.createSearchUrl(query, this.lastReponse.engine.searchUrl);
          }
          this.hide(function() {
            return chrome.runtime.sendMessage({
              handler: openInNewTab ? "openUrlInNewTab" : "openUrlInCurrentTab",
              url: query
            });
          });
        } else {
          completion = this.completions[this.selection];
          this.hide(function() {
            return completion.performAction(openInNewTab);
          });
        }
      } else if (action === "delete") {
        if ((this.customSearchMode != null) && this.input.selectionEnd === 0) {
          this.input.value = this.customSearchMode + this.input.value.ltrim();
          this.input.selectionStart = this.input.selectionEnd = this.customSearchMode.length;
          this.customSearchMode = null;
          this.update(true);
        } else if (this.seenTabToOpenCompletionList && this.input.value.trim().length === 0) {
          this.seenTabToOpenCompletionList = false;
          this.update(true);
        } else {
          return true;
        }
      }
      event.stopImmediatePropagation();
      event.preventDefault();
      return true;
    };

    VomnibarUI.prototype.getInputValueAsQuery = function() {
      return (this.customSearchMode != null ? this.customSearchMode + " " : "") + this.input.value;
    };

    VomnibarUI.prototype.updateCompletions = function(callback) {
      if (callback == null) {
        callback = null;
      }
      return this.completer.filter({
        query: this.getInputValueAsQuery(),
        seenTabToOpenCompletionList: this.seenTabToOpenCompletionList,
        callback: (function(_this) {
          return function(lastReponse) {
            var ref, results;
            _this.lastReponse = lastReponse;
            results = _this.lastReponse.results;
            _this.completions = results;
            _this.selection = ((ref = _this.completions[0]) != null ? ref.autoSelect : void 0) ? 0 : _this.initialSelectionValue;
            _this.completionList.innerHTML = _this.completions.map(function(completion) {
              return "<li>" + completion.html + "</li>";
            }).join("");
            _this.completionList.style.display = _this.completions.length > 0 ? "block" : "";
            _this.selection = Math.min(_this.completions.length - 1, Math.max(_this.initialSelectionValue, _this.selection));
            _this.updateSelection();
            return typeof callback === "function" ? callback() : void 0;
          };
        })(this)
      });
    };

    VomnibarUI.prototype.onInput = function() {
      var updateSynchronously;
      this.seenTabToOpenCompletionList = false;
      this.completer.cancel();
      if (0 <= this.selection && this.completions[this.selection].customSearchMode && !this.customSearchMode) {
        this.customSearchMode = this.completions[this.selection].customSearchMode;
        updateSynchronously = true;
      }
      if (this.previousInputValue != null) {
        this.previousInputValue = null;
        this.selection = -1;
      }
      return this.update(updateSynchronously);
    };

    VomnibarUI.prototype.clearUpdateTimer = function() {
      if (this.updateTimer != null) {
        window.clearTimeout(this.updateTimer);
        return this.updateTimer = null;
      }
    };

    VomnibarUI.prototype.shouldActivateCustomSearchMode = function() {
      var queryTerms, ref;
      queryTerms = this.input.value.ltrim().split(/\s+/);
      return 1 < queryTerms.length && (ref = queryTerms[0], indexOf.call(this.keywords, ref) >= 0) && !this.customSearchMode;
    };

    VomnibarUI.prototype.update = function(updateSynchronously, callback) {
      if (updateSynchronously == null) {
        updateSynchronously = false;
      }
      if (callback == null) {
        callback = null;
      }
      updateSynchronously || (updateSynchronously = this.shouldActivateCustomSearchMode());
      if (updateSynchronously) {
        this.clearUpdateTimer();
        this.updateCompletions(callback);
      } else if (this.updateTimer == null) {
        this.updateTimer = Utils.setTimeout(this.refreshInterval, (function(_this) {
          return function() {
            _this.updateTimer = null;
            return _this.updateCompletions(callback);
          };
        })(this));
      }
      return this.input.focus();
    };

    VomnibarUI.prototype.initDom = function() {
      this.box = document.getElementById("vomnibar");
      this.input = this.box.querySelector("input");
      this.input.addEventListener("input", this.onInput);
      this.input.addEventListener("keydown", this.onKeydown);
      this.completionList = this.box.querySelector("ul");
      this.completionList.style.display = "";
      window.addEventListener("focus", (function(_this) {
        return function() {
          return _this.input.focus();
        };
      })(this));
      this.box.addEventListener("click", (function(_this) {
        return function(event) {
          _this.input.focus();
          return event.stopImmediatePropagation();
        };
      })(this));
      return document.body.addEventListener("click", (function(_this) {
        return function() {
          return _this.hide();
        };
      })(this));
    };

    return VomnibarUI;

  })();

  BackgroundCompleter = (function() {
    function BackgroundCompleter(name1) {
      this.name = name1;
      this.port = chrome.runtime.connect({
        name: "completions"
      });
      this.messageId = null;
      this.reset();
      this.port.onMessage.addListener((function(_this) {
        return function(msg) {
          var j, len, ref, result;
          switch (msg.handler) {
            case "keywords":
              _this.keywords = msg.keywords;
              return _this.lastUI.setKeywords(_this.keywords);
            case "completions":
              if (msg.id === _this.messageId) {
                ref = msg.results;
                for (j = 0, len = ref.length; j < len; j++) {
                  result = ref[j];
                  extend(result, {
                    performAction: result.type === "tab" ? _this.completionActions.switchToTab(result.tabId) : _this.completionActions.navigateToUrl(result.url)
                  });
                }
                return _this.mostRecentCallback(msg);
              }
          }
        };
      })(this));
    }

    BackgroundCompleter.prototype.filter = function(request) {
      var callback, query;
      query = request.query, callback = request.callback;
      this.mostRecentCallback = callback;
      return this.port.postMessage(extend(request, {
        handler: "filter",
        name: this.name,
        id: this.messageId = Utils.createUniqueId(),
        queryTerms: query.trim().split(/\s+/).filter(function(s) {
          return 0 < s.length;
        }),
        callback: null
      }));
    };

    BackgroundCompleter.prototype.reset = function() {
      return this.keywords = [];
    };

    BackgroundCompleter.prototype.refresh = function(lastUI) {
      this.lastUI = lastUI;
      this.reset();
      return this.port.postMessage({
        name: this.name,
        handler: "refresh"
      });
    };

    BackgroundCompleter.prototype.cancel = function() {
      return this.port.postMessage({
        name: this.name,
        handler: "cancel"
      });
    };

    BackgroundCompleter.prototype.completionActions = {
      navigateToUrl: function(url) {
        return function(openInNewTab) {
          openInNewTab && (openInNewTab = !Utils.hasJavascriptPrefix(url));
          return chrome.runtime.sendMessage({
            handler: openInNewTab ? "openUrlInNewTab" : "openUrlInCurrentTab",
            url: url,
            selected: openInNewTab
          });
        };
      },
      switchToTab: function(tabId) {
        return function() {
          return chrome.runtime.sendMessage({
            handler: "selectSpecificTab",
            id: tabId
          });
        };
      }
    };

    return BackgroundCompleter;

  })();

  UIComponentServer.registerHandler(function(event) {
    switch (event.data) {
      case "hide":
        return Vomnibar.hide();
      case "hidden":
        return Vomnibar.onHidden();
      default:
        return Vomnibar.activate(event.data);
    }
  });

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.Vomnibar = Vomnibar;

}).call(this);
