// Generated by CoffeeScript 1.10.0
(function() {
  var AlphabetHints, COPY_LINK_URL, DOWNLOAD_LINK_URL, FilterHints, LinkHints, LinkHintsMode, OPEN_INCOGNITO, OPEN_IN_CURRENT_TAB, OPEN_IN_NEW_BG_TAB, OPEN_IN_NEW_FG_TAB, OPEN_WITH_QUEUE, numberToHintString, root, spanWrap,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  OPEN_IN_CURRENT_TAB = {
    name: "curr-tab"
  };

  OPEN_IN_NEW_BG_TAB = {
    name: "bg-tab"
  };

  OPEN_IN_NEW_FG_TAB = {
    name: "fg-tab"
  };

  OPEN_WITH_QUEUE = {
    name: "queue"
  };

  COPY_LINK_URL = {
    name: "link"
  };

  OPEN_INCOGNITO = {
    name: "incognito"
  };

  DOWNLOAD_LINK_URL = {
    name: "download"
  };

  LinkHints = {
    activateMode: function(mode) {
      if (mode == null) {
        mode = OPEN_IN_CURRENT_TAB;
      }
      return new LinkHintsMode(mode);
    },
    activateModeToOpenInNewTab: function() {
      return this.activateMode(OPEN_IN_NEW_BG_TAB);
    },
    activateModeToOpenInNewForegroundTab: function() {
      return this.activateMode(OPEN_IN_NEW_FG_TAB);
    },
    activateModeToCopyLinkUrl: function() {
      return this.activateMode(COPY_LINK_URL);
    },
    activateModeWithQueue: function() {
      return this.activateMode(OPEN_WITH_QUEUE);
    },
    activateModeToOpenIncognito: function() {
      return this.activateMode(OPEN_INCOGNITO);
    },
    activateModeToDownloadLink: function() {
      return this.activateMode(DOWNLOAD_LINK_URL);
    }
  };

  LinkHintsMode = (function() {
    LinkHintsMode.prototype.hintMarkerContainingDiv = null;

    LinkHintsMode.prototype.mode = void 0;

    LinkHintsMode.prototype.linkActivator = void 0;

    LinkHintsMode.prototype.delayMode = false;

    LinkHintsMode.prototype.isActive = false;

    LinkHintsMode.prototype.hintMode = null;

    LinkHintsMode.prototype.onExit = null;

    LinkHintsMode.prototype.tabCount = 0;

    function LinkHintsMode(mode) {
      var el, elements, hintMarkers, length;
      if (mode == null) {
        mode = OPEN_IN_CURRENT_TAB;
      }
      if (!document.documentElement) {
        return;
      }
      this.isActive = true;
      elements = this.getVisibleClickableElements();
      if (mode === COPY_LINK_URL || mode === OPEN_INCOGNITO) {
        elements = (function() {
          var k, len, results;
          results = [];
          for (k = 0, len = elements.length; k < len; k++) {
            el = elements[k];
            if (el.element.href != null) {
              results.push(el);
            }
          }
          return results;
        })();
      }
      if (Settings.get("filterLinkHints")) {
        length = function(el) {
          var ref, ref1;
          return (ref = (ref1 = el.element.innerHTML) != null ? ref1.length : void 0) != null ? ref : 0;
        };
        elements.sort(function(a, b) {
          return length(a) - length(b);
        });
      }
      hintMarkers = (function() {
        var k, len, results;
        results = [];
        for (k = 0, len = elements.length; k < len; k++) {
          el = elements[k];
          results.push(this.createMarkerFor(el));
        }
        return results;
      }).call(this);
      this.markerMatcher = new (Settings.get("filterLinkHints") ? FilterHints : AlphabetHints);
      this.markerMatcher.fillInMarkers(hintMarkers);
      this.hintMode = new Mode({
        name: "hint/" + mode.name,
        indicator: false,
        passInitialKeyupEvents: true,
        suppressAllKeyboardEvents: true,
        exitOnEscape: true,
        exitOnClick: true,
        exitOnScroll: true,
        keydown: this.onKeyDownInMode.bind(this, hintMarkers),
        keypress: this.onKeyPressInMode.bind(this, hintMarkers)
      });
      this.hintMode.onExit((function(_this) {
        return function() {
          if (_this.isActive) {
            return _this.deactivateMode();
          }
        };
      })(this));
      this.setOpenLinkMode(mode);
      this.hintMarkerContainingDiv = DomUtils.addElementList(hintMarkers, {
        id: "vimiumHintMarkerContainer",
        className: "vimiumReset"
      });
    }

    LinkHintsMode.prototype.setOpenLinkMode = function(mode1) {
      this.mode = mode1;
      if (this.mode === OPEN_IN_NEW_BG_TAB || this.mode === OPEN_IN_NEW_FG_TAB || this.mode === OPEN_WITH_QUEUE) {
        if (this.mode === OPEN_IN_NEW_BG_TAB) {
          this.hintMode.setIndicator("Open link in new tab.");
        } else if (this.mode === OPEN_IN_NEW_FG_TAB) {
          this.hintMode.setIndicator("Open link in new tab and switch to it.");
        } else {
          this.hintMode.setIndicator("Open multiple links in new tabs.");
        }
        return this.linkActivator = function(link) {
          return DomUtils.simulateClick(link, {
            shiftKey: this.mode === OPEN_IN_NEW_FG_TAB,
            metaKey: KeyboardUtils.platform === "Mac",
            ctrlKey: KeyboardUtils.platform !== "Mac",
            altKey: false
          });
        };
      } else if (this.mode === COPY_LINK_URL) {
        this.hintMode.setIndicator("Copy link URL to Clipboard.");
        return this.linkActivator = (function(_this) {
          return function(link) {
            var url;
            if (link.href != null) {
              chrome.runtime.sendMessage({
                handler: "copyToClipboard",
                data: link.href
              });
              url = link.href;
              if (28 < url.length) {
                url = url.slice(0, 26) + "....";
              }
              return _this.onExit = function() {
                return HUD.showForDuration("Yanked " + url, 2000);
              };
            } else {
              return _this.onExit = function() {
                return HUD.showForDuration("No link to yank.", 2000);
              };
            }
          };
        })(this);
      } else if (this.mode === OPEN_INCOGNITO) {
        this.hintMode.setIndicator("Open link in incognito window.");
        return this.linkActivator = function(link) {
          return chrome.runtime.sendMessage({
            handler: 'openUrlInIncognito',
            url: link.href
          });
        };
      } else if (this.mode === DOWNLOAD_LINK_URL) {
        this.hintMode.setIndicator("Download link URL.");
        return this.linkActivator = function(link) {
          return DomUtils.simulateClick(link, {
            altKey: true,
            ctrlKey: false,
            metaKey: false
          });
        };
      } else {
        this.hintMode.setIndicator("Open link in current tab.");
        return this.linkActivator = function(link) {
          return DomUtils.simulateClick.bind(DomUtils, link)();
        };
      }
    };

    LinkHintsMode.prototype.createMarkerFor = (function() {
      var stableSortCount;
      stableSortCount = 0;
      return function(link) {
        var clientRect, marker;
        marker = DomUtils.createElement("div");
        marker.className = "vimiumReset internalVimiumHintMarker vimiumHintMarker";
        marker.clickableItem = link.element;
        marker.stableSortCount = ++stableSortCount;
        clientRect = link.rect;
        marker.style.left = clientRect.left + window.scrollX + "px";
        marker.style.top = clientRect.top + window.scrollY + "px";
        marker.rect = link.rect;
        return marker;
      };
    })();

    LinkHintsMode.prototype.getVisibleClickable = function(element) {
      var areas, areasAndRects, clientRect, imgClientRects, isClickable, jsactionRule, jsactionRules, k, len, map, mapName, onlyHasTabIndex, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, ruleSplit, tabIndex, tabIndexValue, tagName, visibleElements;
      tagName = element.tagName.toLowerCase();
      isClickable = false;
      onlyHasTabIndex = false;
      visibleElements = [];
      if (tagName === "img") {
        mapName = element.getAttribute("usemap");
        if (mapName) {
          imgClientRects = element.getClientRects();
          mapName = mapName.replace(/^#/, "").replace("\"", "\\\"");
          map = document.querySelector("map[name=\"" + mapName + "\"]");
          if (map && imgClientRects.length > 0) {
            areas = map.getElementsByTagName("area");
            areasAndRects = DomUtils.getClientRectsForAreas(imgClientRects[0], areas);
            visibleElements.push.apply(visibleElements, areasAndRects);
          }
        }
      }
      if (((ref = (ref1 = element.getAttribute("aria-hidden")) != null ? ref1.toLowerCase() : void 0) === "" || ref === "true") || ((ref2 = (ref3 = element.getAttribute("aria-disabled")) != null ? ref3.toLowerCase() : void 0) === "" || ref2 === "true")) {
        return [];
      }
      if (this.checkForAngularJs == null) {
        this.checkForAngularJs = (function() {
          var angularElements, k, l, len, len1, ngAttributes, prefix, ref4, ref5, separator;
          angularElements = document.getElementsByClassName("ng-scope");
          if (angularElements.length === 0) {
            return function() {
              return false;
            };
          } else {
            ngAttributes = [];
            ref4 = ['', 'data-', 'x-'];
            for (k = 0, len = ref4.length; k < len; k++) {
              prefix = ref4[k];
              ref5 = ['-', ':', '_'];
              for (l = 0, len1 = ref5.length; l < len1; l++) {
                separator = ref5[l];
                ngAttributes.push(prefix + "ng" + separator + "click");
              }
            }
            return function(element) {
              var attribute, len2, m;
              for (m = 0, len2 = ngAttributes.length; m < len2; m++) {
                attribute = ngAttributes[m];
                if (element.hasAttribute(attribute)) {
                  return true;
                }
              }
              return false;
            };
          }
        })();
      }
      isClickable || (isClickable = this.checkForAngularJs(element));
      if (element.hasAttribute("onclick") || ((ref4 = (ref5 = element.getAttribute("role")) != null ? ref5.toLowerCase() : void 0) === "button" || ref4 === "link") || ((ref6 = element.getAttribute("class")) != null ? ref6.toLowerCase().indexOf("button") : void 0) >= 0 || ((ref7 = (ref8 = element.getAttribute("contentEditable")) != null ? ref8.toLowerCase() : void 0) === "" || ref7 === "contentEditable" || ref7 === "true")) {
        isClickable = true;
      }
      if (element.hasAttribute("jsaction")) {
        jsactionRules = element.getAttribute("jsaction").split(";");
        for (k = 0, len = jsactionRules.length; k < len; k++) {
          jsactionRule = jsactionRules[k];
          ruleSplit = jsactionRule.split(":");
          isClickable || (isClickable = ruleSplit[0] === "click" || (ruleSplit.length === 1 && ruleSplit[0] !== "none"));
        }
      }
      switch (tagName) {
        case "a":
          isClickable = true;
          break;
        case "textarea":
          isClickable || (isClickable = !element.disabled && !element.readOnly);
          break;
        case "input":
          isClickable || (isClickable = !(((ref9 = element.getAttribute("type")) != null ? ref9.toLowerCase() : void 0) === "hidden" || element.disabled || (element.readOnly && DomUtils.isSelectable(element))));
          break;
        case "button":
        case "select":
          isClickable || (isClickable = !element.disabled);
          break;
        case "label":
          isClickable || (isClickable = (element.control != null) && (this.getVisibleClickable(element.control)).length === 0);
      }
      tabIndexValue = element.getAttribute("tabindex");
      tabIndex = tabIndexValue === "" ? 0 : parseInt(tabIndexValue);
      if (!(isClickable || isNaN(tabIndex) || tabIndex < 0)) {
        isClickable = onlyHasTabIndex = true;
      }
      if (isClickable) {
        clientRect = DomUtils.getVisibleClientRect(element, true);
        if (clientRect !== null) {
          visibleElements.push({
            element: element,
            rect: clientRect,
            secondClassCitizen: onlyHasTabIndex
          });
        }
      }
      return visibleElements;
    };

    LinkHintsMode.prototype.getVisibleClickableElements = function() {
      var element, elements, k, l, len, len1, negativeRect, nonOverlappingElements, rects, ref, visibleElement, visibleElements;
      elements = document.documentElement.getElementsByTagName("*");
      visibleElements = [];
      for (k = 0, len = elements.length; k < len; k++) {
        element = elements[k];
        visibleElement = this.getVisibleClickable(element);
        visibleElements.push.apply(visibleElements, visibleElement);
      }
      nonOverlappingElements = [];
      visibleElements = visibleElements.reverse();
      while (visibleElement = visibleElements.pop()) {
        rects = [visibleElement.rect];
        for (l = 0, len1 = visibleElements.length; l < len1; l++) {
          negativeRect = visibleElements[l].rect;
          rects = (ref = []).concat.apply(ref, rects.map(function(rect) {
            return Rect.subtract(rect, negativeRect);
          }));
        }
        if (rects.length > 0) {
          nonOverlappingElements.push({
            element: visibleElement.element,
            rect: rects[0]
          });
        } else {
          if (!visibleElement.secondClassCitizen) {
            nonOverlappingElements.push(visibleElement);
          }
        }
      }
      return nonOverlappingElements;
    };

    LinkHintsMode.prototype.onKeyDownInMode = function(hintMarkers, event) {
      var keyCode, previousMode, previousTabCount, ref, ref1, ref2;
      if (this.delayMode || event.repeat) {
        return;
      }
      this.keydownKeyChar = KeyboardUtils.getKeyChar(event).toLowerCase();
      previousTabCount = this.tabCount;
      this.tabCount = 0;
      if (((ref = event.keyCode) === keyCodes.shiftKey || ref === keyCodes.ctrlKey) && ((ref1 = this.mode) === OPEN_IN_CURRENT_TAB || ref1 === OPEN_WITH_QUEUE || ref1 === OPEN_IN_NEW_BG_TAB || ref1 === OPEN_IN_NEW_FG_TAB)) {
        this.tabCount = previousTabCount;
        previousMode = this.mode;
        keyCode = event.keyCode;
        switch (keyCode) {
          case keyCodes.shiftKey:
            this.setOpenLinkMode(this.mode === OPEN_IN_CURRENT_TAB ? OPEN_IN_NEW_BG_TAB : OPEN_IN_CURRENT_TAB);
            break;
          case keyCodes.ctrlKey:
            this.setOpenLinkMode(this.mode === OPEN_IN_NEW_FG_TAB ? OPEN_IN_NEW_BG_TAB : OPEN_IN_NEW_FG_TAB);
        }
        handlerStack.push({
          keyup: (function(_this) {
            return function(event) {
              if (event.keyCode === keyCode) {
                handlerStack.remove();
                if (_this.isActive) {
                  return _this.setOpenLinkMode(previousMode);
                }
              }
            };
          })(this)
        });
      } else if ((ref2 = event.keyCode) === keyCodes.backspace || ref2 === keyCodes.deleteKey) {
        if (this.markerMatcher.popKeyChar()) {
          this.updateVisibleMarkers(hintMarkers);
        } else {
          this.deactivateMode();
        }
      } else if (event.keyCode === keyCodes.enter) {
        if (this.markerMatcher.activeHintMarker) {
          this.activateLink(this.markerMatcher.activeHintMarker);
        }
      } else if (event.keyCode === keyCodes.tab) {
        this.tabCount = previousTabCount + (event.shiftKey ? -1 : 1);
        this.updateVisibleMarkers(hintMarkers, this.tabCount);
      } else {
        return;
      }
      return DomUtils.suppressEvent(event);
    };

    LinkHintsMode.prototype.onKeyPressInMode = function(hintMarkers, event) {
      var keyChar;
      if (this.delayMode || event.repeat) {
        return;
      }
      keyChar = String.fromCharCode(event.charCode).toLowerCase();
      if (keyChar) {
        this.markerMatcher.pushKeyChar(keyChar, this.keydownKeyChar);
        this.updateVisibleMarkers(hintMarkers);
      }
      return DomUtils.suppressEvent(event);
    };

    LinkHintsMode.prototype.updateVisibleMarkers = function(hintMarkers, tabCount) {
      var k, keyResult, l, len, len1, linksMatched, marker, matched, ref, results;
      if (tabCount == null) {
        tabCount = 0;
      }
      keyResult = this.markerMatcher.getMatchingHints(hintMarkers, tabCount);
      linksMatched = keyResult.linksMatched;
      if (linksMatched.length === 0) {
        return this.deactivateMode();
      } else if (linksMatched.length === 1) {
        return this.activateLink(linksMatched[0], (ref = keyResult.delay) != null ? ref : 0);
      } else {
        for (k = 0, len = hintMarkers.length; k < len; k++) {
          marker = hintMarkers[k];
          this.hideMarker(marker);
        }
        results = [];
        for (l = 0, len1 = linksMatched.length; l < len1; l++) {
          matched = linksMatched[l];
          results.push(this.showMarker(matched, this.markerMatcher.hintKeystrokeQueue.length));
        }
        return results;
      }
    };

    LinkHintsMode.prototype.activateLink = function(matchedLink, delay) {
      var clickEl, ref;
      if (delay == null) {
        delay = 0;
      }
      this.delayMode = true;
      clickEl = matchedLink.clickableItem;
      if (DomUtils.isSelectable(clickEl)) {
        DomUtils.simulateSelect(clickEl);
        return this.deactivateMode(delay);
      } else {
        if (clickEl.nodeName.toLowerCase() === "input" && ((ref = clickEl.type) !== "button" && ref !== "submit")) {
          clickEl.focus();
        }
        DomUtils.flashRect(matchedLink.rect);
        this.linkActivator(clickEl);
        if (this.mode === OPEN_WITH_QUEUE) {
          return this.deactivateMode(delay, function() {
            return LinkHints.activateModeWithQueue();
          });
        } else {
          return this.deactivateMode(delay);
        }
      }
    };

    LinkHintsMode.prototype.showMarker = function(linkMarker, matchingCharCount) {
      var j, k, ref, results;
      linkMarker.style.display = "";
      results = [];
      for (j = k = 0, ref = linkMarker.childNodes.length; 0 <= ref ? k < ref : k > ref; j = 0 <= ref ? ++k : --k) {
        if (j < matchingCharCount) {
          results.push(linkMarker.childNodes[j].classList.add("matchingCharacter"));
        } else {
          results.push(linkMarker.childNodes[j].classList.remove("matchingCharacter"));
        }
      }
      return results;
    };

    LinkHintsMode.prototype.hideMarker = function(linkMarker) {
      return linkMarker.style.display = "none";
    };

    LinkHintsMode.prototype.deactivateMode = function(delay, callback) {
      var deactivate;
      if (delay == null) {
        delay = 0;
      }
      if (callback == null) {
        callback = null;
      }
      deactivate = (function(_this) {
        return function() {
          var ref;
          if (_this.hintMarkerContainingDiv) {
            DomUtils.removeElement(_this.hintMarkerContainingDiv);
          }
          _this.hintMarkerContainingDiv = null;
          _this.markerMatcher = null;
          _this.isActive = false;
          if ((ref = _this.hintMode) != null) {
            ref.exit();
          }
          _this.hintMode = null;
          if (typeof _this.onExit === "function") {
            _this.onExit();
          }
          _this.onExit = null;
          return _this.tabCount = 0;
        };
      })(this);
      if (delay) {
        return Utils.setTimeout(delay, function() {
          deactivate();
          return typeof callback === "function" ? callback() : void 0;
        });
      } else {
        deactivate();
        return typeof callback === "function" ? callback() : void 0;
      }
    };

    return LinkHintsMode;

  })();

  AlphabetHints = (function() {
    AlphabetHints.prototype.logXOfBase = function(x, base) {
      return Math.log(x) / Math.log(base);
    };

    function AlphabetHints() {
      this.linkHintCharacters = Settings.get("linkHintCharacters");
      this.useKeydown = /^[a-z0-9]*$/.test(this.linkHintCharacters);
      this.hintKeystrokeQueue = [];
    }

    AlphabetHints.prototype.fillInMarkers = function(hintMarkers) {
      var hintStrings, idx, k, len, marker;
      hintStrings = this.hintStrings(hintMarkers.length);
      for (idx = k = 0, len = hintMarkers.length; k < len; idx = ++k) {
        marker = hintMarkers[idx];
        marker.hintString = hintStrings[idx];
        marker.innerHTML = spanWrap(marker.hintString.toUpperCase());
      }
      return hintMarkers;
    };

    AlphabetHints.prototype.hintStrings = function(linkCount) {
      var digitsNeeded, hintStrings, i, k, l, longHintCount, ref, ref1, ref2, shortHintCount, start;
      digitsNeeded = Math.ceil(this.logXOfBase(linkCount, this.linkHintCharacters.length));
      shortHintCount = Math.floor((Math.pow(this.linkHintCharacters.length, digitsNeeded) - linkCount) / this.linkHintCharacters.length);
      longHintCount = linkCount - shortHintCount;
      hintStrings = [];
      if (digitsNeeded > 1) {
        for (i = k = 0, ref = shortHintCount; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
          hintStrings.push(numberToHintString(i, this.linkHintCharacters, digitsNeeded - 1));
        }
      }
      start = shortHintCount * this.linkHintCharacters.length;
      for (i = l = ref1 = start, ref2 = start + longHintCount; ref1 <= ref2 ? l < ref2 : l > ref2; i = ref1 <= ref2 ? ++l : --l) {
        hintStrings.push(numberToHintString(i, this.linkHintCharacters, digitsNeeded));
      }
      return this.shuffleHints(hintStrings, this.linkHintCharacters.length);
    };

    AlphabetHints.prototype.shuffleHints = function(hints, characterSetLength) {
      var bucket, buckets, hint, i, k, l, len, len1, result;
      buckets = (function() {
        var k, ref, results;
        results = [];
        for (i = k = 0, ref = characterSetLength; k < ref; i = k += 1) {
          results.push([]);
        }
        return results;
      })();
      for (i = k = 0, len = hints.length; k < len; i = ++k) {
        hint = hints[i];
        buckets[i % buckets.length].push(hint);
      }
      result = [];
      for (l = 0, len1 = buckets.length; l < len1; l++) {
        bucket = buckets[l];
        result = result.concat(bucket);
      }
      return result;
    };

    AlphabetHints.prototype.getMatchingHints = function(hintMarkers) {
      var matchString;
      matchString = this.hintKeystrokeQueue.join("");
      return {
        linksMatched: hintMarkers.filter(function(linkMarker) {
          return linkMarker.hintString.startsWith(matchString);
        })
      };
    };

    AlphabetHints.prototype.pushKeyChar = function(keyChar, keydownKeyChar) {
      return this.hintKeystrokeQueue.push((this.useKeydown ? keydownKeyChar : keyChar));
    };

    AlphabetHints.prototype.popKeyChar = function() {
      return this.hintKeystrokeQueue.pop();
    };

    return AlphabetHints;

  })();

  FilterHints = (function() {
    function FilterHints() {
      this.linkHintNumbers = Settings.get("linkHintNumbers");
      this.hintKeystrokeQueue = [];
      this.linkTextKeystrokeQueue = [];
      this.labelMap = {};
      this.activeHintMarker = null;
    }

    FilterHints.prototype.generateLabelMap = function() {
      var forElement, k, label, labelText, labels, len, results;
      labels = document.querySelectorAll("label");
      results = [];
      for (k = 0, len = labels.length; k < len; k++) {
        label = labels[k];
        forElement = label.getAttribute("for");
        if (forElement) {
          labelText = label.textContent.trim();
          if (labelText[labelText.length - 1] === ":") {
            labelText = labelText.substr(0, labelText.length - 1);
          }
          results.push(this.labelMap[forElement] = labelText);
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    FilterHints.prototype.generateHintString = function(linkHintNumber) {
      return numberToHintString(linkHintNumber, this.linkHintNumbers.toUpperCase());
    };

    FilterHints.prototype.generateLinkText = function(element) {
      var linkText, nodeName, showLinkText;
      linkText = "";
      showLinkText = false;
      nodeName = element.nodeName.toLowerCase();
      if (nodeName === "input") {
        if (this.labelMap[element.id]) {
          linkText = this.labelMap[element.id];
          showLinkText = true;
        } else if (element.type !== "password") {
          linkText = element.value;
          if (!linkText && 'placeholder' in element) {
            linkText = element.placeholder;
          }
        }
      } else if (nodeName === "a" && !element.textContent.trim() && element.firstElementChild && element.firstElementChild.nodeName.toLowerCase() === "img") {
        linkText = element.firstElementChild.alt || element.firstElementChild.title;
        if (linkText) {
          showLinkText = true;
        }
      } else {
        linkText = DomUtils.textContent.get(element);
      }
      return {
        text: linkText,
        show: showLinkText
      };
    };

    FilterHints.prototype.renderMarker = function(marker) {
      return marker.innerHTML = spanWrap(marker.hintString + (marker.showLinkText ? ": " + marker.linkText : ""));
    };

    FilterHints.prototype.fillInMarkers = function(hintMarkers) {
      var k, len, linkTextObject, marker, ref;
      this.generateLabelMap();
      DomUtils.textContent.reset();
      for (k = 0, len = hintMarkers.length; k < len; k++) {
        marker = hintMarkers[k];
        linkTextObject = this.generateLinkText(marker.clickableItem);
        marker.linkText = linkTextObject.text;
        marker.showLinkText = linkTextObject.show;
        this.renderMarker(marker);
      }
      this.activeHintMarker = hintMarkers[0];
      if ((ref = this.activeHintMarker) != null) {
        ref.classList.add("vimiumActiveHintMarker");
      }
      return this.filterLinkHints(hintMarkers);
    };

    FilterHints.prototype.getMatchingHints = function(hintMarkers, tabCount) {
      var delay, linksMatched, matchString, ref, ref1;
      if (tabCount == null) {
        tabCount = 0;
      }
      delay = 0;
      matchString = this.hintKeystrokeQueue.join("");
      linksMatched = this.filterLinkHints(hintMarkers);
      linksMatched = linksMatched.filter(function(linkMarker) {
        return linkMarker.hintString.startsWith(matchString);
      });
      if (linksMatched.length === 1 && this.hintKeystrokeQueue.length === 0 && 0 < this.linkTextKeystrokeQueue.length) {
        delay = 200;
      }
      tabCount = ((linksMatched.length * Math.abs(tabCount)) + tabCount) % linksMatched.length;
      if ((ref = this.activeHintMarker) != null) {
        ref.classList.remove("vimiumActiveHintMarker");
      }
      this.activeHintMarker = linksMatched[tabCount];
      if ((ref1 = this.activeHintMarker) != null) {
        ref1.classList.add("vimiumActiveHintMarker");
      }
      return {
        linksMatched: linksMatched,
        delay: delay
      };
    };

    FilterHints.prototype.pushKeyChar = function(keyChar, keydownKeyChar) {
      if (0 <= this.linkHintNumbers.indexOf(keyChar)) {
        return this.hintKeystrokeQueue.push(keyChar);
      } else {
        this.hintKeystrokeQueue = [];
        return this.linkTextKeystrokeQueue.push(keyChar);
      }
    };

    FilterHints.prototype.popKeyChar = function() {
      return this.hintKeystrokeQueue.pop() || this.linkTextKeystrokeQueue.pop();
    };

    FilterHints.prototype.filterLinkHints = function(hintMarkers) {
      var k, len, linkHintNumber, linkMarker, linkSearchString, results;
      linkSearchString = this.linkTextKeystrokeQueue.join("").trim().toLowerCase();
      (function(scoreFunction) {
        var k, len, linkMarker, results;
        results = [];
        for (k = 0, len = hintMarkers.length; k < len; k++) {
          linkMarker = hintMarkers[k];
          results.push(linkMarker.score = scoreFunction(linkMarker));
        }
        return results;
      })(this.scoreLinkHint(linkSearchString));
      hintMarkers = hintMarkers.slice(0).sort(function(a, b) {
        if (b.score === a.score) {
          return b.stableSortCount - a.stableSortCount;
        } else {
          return b.score - a.score;
        }
      });
      linkHintNumber = 1;
      results = [];
      for (k = 0, len = hintMarkers.length; k < len; k++) {
        linkMarker = hintMarkers[k];
        if (!(0 < linkMarker.score)) {
          continue;
        }
        linkMarker.hintString = this.generateHintString(linkHintNumber++);
        this.renderMarker(linkMarker);
        results.push(linkMarker);
      }
      return results;
    };

    FilterHints.prototype.scoreLinkHint = function(linkSearchString) {
      var searchWords;
      searchWords = linkSearchString.trim().split(/\s+/);
      return function(linkMarker) {
        var addFunc, idx, linkWord, linkWordScores, linkWords, searchWord, searchWordScores;
        linkWords = linkMarker.linkWords != null ? linkMarker.linkWords : linkMarker.linkWords = linkMarker.linkText.trim().toLowerCase().split(/\s+/);
        searchWordScores = (function() {
          var k, len, results;
          results = [];
          for (k = 0, len = searchWords.length; k < len; k++) {
            searchWord = searchWords[k];
            linkWordScores = (function() {
              var l, len1, results1;
              results1 = [];
              for (idx = l = 0, len1 = linkWords.length; l < len1; idx = ++l) {
                linkWord = linkWords[idx];
                if (linkWord === searchWord) {
                  if (idx === 0) {
                    results1.push(8);
                  } else {
                    results1.push(6);
                  }
                } else if (linkWord.startsWith(searchWord)) {
                  if (idx === 0) {
                    results1.push(4);
                  } else {
                    results1.push(2);
                  }
                } else if (0 <= linkWord.indexOf(searchWord)) {
                  results1.push(1);
                } else {
                  results1.push(0);
                }
              }
              return results1;
            })();
            results.push(Math.max.apply(Math, linkWordScores));
          }
          return results;
        })();
        addFunc = function(a, b) {
          return a + b;
        };
        if (indexOf.call(searchWordScores, 0) >= 0) {
          return 0;
        } else {
          return searchWordScores.reduce(addFunc, 0);
        }
      };
    };

    return FilterHints;

  })();

  spanWrap = function(hintString) {
    var char, innerHTML, k, len;
    innerHTML = [];
    for (k = 0, len = hintString.length; k < len; k++) {
      char = hintString[k];
      innerHTML.push("<span class='vimiumReset'>" + char + "</span>");
    }
    return innerHTML.join("");
  };

  numberToHintString = function(number, characterSet, numHintDigits) {
    var base, hintString, hintStringLength, i, k, ref, remainder;
    if (numHintDigits == null) {
      numHintDigits = 0;
    }
    base = characterSet.length;
    hintString = [];
    remainder = 0;
    while (true) {
      remainder = number % base;
      hintString.unshift(characterSet[remainder]);
      number -= remainder;
      number /= Math.floor(base);
      if (!(number > 0)) {
        break;
      }
    }
    hintStringLength = hintString.length;
    for (i = k = 0, ref = numHintDigits - hintStringLength; k < ref; i = k += 1) {
      hintString.unshift(characterSet[0]);
    }
    return hintString.join("");
  };

  root = typeof exports !== "undefined" && exports !== null ? exports : window;

  root.LinkHints = LinkHints;

}).call(this);
