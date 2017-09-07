(function (win) {
    var whiteSpaceRe = /^\s*|\s*$/g, undef, isRegExpBroken = 'B'.replace(/A(.)|B/, '$1') === '$1'; var tinymce = { majorVersion: '3', minorVersion: '5.10', releaseDate: '2013-10-24', _init: function () {
        var t = this, d = document, na = navigator, ua = na.userAgent, i, nl, n, base, p, v; t.isIE11 = ua.indexOf('Trident/') != -1 && (ua.indexOf('rv:') != -1 || na.appName.indexOf('Netscape') != -1); t.isOpera = win.opera && opera.buildNumber; t.isWebKit = /WebKit/.test(ua); t.isIE = !t.isWebKit && !t.isOpera && (/MSIE/gi).test(ua) && (/Explorer/gi).test(na.appName) || t.isIE11; t.isIE6 = t.isIE && /MSIE [56]/.test(ua); t.isIE7 = t.isIE && /MSIE [7]/.test(ua); t.isIE8 = t.isIE && /MSIE [8]/.test(ua); t.isIE9 = t.isIE && /MSIE [9]/.test(ua); t.isGecko = !t.isWebKit && !t.isIE11 && /Gecko/.test(ua); t.isMac = ua.indexOf('Mac') != -1; t.isAir = /adobeair/i.test(ua); t.isIDevice = /(iPad|iPhone)/.test(ua); t.isIOS5 = t.isIDevice && ua.match(/AppleWebKit\/(\d*)/)[1] >= 534; if (win.tinyMCEPreInit) { t.suffix = tinyMCEPreInit.suffix; t.baseURL = tinyMCEPreInit.base; t.query = tinyMCEPreInit.query; return; }
        t.suffix = ''; nl = d.getElementsByTagName('base'); for (i = 0; i < nl.length; i++) {
            v = nl[i].href; if (v) {
                if (/^https?:\/\/[^\/]+$/.test(v))
                    v += '/'; base = v ? v.match(/.*\//)[0] : '';
            } 
        }
        function getBase(n) {
            if (n.src && /tiny_mce(|_gzip|_jquery|_prototype|_full)(_dev|_src)?.js/.test(n.src)) {
                if (/_(src|dev)\.js/g.test(n.src))
                    t.suffix = '_src'; if ((p = n.src.indexOf('?')) != -1)
                    t.query = n.src.substring(p + 1); t.baseURL = n.src.substring(0, n.src.lastIndexOf('/')); if (base && t.baseURL.indexOf('://') == -1 && t.baseURL.indexOf('/') !== 0)
                    t.baseURL = base + t.baseURL; return t.baseURL;
            }
            return null;
        }; nl = d.getElementsByTagName('script'); for (i = 0; i < nl.length; i++) {
            if (getBase(nl[i]))
                return;
        }
        n = d.getElementsByTagName('head')[0]; if (n) {
            nl = n.getElementsByTagName('script'); for (i = 0; i < nl.length; i++) {
                if (getBase(nl[i]))
                    return;
            } 
        }
        return;
    }, is: function (o, t) {
        if (!t)
            return o !== undef; if (t == 'array' && tinymce.isArray(o))
            return true; return typeof (o) == t;
    }, isArray: Array.isArray || function (obj) { return Object.prototype.toString.call(obj) === "[object Array]"; }, makeMap: function (items, delim, map) {
        var i; items = items || []; delim = delim || ','; if (typeof (items) == "string")
            items = items.split(delim); map = map || {}; i = items.length; while (i--)
            map[items[i]] = {}; return map;
    }, each: function (o, cb, s) {
        var n, l; if (!o)
            return 0; s = s || o; if (o.length !== undef) {
            for (n = 0, l = o.length; n < l; n++) {
                if (cb.call(s, o[n], n, o) === false)
                    return 0;
            } 
        } else {
            for (n in o) {
                if (o.hasOwnProperty(n)) {
                    if (cb.call(s, o[n], n, o) === false)
                        return 0;
                } 
            } 
        }
        return 1;
    }, trim: function (s) { return (s ? '' + s : '').replace(whiteSpaceRe, ''); }, create: function (s, p, root) {
        var t = this, sp, ns, cn, scn, c, de = 0; s = /^((static) )?([\w.]+)(:([\w.]+))?/.exec(s); cn = s[3].match(/(^|\.)(\w+)$/i)[2]; ns = t.createNS(s[3].replace(/\.\w+$/, ''), root); if (ns[cn])
            return; if (s[2] == 'static') {
            ns[cn] = p; if (this.onCreate)
                this.onCreate(s[2], s[3], ns[cn]); return;
        }
        if (!p[cn]) { p[cn] = function () { }; de = 1; }
        ns[cn] = p[cn]; t.extend(ns[cn].prototype, p); if (s[5]) {
            sp = t.resolve(s[5]).prototype; scn = s[5].match(/\.(\w+)$/i)[1]; c = ns[cn]; if (de) { ns[cn] = function () { return sp[scn].apply(this, arguments); }; } else { ns[cn] = function () { this.parent = sp[scn]; return c.apply(this, arguments); }; }
            ns[cn].prototype[cn] = ns[cn]; t.each(sp, function (f, n) { ns[cn].prototype[n] = sp[n]; }); t.each(p, function (f, n) {
                if (sp[n]) { ns[cn].prototype[n] = function () { this.parent = sp[n]; return f.apply(this, arguments); }; } else {
                    if (n != cn)
                        ns[cn].prototype[n] = f;
                } 
            });
        }
        t.each(p['static'], function (f, n) { ns[cn][n] = f; }); if (this.onCreate)
            this.onCreate(s[2], s[3], ns[cn].prototype);
    }, walk: function (o, f, n, s) {
        s = s || this; if (o) {
            if (n)
                o = o[n]; tinymce.each(o, function (o, i) {
                    if (f.call(s, o, i, n) === false)
                        return false; tinymce.walk(o, f, n, s);
                });
        } 
    }, createNS: function (n, o) {
        var i, v; o = o || win; n = n.split('.'); for (i = 0; i < n.length; i++) {
            v = n[i]; if (!o[v])
                o[v] = {}; o = o[v];
        }
        return o;
    }, resolve: function (n, o) {
        var i, l; o = o || win; n = n.split('.'); for (i = 0, l = n.length; i < l; i++) {
            o = o[n[i]]; if (!o)
                break;
        }
        return o;
    }, addUnload: function (f, s) {
        var t = this, unload; unload = function () {
            var li = t.unloads, o, n; if (li) {
                for (n in li) {
                    o = li[n]; if (o && o.func)
                        o.func.call(o.scope, 1);
                }
                if (win.detachEvent) { win.detachEvent('onbeforeunload', fakeUnload); win.detachEvent('onunload', unload); } else if (win.removeEventListener)
                    win.removeEventListener('unload', unload, false); t.unloads = o = li = w = unload = 0; if (win.CollectGarbage)
                    CollectGarbage();
            } 
        }; function fakeUnload() {
            var d = document; function stop() {
                d.detachEvent('onstop', stop); if (unload)
                    unload(); d = 0;
            }; if (d.readyState == 'interactive') {
                if (d)
                    d.attachEvent('onstop', stop); win.setTimeout(function () {
                        if (d)
                            d.detachEvent('onstop', stop);
                    }, 0);
            } 
        }; f = { func: f, scope: s || this }; if (!t.unloads) {
            if (win.attachEvent) { win.attachEvent('onunload', unload); win.attachEvent('onbeforeunload', fakeUnload); } else if (win.addEventListener)
                win.addEventListener('unload', unload, false); t.unloads = [f];
        } else
            t.unloads.push(f); return f;
    }, removeUnload: function (f) { var u = this.unloads, r = null; tinymce.each(u, function (o, i) { if (o && o.func == f) { u.splice(i, 1); r = f; return false; } }); return r; }, explode: function (s, d) {
        if (!s || tinymce.is(s, 'array')) { return s; }
        return tinymce.map(s.split(d || ','), tinymce.trim);
    }, _addVer: function (u) {
        var v; if (!this.query)
            return u; v = (u.indexOf('?') == -1 ? '?' : '&') + this.query; if (u.indexOf('#') == -1)
            return u + v; return u.replace('#', v + '#');
    }, _replace: function (find, replace, str) {
        if (isRegExpBroken) {
            return str.replace(find, function () {
                var val = replace, args = arguments, i; for (i = 0; i < args.length - 2; i++) { if (args[i] === undef) { val = val.replace(new RegExp('\\$' + i, 'g'), ''); } else { val = val.replace(new RegExp('\\$' + i, 'g'), args[i]); } }
                return val;
            });
        }
        return str.replace(find, replace);
    } 
    }; tinymce._init(); win.tinymce = win.tinyMCE = tinymce;
})(window); (function ($, tinymce) {
    var is = tinymce.is, attrRegExp = /^(href|src|style)$/i, undef; if (!$ && window.console) { return console.log("Load jQuery first!"); }
    tinymce.$ = $; tinymce.adapter = { patchEditor: function (editor) {
        var fn = $.fn; function css(name, value) {
            var self = this; if (value)
                self.removeAttr('data-mce-style'); return fn.css.apply(self, arguments);
        }; function attr(name, value) {
            var self = this; if (attrRegExp.test(name)) {
                if (value !== undef) { self.each(function (i, node) { editor.dom.setAttrib(node, name, value); }); return self; } else
                    return self.attr('data-mce-' + name);
            }
            return fn.attr.apply(self, arguments);
        }; function patch(jq) {
            if (jq.css !== css) { jq.css = css; jq.attr = attr; jq.tinymce = editor; jq.pushStack = function () { return patch(fn.pushStack.apply(this, arguments)); }; }
            return jq;
        }; editor.$ = function (selector, scope) { var doc = editor.getDoc(); return patch($(selector || doc, doc || scope)); };
    } 
    }; tinymce.extend = $.extend; tinymce.extend(tinymce, { map: $.map, grep: function (a, f) { return $.grep(a, f || function () { return 1; }); }, inArray: function (a, v) { return $.inArray(v, a || []); } }); var patches = { 'tinymce.dom.DOMUtils': { select: function (pattern, scope) { var t = this; return $.find(pattern, t.get(scope) || t.get(t.settings.root_element) || t.doc, []); }, is: function (n, patt) {
        if (n.nodeType !== 1 && patt === '*') { return false; }
        return $(this.get(n)).is(patt);
    } 
    }
    }; tinymce.onCreate = function (ty, c, p) { tinymce.extend(p, patches[c]); };
})(window.jQuery, tinymce); tinymce.create('tinymce.util.Dispatcher', { scope: null, listeners: null, inDispatch: false, Dispatcher: function (scope) { this.scope = scope || this; this.listeners = []; }, add: function (callback, scope) { this.listeners.push({ cb: callback, scope: scope || this.scope }); return callback; }, addToTop: function (callback, scope) {
    var self = this, listener = { cb: callback, scope: scope || self.scope }; if (self.inDispatch) { self.listeners = [listener].concat(self.listeners); } else { self.listeners.unshift(listener); }
    return callback;
}, remove: function (callback) { var listeners = this.listeners, output = null; tinymce.each(listeners, function (listener, i) { if (callback == listener.cb) { output = listener; listeners.splice(i, 1); return false; } }); return output; }, dispatch: function () {
    var self = this, returnValue, args = arguments, i, listeners = self.listeners, listener; self.inDispatch = true; for (i = 0; i < listeners.length; i++) {
        listener = listeners[i]; returnValue = listener.cb.apply(listener.scope, args.length > 0 ? args : [listener.scope]); if (returnValue === false)
            break;
    }
    self.inDispatch = false; return returnValue;
} 
}); (function () {
    var each = tinymce.each; tinymce.create('tinymce.util.URI', { URI: function (u, s) {
        var t = this, o, a, b, base_url; u = tinymce.trim(u); s = t.settings = s || {}; if (/^([\w\-]+):([^\/]{2})/i.test(u) || /^\s*#/.test(u)) { t.source = u; return; }
        if (u.indexOf('/') === 0 && u.indexOf('//') !== 0)
            u = (s.base_uri ? s.base_uri.protocol || 'http' : 'http') + '://mce_host' + u; if (!/^[\w\-]*:?\/\//.test(u)) { base_url = s.base_uri ? s.base_uri.path : new tinymce.util.URI(location.href).directory; u = ((s.base_uri && s.base_uri.protocol) || 'http') + '://mce_host' + t.toAbsPath(base_url, u); }
        u = u.replace(/@@/g, '(mce_at)'); u = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/.exec(u); each(["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"], function (v, i) {
            var s = u[i]; if (s)
                s = s.replace(/\(mce_at\)/g, '@@'); t[v] = s;
        }); b = s.base_uri; if (b) {
            if (!t.protocol)
                t.protocol = b.protocol; if (!t.userInfo)
                t.userInfo = b.userInfo; if (!t.port && t.host === 'mce_host')
                t.port = b.port; if (!t.host || t.host === 'mce_host')
                t.host = b.host; t.source = '';
        } 
    }, setPath: function (p) { var t = this; p = /^(.*?)\/?(\w+)?$/.exec(p); t.path = p[0]; t.directory = p[1]; t.file = p[2]; t.source = ''; t.getURI(); }, toRelative: function (u) {
        var t = this, o; if (u === "./")
            return u; u = new tinymce.util.URI(u, { base_uri: t }); if ((u.host != 'mce_host' && t.host != u.host && u.host) || t.port != u.port || t.protocol != u.protocol)
            return u.getURI(); var tu = t.getURI(), uu = u.getURI(); if (tu == uu || (tu.charAt(tu.length - 1) == "/" && tu.substr(0, tu.length - 1) == uu))
            return tu; o = t.toRelPath(t.path, u.path); if (u.query)
            o += '?' + u.query; if (u.anchor)
            o += '#' + u.anchor; return o;
    }, toAbsolute: function (u, nh) { u = new tinymce.util.URI(u, { base_uri: this }); return u.getURI(this.host == u.host && this.protocol == u.protocol ? nh : 0); }, toRelPath: function (base, path) {
        var items, bp = 0, out = '', i, l; base = base.substring(0, base.lastIndexOf('/')); base = base.split('/'); items = path.split('/'); if (base.length >= items.length) { for (i = 0, l = base.length; i < l; i++) { if (i >= items.length || base[i] != items[i]) { bp = i + 1; break; } } }
        if (base.length < items.length) { for (i = 0, l = items.length; i < l; i++) { if (i >= base.length || base[i] != items[i]) { bp = i + 1; break; } } }
        if (bp === 1)
            return path; for (i = 0, l = base.length - (bp - 1); i < l; i++)
            out += "../"; for (i = bp - 1, l = items.length; i < l; i++) {
            if (i != bp - 1)
                out += "/" + items[i]; else
                out += items[i];
        }
        return out;
    }, toAbsPath: function (base, path) {
        var i, nb = 0, o = [], tr, outPath; tr = /\/$/.test(path) ? '/' : ''; base = base.split('/'); path = path.split('/'); each(base, function (k) {
            if (k)
                o.push(k);
        }); base = o; for (i = path.length - 1, o = []; i >= 0; i--) {
            if (path[i].length === 0 || path[i] === ".")
                continue; if (path[i] === '..') { nb++; continue; }
            if (nb > 0) { nb--; continue; }
            o.push(path[i]);
        }
        i = base.length - nb; if (i <= 0)
            outPath = o.reverse().join('/'); else
            outPath = base.slice(0, i).join('/') + '/' + o.reverse().join('/'); if (outPath.indexOf('/') !== 0)
            outPath = '/' + outPath; if (tr && outPath.lastIndexOf('/') !== outPath.length - 1)
            outPath += tr; return outPath;
    }, getURI: function (nh) {
        var s, t = this; if (!t.source || nh) {
            s = ''; if (!nh) {
                if (t.protocol)
                    s += t.protocol + '://'; if (t.userInfo)
                    s += t.userInfo + '@'; if (t.host)
                    s += t.host; if (t.port)
                    s += ':' + t.port;
            }
            if (t.path)
                s += t.path; if (t.query)
                s += '?' + t.query; if (t.anchor)
                s += '#' + t.anchor; t.source = s;
        }
        return t.source;
    } 
    });
})(); (function () {
    var each = tinymce.each; tinymce.create('static tinymce.util.Cookie', { getHash: function (n) {
        var v = this.get(n), h; if (v) { each(v.split('&'), function (v) { v = v.split('='); h = h || {}; h[unescape(v[0])] = unescape(v[1]); }); }
        return h;
    }, setHash: function (n, v, e, p, d, s) { var o = ''; each(v, function (v, k) { o += (!o ? '' : '&') + escape(k) + '=' + escape(v); }); this.set(n, o, e, p, d, s); }, get: function (n) {
        var c = document.cookie, e, p = n + "=", b; if (!c)
            return; b = c.indexOf("; " + p); if (b == -1) {
            b = c.indexOf(p); if (b !== 0)
                return null;
        } else
            b += 2; e = c.indexOf(";", b); if (e == -1)
            e = c.length; return unescape(c.substring(b + p.length, e));
    }, set: function (n, v, e, p, d, s) { document.cookie = n + "=" + escape(v) + ((e) ? "; expires=" + e.toGMTString() : "") + ((p) ? "; path=" + escape(p) : "") + ((d) ? "; domain=" + d : "") + ((s) ? "; secure" : ""); }, remove: function (name, path, domain) { var date = new Date(); date.setTime(date.getTime() - 1000); this.set(name, '', date, path, domain); } 
    });
})(); (function () {
    function serialize(o, quote) {
        var i, v, t, name; quote = quote || '"'; if (o == null)
            return 'null'; t = typeof o; if (t == 'string') {
            v = '\bb\tt\nn\ff\rr\""\'\'\\\\'; return quote + o.replace(/([\u0080-\uFFFF\x00-\x1f\"\'\\])/g, function (a, b) {
                if (quote === '"' && a === "'")
                    return a; i = v.indexOf(b); if (i + 1)
                    return '\\' + v.charAt(i + 1); a = b.charCodeAt().toString(16); return '\\u' + '0000'.substring(a.length) + a;
            }) + quote;
        }
        if (t == 'object') {
            if (o.hasOwnProperty && Object.prototype.toString.call(o) === '[object Array]') {
                for (i = 0, v = '['; i < o.length; i++)
                    v += (i > 0 ? ',' : '') + serialize(o[i], quote); return v + ']';
            }
            v = '{'; for (name in o) { if (o.hasOwnProperty(name)) { v += typeof o[name] != 'function' ? (v.length > 1 ? ',' + quote : quote) + name + quote + ':' + serialize(o[name], quote) : ''; } }
            return v + '}';
        }
        return '' + o;
    }; tinymce.util.JSON = { serialize: serialize, parse: function (s) { try { return eval('(' + s + ')'); } catch (ex) { } } };
})(); tinymce.create('static tinymce.util.XHR', { send: function (o) {
    var x, t, w = window, c = 0; function ready() {
        if (!o.async || x.readyState == 4 || c++ > 10000) {
            if (o.success && c < 10000 && x.status == 200)
                o.success.call(o.success_scope, '' + x.responseText, x, o); else if (o.error)
                o.error.call(o.error_scope, c > 10000 ? 'TIMED_OUT' : 'GENERAL', x, o); x = null;
        } else
            w.setTimeout(ready, 10);
    }; o.scope = o.scope || this; o.success_scope = o.success_scope || o.scope; o.error_scope = o.error_scope || o.scope; o.async = o.async === false ? false : true; o.data = o.data || ''; function get(s) {
        x = 0; try { x = new ActiveXObject(s); } catch (ex) { }
        return x;
    }; x = w.XMLHttpRequest ? new XMLHttpRequest() : get('Microsoft.XMLHTTP') || get('Msxml2.XMLHTTP'); if (x) {
        if (x.overrideMimeType)
            x.overrideMimeType(o.content_type); x.open(o.type || (o.data ? 'POST' : 'GET'), o.url, o.async); if (o.content_type)
            x.setRequestHeader('Content-Type', o.content_type); x.setRequestHeader('X-Requested-With', 'XMLHttpRequest'); x.send(o.data); if (!o.async)
            return ready(); t = w.setTimeout(ready, 10);
    } 
} 
}); (function () {
    var extend = tinymce.extend, JSON = tinymce.util.JSON, XHR = tinymce.util.XHR; tinymce.create('tinymce.util.JSONRequest', { JSONRequest: function (s) { this.settings = extend({}, s); this.count = 0; }, send: function (o) {
        var ecb = o.error, scb = o.success; o = extend(this.settings, o); o.success = function (c, x) {
            c = JSON.parse(c); if (typeof (c) == 'undefined') { c = { error: 'JSON Parse error.' }; }
            if (c.error)
                ecb.call(o.error_scope || o.scope, c.error, x); else
                scb.call(o.success_scope || o.scope, c.result);
        }; o.error = function (ty, x) {
            if (ecb)
                ecb.call(o.error_scope || o.scope, ty, x);
        }; o.data = JSON.serialize({ id: o.id || 'c' + (this.count++), method: o.method, params: o.params }); o.content_type = 'application/json'; XHR.send(o);
    }, 'static': { sendRPC: function (o) { return new tinymce.util.JSONRequest().send(o); } }
    });
} ()); (function (tinymce) { tinymce.VK = { BACKSPACE: 8, DELETE: 46, DOWN: 40, ENTER: 13, LEFT: 37, RIGHT: 39, SPACEBAR: 32, TAB: 9, UP: 38, modifierPressed: function (e) { return e.shiftKey || e.ctrlKey || e.altKey; }, metaKeyPressed: function (e) { return tinymce.isMac ? e.metaKey : e.ctrlKey && !e.altKey; } }; })(tinymce); tinymce.util.Quirks = function (editor) {
    var VK = tinymce.VK, BACKSPACE = VK.BACKSPACE, DELETE = VK.DELETE, dom = editor.dom, selection = editor.selection, settings = editor.settings, parser = editor.parser, serializer = editor.serializer, each = tinymce.each; function setEditorCommandState(cmd, state) { try { editor.getDoc().execCommand(cmd, false, state); } catch (ex) { } }
    function getDocumentMode() { var documentMode = editor.getDoc().documentMode; return documentMode ? documentMode : 6; }; function isDefaultPrevented(e) { return e.isDefaultPrevented(); }; function cleanupStylesWhenDeleting() {
        function removeMergedFormatSpans(isDelete) {
            var rng, blockElm, wrapperElm, bookmark, container, offset, elm; function isAtStartOrEndOfElm() {
                if (container.nodeType == 3) {
                    if (isDelete && offset == container.length) { return true; }
                    if (!isDelete && offset === 0) { return true; } 
                } 
            }
            rng = selection.getRng(); var tmpRng = [rng.startContainer, rng.startOffset, rng.endContainer, rng.endOffset]; if (!rng.collapsed) { isDelete = true; }
            container = rng[(isDelete ? 'start' : 'end') + 'Container']; offset = rng[(isDelete ? 'start' : 'end') + 'Offset']; if (container.nodeType == 3) {
                blockElm = dom.getParent(rng.startContainer, dom.isBlock); if (isDelete) { blockElm = dom.getNext(blockElm, dom.isBlock); }
                if (blockElm && (isAtStartOrEndOfElm() || !rng.collapsed)) { wrapperElm = dom.create('em', { 'id': '__mceDel' }); each(tinymce.grep(blockElm.childNodes), function (node) { wrapperElm.appendChild(node); }); blockElm.appendChild(wrapperElm); } 
            }
            rng = dom.createRng(); rng.setStart(tmpRng[0], tmpRng[1]); rng.setEnd(tmpRng[2], tmpRng[3]); selection.setRng(rng); editor.getDoc().execCommand(isDelete ? 'ForwardDelete' : 'Delete', false, null); if (wrapperElm) {
                bookmark = selection.getBookmark(); while (elm = dom.get('__mceDel')) { dom.remove(elm, true); }
                selection.moveToBookmark(bookmark);
            } 
        }
        editor.onKeyDown.add(function (editor, e) { var isDelete; isDelete = e.keyCode == DELETE; if (!isDefaultPrevented(e) && (isDelete || e.keyCode == BACKSPACE) && !VK.modifierPressed(e)) { e.preventDefault(); removeMergedFormatSpans(isDelete); } }); editor.addCommand('Delete', function () { removeMergedFormatSpans(); });
    }; function emptyEditorWhenDeleting() {
        function serializeRng(rng) { var body = dom.create("body"); var contents = rng.cloneContents(); body.appendChild(contents); return selection.serializer.serialize(body, { format: 'html' }); }
        function allContentsSelected(rng) { var selection = serializeRng(rng); var allRng = dom.createRng(); allRng.selectNode(editor.getBody()); var allSelection = serializeRng(allRng); return selection === allSelection; }
        editor.onKeyDown.add(function (editor, e) {
            var keyCode = e.keyCode, isCollapsed; if (!isDefaultPrevented(e) && (keyCode == DELETE || keyCode == BACKSPACE)) {
                isCollapsed = editor.selection.isCollapsed(); if (isCollapsed && !dom.isEmpty(editor.getBody())) { return; }
                if (tinymce.isIE && !isCollapsed) { return; }
                if (!isCollapsed && !allContentsSelected(editor.selection.getRng())) { return; }
                editor.setContent(''); editor.selection.setCursorLocation(editor.getBody(), 0); editor.nodeChanged();
            } 
        });
    }; function selectAll() { editor.onKeyDown.add(function (editor, e) { if (!isDefaultPrevented(e) && e.keyCode == 65 && VK.metaKeyPressed(e)) { e.preventDefault(); editor.execCommand('SelectAll'); } }); }; function inputMethodFocus() { if (!editor.settings.content_editable) { dom.bind(editor.getDoc(), 'focusin', function (e) { selection.setRng(selection.getRng()); }); dom.bind(editor.getDoc(), 'mousedown', function (e) { if (e.target == editor.getDoc().documentElement) { editor.getWin().focus(); selection.setRng(selection.getRng()); } }); } }; function removeHrOnBackspace() { editor.onKeyDown.add(function (editor, e) { if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) { if (selection.isCollapsed() && selection.getRng(true).startOffset === 0) { var node = selection.getNode(); var previousSibling = node.previousSibling; if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === "hr") { dom.remove(previousSibling); tinymce.dom.Event.cancel(e); } } } }) }
    function focusBody() { if (!Range.prototype.getClientRects) { editor.onMouseDown.add(function (editor, e) { if (!isDefaultPrevented(e) && e.target.nodeName === "HTML") { var body = editor.getBody(); body.blur(); setTimeout(function () { body.focus(); }, 0); } }); } }; function selectControlElements() {
        editor.onClick.add(function (editor, e) {
            e = e.target; if (/^(IMG|HR)$/.test(e.nodeName)) { selection.getSel().setBaseAndExtent(e, 0, e, 1); }
            if (e.nodeName == 'A' && dom.hasClass(e, 'mceItemAnchor')) { selection.select(e); }
            editor.nodeChanged();
        });
    }; function removeStylesWhenDeletingAccrossBlockElements() {
        function getAttributeApplyFunction() { var template = dom.getAttribs(selection.getStart().cloneNode(false)); return function () { var target = selection.getStart(); if (target !== editor.getBody()) { dom.setAttrib(target, "style", null); each(template, function (attr) { target.setAttributeNode(attr.cloneNode(true)); }); } }; }
        function isSelectionAcrossElements() { return !selection.isCollapsed() && dom.getParent(selection.getStart(), dom.isBlock) != dom.getParent(selection.getEnd(), dom.isBlock); }
        function blockEvent(editor, e) { e.preventDefault(); return false; }
        editor.onKeyPress.add(function (editor, e) { var applyAttributes; if (!isDefaultPrevented(e) && (e.keyCode == 8 || e.keyCode == 46) && isSelectionAcrossElements()) { applyAttributes = getAttributeApplyFunction(); editor.getDoc().execCommand('delete', false, null); applyAttributes(); e.preventDefault(); return false; } }); dom.bind(editor.getDoc(), 'cut', function (e) { var applyAttributes; if (!isDefaultPrevented(e) && isSelectionAcrossElements()) { applyAttributes = getAttributeApplyFunction(); editor.onKeyUp.addToTop(blockEvent); setTimeout(function () { applyAttributes(); editor.onKeyUp.remove(blockEvent); }, 0); } });
    }
    function selectionChangeNodeChanged() {
        var lastRng, selectionTimer; dom.bind(editor.getDoc(), 'selectionchange', function () {
            if (selectionTimer) { clearTimeout(selectionTimer); selectionTimer = 0; }
            selectionTimer = window.setTimeout(function () { var rng = selection.getRng(); if (!lastRng || !tinymce.dom.RangeUtils.compareRanges(rng, lastRng)) { editor.nodeChanged(); lastRng = rng; } }, 50);
        });
    }
    function ensureBodyHasRoleApplication() { document.body.setAttribute("role", "application"); }
    function disableBackspaceIntoATable() { editor.onKeyDown.add(function (editor, e) { if (!isDefaultPrevented(e) && e.keyCode === BACKSPACE) { if (selection.isCollapsed() && selection.getRng(true).startOffset === 0) { var previousSibling = selection.getNode().previousSibling; if (previousSibling && previousSibling.nodeName && previousSibling.nodeName.toLowerCase() === "table") { return tinymce.dom.Event.cancel(e); } } } }) }
    function addNewLinesBeforeBrInPre() {
        if (getDocumentMode() > 7) { return; }
        setEditorCommandState('RespectVisibilityInDesign', true); editor.contentStyles.push('.mceHideBrInPre pre br {display: none}'); dom.addClass(editor.getBody(), 'mceHideBrInPre'); parser.addNodeFilter('pre', function (nodes, name) { var i = nodes.length, brNodes, j, brElm, sibling; while (i--) { brNodes = nodes[i].getAll('br'); j = brNodes.length; while (j--) { brElm = brNodes[j]; sibling = brElm.prev; if (sibling && sibling.type === 3 && sibling.value.charAt(sibling.value - 1) != '\n') { sibling.value += '\n'; } else { brElm.parent.insert(new tinymce.html.Node('#text', 3), brElm, true).value = '\n'; } } } }); serializer.addNodeFilter('pre', function (nodes, name) { var i = nodes.length, brNodes, j, brElm, sibling; while (i--) { brNodes = nodes[i].getAll('br'); j = brNodes.length; while (j--) { brElm = brNodes[j]; sibling = brElm.prev; if (sibling && sibling.type == 3) { sibling.value = sibling.value.replace(/\r?\n$/, ''); } } } });
    }
    function removePreSerializedStylesWhenSelectingControls() {
        dom.bind(editor.getBody(), 'mouseup', function (e) {
            var value, node = selection.getNode(); if (node.nodeName == 'IMG') {
                if (value = dom.getStyle(node, 'width')) { dom.setAttrib(node, 'width', value.replace(/[^0-9%]+/g, '')); dom.setStyle(node, 'width', ''); }
                if (value = dom.getStyle(node, 'height')) { dom.setAttrib(node, 'height', value.replace(/[^0-9%]+/g, '')); dom.setStyle(node, 'height', ''); } 
            } 
        });
    }
    function keepInlineElementOnDeleteBackspace() {
        editor.onKeyDown.add(function (editor, e) {
            var isDelete, rng, container, offset, brElm, sibling, collapsed; isDelete = e.keyCode == DELETE; if (!isDefaultPrevented(e) && (isDelete || e.keyCode == BACKSPACE) && !VK.modifierPressed(e)) {
                rng = selection.getRng(); container = rng.startContainer; offset = rng.startOffset; collapsed = rng.collapsed; if (container.nodeType == 3 && container.nodeValue.length > 0 && ((offset === 0 && !collapsed) || (collapsed && offset === (isDelete ? 0 : 1)))) {
                    sibling = container.previousSibling; if (sibling && sibling.nodeName == "IMG") { return; }
                    nonEmptyElements = editor.schema.getNonEmptyElements(); e.preventDefault(); brElm = dom.create('br', { id: '__tmp' }); container.parentNode.insertBefore(brElm, container); editor.getDoc().execCommand(isDelete ? 'ForwardDelete' : 'Delete', false, null); container = selection.getRng().startContainer; sibling = container.previousSibling; if (sibling && sibling.nodeType == 1 && !dom.isBlock(sibling) && dom.isEmpty(sibling) && !nonEmptyElements[sibling.nodeName.toLowerCase()]) { dom.remove(sibling); }
                    dom.remove('__tmp');
                } 
            } 
        });
    }
    function removeBlockQuoteOnBackSpace() {
        editor.onKeyDown.add(function (editor, e) {
            var rng, container, offset, root, parent; if (isDefaultPrevented(e) || e.keyCode != VK.BACKSPACE) { return; }
            rng = selection.getRng(); container = rng.startContainer; offset = rng.startOffset; root = dom.getRoot(); parent = container; if (!rng.collapsed || offset !== 0) { return; }
            while (parent && parent.parentNode && parent.parentNode.firstChild == parent && parent.parentNode != root) { parent = parent.parentNode; }
            if (parent.tagName === 'BLOCKQUOTE') { editor.formatter.toggle('blockquote', null, parent); rng = dom.createRng(); rng.setStart(container, 0); rng.setEnd(container, 0); selection.setRng(rng); } 
        });
    }; function setGeckoEditingOptions() { function setOpts() { editor._refreshContentEditable(); setEditorCommandState("StyleWithCSS", false); setEditorCommandState("enableInlineTableEditing", false); if (!settings.object_resizing) { setEditorCommandState("enableObjectResizing", false); } }; if (!settings.readonly) { editor.onBeforeExecCommand.add(setOpts); editor.onMouseDown.add(setOpts); } }; function addBrAfterLastLinks() {
        function fixLinks(editor, o) {
            each(dom.select('a'), function (node) {
                var parentNode = node.parentNode, root = dom.getRoot(); if (parentNode.lastChild === node) {
                    while (parentNode && !dom.isBlock(parentNode)) {
                        if (parentNode.parentNode.lastChild !== parentNode || parentNode === root) { return; }
                        parentNode = parentNode.parentNode;
                    }
                    dom.add(parentNode, 'br', { 'data-mce-bogus': 1 });
                } 
            });
        }; editor.onExecCommand.add(function (editor, cmd) { if (cmd === 'CreateLink') { fixLinks(editor); } }); editor.onSetContent.add(selection.onSetContent.add(fixLinks));
    }; function setDefaultBlockType() { if (settings.forced_root_block) { editor.onInit.add(function () { setEditorCommandState('DefaultParagraphSeparator', settings.forced_root_block); }); } }
    function removeGhostSelection() { function repaint(sender, args) { if (!sender || !args.initial) { editor.execCommand('mceRepaint'); } }; editor.onUndo.add(repaint); editor.onRedo.add(repaint); editor.onSetContent.add(repaint); }; function deleteControlItemOnBackSpace() { editor.onKeyDown.add(function (editor, e) { var rng; if (!isDefaultPrevented(e) && e.keyCode == BACKSPACE) { rng = editor.getDoc().selection.createRange(); if (rng && rng.item) { e.preventDefault(); editor.undoManager.beforeChange(); dom.remove(rng.item(0)); editor.undoManager.add(); } } }); }; function renderEmptyBlocksFix() { var emptyBlocksCSS; if (getDocumentMode() >= 10) { emptyBlocksCSS = ''; each('p div h1 h2 h3 h4 h5 h6'.split(' '), function (name, i) { emptyBlocksCSS += (i > 0 ? ',' : '') + name + ':empty'; }); editor.contentStyles.push(emptyBlocksCSS + '{padding-right: 1px !important}'); } }; function fakeImageResize() {
        var selectedElmX, selectedElmY, selectedElm, selectedElmGhost, selectedHandle, startX, startY, startW, startH, ratio, resizeHandles, width, height, rootDocument = document, editableDoc = editor.getDoc(); if (!settings.object_resizing || settings.webkit_fake_resize === false) { return; }
        setEditorCommandState("enableObjectResizing", false); resizeHandles = { n: [.5, 0, 0, -1], e: [1, .5, 1, 0], s: [.5, 1, 0, 1], w: [0, .5, -1, 0], nw: [0, 0, -1, -1], ne: [1, 0, 1, -1], se: [1, 1, 1, 1], sw: [0, 1, -1, 1] }; function resizeElement(e) {
            var deltaX, deltaY; deltaX = e.screenX - startX; deltaY = e.screenY - startY; width = deltaX * selectedHandle[2] + startW; height = deltaY * selectedHandle[3] + startH; width = width < 5 ? 5 : width; height = height < 5 ? 5 : height; if (VK.modifierPressed(e) || (selectedElm.nodeName == "IMG" && selectedHandle[2] * selectedHandle[3] !== 0)) { width = Math.round(height / ratio); height = Math.round(width * ratio); }
            dom.setStyles(selectedElmGhost, { width: width, height: height }); if (selectedHandle[2] < 0 && selectedElmGhost.clientWidth <= width) { dom.setStyle(selectedElmGhost, 'left', selectedElmX + (startW - width)); }
            if (selectedHandle[3] < 0 && selectedElmGhost.clientHeight <= height) { dom.setStyle(selectedElmGhost, 'top', selectedElmY + (startH - height)); } 
        }
        function endResize() {
            function setSizeProp(name, value) { if (value) { if (selectedElm.style[name] || !editor.schema.isValid(selectedElm.nodeName.toLowerCase(), name)) { dom.setStyle(selectedElm, name, value); } else { dom.setAttrib(selectedElm, name, value); } } }
            setSizeProp('width', width); setSizeProp('height', height); dom.unbind(editableDoc, 'mousemove', resizeElement); dom.unbind(editableDoc, 'mouseup', endResize); if (rootDocument != editableDoc) { dom.unbind(rootDocument, 'mousemove', resizeElement); dom.unbind(rootDocument, 'mouseup', endResize); }
            dom.remove(selectedElmGhost); showResizeRect(selectedElm);
        }
        function showResizeRect(targetElm) {
            var position, targetWidth, targetHeight; hideResizeRect(); position = dom.getPos(targetElm); selectedElmX = position.x; selectedElmY = position.y; targetWidth = targetElm.offsetWidth; targetHeight = targetElm.offsetHeight; if (selectedElm != targetElm) { selectedElm = targetElm; width = height = 0; }
            each(resizeHandles, function (handle, name) {
                var handleElm; handleElm = dom.get('mceResizeHandle' + name); if (!handleElm) { handleElm = dom.add(editableDoc.documentElement, 'div', { id: 'mceResizeHandle' + name, 'class': 'mceResizeHandle', style: 'cursor:' + name + '-resize; margin:0; padding:0' }); dom.bind(handleElm, 'mousedown', function (e) { e.preventDefault(); endResize(); startX = e.screenX; startY = e.screenY; startW = selectedElm.clientWidth; startH = selectedElm.clientHeight; ratio = startH / startW; selectedHandle = handle; selectedElmGhost = selectedElm.cloneNode(true); dom.addClass(selectedElmGhost, 'mceClonedResizable'); dom.setStyles(selectedElmGhost, { left: selectedElmX, top: selectedElmY, margin: 0 }); editableDoc.documentElement.appendChild(selectedElmGhost); dom.bind(editableDoc, 'mousemove', resizeElement); dom.bind(editableDoc, 'mouseup', endResize); if (rootDocument != editableDoc) { dom.bind(rootDocument, 'mousemove', resizeElement); dom.bind(rootDocument, 'mouseup', endResize); } }); } else { dom.show(handleElm); }
                dom.setStyles(handleElm, { left: (targetWidth * handle[0] + selectedElmX) - (handleElm.offsetWidth / 2), top: (targetHeight * handle[1] + selectedElmY) - (handleElm.offsetHeight / 2) });
            }); if (!tinymce.isOpera && selectedElm.nodeName == "IMG") { selectedElm.setAttribute('data-mce-selected', '1'); } 
        }
        function hideResizeRect() {
            if (selectedElm) { selectedElm.removeAttribute('data-mce-selected'); }
            for (var name in resizeHandles) { dom.hide('mceResizeHandle' + name); } 
        }
        editor.contentStyles.push('.mceResizeHandle {' + 'position: absolute;' + 'border: 1px solid black;' + 'background: #FFF;' + 'width: 5px;' + 'height: 5px;' + 'z-index: 10000' + '}' + '.mceResizeHandle:hover {' + 'background: #000' + '}' + 'img[data-mce-selected] {' + 'outline: 1px solid black' + '}' + 'img.mceClonedResizable, table.mceClonedResizable {' + 'position: absolute;' + 'outline: 1px dashed black;' + 'opacity: .5;' + 'z-index: 10000' + '}'); function updateResizeRect() { var controlElm = dom.getParent(selection.getNode(), 'table,img'); each(dom.select('img[data-mce-selected]'), function (img) { img.removeAttribute('data-mce-selected'); }); if (controlElm) { showResizeRect(controlElm); } else { hideResizeRect(); } }
        editor.onNodeChange.add(updateResizeRect); dom.bind(editableDoc, 'selectionchange', updateResizeRect); editor.serializer.addAttributeFilter('data-mce-selected', function (nodes, name) { var i = nodes.length; while (i--) { nodes[i].attr(name, null); } });
    }
    function keepNoScriptContents() { if (getDocumentMode() < 9) { parser.addNodeFilter('noscript', function (nodes) { var i = nodes.length, node, textNode; while (i--) { node = nodes[i]; textNode = node.firstChild; if (textNode) { node.attr('data-mce-innertext', textNode.value); } } }); serializer.addNodeFilter('noscript', function (nodes) { var i = nodes.length, node, textNode, value; while (i--) { node = nodes[i]; textNode = nodes[i].firstChild; if (textNode) { textNode.value = tinymce.html.Entities.decode(textNode.value); } else { value = node.attributes.map['data-mce-innertext']; if (value) { node.attr('data-mce-innertext', null); textNode = new tinymce.html.Node('#text', 3); textNode.value = value; textNode.raw = true; node.append(textNode); } } } }); } }
    function bodyHeight() { editor.contentStyles.push('body {min-height: 100px}'); editor.onClick.add(function (ed, e) { if (e.target.nodeName == 'HTML') { editor.execCommand('SelectAll'); editor.selection.collapse(true); editor.nodeChanged(); } }); }
    disableBackspaceIntoATable(); removeBlockQuoteOnBackSpace(); emptyEditorWhenDeleting(); if (tinymce.isWebKit) { keepInlineElementOnDeleteBackspace(); cleanupStylesWhenDeleting(); inputMethodFocus(); selectControlElements(); setDefaultBlockType(); if (tinymce.isIDevice) { selectionChangeNodeChanged(); } else { fakeImageResize(); selectAll(); } }
    if (tinymce.isIE && !tinymce.isIE11) { removeHrOnBackspace(); ensureBodyHasRoleApplication(); addNewLinesBeforeBrInPre(); removePreSerializedStylesWhenSelectingControls(); deleteControlItemOnBackSpace(); renderEmptyBlocksFix(); keepNoScriptContents(); }
    if (tinymce.isIE11) { bodyHeight(); }
    if (tinymce.isGecko && !tinymce.isIE11) { removeHrOnBackspace(); focusBody(); removeStylesWhenDeletingAccrossBlockElements(); setGeckoEditingOptions(); addBrAfterLastLinks(); removeGhostSelection(); }
    if (tinymce.isOpera) { fakeImageResize(); } 
}; (function (tinymce) {
    var namedEntities, baseEntities, reverseEntities, attrsCharsRegExp = /[&<>\"\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, textCharsRegExp = /[<>&\u007E-\uD7FF\uE000-\uFFEF]|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, rawCharsRegExp = /[<>&\"\']/g, entityRegExp = /&(#x|#)?([\w]+);/g, asciiMap = { 128: "\u20AC", 130: "\u201A", 131: "\u0192", 132: "\u201E", 133: "\u2026", 134: "\u2020", 135: "\u2021", 136: "\u02C6", 137: "\u2030", 138: "\u0160", 139: "\u2039", 140: "\u0152", 142: "\u017D", 145: "\u2018", 146: "\u2019", 147: "\u201C", 148: "\u201D", 149: "\u2022", 150: "\u2013", 151: "\u2014", 152: "\u02DC", 153: "\u2122", 154: "\u0161", 155: "\u203A", 156: "\u0153", 158: "\u017E", 159: "\u0178" }; baseEntities = { '\"': '&quot;', "'": '&#39;', '<': '&lt;', '>': '&gt;', '&': '&amp;' }; reverseEntities = { '&lt;': '<', '&gt;': '>', '&amp;': '&', '&quot;': '"', '&apos;': "'" }; function nativeDecode(text) { var elm; elm = document.createElement("div"); elm.innerHTML = text; return elm.textContent || elm.innerText || text; }; function buildEntitiesLookup(items, radix) {
        var i, chr, entity, lookup = {}; if (items) {
            items = items.split(','); radix = radix || 10; for (i = 0; i < items.length; i += 2) { chr = String.fromCharCode(parseInt(items[i], radix)); if (!baseEntities[chr]) { entity = '&' + items[i + 1] + ';'; lookup[chr] = entity; lookup[entity] = chr; } }
            return lookup;
        } 
    }; namedEntities = buildEntitiesLookup('50,nbsp,51,iexcl,52,cent,53,pound,54,curren,55,yen,56,brvbar,57,sect,58,uml,59,copy,' + '5a,ordf,5b,laquo,5c,not,5d,shy,5e,reg,5f,macr,5g,deg,5h,plusmn,5i,sup2,5j,sup3,5k,acute,' + '5l,micro,5m,para,5n,middot,5o,cedil,5p,sup1,5q,ordm,5r,raquo,5s,frac14,5t,frac12,5u,frac34,' + '5v,iquest,60,Agrave,61,Aacute,62,Acirc,63,Atilde,64,Auml,65,Aring,66,AElig,67,Ccedil,' + '68,Egrave,69,Eacute,6a,Ecirc,6b,Euml,6c,Igrave,6d,Iacute,6e,Icirc,6f,Iuml,6g,ETH,6h,Ntilde,' + '6i,Ograve,6j,Oacute,6k,Ocirc,6l,Otilde,6m,Ouml,6n,times,6o,Oslash,6p,Ugrave,6q,Uacute,' + '6r,Ucirc,6s,Uuml,6t,Yacute,6u,THORN,6v,szlig,70,agrave,71,aacute,72,acirc,73,atilde,74,auml,' + '75,aring,76,aelig,77,ccedil,78,egrave,79,eacute,7a,ecirc,7b,euml,7c,igrave,7d,iacute,7e,icirc,' + '7f,iuml,7g,eth,7h,ntilde,7i,ograve,7j,oacute,7k,ocirc,7l,otilde,7m,ouml,7n,divide,7o,oslash,' + '7p,ugrave,7q,uacute,7r,ucirc,7s,uuml,7t,yacute,7u,thorn,7v,yuml,ci,fnof,sh,Alpha,si,Beta,' + 'sj,Gamma,sk,Delta,sl,Epsilon,sm,Zeta,sn,Eta,so,Theta,sp,Iota,sq,Kappa,sr,Lambda,ss,Mu,' + 'st,Nu,su,Xi,sv,Omicron,t0,Pi,t1,Rho,t3,Sigma,t4,Tau,t5,Upsilon,t6,Phi,t7,Chi,t8,Psi,' + 't9,Omega,th,alpha,ti,beta,tj,gamma,tk,delta,tl,epsilon,tm,zeta,tn,eta,to,theta,tp,iota,' + 'tq,kappa,tr,lambda,ts,mu,tt,nu,tu,xi,tv,omicron,u0,pi,u1,rho,u2,sigmaf,u3,sigma,u4,tau,' + 'u5,upsilon,u6,phi,u7,chi,u8,psi,u9,omega,uh,thetasym,ui,upsih,um,piv,812,bull,816,hellip,' + '81i,prime,81j,Prime,81u,oline,824,frasl,88o,weierp,88h,image,88s,real,892,trade,89l,alefsym,' + '8cg,larr,8ch,uarr,8ci,rarr,8cj,darr,8ck,harr,8dl,crarr,8eg,lArr,8eh,uArr,8ei,rArr,8ej,dArr,' + '8ek,hArr,8g0,forall,8g2,part,8g3,exist,8g5,empty,8g7,nabla,8g8,isin,8g9,notin,8gb,ni,8gf,prod,' + '8gh,sum,8gi,minus,8gn,lowast,8gq,radic,8gt,prop,8gu,infin,8h0,ang,8h7,and,8h8,or,8h9,cap,8ha,cup,' + '8hb,int,8hk,there4,8hs,sim,8i5,cong,8i8,asymp,8j0,ne,8j1,equiv,8j4,le,8j5,ge,8k2,sub,8k3,sup,8k4,' + 'nsub,8k6,sube,8k7,supe,8kl,oplus,8kn,otimes,8l5,perp,8m5,sdot,8o8,lceil,8o9,rceil,8oa,lfloor,8ob,' + 'rfloor,8p9,lang,8pa,rang,9ea,loz,9j0,spades,9j3,clubs,9j5,hearts,9j6,diams,ai,OElig,aj,oelig,b0,' + 'Scaron,b1,scaron,bo,Yuml,m6,circ,ms,tilde,802,ensp,803,emsp,809,thinsp,80c,zwnj,80d,zwj,80e,lrm,' + '80f,rlm,80j,ndash,80k,mdash,80o,lsquo,80p,rsquo,80q,sbquo,80s,ldquo,80t,rdquo,80u,bdquo,810,dagger,' + '811,Dagger,81g,permil,81p,lsaquo,81q,rsaquo,85c,euro', 32); tinymce.html = tinymce.html || {}; tinymce.html.Entities = { encodeRaw: function (text, attr) { return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) { return baseEntities[chr] || chr; }); }, encodeAllRaw: function (text) { return ('' + text).replace(rawCharsRegExp, function (chr) { return baseEntities[chr] || chr; }); }, encodeNumeric: function (text, attr) {
        return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) {
            if (chr.length > 1)
                return '&#' + (((chr.charCodeAt(0) - 0xD800) * 0x400) + (chr.charCodeAt(1) - 0xDC00) + 0x10000) + ';'; return baseEntities[chr] || '&#' + chr.charCodeAt(0) + ';';
        });
    }, encodeNamed: function (text, attr, entities) { entities = entities || namedEntities; return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) { return baseEntities[chr] || entities[chr] || chr; }); }, getEncodeFunc: function (name, entities) {
        var Entities = tinymce.html.Entities; entities = buildEntitiesLookup(entities) || namedEntities; function encodeNamedAndNumeric(text, attr) { return text.replace(attr ? attrsCharsRegExp : textCharsRegExp, function (chr) { return baseEntities[chr] || entities[chr] || '&#' + chr.charCodeAt(0) + ';' || chr; }); }; function encodeCustomNamed(text, attr) { return Entities.encodeNamed(text, attr, entities); }; name = tinymce.makeMap(name.replace(/\+/g, ',')); if (name.named && name.numeric)
            return encodeNamedAndNumeric; if (name.named) {
            if (entities)
                return encodeCustomNamed; return Entities.encodeNamed;
        }
        if (name.numeric)
            return Entities.encodeNumeric; return Entities.encodeRaw;
    }, decode: function (text) {
        return text.replace(entityRegExp, function (all, numeric, value) {
            if (numeric) {
                value = parseInt(value, numeric.length === 2 ? 16 : 10); if (value > 0xFFFF) { value -= 0x10000; return String.fromCharCode(0xD800 + (value >> 10), 0xDC00 + (value & 0x3FF)); } else
                    return asciiMap[value] || String.fromCharCode(value);
            }
            return reverseEntities[all] || namedEntities[all] || nativeDecode(all);
        });
    } 
    };
})(tinymce); tinymce.html.Styles = function (settings, schema) {
    var rgbRegExp = /rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)/gi, urlOrStrRegExp = /(?:url(?:(?:\(\s*\"([^\"]+)\"\s*\))|(?:\(\s*\'([^\']+)\'\s*\))|(?:\(\s*([^)\s]+)\s*\))))|(?:\'([^\']+)\')|(?:\"([^\"]+)\")/gi, styleRegExp = /\s*([^:]+):\s*([^;]+);?/g, trimRightRegExp = /\s+$/, urlColorRegExp = /rgb/, undef, i, encodingLookup = {}, encodingItems; settings = settings || {}; encodingItems = '\\" \\\' \\; \\: ; : \uFEFF'.split(' '); for (i = 0; i < encodingItems.length; i++) { encodingLookup[encodingItems[i]] = '\uFEFF' + i; encodingLookup['\uFEFF' + i] = encodingItems[i]; }
    function toHex(match, r, g, b) { function hex(val) { val = parseInt(val).toString(16); return val.length > 1 ? val : '0' + val; }; return '#' + hex(r) + hex(g) + hex(b); }; return { toHex: function (color) { return color.replace(rgbRegExp, toHex); }, parse: function (css) {
        var styles = {}, matches, name, value, isEncoded, urlConverter = settings.url_converter, urlConverterScope = settings.url_converter_scope || this; function compress(prefix, suffix) {
            var top, right, bottom, left; if (styles['border-image'] === 'none') { delete styles['border-image']; }
            top = styles[prefix + '-top' + suffix]; if (!top)
                return; right = styles[prefix + '-right' + suffix]; if (top != right)
                return; bottom = styles[prefix + '-bottom' + suffix]; if (right != bottom)
                return; left = styles[prefix + '-left' + suffix]; if (bottom != left)
                return; styles[prefix + suffix] = left; delete styles[prefix + '-top' + suffix]; delete styles[prefix + '-right' + suffix]; delete styles[prefix + '-bottom' + suffix]; delete styles[prefix + '-left' + suffix];
        }; function canCompress(key) {
            var value = styles[key], i; if (!value || value.indexOf(' ') < 0)
                return; value = value.split(' '); i = value.length; while (i--) {
                if (value[i] !== value[0])
                    return false;
            }
            styles[key] = value[0]; return true;
        }; function compress2(target, a, b, c) {
            if (!canCompress(a))
                return; if (!canCompress(b))
                return; if (!canCompress(c))
                return; styles[target] = styles[a] + ' ' + styles[b] + ' ' + styles[c]; delete styles[a]; delete styles[b]; delete styles[c];
        }; function encode(str) { isEncoded = true; return encodingLookup[str]; }; function decode(str, keep_slashes) {
            if (isEncoded) { str = str.replace(/\uFEFF[0-9]/g, function (str) { return encodingLookup[str]; }); }
            if (!keep_slashes)
                str = str.replace(/\\([\'\";:])/g, "$1"); return str;
        }; function processUrl(match, url, url2, url3, str, str2) {
            str = str || str2; if (str) { str = decode(str); return "'" + str.replace(/\'/g, "\\'") + "'"; }
            url = decode(url || url2 || url3); if (urlConverter)
                url = urlConverter.call(urlConverterScope, url, 'style'); return "url('" + url.replace(/\'/g, "\\'") + "')";
        }; if (css) {
            css = css.replace(/\\[\"\';:\uFEFF]/g, encode).replace(/\"[^\"]+\"|\'[^\']+\'/g, function (str) { return str.replace(/[;:]/g, encode); }); while (matches = styleRegExp.exec(css)) {
                name = matches[1].replace(trimRightRegExp, '').toLowerCase(); value = matches[2].replace(trimRightRegExp, ''); if (name && value.length > 0) {
                    if (name === 'font-weight' && value === '700')
                        value = 'bold'; else if (name === 'color' || name === 'background-color')
                        value = value.toLowerCase(); value = value.replace(rgbRegExp, toHex); value = value.replace(urlOrStrRegExp, processUrl); styles[name] = isEncoded ? decode(value, true) : value;
                }
                styleRegExp.lastIndex = matches.index + matches[0].length;
            }
            compress("border", ""); compress("border", "-width"); compress("border", "-color"); compress("border", "-style"); compress("padding", ""); compress("margin", ""); compress2('border', 'border-width', 'border-style', 'border-color'); if (styles.border === 'medium none')
                delete styles.border;
        }
        return styles;
    }, serialize: function (styles, element_name) {
        var css = '', name, value; function serializeStyles(name) {
            var styleList, i, l, value; styleList = schema.styles[name]; if (styleList) {
                for (i = 0, l = styleList.length; i < l; i++) {
                    name = styleList[i]; value = styles[name]; if (value !== undef && value.length > 0)
                        css += (css.length > 0 ? ' ' : '') + name + ': ' + value + ';';
                } 
            } 
        }; if (element_name && schema && schema.styles) { serializeStyles('*'); serializeStyles(element_name); } else {
            for (name in styles) {
                value = styles[name]; if (value !== undef && value.length > 0)
                    css += (css.length > 0 ? ' ' : '') + name + ': ' + value + ';';
            } 
        }
        return css;
    } 
    };
}; (function (tinymce) {
    var mapCache = {}, makeMap = tinymce.makeMap, each = tinymce.each; function split(str, delim) { return str.split(delim || ','); }; function unpack(lookup, data) {
        var key, elements = {}; function replace(value) { return value.replace(/[A-Z]+/g, function (key) { return replace(lookup[key]); }); }; for (key in lookup) {
            if (lookup.hasOwnProperty(key))
                lookup[key] = replace(lookup[key]);
        }
        replace(data).replace(/#/g, '#text').replace(/(\w+)\[([^\]]+)\]\[([^\]]*)\]/g, function (str, name, attributes, children) { attributes = split(attributes, '|'); elements[name] = { attributes: makeMap(attributes), attributesOrder: attributes, children: makeMap(children, '|', { '#comment': {} })} }); return elements;
    }; function getHTML5() {
        var html5 = mapCache.html5; if (!html5) { html5 = mapCache.html5 = unpack({ A: 'id|accesskey|class|dir|draggable|item|hidden|itemprop|role|spellcheck|style|subject|title|onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup', B: '#|a|abbr|area|audio|b|bdo|br|button|canvas|cite|code|command|datalist|del|dfn|em|embed|i|iframe|img|input|ins|kbd|keygen|label|link|map|mark|meta|' + 'meter|noscript|object|output|progress|q|ruby|samp|script|select|small|span|strong|sub|sup|svg|textarea|time|var|video|wbr', C: '#|a|abbr|area|address|article|aside|audio|b|bdo|blockquote|br|button|canvas|cite|code|command|datalist|del|details|dfn|dialog|div|dl|em|embed|fieldset|' + 'figure|footer|form|h1|h2|h3|h4|h5|h6|header|hgroup|hr|i|iframe|img|input|ins|kbd|keygen|label|link|map|mark|menu|meta|meter|nav|noscript|ol|object|output|' + 'p|pre|progress|q|ruby|samp|script|section|select|small|span|strong|style|sub|sup|svg|table|textarea|time|ul|var|video' }, 'html[A|manifest][body|head]' + 'head[A][base|command|link|meta|noscript|script|style|title]' + 'title[A][#]' + 'base[A|href|target][]' + 'link[A|href|rel|media|type|sizes][]' + 'meta[A|http-equiv|name|content|charset][]' + 'style[A|type|media|scoped][#]' + 'script[A|charset|type|src|defer|async][#]' + 'noscript[A][C]' + 'body[A][C]' + 'section[A][C]' + 'nav[A][C]' + 'article[A][C]' + 'aside[A][C]' + 'h1[A][B]' + 'h2[A][B]' + 'h3[A][B]' + 'h4[A][B]' + 'h5[A][B]' + 'h6[A][B]' + 'hgroup[A][h1|h2|h3|h4|h5|h6]' + 'header[A][C]' + 'footer[A][C]' + 'address[A][C]' + 'p[A][B]' + 'br[A][]' + 'pre[A][B]' + 'dialog[A][dd|dt]' + 'blockquote[A|cite][C]' + 'ol[A|start|reversed][li]' + 'ul[A][li]' + 'li[A|value][C]' + 'dl[A][dd|dt]' + 'dt[A][B]' + 'dd[A][C]' + 'a[A|href|target|ping|rel|media|type][B]' + 'em[A][B]' + 'strong[A][B]' + 'small[A][B]' + 'cite[A][B]' + 'q[A|cite][B]' + 'dfn[A][B]' + 'abbr[A][B]' + 'code[A][B]' + 'var[A][B]' + 'samp[A][B]' + 'kbd[A][B]' + 'sub[A][B]' + 'sup[A][B]' + 'i[A][B]' + 'b[A][B]' + 'mark[A][B]' + 'progress[A|value|max][B]' + 'meter[A|value|min|max|low|high|optimum][B]' + 'time[A|datetime][B]' + 'ruby[A][B|rt|rp]' + 'rt[A][B]' + 'rp[A][B]' + 'bdo[A][B]' + 'span[A][B]' + 'ins[A|cite|datetime][B]' + 'del[A|cite|datetime][B]' + 'figure[A][C|legend|figcaption]' + 'figcaption[A][C]' + 'img[A|alt|src|height|width|usemap|ismap][]' + 'iframe[A|name|src|height|width|sandbox|seamless][]' + 'embed[A|src|height|width|type][]' + 'object[A|data|type|height|width|usemap|name|form|classid][param]' + 'param[A|name|value][]' + 'details[A|open][C|legend]' + 'command[A|type|label|icon|disabled|checked|radiogroup][]' + 'menu[A|type|label][C|li]' + 'legend[A][C|B]' + 'div[A][C]' + 'source[A|src|type|media][]' + 'audio[A|src|autobuffer|autoplay|loop|controls][source]' + 'video[A|src|autobuffer|autoplay|loop|controls|width|height|poster][source]' + 'hr[A][]' + 'form[A|accept-charset|action|autocomplete|enctype|method|name|novalidate|target][C]' + 'fieldset[A|disabled|form|name][C|legend]' + 'label[A|form|for][B]' + 'input[A|type|accept|alt|autocomplete|autofocus|checked|disabled|form|formaction|formenctype|formmethod|formnovalidate|formtarget|height|list|max|maxlength|min|' + 'multiple|pattern|placeholder|readonly|required|size|src|step|width|files|value|name][]' + 'button[A|autofocus|disabled|form|formaction|formenctype|formmethod|formnovalidate|formtarget|name|value|type][B]' + 'select[A|autofocus|disabled|form|multiple|name|size][option|optgroup]' + 'datalist[A][B|option]' + 'optgroup[A|disabled|label][option]' + 'option[A|disabled|selected|label|value][]' + 'textarea[A|autofocus|disabled|form|maxlength|name|placeholder|readonly|required|rows|cols|wrap][]' + 'keygen[A|autofocus|challenge|disabled|form|keytype|name][]' + 'output[A|for|form|name][B]' + 'canvas[A|width|height][]' + 'map[A|name][B|C]' + 'area[A|shape|coords|href|alt|target|media|rel|ping|type][]' + 'mathml[A][]' + 'svg[A][]' + 'table[A|border][caption|colgroup|thead|tfoot|tbody|tr]' + 'caption[A][C]' + 'colgroup[A|span][col]' + 'col[A|span][]' + 'thead[A][tr]' + 'tfoot[A][tr]' + 'tbody[A][tr]' + 'tr[A][th|td]' + 'th[A|headers|rowspan|colspan|scope][B]' + 'td[A|headers|rowspan|colspan][C]' + 'wbr[A][]'); }
        return html5;
    }; function getHTML4() {
        var html4 = mapCache.html4; if (!html4) { html4 = mapCache.html4 = unpack({ Z: 'H|K|N|O|P', Y: 'X|form|R|Q', ZG: 'E|span|width|align|char|charoff|valign', X: 'p|T|div|U|W|isindex|fieldset|table', ZF: 'E|align|char|charoff|valign', W: 'pre|hr|blockquote|address|center|noframes', ZE: 'abbr|axis|headers|scope|rowspan|colspan|align|char|charoff|valign|nowrap|bgcolor|width|height', ZD: '[E][S]', U: 'ul|ol|dl|menu|dir', ZC: 'p|Y|div|U|W|table|br|span|bdo|object|applet|img|map|K|N|Q', T: 'h1|h2|h3|h4|h5|h6', ZB: 'X|S|Q', S: 'R|P', ZA: 'a|G|J|M|O|P', R: 'a|H|K|N|O', Q: 'noscript|P', P: 'ins|del|script', O: 'input|select|textarea|label|button', N: 'M|L', M: 'em|strong|dfn|code|q|samp|kbd|var|cite|abbr|acronym', L: 'sub|sup', K: 'J|I', J: 'tt|i|b|u|s|strike', I: 'big|small|font|basefont', H: 'G|F', G: 'br|span|bdo', F: 'object|applet|img|map|iframe', E: 'A|B|C', D: 'accesskey|tabindex|onfocus|onblur', C: 'onclick|ondblclick|onmousedown|onmouseup|onmouseover|onmousemove|onmouseout|onkeypress|onkeydown|onkeyup', B: 'lang|xml:lang|dir', A: 'id|class|style|title' }, 'script[id|charset|type|language|src|defer|xml:space][]' + 'style[B|id|type|media|title|xml:space][]' + 'object[E|declare|classid|codebase|data|type|codetype|archive|standby|width|height|usemap|name|tabindex|align|border|hspace|vspace][#|param|Y]' + 'param[id|name|value|valuetype|type][]' + 'p[E|align][#|S]' + 'a[E|D|charset|type|name|href|hreflang|rel|rev|shape|coords|target][#|Z]' + 'br[A|clear][]' + 'span[E][#|S]' + 'bdo[A|C|B][#|S]' + 'applet[A|codebase|archive|code|object|alt|name|width|height|align|hspace|vspace][#|param|Y]' + 'h1[E|align][#|S]' + 'img[E|src|alt|name|longdesc|width|height|usemap|ismap|align|border|hspace|vspace][]' + 'map[B|C|A|name][X|form|Q|area]' + 'h2[E|align][#|S]' + 'iframe[A|longdesc|name|src|frameborder|marginwidth|marginheight|scrolling|align|width|height][#|Y]' + 'h3[E|align][#|S]' + 'tt[E][#|S]' + 'i[E][#|S]' + 'b[E][#|S]' + 'u[E][#|S]' + 's[E][#|S]' + 'strike[E][#|S]' + 'big[E][#|S]' + 'small[E][#|S]' + 'font[A|B|size|color|face][#|S]' + 'basefont[id|size|color|face][]' + 'em[E][#|S]' + 'strong[E][#|S]' + 'dfn[E][#|S]' + 'code[E][#|S]' + 'q[E|cite][#|S]' + 'samp[E][#|S]' + 'kbd[E][#|S]' + 'var[E][#|S]' + 'cite[E][#|S]' + 'abbr[E][#|S]' + 'acronym[E][#|S]' + 'sub[E][#|S]' + 'sup[E][#|S]' + 'input[E|D|type|name|value|checked|disabled|readonly|size|maxlength|src|alt|usemap|onselect|onchange|accept|align][]' + 'select[E|name|size|multiple|disabled|tabindex|onfocus|onblur|onchange][optgroup|option]' + 'optgroup[E|disabled|label][option]' + 'option[E|selected|disabled|label|value][]' + 'textarea[E|D|name|rows|cols|disabled|readonly|onselect|onchange][]' + 'label[E|for|accesskey|onfocus|onblur][#|S]' + 'button[E|D|name|value|type|disabled][#|p|T|div|U|W|table|G|object|applet|img|map|K|N|Q]' + 'h4[E|align][#|S]' + 'ins[E|cite|datetime][#|Y]' + 'h5[E|align][#|S]' + 'del[E|cite|datetime][#|Y]' + 'h6[E|align][#|S]' + 'div[E|align][#|Y]' + 'ul[E|type|compact][li]' + 'li[E|type|value][#|Y]' + 'ol[E|type|compact|start][li]' + 'dl[E|compact][dt|dd]' + 'dt[E][#|S]' + 'dd[E][#|Y]' + 'menu[E|compact][li]' + 'dir[E|compact][li]' + 'pre[E|width|xml:space][#|ZA]' + 'hr[E|align|noshade|size|width][]' + 'blockquote[E|cite][#|Y]' + 'address[E][#|S|p]' + 'center[E][#|Y]' + 'noframes[E][#|Y]' + 'isindex[A|B|prompt][]' + 'fieldset[E][#|legend|Y]' + 'legend[E|accesskey|align][#|S]' + 'table[E|summary|width|border|frame|rules|cellspacing|cellpadding|align|bgcolor][caption|col|colgroup|thead|tfoot|tbody|tr]' + 'caption[E|align][#|S]' + 'col[ZG][]' + 'colgroup[ZG][col]' + 'thead[ZF][tr]' + 'tr[ZF|bgcolor][th|td]' + 'th[E|ZE][#|Y]' + 'form[E|action|method|name|enctype|onsubmit|onreset|accept|accept-charset|target][#|X|R|Q]' + 'noscript[E][#|Y]' + 'td[E|ZE][#|Y]' + 'tfoot[ZF][tr]' + 'tbody[ZF][tr]' + 'area[E|D|shape|coords|href|nohref|alt|target][]' + 'base[id|href|target][]' + 'body[E|onload|onunload|background|bgcolor|text|link|vlink|alink][#|Y]'); }
        return html4;
    }; tinymce.html.Schema = function (settings) {
        var self = this, elements = {}, children = {}, patternElements = [], validStyles, schemaItems; var whiteSpaceElementsMap, selfClosingElementsMap, shortEndedElementsMap, boolAttrMap, blockElementsMap, nonEmptyElementsMap, customElementsMap = {}; function createLookupTable(option, default_value, extend) {
            var value = settings[option]; if (!value) { value = mapCache[option]; if (!value) { value = makeMap(default_value, ' ', makeMap(default_value.toUpperCase(), ' ')); value = tinymce.extend(value, extend); mapCache[option] = value; } } else { value = makeMap(value, ',', makeMap(value.toUpperCase(), ' ')); }
            return value;
        }; settings = settings || {}; schemaItems = settings.schema == "html5" ? getHTML5() : getHTML4(); if (settings.verify_html === false)
            settings.valid_elements = '*[*]'; if (settings.valid_styles) { validStyles = {}; each(settings.valid_styles, function (value, key) { validStyles[key] = tinymce.explode(value); }); }
        whiteSpaceElementsMap = createLookupTable('whitespace_elements', 'pre script noscript style textarea'); selfClosingElementsMap = createLookupTable('self_closing_elements', 'colgroup dd dt li option p td tfoot th thead tr'); shortEndedElementsMap = createLookupTable('short_ended_elements', 'area base basefont br col frame hr img input isindex link meta param embed source wbr'); boolAttrMap = createLookupTable('boolean_attributes', 'checked compact declare defer disabled ismap multiple nohref noresize noshade nowrap readonly selected autoplay loop controls'); nonEmptyElementsMap = createLookupTable('non_empty_elements', 'td th iframe video audio object script', shortEndedElementsMap); textBlockElementsMap = createLookupTable('text_block_elements', 'h1 h2 h3 h4 h5 h6 p div address pre form ' + 'blockquote center dir fieldset header footer article section hgroup aside nav figure'); blockElementsMap = createLookupTable('block_elements', 'hr table tbody thead tfoot ' + 'th tr td li ol ul caption dl dt dd noscript menu isindex samp option datalist select optgroup', textBlockElementsMap); function patternToRegExp(str) { return new RegExp('^' + str.replace(/([?+*])/g, '.$1') + '$'); }; function addValidElements(valid_elements) {
            var ei, el, ai, al, yl, matches, element, attr, attrData, elementName, attrName, attrType, attributes, attributesOrder, prefix, outputName, globalAttributes, globalAttributesOrder, transElement, key, childKey, value, elementRuleRegExp = /^([#+\-])?([^\[\/]+)(?:\/([^\[]+))?(?:\[([^\]]+)\])?$/, attrRuleRegExp = /^([!\-])?(\w+::\w+|[^=:<]+)?(?:([=:<])(.*))?$/, hasPatternsRegExp = /[*?+]/; if (valid_elements) {
                valid_elements = split(valid_elements); if (elements['@']) { globalAttributes = elements['@'].attributes; globalAttributesOrder = elements['@'].attributesOrder; }
                for (ei = 0, el = valid_elements.length; ei < el; ei++) {
                    matches = elementRuleRegExp.exec(valid_elements[ei]); if (matches) {
                        prefix = matches[1]; elementName = matches[2]; outputName = matches[3]; attrData = matches[4]; attributes = {}; attributesOrder = []; element = { attributes: attributes, attributesOrder: attributesOrder }; if (prefix === '#')
                            element.paddEmpty = true; if (prefix === '-')
                            element.removeEmpty = true; if (globalAttributes) {
                            for (key in globalAttributes)
                                attributes[key] = globalAttributes[key]; attributesOrder.push.apply(attributesOrder, globalAttributesOrder);
                        }
                        if (attrData) {
                            attrData = split(attrData, '|'); for (ai = 0, al = attrData.length; ai < al; ai++) {
                                matches = attrRuleRegExp.exec(attrData[ai]); if (matches) {
                                    attr = {}; attrType = matches[1]; attrName = matches[2].replace(/::/g, ':'); prefix = matches[3]; value = matches[4]; if (attrType === '!') { element.attributesRequired = element.attributesRequired || []; element.attributesRequired.push(attrName); attr.required = true; }
                                    if (attrType === '-') { delete attributes[attrName]; attributesOrder.splice(tinymce.inArray(attributesOrder, attrName), 1); continue; }
                                    if (prefix) {
                                        if (prefix === '=') { element.attributesDefault = element.attributesDefault || []; element.attributesDefault.push({ name: attrName, value: value }); attr.defaultValue = value; }
                                        if (prefix === ':') { element.attributesForced = element.attributesForced || []; element.attributesForced.push({ name: attrName, value: value }); attr.forcedValue = value; }
                                        if (prefix === '<')
                                            attr.validValues = makeMap(value, '?');
                                    }
                                    if (hasPatternsRegExp.test(attrName)) { element.attributePatterns = element.attributePatterns || []; attr.pattern = patternToRegExp(attrName); element.attributePatterns.push(attr); } else {
                                        if (!attributes[attrName])
                                            attributesOrder.push(attrName); attributes[attrName] = attr;
                                    } 
                                } 
                            } 
                        }
                        if (!globalAttributes && elementName == '@') { globalAttributes = attributes; globalAttributesOrder = attributesOrder; }
                        if (outputName) { element.outputName = elementName; elements[outputName] = element; }
                        if (hasPatternsRegExp.test(elementName)) { element.pattern = patternToRegExp(elementName); patternElements.push(element); } else
                            elements[elementName] = element;
                    } 
                } 
            } 
        }; function setValidElements(valid_elements) { elements = {}; patternElements = []; addValidElements(valid_elements); each(schemaItems, function (element, name) { children[name] = element.children; }); }; function addCustomElements(custom_elements) {
            var customElementRegExp = /^(~)?(.+)$/; if (custom_elements) {
                each(split(custom_elements), function (rule) {
                    var matches = customElementRegExp.exec(rule), inline = matches[1] === '~', cloneName = inline ? 'span' : 'div', name = matches[2]; children[name] = children[cloneName]; customElementsMap[name] = cloneName; if (!inline) { blockElementsMap[name.toUpperCase()] = {}; blockElementsMap[name] = {}; }
                    if (!elements[name]) { elements[name] = elements[cloneName]; }
                    each(children, function (element, child) {
                        if (element[cloneName])
                            element[name] = element[cloneName];
                    });
                });
            } 
        }; function addValidChildren(valid_children) {
            var childRuleRegExp = /^([+\-]?)(\w+)\[([^\]]+)\]$/; if (valid_children) {
                each(split(valid_children), function (rule) {
                    var matches = childRuleRegExp.exec(rule), parent, prefix; if (matches) {
                        prefix = matches[1]; if (prefix)
                            parent = children[matches[2]]; else
                            parent = children[matches[2]] = { '#comment': {} }; parent = children[matches[2]]; each(split(matches[3], '|'), function (child) {
                                if (prefix === '-')
                                    delete parent[child]; else
                                    parent[child] = {};
                            });
                    } 
                });
            } 
        }; function getElementRule(name) {
            var element = elements[name], i; if (element)
                return element; i = patternElements.length; while (i--) {
                element = patternElements[i]; if (element.pattern.test(name))
                    return element;
            } 
        }; if (!settings.valid_elements) {
            each(schemaItems, function (element, name) { elements[name] = { attributes: element.attributes, attributesOrder: element.attributesOrder }; children[name] = element.children; }); if (settings.schema != "html5") { each(split('strong/b,em/i'), function (item) { item = split(item, '/'); elements[item[1]].outputName = item[0]; }); }
            elements.img.attributesDefault = [{ name: 'alt', value: ''}]; each(split('ol,ul,sub,sup,blockquote,span,font,a,table,tbody,tr,strong,em,b,i'), function (name) { if (elements[name]) { elements[name].removeEmpty = true; } }); each(split('p,h1,h2,h3,h4,h5,h6,th,td,pre,div,address,caption'), function (name) { elements[name].paddEmpty = true; });
        } else
            setValidElements(settings.valid_elements); addCustomElements(settings.custom_elements); addValidChildren(settings.valid_children); addValidElements(settings.extended_valid_elements); addValidChildren('+ol[ul|ol],+ul[ul|ol]'); if (settings.invalid_elements) {
            tinymce.each(tinymce.explode(settings.invalid_elements), function (item) {
                if (elements[item])
                    delete elements[item];
            });
        }
        if (!getElementRule('span'))
            addValidElements('span[!data-mce-type|*]'); self.children = children; self.styles = validStyles; self.getBoolAttrs = function () { return boolAttrMap; }; self.getBlockElements = function () { return blockElementsMap; }; self.getTextBlockElements = function () { return textBlockElementsMap; }; self.getShortEndedElements = function () { return shortEndedElementsMap; }; self.getSelfClosingElements = function () { return selfClosingElementsMap; }; self.getNonEmptyElements = function () { return nonEmptyElementsMap; }; self.getWhiteSpaceElements = function () { return whiteSpaceElementsMap; }; self.isValidChild = function (name, child) { var parent = children[name]; return !!(parent && parent[child]); }; self.isValid = function (name, attr) {
                var attrPatterns, i, rule = getElementRule(name); if (rule) {
                    if (attr) {
                        if (rule.attributes[attr]) { return true; }
                        attrPatterns = rule.attributePatterns; if (attrPatterns) { i = attrPatterns.length; while (i--) { if (attrPatterns[i].pattern.test(name)) { return true; } } } 
                    } else { return true; } 
                }
                return false;
            }; self.getElementRule = getElementRule; self.getCustomElements = function () { return customElementsMap; }; self.addValidElements = addValidElements; self.setValidElements = setValidElements; self.addCustomElements = addCustomElements; self.addValidChildren = addValidChildren; self.elements = elements;
    };
})(tinymce); (function (tinymce) {
    tinymce.html.SaxParser = function (settings, schema) {
        var self = this, noop = function () { }; settings = settings || {}; self.schema = schema = schema || new tinymce.html.Schema(); if (settings.fix_self_closing !== false)
            settings.fix_self_closing = true; tinymce.each('comment cdata text start end pi doctype'.split(' '), function (name) {
                if (name)
                    self[name] = settings[name] || noop;
            }); self.parse = function (html) {
                var self = this, matches, index = 0, value, endRegExp, stack = [], attrList, i, text, name, isInternalElement, removeInternalElements, shortEndedElements, fillAttrsMap, isShortEnded, validate, elementRule, isValidElement, attr, attribsValue, invalidPrefixRegExp, validAttributesMap, validAttributePatterns, attributesRequired, attributesDefault, attributesForced, selfClosing, tokenRegExp, attrRegExp, specialElements, attrValue, idCount = 0, decode = tinymce.html.Entities.decode, fixSelfClosing, isIE; function processEndTag(name) {
                    var pos, i; pos = stack.length; while (pos--) {
                        if (stack[pos].name === name)
                            break;
                    }
                    if (pos >= 0) {
                        for (i = stack.length - 1; i >= pos; i--) {
                            name = stack[i]; if (name.valid)
                                self.end(name.name);
                        }
                        stack.length = pos;
                    } 
                }; function parseAttribute(match, name, value, val2, val3) {
                    var attrRule, i; name = name.toLowerCase(); value = name in fillAttrsMap ? name : decode(value || val2 || val3 || ''); if (validate && !isInternalElement && name.indexOf('data-') !== 0) {
                        attrRule = validAttributesMap[name]; if (!attrRule && validAttributePatterns) {
                            i = validAttributePatterns.length; while (i--) {
                                attrRule = validAttributePatterns[i]; if (attrRule.pattern.test(name))
                                    break;
                            }
                            if (i === -1)
                                attrRule = null;
                        }
                        if (!attrRule)
                            return; if (attrRule.validValues && !(value in attrRule.validValues))
                            return;
                    }
                    attrList.map[name] = value; attrList.push({ name: name, value: value });
                }; tokenRegExp = new RegExp('<(?:' + '(?:!--([\\w\\W]*?)-->)|' + '(?:!\\[CDATA\\[([\\w\\W]*?)\\]\\]>)|' + '(?:!DOCTYPE([\\w\\W]*?)>)|' + '(?:\\?([^\\s\\/<>]+) ?([\\w\\W]*?)[?/]>)|' + '(?:\\/([^>]+)>)|' + '(?:([A-Za-z0-9\\-\\:\\.]+)((?:\\s+[^"\'>]+(?:(?:"[^"]*")|(?:\'[^\']*\')|[^>]*))*|\\/|\\s+)>)' + ')', 'g'); attrRegExp = /([\w:\-]+)(?:\s*=\s*(?:(?:\"((?:[^\"])*)\")|(?:\'((?:[^\'])*)\')|([^>\s]+)))?/g; specialElements = { 'script': /<\/script[^>]*>/gi, 'style': /<\/style[^>]*>/gi, 'noscript': /<\/noscript[^>]*>/gi }; shortEndedElements = schema.getShortEndedElements(); selfClosing = settings.self_closing_elements || schema.getSelfClosingElements(); fillAttrsMap = schema.getBoolAttrs(); validate = settings.validate; removeInternalElements = settings.remove_internals; fixSelfClosing = settings.fix_self_closing; isIE = tinymce.isIE; invalidPrefixRegExp = /^:/; while (matches = tokenRegExp.exec(html)) {
                    if (index < matches.index)
                        self.text(decode(html.substr(index, matches.index - index))); if (value = matches[6]) {
                        value = value.toLowerCase(); if (isIE && invalidPrefixRegExp.test(value))
                            value = value.substr(1); processEndTag(value);
                    } else if (value = matches[7]) {
                        value = value.toLowerCase(); if (isIE && invalidPrefixRegExp.test(value))
                            value = value.substr(1); isShortEnded = value in shortEndedElements; if (fixSelfClosing && selfClosing[value] && stack.length > 0 && stack[stack.length - 1].name === value)
                            processEndTag(value); if (!validate || (elementRule = schema.getElementRule(value))) {
                            isValidElement = true; if (validate) { validAttributesMap = elementRule.attributes; validAttributePatterns = elementRule.attributePatterns; }
                            if (attribsValue = matches[8]) {
                                isInternalElement = attribsValue.indexOf('data-mce-type') !== -1; if (isInternalElement && removeInternalElements)
                                    isValidElement = false; attrList = []; attrList.map = {}; attribsValue.replace(attrRegExp, parseAttribute);
                            } else { attrList = []; attrList.map = {}; }
                            if (validate && !isInternalElement) {
                                attributesRequired = elementRule.attributesRequired; attributesDefault = elementRule.attributesDefault; attributesForced = elementRule.attributesForced; if (attributesForced) {
                                    i = attributesForced.length; while (i--) {
                                        attr = attributesForced[i]; name = attr.name; attrValue = attr.value; if (attrValue === '{$uid}')
                                            attrValue = 'mce_' + idCount++; attrList.map[name] = attrValue; attrList.push({ name: name, value: attrValue });
                                    } 
                                }
                                if (attributesDefault) {
                                    i = attributesDefault.length; while (i--) {
                                        attr = attributesDefault[i]; name = attr.name; if (!(name in attrList.map)) {
                                            attrValue = attr.value; if (attrValue === '{$uid}')
                                                attrValue = 'mce_' + idCount++; attrList.map[name] = attrValue; attrList.push({ name: name, value: attrValue });
                                        } 
                                    } 
                                }
                                if (attributesRequired) {
                                    i = attributesRequired.length; while (i--) {
                                        if (attributesRequired[i] in attrList.map)
                                            break;
                                    }
                                    if (i === -1)
                                        isValidElement = false;
                                }
                                if (attrList.map['data-mce-bogus'])
                                    isValidElement = false;
                            }
                            if (isValidElement)
                                self.start(value, attrList, isShortEnded);
                        } else
                            isValidElement = false; if (endRegExp = specialElements[value]) {
                            endRegExp.lastIndex = index = matches.index + matches[0].length; if (matches = endRegExp.exec(html)) {
                                if (isValidElement)
                                    text = html.substr(index, matches.index - index); index = matches.index + matches[0].length;
                            } else { text = html.substr(index); index = html.length; }
                            if (isValidElement && text.length > 0)
                                self.text(text, true); if (isValidElement)
                                self.end(value); tokenRegExp.lastIndex = index; continue;
                        }
                        if (!isShortEnded) {
                            if (!attribsValue || attribsValue.indexOf('/') != attribsValue.length - 1)
                                stack.push({ name: value, valid: isValidElement }); else if (isValidElement)
                                self.end(value);
                        } 
                    } else if (value = matches[1]) { self.comment(value); } else if (value = matches[2]) { self.cdata(value); } else if (value = matches[3]) { self.doctype(value); } else if (value = matches[4]) { self.pi(value, matches[5]); }
                    index = matches.index + matches[0].length;
                }
                if (index < html.length)
                    self.text(decode(html.substr(index))); for (i = stack.length - 1; i >= 0; i--) {
                    value = stack[i]; if (value.valid)
                        self.end(value.name);
                } 
            };
    } 
})(tinymce); (function (tinymce) {
    var whiteSpaceRegExp = /^[ \t\r\n]*$/, typeLookup = { '#text': 3, '#comment': 8, '#cdata': 4, '#pi': 7, '#doctype': 10, '#document-fragment': 11 }; function walk(node, root_node, prev) {
        var sibling, parent, startName = prev ? 'lastChild' : 'firstChild', siblingName = prev ? 'prev' : 'next'; if (node[startName])
            return node[startName]; if (node !== root_node) {
            sibling = node[siblingName]; if (sibling)
                return sibling; for (parent = node.parent; parent && parent !== root_node; parent = parent.parent) {
                sibling = parent[siblingName]; if (sibling)
                    return sibling;
            } 
        } 
    }; function Node(name, type) { this.name = name; this.type = type; if (type === 1) { this.attributes = []; this.attributes.map = {}; } }
    tinymce.extend(Node.prototype, { replace: function (node) {
        var self = this; if (node.parent)
            node.remove(); self.insert(node, self); self.remove(); return self;
    }, attr: function (name, value) {
        var self = this, attrs, i, undef; if (typeof name !== "string") {
            for (i in name)
                self.attr(i, name[i]); return self;
        }
        if (attrs = self.attributes) {
            if (value !== undef) {
                if (value === null) {
                    if (name in attrs.map) { delete attrs.map[name]; i = attrs.length; while (i--) { if (attrs[i].name === name) { attrs = attrs.splice(i, 1); return self; } } }
                    return self;
                }
                if (name in attrs.map) { i = attrs.length; while (i--) { if (attrs[i].name === name) { attrs[i].value = value; break; } } } else
                    attrs.push({ name: name, value: value }); attrs.map[name] = value; return self;
            } else { return attrs.map[name]; } 
        } 
    }, clone: function () {
        var self = this, clone = new Node(self.name, self.type), i, l, selfAttrs, selfAttr, cloneAttrs; if (selfAttrs = self.attributes) {
            cloneAttrs = []; cloneAttrs.map = {}; for (i = 0, l = selfAttrs.length; i < l; i++) { selfAttr = selfAttrs[i]; if (selfAttr.name !== 'id') { cloneAttrs[cloneAttrs.length] = { name: selfAttr.name, value: selfAttr.value }; cloneAttrs.map[selfAttr.name] = selfAttr.value; } }
            clone.attributes = cloneAttrs;
        }
        clone.value = self.value; clone.shortEnded = self.shortEnded; return clone;
    }, wrap: function (wrapper) { var self = this; self.parent.insert(wrapper, self); wrapper.append(self); return self; }, unwrap: function () {
        var self = this, node, next; for (node = self.firstChild; node; ) { next = node.next; self.insert(node, self, true); node = next; }
        self.remove();
    }, remove: function () {
        var self = this, parent = self.parent, next = self.next, prev = self.prev; if (parent) {
            if (parent.firstChild === self) {
                parent.firstChild = next; if (next)
                    next.prev = null;
            } else { prev.next = next; }
            if (parent.lastChild === self) {
                parent.lastChild = prev; if (prev)
                    prev.next = null;
            } else { next.prev = prev; }
            self.parent = self.next = self.prev = null;
        }
        return self;
    }, append: function (node) {
        var self = this, last; if (node.parent)
            node.remove(); last = self.lastChild; if (last) { last.next = node; node.prev = last; self.lastChild = node; } else
            self.lastChild = self.firstChild = node; node.parent = self; return node;
    }, insert: function (node, ref_node, before) {
        var parent; if (node.parent)
            node.remove(); parent = ref_node.parent || this; if (before) {
            if (ref_node === parent.firstChild)
                parent.firstChild = node; else
                ref_node.prev.next = node; node.prev = ref_node.prev; node.next = ref_node; ref_node.prev = node;
        } else {
            if (ref_node === parent.lastChild)
                parent.lastChild = node; else
                ref_node.next.prev = node; node.next = ref_node.next; node.prev = ref_node; ref_node.next = node;
        }
        node.parent = parent; return node;
    }, getAll: function (name) {
        var self = this, node, collection = []; for (node = self.firstChild; node; node = walk(node, self)) {
            if (node.name === name)
                collection.push(node);
        }
        return collection;
    }, empty: function () {
        var self = this, nodes, i, node; if (self.firstChild) {
            nodes = []; for (node = self.firstChild; node; node = walk(node, self))
                nodes.push(node); i = nodes.length; while (i--) { node = nodes[i]; node.parent = node.firstChild = node.lastChild = node.next = node.prev = null; } 
        }
        self.firstChild = self.lastChild = null; return self;
    }, isEmpty: function (elements) {
        var self = this, node = self.firstChild, i, name; if (node) {
            do {
                if (node.type === 1) {
                    if (node.attributes.map['data-mce-bogus'])
                        continue; if (elements[node.name])
                        return false; i = node.attributes.length; while (i--) {
                        name = node.attributes[i].name; if (name === "name" || name.indexOf('data-mce-') === 0)
                            return false;
                    } 
                }
                if (node.type === 8)
                    return false; if ((node.type === 3 && !whiteSpaceRegExp.test(node.value)))
                    return false;
            } while (node = walk(node, self));
        }
        return true;
    }, walk: function (prev) { return walk(this, null, prev); } 
    }); tinymce.extend(Node, { create: function (name, attrs) {
        var node, attrName; node = new Node(name, typeLookup[name] || 1); if (attrs) {
            for (attrName in attrs)
                node.attr(attrName, attrs[attrName]);
        }
        return node;
    } 
    }); tinymce.html.Node = Node;
})(tinymce); (function (tinymce) {
    var Node = tinymce.html.Node; tinymce.html.DomParser = function (settings, schema) {
        var self = this, nodeFilters = {}, attributeFilters = [], matchedNodes = {}, matchedAttributes = {}; settings = settings || {}; settings.validate = "validate" in settings ? settings.validate : true; settings.root_name = settings.root_name || 'body'; self.schema = schema = schema || new tinymce.html.Schema(); function fixInvalidChildren(nodes) {
            var ni, node, parent, parents, newParent, currentNode, tempNode, childNode, i, childClone, nonEmptyElements, nonSplitableElements, textBlockElements, sibling, nextNode; nonSplitableElements = tinymce.makeMap('tr,td,th,tbody,thead,tfoot,table'); nonEmptyElements = schema.getNonEmptyElements(); textBlockElements = schema.getTextBlockElements(); for (ni = 0; ni < nodes.length; ni++) {
                node = nodes[ni]; if (!node.parent || node.fixed)
                    continue; if (textBlockElements[node.name] && node.parent.name == 'li') {
                    sibling = node.next; while (sibling) {
                        if (textBlockElements[sibling.name]) { sibling.name = 'li'; sibling.fixed = true; node.parent.insert(sibling, node.parent); } else { break; }
                        sibling = sibling.next;
                    }
                    node.unwrap(node); continue;
                }
                parents = [node]; for (parent = node.parent; parent && !schema.isValidChild(parent.name, node.name) && !nonSplitableElements[parent.name]; parent = parent.parent)
                    parents.push(parent); if (parent && parents.length > 1) {
                    parents.reverse(); newParent = currentNode = self.filterNode(parents[0].clone()); for (i = 0; i < parents.length - 1; i++) {
                        if (schema.isValidChild(currentNode.name, parents[i].name)) { tempNode = self.filterNode(parents[i].clone()); currentNode.append(tempNode); } else
                            tempNode = currentNode; for (childNode = parents[i].firstChild; childNode && childNode != parents[i + 1]; ) { nextNode = childNode.next; tempNode.append(childNode); childNode = nextNode; }
                        currentNode = tempNode;
                    }
                    if (!newParent.isEmpty(nonEmptyElements)) { parent.insert(newParent, parents[0], true); parent.insert(node, newParent); } else { parent.insert(node, parents[0], true); }
                    parent = parents[0]; if (parent.isEmpty(nonEmptyElements) || parent.firstChild === parent.lastChild && parent.firstChild.name === 'br') { parent.empty().remove(); } 
                } else if (node.parent) {
                    if (node.name === 'li') {
                        sibling = node.prev; if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) { sibling.append(node); continue; }
                        sibling = node.next; if (sibling && (sibling.name === 'ul' || sibling.name === 'ul')) { sibling.insert(node, sibling.firstChild, true); continue; }
                        node.wrap(self.filterNode(new Node('ul', 1))); continue;
                    }
                    if (schema.isValidChild(node.parent.name, 'div') && schema.isValidChild('div', node.name)) { node.wrap(self.filterNode(new Node('div', 1))); } else {
                        if (node.name === 'style' || node.name === 'script')
                            node.empty().remove(); else
                            node.unwrap();
                    } 
                } 
            } 
        }; self.filterNode = function (node) {
            var i, name, list; if (name in nodeFilters) {
                list = matchedNodes[name]; if (list)
                    list.push(node); else
                    matchedNodes[name] = [node];
            }
            i = attributeFilters.length; while (i--) {
                name = attributeFilters[i].name; if (name in node.attributes.map) {
                    list = matchedAttributes[name]; if (list)
                        list.push(node); else
                        matchedAttributes[name] = [node];
                } 
            }
            return node;
        }; self.addNodeFilter = function (name, callback) {
            tinymce.each(tinymce.explode(name), function (name) {
                var list = nodeFilters[name]; if (!list)
                    nodeFilters[name] = list = []; list.push(callback);
            });
        }; self.addAttributeFilter = function (name, callback) {
            tinymce.each(tinymce.explode(name), function (name) {
                var i; for (i = 0; i < attributeFilters.length; i++) { if (attributeFilters[i].name === name) { attributeFilters[i].callbacks.push(callback); return; } }
                attributeFilters.push({ name: name, callbacks: [callback] });
            });
        }; self.parse = function (html, args) {
            var parser, rootNode, node, nodes, i, l, fi, fl, list, name, validate, blockElements, startWhiteSpaceRegExp, invalidChildren = [], isInWhiteSpacePreservedElement, endWhiteSpaceRegExp, allWhiteSpaceRegExp, isAllWhiteSpaceRegExp, whiteSpaceElements, children, nonEmptyElements, rootBlockName; args = args || {}; matchedNodes = {}; matchedAttributes = {}; blockElements = tinymce.extend(tinymce.makeMap('script,style,head,html,body,title,meta,param'), schema.getBlockElements()); nonEmptyElements = schema.getNonEmptyElements(); children = schema.children; validate = settings.validate; rootBlockName = "forced_root_block" in args ? args.forced_root_block : settings.forced_root_block; whiteSpaceElements = schema.getWhiteSpaceElements(); startWhiteSpaceRegExp = /^[ \t\r\n]+/; endWhiteSpaceRegExp = /[ \t\r\n]+$/; allWhiteSpaceRegExp = /[ \t\r\n]+/g; isAllWhiteSpaceRegExp = /^[ \t\r\n]+$/; function addRootBlocks() {
                var node = rootNode.firstChild, next, rootBlockNode; while (node) {
                    next = node.next; if (node.type == 3 || (node.type == 1 && node.name !== 'p' && !blockElements[node.name] && !node.attr('data-mce-type'))) {
                        if (!rootBlockNode) { rootBlockNode = createNode(rootBlockName, 1); rootNode.insert(rootBlockNode, node); rootBlockNode.append(node); } else
                            rootBlockNode.append(node);
                    } else { rootBlockNode = null; }
                    node = next;
                };
            }; function createNode(name, type) {
                var node = new Node(name, type), list; if (name in nodeFilters) {
                    list = matchedNodes[name]; if (list)
                        list.push(node); else
                        matchedNodes[name] = [node];
                }
                return node;
            }; function removeWhitespaceBefore(node) { var textNode, textVal, sibling; for (textNode = node.prev; textNode && textNode.type === 3; ) { textVal = textNode.value.replace(endWhiteSpaceRegExp, ''); if (textVal.length > 0) { textNode.value = textVal; textNode = textNode.prev; } else { sibling = textNode.prev; textNode.remove(); textNode = sibling; } } }; function cloneAndExcludeBlocks(input) {
                var name, output = {}; for (name in input) { if (name !== 'li' && name != 'p') { output[name] = input[name]; } }
                return output;
            }; parser = new tinymce.html.SaxParser({ validate: validate, self_closing_elements: cloneAndExcludeBlocks(schema.getSelfClosingElements()), cdata: function (text) { node.append(createNode('#cdata', 4)).value = text; }, text: function (text, raw) {
                var textNode; if (!isInWhiteSpacePreservedElement) {
                    text = text.replace(allWhiteSpaceRegExp, ' '); if (node.lastChild && blockElements[node.lastChild.name])
                        text = text.replace(startWhiteSpaceRegExp, '');
                }
                if (text.length !== 0) { textNode = createNode('#text', 3); textNode.raw = !!raw; node.append(textNode).value = text; } 
            }, comment: function (text) { node.append(createNode('#comment', 8)).value = text; }, pi: function (name, text) { node.append(createNode(name, 7)).value = text; removeWhitespaceBefore(node); }, doctype: function (text) { var newNode; newNode = node.append(createNode('#doctype', 10)); newNode.value = text; removeWhitespaceBefore(node); }, start: function (name, attrs, empty) {
                var newNode, attrFiltersLen, elementRule, textNode, attrName, text, sibling, parent; elementRule = validate ? schema.getElementRule(name) : {}; if (elementRule) {
                    newNode = createNode(elementRule.outputName || name, 1); newNode.attributes = attrs; newNode.shortEnded = empty; node.append(newNode); parent = children[node.name]; if (parent && children[newNode.name] && !parent[newNode.name])
                        invalidChildren.push(newNode); attrFiltersLen = attributeFilters.length; while (attrFiltersLen--) {
                        attrName = attributeFilters[attrFiltersLen].name; if (attrName in attrs.map) {
                            list = matchedAttributes[attrName]; if (list)
                                list.push(newNode); else
                                matchedAttributes[attrName] = [newNode];
                        } 
                    }
                    if (blockElements[name])
                        removeWhitespaceBefore(newNode); if (!empty)
                        node = newNode; if (!isInWhiteSpacePreservedElement && whiteSpaceElements[name]) { isInWhiteSpacePreservedElement = true; } 
                } 
            }, end: function (name) {
                var textNode, elementRule, text, sibling, tempNode; elementRule = validate ? schema.getElementRule(name) : {}; if (elementRule) {
                    if (blockElements[name]) {
                        if (!isInWhiteSpacePreservedElement) {
                            textNode = node.firstChild; if (textNode && textNode.type === 3) {
                                text = textNode.value.replace(startWhiteSpaceRegExp, ''); if (text.length > 0) { textNode.value = text; textNode = textNode.next; } else { sibling = textNode.next; textNode.remove(); textNode = sibling; }
                                while (textNode && textNode.type === 3) {
                                    text = textNode.value; sibling = textNode.next; if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) { textNode.remove(); textNode = sibling; }
                                    textNode = sibling;
                                } 
                            }
                            textNode = node.lastChild; if (textNode && textNode.type === 3) {
                                text = textNode.value.replace(endWhiteSpaceRegExp, ''); if (text.length > 0) { textNode.value = text; textNode = textNode.prev; } else { sibling = textNode.prev; textNode.remove(); textNode = sibling; }
                                while (textNode && textNode.type === 3) {
                                    text = textNode.value; sibling = textNode.prev; if (text.length === 0 || isAllWhiteSpaceRegExp.test(text)) { textNode.remove(); textNode = sibling; }
                                    textNode = sibling;
                                } 
                            } 
                        } 
                    }
                    if (isInWhiteSpacePreservedElement && whiteSpaceElements[name]) { isInWhiteSpacePreservedElement = false; }
                    if (elementRule.removeEmpty || elementRule.paddEmpty) {
                        if (node.isEmpty(nonEmptyElements)) {
                            if (elementRule.paddEmpty)
                                node.empty().append(new Node('#text', '3')).value = '\u00a0'; else { if (!node.attributes.map.name && !node.attributes.map.id) { tempNode = node.parent; node.empty().remove(); node = tempNode; return; } } 
                        } 
                    }
                    node = node.parent;
                } 
            } 
            }, schema); rootNode = node = new Node(args.context || settings.root_name, 11); parser.parse(html); if (validate && invalidChildren.length) {
                if (!args.context)
                    fixInvalidChildren(invalidChildren); else
                    args.invalid = true;
            }
            if (rootBlockName && rootNode.name == 'body')
                addRootBlocks(); if (!args.invalid) {
                for (name in matchedNodes) {
                    list = nodeFilters[name]; nodes = matchedNodes[name]; fi = nodes.length; while (fi--) {
                        if (!nodes[fi].parent)
                            nodes.splice(fi, 1);
                    }
                    for (i = 0, l = list.length; i < l; i++)
                        list[i](nodes, name, args);
                }
                for (i = 0, l = attributeFilters.length; i < l; i++) {
                    list = attributeFilters[i]; if (list.name in matchedAttributes) {
                        nodes = matchedAttributes[list.name]; fi = nodes.length; while (fi--) {
                            if (!nodes[fi].parent)
                                nodes.splice(fi, 1);
                        }
                        for (fi = 0, fl = list.callbacks.length; fi < fl; fi++)
                            list.callbacks[fi](nodes, list.name, args);
                    } 
                } 
            }
            return rootNode;
        }; if (settings.remove_trailing_brs) {
            self.addNodeFilter('br', function (nodes, name) {
                var i, l = nodes.length, node, blockElements = tinymce.extend({}, schema.getBlockElements()), nonEmptyElements = schema.getNonEmptyElements(), parent, lastParent, prev, prevName; blockElements.body = 1; for (i = 0; i < l; i++) {
                    node = nodes[i]; parent = node.parent; if (blockElements[node.parent.name] && node === parent.lastChild) {
                        prev = node.prev; while (prev) {
                            prevName = prev.name; if (prevName !== "span" || prev.attr('data-mce-type') !== 'bookmark') {
                                if (prevName !== "br")
                                    break; if (prevName === 'br') { node = null; break; } 
                            }
                            prev = prev.prev;
                        }
                        if (node) {
                            node.remove(); if (parent.isEmpty(nonEmptyElements)) {
                                elementRule = schema.getElementRule(parent.name); if (elementRule) {
                                    if (elementRule.removeEmpty)
                                        parent.remove(); else if (elementRule.paddEmpty)
                                        parent.empty().append(new tinymce.html.Node('#text', 3)).value = '\u00a0';
                                } 
                            } 
                        } 
                    } else {
                        lastParent = node; while (parent.firstChild === lastParent && parent.lastChild === lastParent) {
                            lastParent = parent; if (blockElements[parent.name]) { break; }
                            parent = parent.parent;
                        }
                        if (lastParent === parent) { textNode = new tinymce.html.Node('#text', 3); textNode.value = '\u00a0'; node.replace(textNode); } 
                    } 
                } 
            });
        }
        if (!settings.allow_html_in_named_anchor) { self.addAttributeFilter('id,name', function (nodes, name) { var i = nodes.length, sibling, prevSibling, parent, node; while (i--) { node = nodes[i]; if (node.name === 'a' && node.firstChild && !node.attr('href')) { parent = node.parent; sibling = node.lastChild; do { prevSibling = sibling.prev; parent.insert(sibling, node); sibling = prevSibling; } while (sibling); } } }); } 
    } 
})(tinymce); tinymce.html.Writer = function (settings) {
    var html = [], indent, indentBefore, indentAfter, encode, htmlOutput; settings = settings || {}; indent = settings.indent; indentBefore = tinymce.makeMap(settings.indent_before || ''); indentAfter = tinymce.makeMap(settings.indent_after || ''); encode = tinymce.html.Entities.getEncodeFunc(settings.entity_encoding || 'raw', settings.entities); htmlOutput = settings.element_format == "html"; return { start: function (name, attrs, empty) {
        var i, l, attr, value; if (indent && indentBefore[name] && html.length > 0) {
            value = html[html.length - 1]; if (value.length > 0 && value !== '\n')
                html.push('\n');
        }
        html.push('<', name); if (attrs) { for (i = 0, l = attrs.length; i < l; i++) { attr = attrs[i]; html.push(' ', attr.name, '="', encode(attr.value, true), '"'); } }
        if (!empty || htmlOutput)
            html[html.length] = '>'; else
            html[html.length] = ' />'; if (empty && indent && indentAfter[name] && html.length > 0) {
            value = html[html.length - 1]; if (value.length > 0 && value !== '\n')
                html.push('\n');
        } 
    }, end: function (name) {
        var value; html.push('</', name, '>'); if (indent && indentAfter[name] && html.length > 0) {
            value = html[html.length - 1]; if (value.length > 0 && value !== '\n')
                html.push('\n');
        } 
    }, text: function (text, raw) {
        if (text.length > 0)
            html[html.length] = raw ? text : encode(text);
    }, cdata: function (text) { html.push('<![CDATA[', text, ']]>'); }, comment: function (text) { html.push('<!--', text, '-->'); }, pi: function (name, text) {
        if (text)
            html.push('<?', name, ' ', text, '?>'); else
            html.push('<?', name, '?>'); if (indent)
            html.push('\n');
    }, doctype: function (text) { html.push('<!DOCTYPE', text, '>', indent ? '\n' : ''); }, reset: function () { html.length = 0; }, getContent: function () { return html.join('').replace(/\n$/, ''); } 
    };
}; (function (tinymce) {
    tinymce.html.Serializer = function (settings, schema) {
        var self = this, writer = new tinymce.html.Writer(settings); settings = settings || {}; settings.validate = "validate" in settings ? settings.validate : true; self.schema = schema = schema || new tinymce.html.Schema(); self.writer = writer; self.serialize = function (node) {
            var handlers, validate; validate = settings.validate; handlers = { 3: function (node, raw) { writer.text(node.value, node.raw); }, 8: function (node) { writer.comment(node.value); }, 7: function (node) { writer.pi(node.name, node.value); }, 10: function (node) { writer.doctype(node.value); }, 4: function (node) { writer.cdata(node.value); }, 11: function (node) { if ((node = node.firstChild)) { do { walk(node); } while (node = node.next); } } }; writer.reset(); function walk(node) {
                var handler = handlers[node.type], name, isEmpty, attrs, attrName, attrValue, sortedAttrs, i, l, elementRule; if (!handler) {
                    name = node.name; isEmpty = node.shortEnded; attrs = node.attributes; if (validate && attrs && attrs.length > 1) {
                        sortedAttrs = []; sortedAttrs.map = {}; elementRule = schema.getElementRule(node.name); for (i = 0, l = elementRule.attributesOrder.length; i < l; i++) { attrName = elementRule.attributesOrder[i]; if (attrName in attrs.map) { attrValue = attrs.map[attrName]; sortedAttrs.map[attrName] = attrValue; sortedAttrs.push({ name: attrName, value: attrValue }); } }
                        for (i = 0, l = attrs.length; i < l; i++) { attrName = attrs[i].name; if (!(attrName in sortedAttrs.map)) { attrValue = attrs.map[attrName]; sortedAttrs.map[attrName] = attrValue; sortedAttrs.push({ name: attrName, value: attrValue }); } }
                        attrs = sortedAttrs;
                    }
                    writer.start(node.name, attrs, isEmpty); if (!isEmpty) {
                        if ((node = node.firstChild)) { do { walk(node); } while (node = node.next); }
                        writer.end(name);
                    } 
                } else
                    handler(node);
            }
            if (node.type == 1 && !settings.inner)
                walk(node); else
                handlers[11](node); return writer.getContent();
        };
    } 
})(tinymce); tinymce.dom = {}; (function (namespace, expando) {
    var w3cEventModel = !!document.addEventListener; function addEvent(target, name, callback, capture) { if (target.addEventListener) { target.addEventListener(name, callback, capture || false); } else if (target.attachEvent) { target.attachEvent('on' + name, callback); } }
    function removeEvent(target, name, callback, capture) { if (target.removeEventListener) { target.removeEventListener(name, callback, capture || false); } else if (target.detachEvent) { target.detachEvent('on' + name, callback); } }
    function fix(original_event, data) {
        var name, event = data || {}; function returnFalse() { return false; }
        function returnTrue() { return true; }
        for (name in original_event) { if (name !== "layerX" && name !== "layerY") { event[name] = original_event[name]; } }
        if (!event.target) { event.target = event.srcElement || document; }
        event.preventDefault = function () { event.isDefaultPrevented = returnTrue; if (original_event) { if (original_event.preventDefault) { original_event.preventDefault(); } else { original_event.returnValue = false; } } }; event.stopPropagation = function () { event.isPropagationStopped = returnTrue; if (original_event) { if (original_event.stopPropagation) { original_event.stopPropagation(); } else { original_event.cancelBubble = true; } } }; event.stopImmediatePropagation = function () { event.isImmediatePropagationStopped = returnTrue; event.stopPropagation(); }; if (!event.isDefaultPrevented) { event.isDefaultPrevented = returnFalse; event.isPropagationStopped = returnFalse; event.isImmediatePropagationStopped = returnFalse; }
        return event;
    }
    function bindOnReady(win, callback, event_utils) {
        var doc = win.document, event = { type: 'ready' }; function readyHandler() { if (!event_utils.domLoaded) { event_utils.domLoaded = true; callback(event); } }
        if (doc.readyState == "complete") { readyHandler(); return; }
        if (w3cEventModel) { addEvent(win, 'DOMContentLoaded', readyHandler); } else {
            addEvent(doc, "readystatechange", function () { if (doc.readyState === "complete") { removeEvent(doc, "readystatechange", arguments.callee); readyHandler(); } }); if (doc.documentElement.doScroll && win === win.top) {
                (function () {
                    try { doc.documentElement.doScroll("left"); } catch (ex) { setTimeout(arguments.callee, 0); return; }
                    readyHandler();
                })();
            } 
        }
        addEvent(win, 'load', readyHandler);
    }
    function EventUtils(proxy) {
        var self = this, events = {}, count, isFocusBlurBound, hasFocusIn, hasMouseEnterLeave, mouseEnterLeave; hasMouseEnterLeave = "onmouseenter" in document.documentElement; hasFocusIn = "onfocusin" in document.documentElement; mouseEnterLeave = { mouseenter: 'mouseover', mouseleave: 'mouseout' }; count = 1; self.domLoaded = false; self.events = events; function executeHandlers(evt, id) {
            var callbackList, i, l, callback; callbackList = events[id][evt.type]; if (callbackList) {
                for (i = 0, l = callbackList.length; i < l; i++) {
                    callback = callbackList[i]; if (callback && callback.func.call(callback.scope, evt) === false) { evt.preventDefault(); }
                    if (evt.isImmediatePropagationStopped()) { return; } 
                } 
            } 
        }
        self.bind = function (target, names, callback, scope) {
            var id, callbackList, i, name, fakeName, nativeHandler, capture, win = window; function defaultNativeHandler(evt) { executeHandlers(fix(evt || win.event), id); }
            if (!target || target.nodeType === 3 || target.nodeType === 8) { return; }
            if (!target[expando]) { id = count++; target[expando] = id; events[id] = {}; } else { id = target[expando]; if (!events[id]) { events[id] = {}; } }
            scope = scope || target; names = names.split(' '); i = names.length; while (i--) {
                name = names[i]; nativeHandler = defaultNativeHandler; fakeName = capture = false; if (name === "DOMContentLoaded") { name = "ready"; }
                if ((self.domLoaded || target.readyState == 'complete') && name === "ready") { self.domLoaded = true; callback.call(scope, fix({ type: name })); continue; }
                if (!hasMouseEnterLeave) {
                    fakeName = mouseEnterLeave[name]; if (fakeName) {
                        nativeHandler = function (evt) {
                            var current, related; current = evt.currentTarget; related = evt.relatedTarget; if (related && current.contains) { related = current.contains(related); } else { while (related && related !== current) { related = related.parentNode; } }
                            if (!related) { evt = fix(evt || win.event); evt.type = evt.type === 'mouseout' ? 'mouseleave' : 'mouseenter'; evt.target = current; executeHandlers(evt, id); } 
                        };
                    } 
                }
                if (!hasFocusIn && (name === "focusin" || name === "focusout")) { capture = true; fakeName = name === "focusin" ? "focus" : "blur"; nativeHandler = function (evt) { evt = fix(evt || win.event); evt.type = evt.type === 'focus' ? 'focusin' : 'focusout'; executeHandlers(evt, id); }; }
                callbackList = events[id][name]; if (!callbackList) {
                    events[id][name] = callbackList = [{ func: callback, scope: scope}]; callbackList.fakeName = fakeName; callbackList.capture = capture; callbackList.nativeHandler = nativeHandler; if (!w3cEventModel) { callbackList.proxyHandler = proxy(id); }
                    if (name === "ready") { bindOnReady(target, nativeHandler, self); } else { addEvent(target, fakeName || name, w3cEventModel ? nativeHandler : callbackList.proxyHandler, capture); } 
                } else { callbackList.push({ func: callback, scope: scope }); } 
            }
            target = callbackList = 0; return callback;
        }; self.unbind = function (target, names, callback) {
            var id, callbackList, i, ci, name, eventMap; if (!target || target.nodeType === 3 || target.nodeType === 8) { return self; }
            id = target[expando]; if (id) {
                eventMap = events[id]; if (names) {
                    names = names.split(' '); i = names.length; while (i--) {
                        name = names[i]; callbackList = eventMap[name]; if (callbackList) {
                            if (callback) { ci = callbackList.length; while (ci--) { if (callbackList[ci].func === callback) { callbackList.splice(ci, 1); } } }
                            if (!callback || callbackList.length === 0) { delete eventMap[name]; removeEvent(target, callbackList.fakeName || name, w3cEventModel ? callbackList.nativeHandler : callbackList.proxyHandler, callbackList.capture); } 
                        } 
                    } 
                } else {
                    for (name in eventMap) { callbackList = eventMap[name]; removeEvent(target, callbackList.fakeName || name, w3cEventModel ? callbackList.nativeHandler : callbackList.proxyHandler, callbackList.capture); }
                    eventMap = {};
                }
                for (name in eventMap) { return self; }
                delete events[id]; try { delete target[expando]; } catch (ex) { target[expando] = null; } 
            }
            return self;
        }; self.fire = function (target, name, args) {
            var id, event; if (!target || target.nodeType === 3 || target.nodeType === 8) { return self; }
            event = fix(null, args); event.type = name; do {
                id = target[expando]; if (id) { executeHandlers(event, id); }
                target = target.parentNode || target.ownerDocument || target.defaultView || target.parentWindow;
            } while (target && !event.isPropagationStopped()); return self;
        }; self.clean = function (target) {
            var i, children, unbind = self.unbind; if (!target || target.nodeType === 3 || target.nodeType === 8) { return self; }
            if (target[expando]) { unbind(target); }
            if (!target.getElementsByTagName) { target = target.document; }
            if (target && target.getElementsByTagName) { unbind(target); children = target.getElementsByTagName('*'); i = children.length; while (i--) { target = children[i]; if (target[expando]) { unbind(target); } } }
            return self;
        }; self.callNativeHandler = function (id, evt) { if (events) { events[id][evt.type].nativeHandler(evt); } }; self.destory = function () { events = {}; }; self.add = function (target, events, func, scope) {
            if (typeof (target) === "string") { target = document.getElementById(target); }
            if (target && target instanceof Array) {
                var i = target.length; while (i--) { self.add(target[i], events, func, scope); }
                return;
            }
            if (events === "init") { events = "ready"; }
            return self.bind(target, events instanceof Array ? events.join(' ') : events, func, scope);
        }; self.remove = function (target, events, func, scope) {
            if (!target) { return self; }
            if (typeof (target) === "string") { target = document.getElementById(target); }
            if (target instanceof Array) {
                var i = target.length; while (i--) { self.remove(target[i], events, func, scope); }
                return self;
            }
            return self.unbind(target, events instanceof Array ? events.join(' ') : events, func);
        }; self.clear = function (target) {
            if (typeof (target) === "string") { target = document.getElementById(target); }
            return self.clean(target);
        }; self.cancel = function (e) {
            if (e) { self.prevent(e); self.stop(e); }
            return false;
        }; self.prevent = function (e) {
            if (!e.preventDefault) { e = fix(e); }
            e.preventDefault(); return false;
        }; self.stop = function (e) {
            if (!e.stopPropagation) { e = fix(e); }
            e.stopPropagation(); return false;
        };
    }
    namespace.EventUtils = EventUtils; namespace.Event = new EventUtils(function (id) { return function (evt) { tinymce.dom.Event.callNativeHandler(id, evt); }; }); namespace.Event.bind(window, 'ready', function () { }); namespace = 0;
})(tinymce.dom, 'data-mce-expando'); tinymce.dom.TreeWalker = function (start_node, root_node) {
    var node = start_node; function findSibling(node, start_name, sibling_name, shallow) {
        var sibling, parent; if (node) {
            if (!shallow && node[start_name])
                return node[start_name]; if (node != root_node) {
                sibling = node[sibling_name]; if (sibling)
                    return sibling; for (parent = node.parentNode; parent && parent != root_node; parent = parent.parentNode) {
                    sibling = parent[sibling_name]; if (sibling)
                        return sibling;
                } 
            } 
        } 
    }; this.current = function () { return node; }; this.next = function (shallow) { return (node = findSibling(node, 'firstChild', 'nextSibling', shallow)); }; this.prev = function (shallow) { return (node = findSibling(node, 'lastChild', 'previousSibling', shallow)); };
}; (function (tinymce) {
    var each = tinymce.each, is = tinymce.is, isWebKit = tinymce.isWebKit, isIE = tinymce.isIE, Entities = tinymce.html.Entities, simpleSelectorRe = /^([a-z0-9],?)+$/i, whiteSpaceRegExp = /^[ \t\r\n]*$/; tinymce.create('tinymce.dom.DOMUtils', { doc: null, root: null, files: null, pixelStyles: /^(top|left|bottom|right|width|height|borderWidth)$/, props: { "for": "htmlFor", "class": "className", className: "className", checked: "checked", disabled: "disabled", maxlength: "maxLength", readonly: "readOnly", selected: "selected", value: "value", id: "id", name: "name", type: "type" }, DOMUtils: function (d, s) {
        var t = this, globalStyle, name, blockElementsMap; t.doc = d; t.win = window; t.files = {}; t.cssFlicker = false; t.counter = 0; t.stdMode = !tinymce.isIE || d.documentMode >= 8; t.boxModel = !tinymce.isIE || d.compatMode == "CSS1Compat" || t.stdMode; t.hasOuterHTML = "outerHTML" in d.createElement("a"); t.settings = s = tinymce.extend({ keep_values: false, hex_colors: 1 }, s); t.schema = s.schema; t.styles = new tinymce.html.Styles({ url_converter: s.url_converter, url_converter_scope: s.url_converter_scope }, s.schema); if (tinymce.isIE6) { try { d.execCommand('BackgroundImageCache', false, true); } catch (e) { t.cssFlicker = true; } }
        t.fixDoc(d); t.events = s.ownEvents ? new tinymce.dom.EventUtils(s.proxy) : tinymce.dom.Event; tinymce.addUnload(t.destroy, t); blockElementsMap = s.schema ? s.schema.getBlockElements() : {}; t.isBlock = function (node) {
            if (!node) { return false; }
            var type = node.nodeType; if (type)
                return !!(type === 1 && blockElementsMap[node.nodeName]); return !!blockElementsMap[node];
        };
    }, fixDoc: function (doc) { var settings = this.settings, name; if (isIE && !tinymce.isIE11 && settings.schema) { ('abbr article aside audio canvas ' + 'details figcaption figure footer ' + 'header hgroup mark menu meter nav ' + 'output progress section summary ' + 'time video').replace(/\w+/g, function (name) { doc.createElement(name); }); for (name in settings.schema.getCustomElements()) { doc.createElement(name); } } }, clone: function (node, deep) {
        var self = this, clone, doc; if (!isIE || tinymce.isIE11 || node.nodeType !== 1 || deep) { return node.cloneNode(deep); }
        doc = self.doc; if (!deep) { clone = doc.createElement(node.nodeName); each(self.getAttribs(node), function (attr) { self.setAttrib(clone, attr.nodeName, self.getAttrib(node, attr.nodeName)); }); return clone; }
        return clone.firstChild;
    }, getRoot: function () { var t = this, s = t.settings; return (s && t.get(s.root_element)) || t.doc.body; }, getViewPort: function (w) { var d, b; w = !w ? this.win : w; d = w.document; b = this.boxModel ? d.documentElement : d.body; return { x: w.pageXOffset || b.scrollLeft, y: w.pageYOffset || b.scrollTop, w: w.innerWidth || b.clientWidth, h: w.innerHeight || b.clientHeight }; }, getRect: function (e) { var p, t = this, sr; e = t.get(e); p = t.getPos(e); sr = t.getSize(e); return { x: p.x, y: p.y, w: sr.w, h: sr.h }; }, getSize: function (e) {
        var t = this, w, h; e = t.get(e); w = t.getStyle(e, 'width'); h = t.getStyle(e, 'height'); if (w.indexOf('px') === -1)
            w = 0; if (h.indexOf('px') === -1)
            h = 0; return { w: parseInt(w, 10) || e.offsetWidth || e.clientWidth, h: parseInt(h, 10) || e.offsetHeight || e.clientHeight };
    }, getParent: function (n, f, r) { return this.getParents(n, f, r, false); }, getParents: function (n, f, r, c) {
        var t = this, na, se = t.settings, o = []; n = t.get(n); c = c === undefined; if (se.strict_root)
            r = r || t.getRoot(); if (is(f, 'string')) { na = f; if (f === '*') { f = function (n) { return n.nodeType == 1; }; } else { f = function (n) { return t.is(n, na); }; } }
        while (n) {
            if (n == r || !n.nodeType || n.nodeType === 9)
                break; if (!f || f(n)) {
                if (c)
                    o.push(n); else
                    return n;
            }
            n = n.parentNode;
        }
        return c ? o : null;
    }, get: function (e) {
        var n; if (e && this.doc && typeof (e) == 'string') {
            n = e; e = this.doc.getElementById(e); if (e && e.id !== n)
                return this.doc.getElementsByName(n)[1];
        }
        return e;
    }, getNext: function (node, selector) { return this._findSib(node, selector, 'nextSibling'); }, getPrev: function (node, selector) { return this._findSib(node, selector, 'previousSibling'); }, add: function (p, n, a, h, c) {
        var t = this; return this.run(p, function (p) {
            var e, k; e = is(n, 'string') ? t.doc.createElement(n) : n; t.setAttribs(e, a); if (h) {
                if (h.nodeType)
                    e.appendChild(h); else
                    t.setHTML(e, h);
            }
            return !c ? p.appendChild(e) : e;
        });
    }, create: function (n, a, h) { return this.add(this.doc.createElement(n), n, a, h, 1); }, createHTML: function (n, a, h) {
        var o = '', t = this, k; o += '<' + n; for (k in a) {
            if (a.hasOwnProperty(k))
                o += ' ' + k + '="' + t.encode(a[k]) + '"';
        }
        if (typeof (h) != "undefined")
            return o + '>' + h + '</' + n + '>'; return o + ' />';
    }, remove: function (node, keep_children) {
        return this.run(node, function (node) {
            var child, parent = node.parentNode; if (!parent)
                return null; if (keep_children) {
                while (child = node.firstChild) {
                    if (!tinymce.isIE || child.nodeType !== 3 || child.nodeValue)
                        parent.insertBefore(child, node); else
                        node.removeChild(child);
                } 
            }
            return parent.removeChild(node);
        });
    }, setStyle: function (n, na, v) {
        var t = this; return t.run(n, function (e) {
            var s, i; s = e.style; na = na.replace(/-(\D)/g, function (a, b) { return b.toUpperCase(); }); if (t.pixelStyles.test(na) && (tinymce.is(v, 'number') || /^[\-0-9\.]+$/.test(v)))
                v += 'px'; switch (na) {
                case 'opacity': if (isIE && !tinymce.isIE11) {
                        s.filter = v === '' ? '' : "alpha(opacity=" + (v * 100) + ")"; if (!n.currentStyle || !n.currentStyle.hasLayout)
                            s.display = 'inline-block';
                    }
                    s[na] = s['-moz-opacity'] = s['-khtml-opacity'] = v || ''; break; case 'float': (isIE && !tinymce.isIE11) ? s.styleFloat = v : s.cssFloat = v; break; default: s[na] = v || '';
            }
            if (t.settings.update_styles)
                t.setAttrib(e, 'data-mce-style');
        });
    }, getStyle: function (n, na, c) {
        n = this.get(n); if (!n)
            return; if (this.doc.defaultView && c) { na = na.replace(/[A-Z]/g, function (a) { return '-' + a; }); try { return this.doc.defaultView.getComputedStyle(n, null).getPropertyValue(na); } catch (ex) { return null; } }
        na = na.replace(/-(\D)/g, function (a, b) { return b.toUpperCase(); }); if (na == 'float')
            na = isIE ? 'styleFloat' : 'cssFloat'; if (n.currentStyle && c)
            return n.currentStyle[na]; return n.style ? n.style[na] : undefined;
    }, setStyles: function (e, o) {
        var t = this, s = t.settings, ol; ol = s.update_styles; s.update_styles = 0; each(o, function (v, n) { t.setStyle(e, n, v); }); s.update_styles = ol; if (s.update_styles)
            t.setAttrib(e, s.cssText);
    }, removeAllAttribs: function (e) { return this.run(e, function (e) { var i, attrs = e.attributes; for (i = attrs.length - 1; i >= 0; i--) { e.removeAttributeNode(attrs.item(i)); } }); }, setAttrib: function (e, n, v) {
        var t = this; if (!e || !n)
            return; if (t.settings.strict)
            n = n.toLowerCase(); return this.run(e, function (e) {
                var s = t.settings; var originalValue = e.getAttribute(n); if (v !== null) {
                    switch (n) {
                        case "style": if (!is(v, 'string')) { each(v, function (v, n) { t.setStyle(e, n, v); }); return; }
                            if (s.keep_values) {
                                if (v && !t._isRes(v))
                                    e.setAttribute('data-mce-style', v, 2); else
                                    e.removeAttribute('data-mce-style', 2);
                            }
                            e.style.cssText = v; break; case "class": e.className = v || ''; break; case "src": case "href": if (s.keep_values) {
                                if (s.url_converter)
                                    v = s.url_converter.call(s.url_converter_scope || t, v, n, e); t.setAttrib(e, 'data-mce-' + n, v, 2);
                            }
                            break; case "shape": e.setAttribute('data-mce-style', v); break;
                    } 
                }
                if (is(v) && v !== null && v.length !== 0)
                    e.setAttribute(n, '' + v, 2); else
                    e.removeAttribute(n, 2); if (tinyMCE.activeEditor && originalValue != v) { var ed = tinyMCE.activeEditor; ed.onSetAttrib.dispatch(ed, e, n, v); } 
            });
    }, setAttribs: function (e, o) { var t = this; return this.run(e, function (e) { each(o, function (v, n) { t.setAttrib(e, n, v); }); }); }, getAttrib: function (e, n, dv) {
        var v, t = this, undef; e = t.get(e); if (!e || e.nodeType !== 1)
            return dv === undef ? false : dv; if (!is(dv))
            dv = ''; if (/^(src|href|style|coords|shape)$/.test(n)) {
            v = e.getAttribute("data-mce-" + n); if (v)
                return v;
        }
        if (isIE && t.props[n]) { v = e[t.props[n]]; v = v && v.nodeValue ? v.nodeValue : v; }
        if (!v)
            v = e.getAttribute(n, 2); if (/^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noshade|nowrap|readonly|selected)$/.test(n)) {
            if (e[t.props[n]] === true && v === '')
                return n; return v ? n : '';
        }
        if (e.nodeName === "FORM" && e.getAttributeNode(n))
            return e.getAttributeNode(n).nodeValue; if (n === 'style') {
            v = v || e.style.cssText; if (v) {
                v = t.serializeStyle(t.parseStyle(v), e.nodeName); if (t.settings.keep_values && !t._isRes(v))
                    e.setAttribute('data-mce-style', v);
            } 
        }
        if (isWebKit && n === "class" && v)
            v = v.replace(/(apple|webkit)\-[a-z\-]+/gi, ''); if (isIE) {
            switch (n) {
                case 'rowspan': case 'colspan': if (v === 1)
                        v = ''; break; case 'size': if (v === '+0' || v === 20 || v === 0)
                        v = ''; break; case 'width': case 'height': case 'vspace': case 'checked': case 'disabled': case 'readonly': if (v === 0)
                        v = ''; break; case 'hspace': if (v === -1)
                        v = ''; break; case 'maxlength': case 'tabindex': if (v === 32768 || v === 2147483647 || v === '32768')
                        v = ''; break; case 'multiple': case 'compact': case 'noshade': case 'nowrap': if (v === 65535)
                        return n; return dv; case 'shape': v = v.toLowerCase(); break; default: if (n.indexOf('on') === 0 && v)
                        v = tinymce._replace(/^function\s+\w+\(\)\s+\{\s+(.*)\s+\}$/, '$1', '' + v);
            } 
        }
        return (v !== undef && v !== null && v !== '') ? '' + v : dv;
    }, getPos: function (n, ro) {
        var t = this, x = 0, y = 0, e, d = t.doc, r; n = t.get(n); ro = ro || d.body; if (n) {
            if (n.getBoundingClientRect) { n = n.getBoundingClientRect(); e = t.boxModel ? d.documentElement : d.body; x = n.left + (d.documentElement.scrollLeft || d.body.scrollLeft) - e.clientTop; y = n.top + (d.documentElement.scrollTop || d.body.scrollTop) - e.clientLeft; return { x: x, y: y }; }
            r = n; while (r && r != ro && r.nodeType) { x += r.offsetLeft || 0; y += r.offsetTop || 0; r = r.offsetParent; }
            r = n.parentNode; while (r && r != ro && r.nodeType) { x -= r.scrollLeft || 0; y -= r.scrollTop || 0; r = r.parentNode; } 
        }
        return { x: x, y: y };
    }, parseStyle: function (st) { return this.styles.parse(st); }, serializeStyle: function (o, name) { return this.styles.serialize(o, name); }, addStyle: function (cssText) {
        var doc = this.doc, head; styleElm = doc.getElementById('mceDefaultStyles'); if (!styleElm) { styleElm = doc.createElement('style'), styleElm.id = 'mceDefaultStyles'; styleElm.type = 'text/css'; head = doc.getElementsByTagName('head')[0]; if (head.firstChild) { head.insertBefore(styleElm, head.firstChild); } else { head.appendChild(styleElm); } }
        if (styleElm.styleSheet) { styleElm.styleSheet.cssText += cssText; } else { styleElm.appendChild(doc.createTextNode(cssText)); } 
    }, loadCSS: function (u) {
        var t = this, d = t.doc, head; if (!u)
            u = ''; head = d.getElementsByTagName('head')[0]; each(u.split(','), function (u) {
                var link; if (t.files[u])
                    return; t.files[u] = true; if (isIE && !tinymce.isIE11 && d.documentMode && document.createStyleSheet) { (function (c) { c[c.length - 1].addImport(tinymce._addVer(u)) })(document.styleSheets); } else {
                    link = t.create('link', { rel: 'stylesheet', href: tinymce._addVer(u) }); if (isIE && !tinymce.isIE11 && d.documentMode && d.recalc) {
                        link.onload = function () {
                            if (d.recalc)
                                d.recalc(); link.onload = null;
                        };
                    }
                    head.appendChild(link);
                } 
            });
    }, addClass: function (e, c) {
        return this.run(e, function (e) {
            var o; if (!c)
                return 0; if (this.hasClass(e, c))
                return e.className; o = this.removeClass(e, c); return e.className = (o != '' ? (o + ' ') : '') + c;
        });
    }, removeClass: function (e, c) {
        var t = this, re; return t.run(e, function (e) {
            var v; if (t.hasClass(e, c)) {
                if (!re)
                    re = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g"); v = e.className.replace(re, ' '); v = tinymce.trim(v != ' ' ? v : ''); e.className = v; if (!v) { e.removeAttribute('class'); e.removeAttribute('className'); }
                return v;
            }
            return e.className;
        });
    }, hasClass: function (n, c) {
        n = this.get(n); if (!n || !c)
            return false; return (' ' + n.className + ' ').indexOf(' ' + c + ' ') !== -1;
    }, show: function (e) { return this.setStyle(e, 'display', 'block'); }, hide: function (e) { return this.setStyle(e, 'display', 'none'); }, isHidden: function (e) { e = this.get(e); return !e || e.style.display == 'none' || this.getStyle(e, 'display') == 'none'; }, uniqueId: function (p) { return (!p ? 'mce_' : p) + (this.counter++); }, setHTML: function (element, html) {
        var self = this; return self.run(element, function (element) {
            if (isIE) {
                while (element.firstChild)
                    element.removeChild(element.firstChild); try { element.innerHTML = '<br />' + html; element.removeChild(element.firstChild); } catch (ex) {
                    var newElement = self.create('div'); newElement.innerHTML = '<br />' + html; each(tinymce.grep(newElement.childNodes), function (node, i) {
                        if (i && element.canHaveHTML)
                            element.appendChild(node);
                    });
                } 
            } else
                element.innerHTML = html; return html;
        });
    }, getOuterHTML: function (elm) {
        var doc, self = this; elm = self.get(elm); if (!elm)
            return null; if (elm.nodeType === 1 && self.hasOuterHTML)
            return elm.outerHTML; doc = (elm.ownerDocument || self.doc).createElement("body"); doc.appendChild(elm.cloneNode(true)); return doc.innerHTML;
    }, setOuterHTML: function (e, h, d) {
        var t = this; function setHTML(e, h, d) {
            var n, tp; tp = d.createElement("body"); tp.innerHTML = h; n = tp.lastChild; while (n) { t.insertAfter(n.cloneNode(true), e); n = n.previousSibling; }
            t.remove(e);
        }; return this.run(e, function (e) {
            e = t.get(e); if (e.nodeType == 1) {
                d = d || e.ownerDocument || t.doc; if (isIE) {
                    try {
                        if (isIE && e.nodeType == 1)
                            e.outerHTML = h; else
                            setHTML(e, h, d);
                    } catch (ex) { setHTML(e, h, d); } 
                } else
                    setHTML(e, h, d);
            } 
        });
    }, decode: Entities.decode, encode: Entities.encodeAllRaw, insertAfter: function (node, reference_node) {
        reference_node = this.get(reference_node); return this.run(node, function (node) {
            var parent, nextSibling; parent = reference_node.parentNode; nextSibling = reference_node.nextSibling; if (nextSibling)
                parent.insertBefore(node, nextSibling); else
                parent.appendChild(node); return node;
        });
    }, replace: function (n, o, k) {
        var t = this; if (is(o, 'array'))
            n = n.cloneNode(true); return t.run(o, function (o) {
                if (k) { each(tinymce.grep(o.childNodes), function (c) { n.appendChild(c); }); }
                return o.parentNode.replaceChild(n, o);
            });
    }, rename: function (elm, name) {
        var t = this, newElm; if (elm.nodeName != name.toUpperCase()) { newElm = t.create(name); each(t.getAttribs(elm), function (attr_node) { t.setAttrib(newElm, attr_node.nodeName, t.getAttrib(elm, attr_node.nodeName)); }); t.replace(newElm, elm, 1); }
        return newElm || elm;
    }, findCommonAncestor: function (a, b) {
        var ps = a, pe; while (ps) {
            pe = b; while (pe && ps != pe)
                pe = pe.parentNode; if (ps == pe)
                break; ps = ps.parentNode;
        }
        if (!ps && a.ownerDocument)
            return a.ownerDocument.documentElement; return ps;
    }, toHex: function (s) {
        var c = /^\s*rgb\s*?\(\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?,\s*?([0-9]+)\s*?\)\s*$/i.exec(s); function hex(s) { s = parseInt(s, 10).toString(16); return s.length > 1 ? s : '0' + s; }; if (c) { s = '#' + hex(c[1]) + hex(c[2]) + hex(c[3]); return s; }
        return s;
    }, getClasses: function () {
        var t = this, cl = [], i, lo = {}, f = t.settings.class_filter, ov; if (t.classes)
            return t.classes; function addClasses(s) {
                each(s.imports, function (r) { addClasses(r); }); each(s.cssRules || s.rules, function (r) {
                    switch (r.type || 1) {
                        case 1: if (r.selectorText) {
                                each(r.selectorText.split(','), function (v) {
                                    v = v.replace(/^\s*|\s*$|^\s\./g, ""); if (/\.mce/.test(v) || !/\.[\w\-]+$/.test(v))
                                        return; ov = v; v = tinymce._replace(/.*\.([a-z0-9_\-]+).*/i, '$1', v); if (f && !(v = f(v, ov)))
                                        return; if (!lo[v]) { cl.push({ 'class': v }); lo[v] = 1; } 
                                });
                            }
                            break; case 3: try { addClasses(r.styleSheet); } catch (ex) { }
                            break;
                    } 
                });
            }; try { each(t.doc.styleSheets, addClasses); } catch (ex) { }
        if (cl.length > 0)
            t.classes = cl; return cl;
    }, run: function (e, f, s) {
        var t = this, o; if (t.doc && typeof (e) === 'string')
            e = t.get(e); if (!e)
            return false; s = s || this; if (!e.nodeType && (e.length || e.length === 0)) {
            o = []; each(e, function (e, i) {
                if (e) {
                    if (typeof (e) == 'string')
                        e = t.doc.getElementById(e); o.push(f.call(s, e, i));
                } 
            }); return o;
        }
        return f.call(s, e);
    }, getAttribs: function (n) {
        var o; n = this.get(n); if (!n)
            return []; if (isIE) {
            o = []; if (n.nodeName == 'OBJECT')
                return n.attributes; if (n.nodeName === 'OPTION' && this.getAttrib(n, 'selected'))
                o.push({ specified: 1, nodeName: 'selected' }); n.cloneNode(false).outerHTML.replace(/<\/?[\w:\-]+ ?|=[\"][^\"]+\"|=\'[^\']+\'|=[\w\-]+|>/gi, '').replace(/[\w:\-]+/gi, function (a) { o.push({ specified: 1, nodeName: a }); }); return o;
        }
        return n.attributes;
    }, isEmpty: function (node, elements) {
        var self = this, i, attributes, type, walker, name, brCount = 0; node = node.firstChild; if (node) {
            walker = new tinymce.dom.TreeWalker(node, node.parentNode); elements = elements || self.schema ? self.schema.getNonEmptyElements() : null; do {
                type = node.nodeType; if (type === 1) {
                    if (node.getAttribute('data-mce-bogus'))
                        continue; name = node.nodeName.toLowerCase(); if (elements && elements[name]) {
                        if (name === 'br') { brCount++; continue; }
                        return false;
                    }
                    attributes = self.getAttribs(node); i = node.attributes.length; while (i--) {
                        name = node.attributes[i].nodeName; if (name === "name" || name === 'data-mce-bookmark')
                            return false;
                    } 
                }
                if (type == 8)
                    return false; if ((type === 3 && !whiteSpaceRegExp.test(node.nodeValue)))
                    return false;
            } while (node = walker.next());
        }
        return brCount <= 1;
    }, destroy: function (s) {
        var t = this; t.win = t.doc = t.root = t.events = t.frag = null; if (!s)
            tinymce.removeUnload(t.destroy);
    }, createRng: function () { var d = this.doc; return d.createRange ? d.createRange() : new tinymce.dom.Range(this); }, nodeIndex: function (node, normalized) {
        var idx = 0, lastNodeType, lastNode, nodeType; if (node) {
            for (lastNodeType = node.nodeType, node = node.previousSibling, lastNode = node; node; node = node.previousSibling) {
                nodeType = node.nodeType; if (normalized && nodeType == 3) {
                    if (nodeType == lastNodeType || !node.nodeValue.length)
                        continue;
                }
                idx++; lastNodeType = nodeType;
            } 
        }
        return idx;
    }, split: function (pe, e, re) {
        var t = this, r = t.createRng(), bef, aft, pa; function trim(node) {
            var i, children = node.childNodes, type = node.nodeType; function surroundedBySpans(node) { var previousIsSpan = node.previousSibling && node.previousSibling.nodeName == 'SPAN'; var nextIsSpan = node.nextSibling && node.nextSibling.nodeName == 'SPAN'; return previousIsSpan && nextIsSpan; }
            if (type == 1 && node.getAttribute('data-mce-type') == 'bookmark')
                return; for (i = children.length - 1; i >= 0; i--)
                trim(children[i]); if (type != 9) {
                if (type == 3 && node.nodeValue.length > 0) {
                    var trimmedLength = tinymce.trim(node.nodeValue).length; if (!t.isBlock(node.parentNode) || trimmedLength > 0 || trimmedLength === 0 && surroundedBySpans(node))
                        return;
                } else if (type == 1) {
                    children = node.childNodes; if (children.length == 1 && children[0] && children[0].nodeType == 1 && children[0].getAttribute('data-mce-type') == 'bookmark')
                        node.parentNode.insertBefore(children[0], node); if (children.length || /^(br|hr|input|img)$/i.test(node.nodeName))
                        return;
                }
                t.remove(node);
            }
            return node;
        }; if (pe && e) {
            r.setStart(pe.parentNode, t.nodeIndex(pe)); r.setEnd(e.parentNode, t.nodeIndex(e)); bef = r.extractContents(); r = t.createRng(); r.setStart(e.parentNode, t.nodeIndex(e) + 1); r.setEnd(pe.parentNode, t.nodeIndex(pe) + 1); aft = r.extractContents(); pa = pe.parentNode; pa.insertBefore(trim(bef), pe); if (re)
                pa.replaceChild(re, e); else
                pa.insertBefore(e, pe); pa.insertBefore(trim(aft), pe); t.remove(pe); return re || e;
        } 
    }, bind: function (target, name, func, scope) { return this.events.add(target, name, func, scope || this); }, unbind: function (target, name, func) { return this.events.remove(target, name, func); }, fire: function (target, name, evt) { return this.events.fire(target, name, evt); }, getContentEditable: function (node) {
        var contentEditable; if (node.nodeType != 1) { return null; }
        contentEditable = node.getAttribute("data-mce-contenteditable"); if (contentEditable && contentEditable !== "inherit") { return contentEditable; }
        return node.contentEditable !== "inherit" ? node.contentEditable : null;
    }, _findSib: function (node, selector, name) {
        var t = this, f = selector; if (node) {
            if (is(f, 'string')) { f = function (node) { return t.is(node, selector); }; }
            for (node = node[name]; node; node = node[name]) {
                if (f(node))
                    return node;
            } 
        }
        return null;
    }, _isRes: function (c) { return /^(top|left|bottom|right|width|height)/i.test(c) || /;\s*(top|left|bottom|right|width|height)/i.test(c); } 
    }); tinymce.DOM = new tinymce.dom.DOMUtils(document, { process_html: 0 });
})(tinymce); (function (ns) {
    function Range(dom) {
        var t = this, doc = dom.doc, EXTRACT = 0, CLONE = 1, DELETE = 2, TRUE = true, FALSE = false, START_OFFSET = 'startOffset', START_CONTAINER = 'startContainer', END_CONTAINER = 'endContainer', END_OFFSET = 'endOffset', extend = tinymce.extend, nodeIndex = dom.nodeIndex; extend(t, { startContainer: doc, startOffset: 0, endContainer: doc, endOffset: 0, collapsed: TRUE, commonAncestorContainer: doc, START_TO_START: 0, START_TO_END: 1, END_TO_END: 2, END_TO_START: 3, setStart: setStart, setEnd: setEnd, setStartBefore: setStartBefore, setStartAfter: setStartAfter, setEndBefore: setEndBefore, setEndAfter: setEndAfter, collapse: collapse, selectNode: selectNode, selectNodeContents: selectNodeContents, compareBoundaryPoints: compareBoundaryPoints, deleteContents: deleteContents, extractContents: extractContents, cloneContents: cloneContents, insertNode: insertNode, surroundContents: surroundContents, cloneRange: cloneRange, toStringIE: toStringIE }); function createDocumentFragment() { return doc.createDocumentFragment(); }; function setStart(n, o) { _setEndPoint(TRUE, n, o); }; function setEnd(n, o) { _setEndPoint(FALSE, n, o); }; function setStartBefore(n) { setStart(n.parentNode, nodeIndex(n)); }; function setStartAfter(n) { setStart(n.parentNode, nodeIndex(n) + 1); }; function setEndBefore(n) { setEnd(n.parentNode, nodeIndex(n)); }; function setEndAfter(n) { setEnd(n.parentNode, nodeIndex(n) + 1); }; function collapse(ts) {
            if (ts) { t[END_CONTAINER] = t[START_CONTAINER]; t[END_OFFSET] = t[START_OFFSET]; } else { t[START_CONTAINER] = t[END_CONTAINER]; t[START_OFFSET] = t[END_OFFSET]; }
            t.collapsed = TRUE;
        }; function selectNode(n) { setStartBefore(n); setEndAfter(n); }; function selectNodeContents(n) { setStart(n, 0); setEnd(n, n.nodeType === 1 ? n.childNodes.length : n.nodeValue.length); }; function compareBoundaryPoints(h, r) {
            var sc = t[START_CONTAINER], so = t[START_OFFSET], ec = t[END_CONTAINER], eo = t[END_OFFSET], rsc = r.startContainer, rso = r.startOffset, rec = r.endContainer, reo = r.endOffset; if (h === 0)
                return _compareBoundaryPoints(sc, so, rsc, rso); if (h === 1)
                return _compareBoundaryPoints(ec, eo, rsc, rso); if (h === 2)
                return _compareBoundaryPoints(ec, eo, rec, reo); if (h === 3)
                return _compareBoundaryPoints(sc, so, rec, reo);
        }; function deleteContents() { _traverse(DELETE); }; function extractContents() { return _traverse(EXTRACT); }; function cloneContents() { return _traverse(CLONE); }; function insertNode(n) {
            var startContainer = this[START_CONTAINER], startOffset = this[START_OFFSET], nn, o; if ((startContainer.nodeType === 3 || startContainer.nodeType === 4) && startContainer.nodeValue) { if (!startOffset) { startContainer.parentNode.insertBefore(n, startContainer); } else if (startOffset >= startContainer.nodeValue.length) { dom.insertAfter(n, startContainer); } else { nn = startContainer.splitText(startOffset); startContainer.parentNode.insertBefore(n, nn); } } else {
                if (startContainer.childNodes.length > 0)
                    o = startContainer.childNodes[startOffset]; if (o)
                    startContainer.insertBefore(n, o); else
                    startContainer.appendChild(n);
            } 
        }; function surroundContents(n) { var f = t.extractContents(); t.insertNode(n); n.appendChild(f); t.selectNode(n); }; function cloneRange() { return extend(new Range(dom), { startContainer: t[START_CONTAINER], startOffset: t[START_OFFSET], endContainer: t[END_CONTAINER], endOffset: t[END_OFFSET], collapsed: t.collapsed, commonAncestorContainer: t.commonAncestorContainer }); }; function _getSelectedNode(container, offset) {
            var child; if (container.nodeType == 3)
                return container; if (offset < 0)
                return container; child = container.firstChild; while (child && offset > 0) { --offset; child = child.nextSibling; }
            if (child)
                return child; return container;
        }; function _isCollapsed() { return (t[START_CONTAINER] == t[END_CONTAINER] && t[START_OFFSET] == t[END_OFFSET]); }; function _compareBoundaryPoints(containerA, offsetA, containerB, offsetB) {
            var c, offsetC, n, cmnRoot, childA, childB; if (containerA == containerB) {
                if (offsetA == offsetB)
                    return 0; if (offsetA < offsetB)
                    return -1; return 1;
            }
            c = containerB; while (c && c.parentNode != containerA)
                c = c.parentNode; if (c) {
                offsetC = 0; n = containerA.firstChild; while (n != c && offsetC < offsetA) { offsetC++; n = n.nextSibling; }
                if (offsetA <= offsetC)
                    return -1; return 1;
            }
            c = containerA; while (c && c.parentNode != containerB) { c = c.parentNode; }
            if (c) {
                offsetC = 0; n = containerB.firstChild; while (n != c && offsetC < offsetB) { offsetC++; n = n.nextSibling; }
                if (offsetC < offsetB)
                    return -1; return 1;
            }
            cmnRoot = dom.findCommonAncestor(containerA, containerB); childA = containerA; while (childA && childA.parentNode != cmnRoot)
                childA = childA.parentNode; if (!childA)
                childA = cmnRoot; childB = containerB; while (childB && childB.parentNode != cmnRoot)
                childB = childB.parentNode; if (!childB)
                childB = cmnRoot; if (childA == childB)
                return 0; n = cmnRoot.firstChild; while (n) {
                if (n == childA)
                    return -1; if (n == childB)
                    return 1; n = n.nextSibling;
            } 
        }; function _setEndPoint(st, n, o) {
            var ec, sc; if (st) { t[START_CONTAINER] = n; t[START_OFFSET] = o; } else { t[END_CONTAINER] = n; t[END_OFFSET] = o; }
            ec = t[END_CONTAINER]; while (ec.parentNode)
                ec = ec.parentNode; sc = t[START_CONTAINER]; while (sc.parentNode)
                sc = sc.parentNode; if (sc == ec) {
                if (_compareBoundaryPoints(t[START_CONTAINER], t[START_OFFSET], t[END_CONTAINER], t[END_OFFSET]) > 0)
                    t.collapse(st);
            } else
                t.collapse(st); t.collapsed = _isCollapsed(); t.commonAncestorContainer = dom.findCommonAncestor(t[START_CONTAINER], t[END_CONTAINER]);
        }; function _traverse(how) {
            var c, endContainerDepth = 0, startContainerDepth = 0, p, depthDiff, startNode, endNode, sp, ep; if (t[START_CONTAINER] == t[END_CONTAINER])
                return _traverseSameContainer(how); for (c = t[END_CONTAINER], p = c.parentNode; p; c = p, p = p.parentNode) {
                if (p == t[START_CONTAINER])
                    return _traverseCommonStartContainer(c, how); ++endContainerDepth;
            }
            for (c = t[START_CONTAINER], p = c.parentNode; p; c = p, p = p.parentNode) {
                if (p == t[END_CONTAINER])
                    return _traverseCommonEndContainer(c, how); ++startContainerDepth;
            }
            depthDiff = startContainerDepth - endContainerDepth; startNode = t[START_CONTAINER]; while (depthDiff > 0) { startNode = startNode.parentNode; depthDiff--; }
            endNode = t[END_CONTAINER]; while (depthDiff < 0) { endNode = endNode.parentNode; depthDiff++; }
            for (sp = startNode.parentNode, ep = endNode.parentNode; sp != ep; sp = sp.parentNode, ep = ep.parentNode) { startNode = sp; endNode = ep; }
            return _traverseCommonAncestors(startNode, endNode, how);
        }; function _traverseSameContainer(how) {
            var frag, s, sub, n, cnt, sibling, xferNode, start, len; if (how != DELETE)
                frag = createDocumentFragment(); if (t[START_OFFSET] == t[END_OFFSET])
                return frag; if (t[START_CONTAINER].nodeType == 3) {
                s = t[START_CONTAINER].nodeValue; sub = s.substring(t[START_OFFSET], t[END_OFFSET]); if (how != CLONE) {
                    n = t[START_CONTAINER]; start = t[START_OFFSET]; len = t[END_OFFSET] - t[START_OFFSET]; if (start === 0 && len >= n.nodeValue.length - 1) { n.parentNode.removeChild(n); } else { n.deleteData(start, len); }
                    t.collapse(TRUE);
                }
                if (how == DELETE)
                    return; if (sub.length > 0) { frag.appendChild(doc.createTextNode(sub)); }
                return frag;
            }
            n = _getSelectedNode(t[START_CONTAINER], t[START_OFFSET]); cnt = t[END_OFFSET] - t[START_OFFSET]; while (n && cnt > 0) {
                sibling = n.nextSibling; xferNode = _traverseFullySelected(n, how); if (frag)
                    frag.appendChild(xferNode); --cnt; n = sibling;
            }
            if (how != CLONE)
                t.collapse(TRUE); return frag;
        }; function _traverseCommonStartContainer(endAncestor, how) {
            var frag, n, endIdx, cnt, sibling, xferNode; if (how != DELETE)
                frag = createDocumentFragment(); n = _traverseRightBoundary(endAncestor, how); if (frag)
                frag.appendChild(n); endIdx = nodeIndex(endAncestor); cnt = endIdx - t[START_OFFSET]; if (cnt <= 0) {
                if (how != CLONE) { t.setEndBefore(endAncestor); t.collapse(FALSE); }
                return frag;
            }
            n = endAncestor.previousSibling; while (cnt > 0) {
                sibling = n.previousSibling; xferNode = _traverseFullySelected(n, how); if (frag)
                    frag.insertBefore(xferNode, frag.firstChild); --cnt; n = sibling;
            }
            if (how != CLONE) { t.setEndBefore(endAncestor); t.collapse(FALSE); }
            return frag;
        }; function _traverseCommonEndContainer(startAncestor, how) {
            var frag, startIdx, n, cnt, sibling, xferNode; if (how != DELETE)
                frag = createDocumentFragment(); n = _traverseLeftBoundary(startAncestor, how); if (frag)
                frag.appendChild(n); startIdx = nodeIndex(startAncestor); ++startIdx; cnt = t[END_OFFSET] - startIdx; n = startAncestor.nextSibling; while (n && cnt > 0) {
                sibling = n.nextSibling; xferNode = _traverseFullySelected(n, how); if (frag)
                    frag.appendChild(xferNode); --cnt; n = sibling;
            }
            if (how != CLONE) { t.setStartAfter(startAncestor); t.collapse(TRUE); }
            return frag;
        }; function _traverseCommonAncestors(startAncestor, endAncestor, how) {
            var n, frag, commonParent, startOffset, endOffset, cnt, sibling, nextSibling; if (how != DELETE)
                frag = createDocumentFragment(); n = _traverseLeftBoundary(startAncestor, how); if (frag)
                frag.appendChild(n); commonParent = startAncestor.parentNode; startOffset = nodeIndex(startAncestor); endOffset = nodeIndex(endAncestor); ++startOffset; cnt = endOffset - startOffset; sibling = startAncestor.nextSibling; while (cnt > 0) {
                nextSibling = sibling.nextSibling; n = _traverseFullySelected(sibling, how); if (frag)
                    frag.appendChild(n); sibling = nextSibling; --cnt;
            }
            n = _traverseRightBoundary(endAncestor, how); if (frag)
                frag.appendChild(n); if (how != CLONE) { t.setStartAfter(startAncestor); t.collapse(TRUE); }
            return frag;
        }; function _traverseRightBoundary(root, how) {
            var next = _getSelectedNode(t[END_CONTAINER], t[END_OFFSET] - 1), parent, clonedParent, prevSibling, clonedChild, clonedGrandParent, isFullySelected = next != t[END_CONTAINER]; if (next == root)
                return _traverseNode(next, isFullySelected, FALSE, how); parent = next.parentNode; clonedParent = _traverseNode(parent, FALSE, FALSE, how); while (parent) {
                while (next) {
                    prevSibling = next.previousSibling; clonedChild = _traverseNode(next, isFullySelected, FALSE, how); if (how != DELETE)
                        clonedParent.insertBefore(clonedChild, clonedParent.firstChild); isFullySelected = TRUE; next = prevSibling;
                }
                if (parent == root)
                    return clonedParent; next = parent.previousSibling; parent = parent.parentNode; clonedGrandParent = _traverseNode(parent, FALSE, FALSE, how); if (how != DELETE)
                    clonedGrandParent.appendChild(clonedParent); clonedParent = clonedGrandParent;
            } 
        }; function _traverseLeftBoundary(root, how) {
            var next = _getSelectedNode(t[START_CONTAINER], t[START_OFFSET]), isFullySelected = next != t[START_CONTAINER], parent, clonedParent, nextSibling, clonedChild, clonedGrandParent; if (next == root)
                return _traverseNode(next, isFullySelected, TRUE, how); parent = next.parentNode; clonedParent = _traverseNode(parent, FALSE, TRUE, how); while (parent) {
                while (next) {
                    nextSibling = next.nextSibling; clonedChild = _traverseNode(next, isFullySelected, TRUE, how); if (how != DELETE)
                        clonedParent.appendChild(clonedChild); isFullySelected = TRUE; next = nextSibling;
                }
                if (parent == root)
                    return clonedParent; next = parent.nextSibling; parent = parent.parentNode; clonedGrandParent = _traverseNode(parent, FALSE, TRUE, how); if (how != DELETE)
                    clonedGrandParent.appendChild(clonedParent); clonedParent = clonedGrandParent;
            } 
        }; function _traverseNode(n, isFullySelected, isLeft, how) {
            var txtValue, newNodeValue, oldNodeValue, offset, newNode; if (isFullySelected)
                return _traverseFullySelected(n, how); if (n.nodeType == 3) {
                txtValue = n.nodeValue; if (isLeft) { offset = t[START_OFFSET]; newNodeValue = txtValue.substring(offset); oldNodeValue = txtValue.substring(0, offset); } else { offset = t[END_OFFSET]; newNodeValue = txtValue.substring(0, offset); oldNodeValue = txtValue.substring(offset); }
                if (how != CLONE)
                    n.nodeValue = oldNodeValue; if (how == DELETE)
                    return; newNode = dom.clone(n, FALSE); newNode.nodeValue = newNodeValue; return newNode;
            }
            if (how == DELETE)
                return; return dom.clone(n, FALSE);
        }; function _traverseFullySelected(n, how) {
            if (how != DELETE)
                return how == CLONE ? dom.clone(n, TRUE) : n; n.parentNode.removeChild(n);
        }; function toStringIE() { return dom.create('body', null, cloneContents()).outerText; }
        return t;
    }; ns.Range = Range; Range.prototype.toString = function () { return this.toStringIE(); };
})(tinymce.dom); (function () {
    function Selection(selection) {
        var self = this, dom = selection.dom, TRUE = true, FALSE = false; function getPosition(rng, start) {
            var checkRng, startIndex = 0, endIndex, inside, children, child, offset, index, position = -1, parent; checkRng = rng.duplicate(); checkRng.collapse(start); parent = checkRng.parentElement(); if (parent.ownerDocument !== selection.dom.doc)
                return; while (parent.contentEditable === "false") { parent = parent.parentNode; }
            if (!parent.hasChildNodes()) { return { node: parent, inside: 1 }; }
            children = parent.children; endIndex = children.length - 1; while (startIndex <= endIndex) { index = Math.floor((startIndex + endIndex) / 2); child = children[index]; checkRng.moveToElementText(child); position = checkRng.compareEndPoints(start ? 'StartToStart' : 'EndToEnd', rng); if (position > 0) { endIndex = index - 1; } else if (position < 0) { startIndex = index + 1; } else { return { node: child }; } }
            if (position < 0) {
                if (!child) { checkRng.moveToElementText(parent); checkRng.collapse(true); child = parent; inside = true; } else
                    checkRng.collapse(false); offset = 0; while (checkRng.compareEndPoints(start ? 'StartToStart' : 'StartToEnd', rng) !== 0) {
                    if (checkRng.move('character', 1) === 0 || parent != checkRng.parentElement()) { break; }
                    offset++;
                } 
            } else {
                checkRng.collapse(true); offset = 0; while (checkRng.compareEndPoints(start ? 'StartToStart' : 'StartToEnd', rng) !== 0) {
                    if (checkRng.move('character', -1) === 0 || parent != checkRng.parentElement()) { break; }
                    offset++;
                } 
            }
            return { node: child, position: position, offset: offset, inside: inside };
        }; function getRange() {
            var ieRange = selection.getRng(), domRange = dom.createRng(), element, collapsed, tmpRange, element2, bookmark, fail; element = ieRange.item ? ieRange.item(0) : ieRange.parentElement(); if (element.ownerDocument != dom.doc)
                return domRange; collapsed = selection.isCollapsed(); if (ieRange.item) { domRange.setStart(element.parentNode, dom.nodeIndex(element)); domRange.setEnd(domRange.startContainer, domRange.startOffset + 1); return domRange; }
            function findEndPoint(start) {
                var endPoint = getPosition(ieRange, start), container, offset, textNodeOffset = 0, sibling, undef, nodeValue; container = endPoint.node; offset = endPoint.offset; if (endPoint.inside && !container.hasChildNodes()) { domRange[start ? 'setStart' : 'setEnd'](container, 0); return; }
                if (offset === undef) { domRange[start ? 'setStartBefore' : 'setEndAfter'](container); return; }
                if (endPoint.position < 0) {
                    sibling = endPoint.inside ? container.firstChild : container.nextSibling; if (!sibling) { domRange[start ? 'setStartAfter' : 'setEndAfter'](container); return; }
                    if (!offset) {
                        if (sibling.nodeType == 3)
                            domRange[start ? 'setStart' : 'setEnd'](sibling, 0); else
                            domRange[start ? 'setStartBefore' : 'setEndBefore'](sibling); return;
                    }
                    while (sibling) {
                        nodeValue = sibling.nodeValue; textNodeOffset += nodeValue.length; if (textNodeOffset >= offset) { container = sibling; textNodeOffset -= offset; textNodeOffset = nodeValue.length - textNodeOffset; break; }
                        sibling = sibling.nextSibling;
                    } 
                } else {
                    sibling = container.previousSibling; if (!sibling)
                        return domRange[start ? 'setStartBefore' : 'setEndBefore'](container); if (!offset) {
                        if (container.nodeType == 3)
                            domRange[start ? 'setStart' : 'setEnd'](sibling, container.nodeValue.length); else
                            domRange[start ? 'setStartAfter' : 'setEndAfter'](sibling); return;
                    }
                    while (sibling) {
                        textNodeOffset += sibling.nodeValue.length; if (textNodeOffset >= offset) { container = sibling; textNodeOffset -= offset; break; }
                        sibling = sibling.previousSibling;
                    } 
                }
                domRange[start ? 'setStart' : 'setEnd'](container, textNodeOffset);
            }; try {
                findEndPoint(true); if (!collapsed)
                    findEndPoint();
            } catch (ex) {
                if (ex.number == -2147024809) {
                    bookmark = self.getBookmark(2); tmpRange = ieRange.duplicate(); tmpRange.collapse(true); element = tmpRange.parentElement(); if (!collapsed) { tmpRange = ieRange.duplicate(); tmpRange.collapse(false); element2 = tmpRange.parentElement(); element2.innerHTML = element2.innerHTML; }
                    element.innerHTML = element.innerHTML; self.moveToBookmark(bookmark); ieRange = selection.getRng(); findEndPoint(true); if (!collapsed)
                        findEndPoint();
                } else
                    throw ex;
            }
            return domRange;
        }; this.getBookmark = function (type) {
            var rng = selection.getRng(), start, end, bookmark = {}; function getIndexes(node) {
                var parent, root, children, i, indexes = []; parent = node.parentNode; root = dom.getRoot().parentNode; while (parent != root && parent.nodeType !== 9) {
                    children = parent.children; i = children.length; while (i--) { if (node === children[i]) { indexes.push(i); break; } }
                    node = parent; parent = parent.parentNode;
                }
                return indexes;
            }; function getBookmarkEndPoint(start) { var position; position = getPosition(rng, start); if (position) { return { position: position.position, offset: position.offset, indexes: getIndexes(position.node), inside: position.inside }; } }; if (type === 2) {
                if (!rng.item) {
                    bookmark.start = getBookmarkEndPoint(true); if (!selection.isCollapsed())
                        bookmark.end = getBookmarkEndPoint();
                } else
                    bookmark.start = { ctrl: true, indexes: getIndexes(rng.item(0)) };
            }
            return bookmark;
        }; this.moveToBookmark = function (bookmark) {
            var rng, body = dom.doc.body; function resolveIndexes(indexes) {
                var node, i, idx, children; node = dom.getRoot(); for (i = indexes.length - 1; i >= 0; i--) { children = node.children; idx = indexes[i]; if (idx <= children.length - 1) { node = children[idx]; } }
                return node;
            }; function setBookmarkEndPoint(start) {
                var endPoint = bookmark[start ? 'start' : 'end'], moveLeft, moveRng, undef; if (endPoint) {
                    moveLeft = endPoint.position > 0; moveRng = body.createTextRange(); moveRng.moveToElementText(resolveIndexes(endPoint.indexes)); offset = endPoint.offset; if (offset !== undef) { moveRng.collapse(endPoint.inside || moveLeft); moveRng.moveStart('character', moveLeft ? -offset : offset); } else
                        moveRng.collapse(start); rng.setEndPoint(start ? 'StartToStart' : 'EndToStart', moveRng); if (start)
                        rng.collapse(true);
                } 
            }; if (bookmark.start) { if (bookmark.start.ctrl) { rng = body.createControlRange(); rng.addElement(resolveIndexes(bookmark.start.indexes)); rng.select(); } else { rng = body.createTextRange(); setBookmarkEndPoint(true); setBookmarkEndPoint(); rng.select(); } } 
        }; this.addRange = function (rng) {
            var ieRng, ctrlRng, startContainer, startOffset, endContainer, endOffset, sibling, doc = selection.dom.doc, body = doc.body, nativeRng, ctrlElm; function setEndPoint(start) {
                var container, offset, marker, tmpRng, nodes; marker = dom.create('a'); container = start ? startContainer : endContainer; offset = start ? startOffset : endOffset; tmpRng = ieRng.duplicate(); if (container == doc || container == doc.documentElement) { container = body; offset = 0; }
                if (container.nodeType == 3) { container.parentNode.insertBefore(marker, container); tmpRng.moveToElementText(marker); tmpRng.moveStart('character', offset); dom.remove(marker); ieRng.setEndPoint(start ? 'StartToStart' : 'EndToEnd', tmpRng); } else {
                    nodes = container.childNodes; if (nodes.length) {
                        if (offset >= nodes.length) { dom.insertAfter(marker, nodes[nodes.length - 1]); } else { container.insertBefore(marker, nodes[offset]); }
                        tmpRng.moveToElementText(marker);
                    } else if (container.canHaveHTML) { container.innerHTML = '<span>\uFEFF</span>'; marker = container.firstChild; tmpRng.moveToElementText(marker); tmpRng.collapse(FALSE); }
                    ieRng.setEndPoint(start ? 'StartToStart' : 'EndToEnd', tmpRng); dom.remove(marker);
                } 
            }
            startContainer = rng.startContainer; startOffset = rng.startOffset; endContainer = rng.endContainer; endOffset = rng.endOffset; ieRng = body.createTextRange(); if (startContainer == endContainer && startContainer.nodeType == 1) {
                if (startOffset == endOffset && !startContainer.hasChildNodes()) {
                    if (startContainer.canHaveHTML) {
                        sibling = startContainer.previousSibling; if (sibling && !sibling.hasChildNodes() && dom.isBlock(sibling)) { sibling.innerHTML = '\uFEFF'; } else { sibling = null; }
                        startContainer.innerHTML = '<span>\uFEFF</span><span>\uFEFF</span>'; ieRng.moveToElementText(startContainer.lastChild); ieRng.select(); dom.doc.selection.clear(); startContainer.innerHTML = ''; if (sibling) { sibling.innerHTML = ''; }
                        return;
                    } else { startOffset = dom.nodeIndex(startContainer); startContainer = startContainer.parentNode; } 
                }
                if (startOffset == endOffset - 1) { try { ctrlElm = startContainer.childNodes[startOffset]; ctrlRng = body.createControlRange(); ctrlRng.addElement(ctrlElm); ctrlRng.select(); nativeRng = selection.getRng(); if (nativeRng.item && ctrlElm === nativeRng.item(0)) { return; } } catch (ex) { } } 
            }
            setEndPoint(true); setEndPoint(); ieRng.select();
        }; this.getRangeAt = getRange;
    }; tinymce.dom.TridentSelection = Selection;
})(); (function (tinymce) {
    tinymce.dom.Element = function (id, settings) {
        var t = this, dom, el; t.settings = settings = settings || {}; t.id = id; t.dom = dom = settings.dom || tinymce.DOM; if (!tinymce.isIE)
            el = dom.get(t.id); tinymce.each(('getPos,getRect,getParent,add,setStyle,getStyle,setStyles,' + 'setAttrib,setAttribs,getAttrib,addClass,removeClass,' + 'hasClass,getOuterHTML,setOuterHTML,remove,show,hide,' + 'isHidden,setHTML,get').split(/,/), function (k) {
                t[k] = function () {
                    var a = [id], i; for (i = 0; i < arguments.length; i++)
                        a.push(arguments[i]); a = dom[k].apply(dom, a); t.update(k); return a;
                };
            }); tinymce.extend(t, { on: function (n, f, s) { return tinymce.dom.Event.add(t.id, n, f, s); }, getXY: function () { return { x: parseInt(t.getStyle('left')), y: parseInt(t.getStyle('top')) }; }, getSize: function () { var n = dom.get(t.id); return { w: parseInt(t.getStyle('width') || n.clientWidth), h: parseInt(t.getStyle('height') || n.clientHeight) }; }, moveTo: function (x, y) { t.setStyles({ left: x, top: y }); }, moveBy: function (x, y) { var p = t.getXY(); t.moveTo(p.x + x, p.y + y); }, resizeTo: function (w, h) { t.setStyles({ width: w, height: h }); }, resizeBy: function (w, h) { var s = t.getSize(); t.resizeTo(s.w + w, s.h + h); }, update: function (k) {
                var b; if (tinymce.isIE6 && settings.blocker) {
                    k = k || ''; if (k.indexOf('get') === 0 || k.indexOf('has') === 0 || k.indexOf('is') === 0)
                        return; if (k == 'remove') { dom.remove(t.blocker); return; }
                    if (!t.blocker) { t.blocker = dom.uniqueId(); b = dom.add(settings.container || dom.getRoot(), 'iframe', { id: t.blocker, style: 'position:absolute;', frameBorder: 0, src: 'placeholder.htm' }); dom.setStyle(b, 'opacity', 0); } else
                        b = dom.get(t.blocker); dom.setStyles(b, { left: t.getStyle('left', 1), top: t.getStyle('top', 1), width: t.getStyle('width', 1), height: t.getStyle('height', 1), display: t.getStyle('display', 1), zIndex: parseInt(t.getStyle('zIndex', 1) || 0) - 1 });
                } 
            } 
            });
    };
})(tinymce); (function (tinymce) {
    function trimNl(s) { return s.replace(/[\n\r]+/g, ''); }; var is = tinymce.is, isIE = tinymce.isIE, each = tinymce.each, TreeWalker = tinymce.dom.TreeWalker; tinymce.create('tinymce.dom.Selection', { Selection: function (dom, win, serializer, editor) {
        var t = this; t.dom = dom; t.win = win; t.serializer = serializer; t.editor = editor; each(['onBeforeSetContent', 'onBeforeGetContent', 'onSetContent', 'onGetContent'], function (e) { t[e] = new tinymce.util.Dispatcher(t); }); if (!t.win.getSelection)
            t.tridentSel = new tinymce.dom.TridentSelection(t); if (tinymce.isIE && !tinymce.isIE11 && dom.boxModel)
            this._fixIESelection(); tinymce.addUnload(t.destroy, t);
    }, setCursorLocation: function (node, offset) { var t = this; var r = t.dom.createRng(); r.setStart(node, offset); r.setEnd(node, offset); t.setRng(r); t.collapse(false); }, getContent: function (s) {
        var t = this, r = t.getRng(), e = t.dom.create("body"), se = t.getSel(), wb, wa, n; s = s || {}; wb = wa = ''; s.get = true; s.format = s.format || 'html'; s.forced_root_block = ''; t.onBeforeGetContent.dispatch(t, s); if (s.format == 'text')
            return t.isCollapsed() ? '' : (r.text || (se.toString ? se.toString() : '')); if (r.cloneContents) {
            n = r.cloneContents(); if (n)
                e.appendChild(n);
        } else if (is(r.item) || is(r.htmlText)) { e.innerHTML = '<br>' + (r.item ? r.item(0).outerHTML : r.htmlText); e.removeChild(e.firstChild); } else
            e.innerHTML = r.toString(); if (/^\s/.test(e.innerHTML))
            wb = ' '; if (/\s+$/.test(e.innerHTML))
            wa = ' '; s.getInner = true; s.content = t.isCollapsed() ? '' : wb + t.serializer.serialize(e, s) + wa; t.onGetContent.dispatch(t, s); return s.content;
    }, setContent: function (content, args) {
        var self = this, rng = self.getRng(), caretNode, doc = self.win.document, frag, temp; args = args || { format: 'html' }; args.set = true; content = args.content = content; if (!args.no_events)
            self.onBeforeSetContent.dispatch(self, args); content = args.content; if (rng.insertNode) {
            content += '<span id="__caret">_</span>'; if (rng.startContainer == doc && rng.endContainer == doc) { doc.body.innerHTML = content; } else { rng.deleteContents(); if (doc.body.childNodes.length === 0) { doc.body.innerHTML = content; } else { if (rng.createContextualFragment) { rng.insertNode(rng.createContextualFragment(content)); } else { frag = doc.createDocumentFragment(); temp = doc.createElement('div'); frag.appendChild(temp); temp.outerHTML = content; rng.insertNode(frag); } } }
            caretNode = self.dom.get('__caret'); rng = doc.createRange(); rng.setStartBefore(caretNode); rng.setEndBefore(caretNode); self.setRng(rng); self.dom.remove('__caret'); try { self.setRng(rng); } catch (ex) { } 
        } else {
            if (rng.item) { doc.execCommand('Delete', false, null); rng = self.getRng(); }
            if (/^\s+/.test(content)) { rng.pasteHTML('<span id="__mce_tmp">_</span>' + content); self.dom.remove('__mce_tmp'); } else
                rng.pasteHTML(content);
        }
        if (!args.no_events)
            self.onSetContent.dispatch(self, args);
    }, getStart: function () {
        var self = this, rng = self.getRng(), startElement, parentElement, checkRng, node; if (rng.duplicate || rng.item) {
            if (rng.item)
                return rng.item(0); checkRng = rng.duplicate(); checkRng.collapse(1); startElement = checkRng.parentElement(); if (startElement.ownerDocument !== self.dom.doc) { startElement = self.dom.getRoot(); }
            parentElement = node = rng.parentElement(); while (node = node.parentNode) { if (node == startElement) { startElement = parentElement; break; } }
            return startElement;
        } else {
            startElement = rng.startContainer; if (startElement.nodeType == 1 && startElement.hasChildNodes())
                startElement = startElement.childNodes[Math.min(startElement.childNodes.length - 1, rng.startOffset)]; if (startElement && startElement.nodeType == 3)
                return startElement.parentNode; return startElement;
        } 
    }, getEnd: function () {
        var self = this, rng = self.getRng(), endElement, endOffset; if (rng.duplicate || rng.item) {
            if (rng.item)
                return rng.item(0); rng = rng.duplicate(); rng.collapse(0); endElement = rng.parentElement(); if (endElement.ownerDocument !== self.dom.doc) { endElement = self.dom.getRoot(); }
            if (endElement && endElement.nodeName == 'BODY')
                return endElement.lastChild || endElement; return endElement;
        } else {
            endElement = rng.endContainer; endOffset = rng.endOffset; if (endElement.nodeType == 1 && endElement.hasChildNodes())
                endElement = endElement.childNodes[endOffset > 0 ? endOffset - 1 : endOffset]; if (endElement && endElement.nodeType == 3)
                return endElement.parentNode; return endElement;
        } 
    }, getBookmark: function (type, normalized) {
        var t = this, dom = t.dom, rng, rng2, id, collapsed, name, element, index, chr = '\uFEFF', styles; function findIndex(name, element) {
            var index = 0; each(dom.select(name), function (node, i) {
                if (node == element)
                    index = i;
            }); return index;
        }; function normalizeTableCellSelection(rng) { function moveEndPoint(start) { var container, offset, childNodes, prefix = start ? 'start' : 'end'; container = rng[prefix + 'Container']; offset = rng[prefix + 'Offset']; if (container.nodeType == 1 && container.nodeName == "TR") { childNodes = container.childNodes; container = childNodes[Math.min(start ? offset : offset - 1, childNodes.length - 1)]; if (container) { offset = start ? 0 : container.childNodes.length; rng['set' + (start ? 'Start' : 'End')](container, offset); } } }; moveEndPoint(true); moveEndPoint(); return rng; }; function getLocation() {
            var rng = t.getRng(true), root = dom.getRoot(), bookmark = {}; function getPoint(rng, start) {
                var container = rng[start ? 'startContainer' : 'endContainer'], offset = rng[start ? 'startOffset' : 'endOffset'], point = [], node, childNodes, after = 0; if (container.nodeType == 3) {
                    if (normalized) {
                        for (node = container.previousSibling; node && node.nodeType == 3; node = node.previousSibling)
                            offset += node.nodeValue.length;
                    }
                    point.push(offset);
                } else {
                    childNodes = container.childNodes; if (offset >= childNodes.length && childNodes.length) { after = 1; offset = Math.max(0, childNodes.length - 1); }
                    point.push(t.dom.nodeIndex(childNodes[offset], normalized) + after);
                }
                for (; container && container != root; container = container.parentNode)
                    point.push(t.dom.nodeIndex(container, normalized)); return point;
            }; bookmark.start = getPoint(rng, true); if (!t.isCollapsed())
                bookmark.end = getPoint(rng); return bookmark;
        }; if (type == 2) {
            if (t.tridentSel)
                return t.tridentSel.getBookmark(type); return getLocation();
        }
        if (type) {
            rng = t.getRng(); if (rng.setStart) { rng = { startContainer: rng.startContainer, startOffset: rng.startOffset, endContainer: rng.endContainer, endOffset: rng.endOffset }; }
            return { rng: rng };
        }
        rng = t.getRng(); id = dom.uniqueId(); collapsed = tinyMCE.activeEditor.selection.isCollapsed(); styles = 'overflow:hidden;line-height:0px'; if (rng.duplicate || rng.item) {
            if (!rng.item) {
                rng2 = rng.duplicate(); try {
                    rng.collapse(); rng.pasteHTML('<span data-mce-type="bookmark" id="' + id + '_start" style="' + styles + '">' + chr + '</span>'); if (!collapsed) {
                        rng2.collapse(false); rng.moveToElementText(rng2.parentElement()); if (rng.compareEndPoints('StartToEnd', rng2) === 0)
                            rng2.move('character', -1); rng2.pasteHTML('<span data-mce-type="bookmark" id="' + id + '_end" style="' + styles + '">' + chr + '</span>');
                    } 
                } catch (ex) { return null; } 
            } else { element = rng.item(0); name = element.nodeName; return { name: name, index: findIndex(name, element) }; } 
        } else {
            element = t.getNode(); name = element.nodeName; if (name == 'IMG')
                return { name: name, index: findIndex(name, element) }; rng2 = normalizeTableCellSelection(rng.cloneRange()); if (!collapsed) { rng2.collapse(false); rng2.insertNode(dom.create('span', { 'data-mce-type': "bookmark", id: id + '_end', style: styles }, chr)); }
            rng = normalizeTableCellSelection(rng); rng.collapse(true); rng.insertNode(dom.create('span', { 'data-mce-type': "bookmark", id: id + '_start', style: styles }, chr));
        }
        t.moveToBookmark({ id: id, keep: 1 }); return { id: id };
    }, moveToBookmark: function (bookmark) {
        var t = this, dom = t.dom, marker1, marker2, rng, rng2, root, startContainer, endContainer, startOffset, endOffset; function setEndPoint(start) {
            var point = bookmark[start ? 'start' : 'end'], i, node, offset, children; if (point) {
                offset = point[0]; for (node = root, i = point.length - 1; i >= 1; i--) {
                    children = node.childNodes; if (point[i] > children.length - 1)
                        return; node = children[point[i]];
                }
                if (node.nodeType === 3)
                    offset = Math.min(point[0], node.nodeValue.length); if (node.nodeType === 1)
                    offset = Math.min(point[0], node.childNodes.length); if (start)
                    rng.setStart(node, offset); else
                    rng.setEnd(node, offset);
            }
            return true;
        }; function restoreEndPoint(suffix) {
            var marker = dom.get(bookmark.id + '_' + suffix), node, idx, next, prev, keep = bookmark.keep; if (marker) {
                node = marker.parentNode; if (suffix == 'start') {
                    if (!keep) { idx = dom.nodeIndex(marker); } else { node = marker.firstChild; idx = 1; }
                    startContainer = endContainer = node; startOffset = endOffset = idx;
                } else {
                    if (!keep) { idx = dom.nodeIndex(marker); } else { node = marker.firstChild; idx = 1; }
                    endContainer = node; endOffset = idx;
                }
                if (!keep) {
                    prev = marker.previousSibling; next = marker.nextSibling; each(tinymce.grep(marker.childNodes), function (node) {
                        if (node.nodeType == 3)
                            node.nodeValue = node.nodeValue.replace(/\uFEFF/g, '');
                    }); while (marker = dom.get(bookmark.id + '_' + suffix))
                        dom.remove(marker, 1); if (prev && next && prev.nodeType == next.nodeType && prev.nodeType == 3 && !tinymce.isOpera) { idx = prev.nodeValue.length; prev.appendData(next.nodeValue); dom.remove(next); if (suffix == 'start') { startContainer = endContainer = prev; startOffset = endOffset = idx; } else { endContainer = prev; endOffset = idx; } } 
                } 
            } 
        }; function addBogus(node) {
            if (dom.isBlock(node) && !node.innerHTML && !isIE)
                node.innerHTML = '<br data-mce-bogus="1" />'; return node;
        }; if (bookmark) {
            if (bookmark.start) {
                rng = dom.createRng(); root = dom.getRoot(); if (t.tridentSel)
                    return t.tridentSel.moveToBookmark(bookmark); if (setEndPoint(true) && setEndPoint()) { t.setRng(rng); } 
            } else if (bookmark.id) { restoreEndPoint('start'); restoreEndPoint('end'); if (startContainer) { rng = dom.createRng(); rng.setStart(addBogus(startContainer), startOffset); rng.setEnd(addBogus(endContainer), endOffset); t.setRng(rng); } } else if (bookmark.name) { t.select(dom.select(bookmark.name)[bookmark.index]); } else if (bookmark.rng) {
                rng = bookmark.rng; if (rng.startContainer) {
                    rng2 = t.dom.createRng(); try { rng2.setStart(rng.startContainer, rng.startOffset); rng2.setEnd(rng.endContainer, rng.endOffset); } catch (e) { }
                    rng = rng2;
                }
                t.setRng(rng);
            } 
        } 
    }, select: function (node, content) {
        var t = this, dom = t.dom, rng = dom.createRng(), idx; function setPoint(node, start) {
            var walker = new TreeWalker(node, node); do {
                if (node.nodeType == 3 && tinymce.trim(node.nodeValue).length !== 0) {
                    if (start)
                        rng.setStart(node, 0); else
                        rng.setEnd(node, node.nodeValue.length); return;
                }
                if (node.nodeName == 'BR') {
                    if (start)
                        rng.setStartBefore(node); else
                        rng.setEndBefore(node); return;
                } 
            } while (node = (start ? walker.next() : walker.prev()));
        }; if (node) {
            idx = dom.nodeIndex(node); rng.setStart(node.parentNode, idx); rng.setEnd(node.parentNode, idx + 1); if (content) { setPoint(node, 1); setPoint(node); }
            t.setRng(rng);
        }
        return node;
    }, isCollapsed: function () {
        var t = this, r = t.getRng(), s = t.getSel(); if (!r || r.item)
            return false; if (r.compareEndPoints)
            return r.compareEndPoints('StartToEnd', r) === 0; return !s || r.collapsed;
    }, collapse: function (to_start) {
        var self = this, rng = self.getRng(), node; if (rng.item) { node = rng.item(0); rng = self.win.document.body.createTextRange(); rng.moveToElementText(node); }
        rng.collapse(!!to_start); self.setRng(rng);
    }, getSel: function () { var t = this, w = this.win; return w.getSelection ? w.getSelection() : w.document.selection; }, getRng: function (w3c) {
        var self = this, selection, rng, elm, doc = self.win.document; if (w3c && self.tridentSel) { return self.tridentSel.getRangeAt(0); }
        try { if (selection = self.getSel()) { rng = selection.rangeCount > 0 ? selection.getRangeAt(0) : (selection.createRange ? selection.createRange() : doc.createRange()); } } catch (ex) { }
        if (tinymce.isIE && !tinymce.isIE11 && rng && rng.setStart && doc.selection.createRange().item) { elm = doc.selection.createRange().item(0); rng = doc.createRange(); rng.setStartBefore(elm); rng.setEndAfter(elm); }
        if (!rng) { rng = doc.createRange ? doc.createRange() : doc.body.createTextRange(); }
        if (rng.setStart && rng.startContainer.nodeType === 9 && rng.collapsed) { elm = self.dom.getRoot(); rng.setStart(elm, 0); rng.setEnd(elm, 0); }
        if (self.selectedRange && self.explicitRange) { if (rng.compareBoundaryPoints(rng.START_TO_START, self.selectedRange) === 0 && rng.compareBoundaryPoints(rng.END_TO_END, self.selectedRange) === 0) { rng = self.explicitRange; } else { self.selectedRange = null; self.explicitRange = null; } }
        return rng;
    }, setRng: function (r, forward) {
        var s, t = this; if (!t.tridentSel) {
            s = t.getSel(); if (s) {
                t.explicitRange = r; try { s.removeAllRanges(); } catch (ex) { }
                s.addRange(r); if (forward === false && s.extend) { s.collapse(r.endContainer, r.endOffset); s.extend(r.startContainer, r.startOffset); }
                t.selectedRange = s.rangeCount > 0 ? s.getRangeAt(0) : null;
            } 
        } else {
            if (r.cloneRange) { try { t.tridentSel.addRange(r); return; } catch (ex) { } }
            try { r.select(); } catch (ex) { } 
        } 
    }, setNode: function (n) { var t = this; t.setContent(t.dom.getOuterHTML(n)); return n; }, getNode: function () {
        var t = this, rng = t.getRng(), sel = t.getSel(), elm, start = rng.startContainer, end = rng.endContainer; function skipEmptyTextNodes(n, forwards) {
            var orig = n; while (n && n.nodeType === 3 && n.length === 0) { n = forwards ? n.nextSibling : n.previousSibling; }
            return n || orig;
        }; if (!rng)
            return t.dom.getRoot(); if (rng.setStart) {
            elm = rng.commonAncestorContainer; if (!rng.collapsed) {
                if (rng.startContainer == rng.endContainer) {
                    if (rng.endOffset - rng.startOffset < 2) {
                        if (rng.startContainer.hasChildNodes())
                            elm = rng.startContainer.childNodes[rng.startOffset];
                    } 
                }
                if (start.nodeType === 3 && end.nodeType === 3) {
                    if (start.length === rng.startOffset) { start = skipEmptyTextNodes(start.nextSibling, true); } else { start = start.parentNode; }
                    if (rng.endOffset === 0) { end = skipEmptyTextNodes(end.previousSibling, false); } else { end = end.parentNode; }
                    if (start && start === end)
                        return start;
                } 
            }
            if (elm && elm.nodeType == 3)
                return elm.parentNode; return elm;
        }
        return rng.item ? rng.item(0) : rng.parentElement();
    }, getSelectedBlocks: function (st, en) {
        var t = this, dom = t.dom, sb, eb, n, bl = []; sb = dom.getParent(st || t.getStart(), dom.isBlock); eb = dom.getParent(en || t.getEnd(), dom.isBlock); if (sb)
            bl.push(sb); if (sb && eb && sb != eb) {
            n = sb; var walker = new TreeWalker(sb, dom.getRoot()); while ((n = walker.next()) && n != eb) {
                if (dom.isBlock(n))
                    bl.push(n);
            } 
        }
        if (eb && sb != eb)
            bl.push(eb); return bl;
    }, isForward: function () {
        var dom = this.dom, sel = this.getSel(), anchorRange, focusRange; if (!sel || sel.anchorNode == null || sel.focusNode == null) { return true; }
        anchorRange = dom.createRng(); anchorRange.setStart(sel.anchorNode, sel.anchorOffset); anchorRange.collapse(true); focusRange = dom.createRng(); focusRange.setStart(sel.focusNode, sel.focusOffset); focusRange.collapse(true); return anchorRange.compareBoundaryPoints(anchorRange.START_TO_START, focusRange) <= 0;
    }, normalize: function () {
        var self = this, rng, normalized, collapsed, node, sibling; function normalizeEndPoint(start) {
            var container, offset, walker, dom = self.dom, body = dom.getRoot(), node, nonEmptyElementsMap, nodeName; function hasBrBeforeAfter(node, left) { var walker = new TreeWalker(node, dom.getParent(node.parentNode, dom.isBlock) || body); while (node = walker[left ? 'prev' : 'next']()) { if (node.nodeName === "BR") { return true; } } }; function findTextNodeRelative(left, startNode) {
                var walker, lastInlineElement; startNode = startNode || container; walker = new TreeWalker(startNode, dom.getParent(startNode.parentNode, dom.isBlock) || body); while (node = walker[left ? 'prev' : 'next']()) {
                    if (node.nodeType === 3 && node.nodeValue.length > 0) { container = node; offset = left ? node.nodeValue.length : 0; normalized = true; return; }
                    if (dom.isBlock(node) || nonEmptyElementsMap[node.nodeName.toLowerCase()]) { return; }
                    lastInlineElement = node;
                }
                if (collapsed && lastInlineElement) { container = lastInlineElement; normalized = true; offset = 0; } 
            }; container = rng[(start ? 'start' : 'end') + 'Container']; offset = rng[(start ? 'start' : 'end') + 'Offset']; nonEmptyElementsMap = dom.schema.getNonEmptyElements(); if (container.nodeType === 9) { container = dom.getRoot(); offset = 0; }
            if (container === body) {
                if (start) { node = container.childNodes[offset > 0 ? offset - 1 : 0]; if (node) { nodeName = node.nodeName.toLowerCase(); if (nonEmptyElementsMap[node.nodeName] || node.nodeName == "TABLE") { return; } } }
                if (container.hasChildNodes()) {
                    container = container.childNodes[Math.min(!start && offset > 0 ? offset - 1 : offset, container.childNodes.length - 1)]; offset = 0; if (container.hasChildNodes() && !/TABLE/.test(container.nodeName)) {
                        node = container; walker = new TreeWalker(container, body); do {
                            if (node.nodeType === 3 && node.nodeValue.length > 0) { offset = start ? 0 : node.nodeValue.length; container = node; normalized = true; break; }
                            if (nonEmptyElementsMap[node.nodeName.toLowerCase()]) {
                                offset = dom.nodeIndex(node); container = node.parentNode; if (node.nodeName == "IMG" && !start) { offset++; }
                                normalized = true; break;
                            } 
                        } while (node = (start ? walker.next() : walker.prev()));
                    } 
                } 
            }
            if (collapsed) {
                if (container.nodeType === 3 && offset === 0) { findTextNodeRelative(true); }
                if (container.nodeType === 1) { node = container.childNodes[offset]; if (node && node.nodeName === 'BR' && !hasBrBeforeAfter(node) && !hasBrBeforeAfter(node, true)) { findTextNodeRelative(true, container.childNodes[offset]); } } 
            }
            if (start && !collapsed && container.nodeType === 3 && offset === container.nodeValue.length) { findTextNodeRelative(false); }
            if (normalized)
                rng['set' + (start ? 'Start' : 'End')](container, offset);
        }; if (tinymce.isIE)
            return; rng = self.getRng(); collapsed = rng.collapsed; normalizeEndPoint(true); if (!collapsed)
            normalizeEndPoint(); if (normalized) {
            if (collapsed) { rng.collapse(true); }
            self.setRng(rng, self.isForward());
        } 
    }, selectorChanged: function (selector, callback) {
        var self = this, currentSelectors; if (!self.selectorChangedData) {
            self.selectorChangedData = {}; currentSelectors = {}; self.editor.onNodeChange.addToTop(function (ed, cm, node) {
                var dom = self.dom, parents = dom.getParents(node, null, dom.getRoot()), matchedSelectors = {}; each(self.selectorChangedData, function (callbacks, selector) {
                    each(parents, function (node) {
                        if (dom.is(node, selector)) {
                            if (!currentSelectors[selector]) { each(callbacks, function (callback) { callback(true, { node: node, selector: selector, parents: parents }); }); currentSelectors[selector] = callbacks; }
                            matchedSelectors[selector] = callbacks; return false;
                        } 
                    });
                }); each(currentSelectors, function (callbacks, selector) { if (!matchedSelectors[selector]) { delete currentSelectors[selector]; each(callbacks, function (callback) { callback(false, { node: node, selector: selector, parents: parents }); }); } });
            });
        }
        if (!self.selectorChangedData[selector]) { self.selectorChangedData[selector] = []; }
        self.selectorChangedData[selector].push(callback); return self;
    }, scrollIntoView: function (elm) { var y, viewPort, self = this, dom = self.dom; viewPort = dom.getViewPort(self.editor.getWin()); y = dom.getPos(elm).y; if (y < viewPort.y || y + 25 > viewPort.y + viewPort.h) { self.editor.getWin().scrollTo(0, y < viewPort.y ? y : y - viewPort.h + 25); } }, destroy: function (manual) {
        var self = this; self.win = null; if (!manual)
            tinymce.removeUnload(self.destroy);
    }, _fixIESelection: function () {
        var dom = this.dom, doc = dom.doc, body = doc.body, started, startRng, htmlElm; function rngFromPoint(x, y) {
            var rng = body.createTextRange(); try { rng.moveToPoint(x, y); } catch (ex) { rng = null; }
            return rng;
        }; function selectionChange(e) {
            var pointRng; if (e.button) {
                pointRng = rngFromPoint(e.x, e.y); if (pointRng) {
                    if (pointRng.compareEndPoints('StartToStart', startRng) > 0)
                        pointRng.setEndPoint('StartToStart', startRng); else
                        pointRng.setEndPoint('EndToEnd', startRng); pointRng.select();
                } 
            } else
                endSelection();
        }
        function endSelection() {
            var rng = doc.selection.createRange(); if (startRng && !rng.item && rng.compareEndPoints('StartToEnd', rng) === 0)
                startRng.select(); dom.unbind(doc, 'mouseup', endSelection); dom.unbind(doc, 'mousemove', selectionChange); startRng = started = 0;
        }; doc.documentElement.unselectable = true; dom.bind(doc, ['mousedown', 'contextmenu'], function (e) {
            if (e.target.nodeName === 'HTML') {
                if (started)
                    endSelection(); htmlElm = doc.documentElement; if (htmlElm.scrollHeight > htmlElm.clientHeight)
                    return; started = 1; startRng = rngFromPoint(e.x, e.y); if (startRng) { dom.bind(doc, 'mouseup', endSelection); dom.bind(doc, 'mousemove', selectionChange); dom.win.focus(); startRng.select(); } 
            } 
        });
    } 
    });
})(tinymce); (function (tinymce) {
    tinymce.dom.Serializer = function (settings, dom, schema) {
        var onPreProcess, onPostProcess, isIE = tinymce.isIE, each = tinymce.each, htmlParser; if (!settings.apply_source_formatting)
            settings.indent = false; dom = dom || tinymce.DOM; schema = schema || new tinymce.html.Schema(settings); settings.entity_encoding = settings.entity_encoding || 'named'; settings.remove_trailing_brs = "remove_trailing_brs" in settings ? settings.remove_trailing_brs : true; onPreProcess = new tinymce.util.Dispatcher(self); onPostProcess = new tinymce.util.Dispatcher(self); htmlParser = new tinymce.html.DomParser(settings, schema); htmlParser.addAttributeFilter('src,href,style', function (nodes, name) {
                var i = nodes.length, node, value, internalName = 'data-mce-' + name, urlConverter = settings.url_converter, urlConverterScope = settings.url_converter_scope, undef; while (i--) {
                    node = nodes[i]; value = node.attributes.map[internalName]; if (value !== undef) { node.attr(name, value.length > 0 ? value : null); node.attr(internalName, null); } else {
                        value = node.attributes.map[name]; if (name === "style")
                            value = dom.serializeStyle(dom.parseStyle(value), node.name); else if (urlConverter)
                            value = urlConverter.call(urlConverterScope, value, name, node.name); node.attr(name, value.length > 0 ? value : null);
                    } 
                } 
            }); htmlParser.addAttributeFilter('class', function (nodes, name) { var i = nodes.length, node, value; while (i--) { node = nodes[i]; value = node.attr('class').replace(/(?:^|\s)mce(Item\w+|Selected)(?!\S)/g, ''); node.attr('class', value.length > 0 ? value : null); } }); htmlParser.addAttributeFilter('data-mce-type', function (nodes, name, args) {
                var i = nodes.length, node; while (i--) {
                    node = nodes[i]; if (node.attributes.map['data-mce-type'] === 'bookmark' && !args.cleanup)
                        node.remove();
                } 
            }); htmlParser.addAttributeFilter('data-mce-expando', function (nodes, name, args) { var i = nodes.length; while (i--) { nodes[i].attr(name, null); } }); htmlParser.addNodeFilter('noscript', function (nodes) { var i = nodes.length, node; while (i--) { node = nodes[i].firstChild; if (node) { node.value = tinymce.html.Entities.decode(node.value); } } }); htmlParser.addNodeFilter('script,style', function (nodes, name) {
                var i = nodes.length, node, value; function trim(value) { return value.replace(/(<!--\[CDATA\[|\]\]-->)/g, '\n').replace(/^[\r\n]*|[\r\n]*$/g, '').replace(/^\s*((<!--)?(\s*\/\/)?\s*<!\[CDATA\[|(<!--\s*)?\/\*\s*<!\[CDATA\[\s*\*\/|(\/\/)?\s*<!--|\/\*\s*<!--\s*\*\/)\s*[\r\n]*/gi, '').replace(/\s*(\/\*\s*\]\]>\s*\*\/(-->)?|\s*\/\/\s*\]\]>(-->)?|\/\/\s*(-->)?|\]\]>|\/\*\s*-->\s*\*\/|\s*-->\s*)\s*$/g, ''); }; while (i--) {
                    node = nodes[i]; value = node.firstChild ? node.firstChild.value : ''; if (name === "script") {
                        node.attr('type', (node.attr('type') || 'text/javascript').replace(/^mce\-/, '')); if (value.length > 0)
                            node.firstChild.value = '// <![CDATA[\n' + trim(value) + '\n// ]]>';
                    } else {
                        if (value.length > 0)
                            node.firstChild.value = '<!--\n' + trim(value) + '\n-->';
                    } 
                } 
            }); htmlParser.addNodeFilter('#comment', function (nodes, name) { var i = nodes.length, node; while (i--) { node = nodes[i]; if (node.value.indexOf('[CDATA[') === 0) { node.name = '#cdata'; node.type = 4; node.value = node.value.replace(/^\[CDATA\[|\]\]$/g, ''); } else if (node.value.indexOf('mce:protected ') === 0) { node.name = "#text"; node.type = 3; node.raw = true; node.value = unescape(node.value).substr(14); } } }); htmlParser.addNodeFilter('xml:namespace,input', function (nodes, name) {
                var i = nodes.length, node; while (i--) {
                    node = nodes[i]; if (node.type === 7)
                        node.remove(); else if (node.type === 1) {
                        if (name === "input" && !("type" in node.attributes.map))
                            node.attr('type', 'text');
                    } 
                } 
            }); if (settings.fix_list_elements) { htmlParser.addNodeFilter('ul,ol', function (nodes, name) { var i = nodes.length, node, parentNode; while (i--) { node = nodes[i]; parentNode = node.parent; if (parentNode.name === 'ul' || parentNode.name === 'ol') { if (node.prev && node.prev.name === 'li') { node.prev.append(node); } } } }); }
        htmlParser.addAttributeFilter('data-mce-src,data-mce-href,data-mce-style', function (nodes, name) { var i = nodes.length; while (i--) { nodes[i].attr(name, null); } }); return { schema: schema, addNodeFilter: htmlParser.addNodeFilter, addAttributeFilter: htmlParser.addAttributeFilter, onPreProcess: onPreProcess, onPostProcess: onPostProcess, serialize: function (node, args) {
            var impl, doc, oldDoc, htmlSerializer, content; if (isIE && dom.select('script,style,select,map').length > 0) { content = node.innerHTML; node = node.cloneNode(false); dom.setHTML(node, content); } else
                node = node.cloneNode(true); impl = node.ownerDocument.implementation; if (impl.createHTMLDocument) {
                doc = impl.createHTMLDocument(""); each(node.nodeName == 'BODY' ? node.childNodes : [node], function (node) { doc.body.appendChild(doc.importNode(node, true)); }); if (node.nodeName != 'BODY')
                    node = doc.body.firstChild; else
                    node = doc.body; oldDoc = dom.doc; dom.doc = doc;
            }
            args = args || {}; args.format = args.format || 'html'; if (!args.no_events) { args.node = node; onPreProcess.dispatch(self, args); }
            htmlSerializer = new tinymce.html.Serializer(settings, schema); args.content = htmlSerializer.serialize(htmlParser.parse(tinymce.trim(args.getInner ? node.innerHTML : dom.getOuterHTML(node)), args)); if (!args.cleanup)
                args.content = args.content.replace(/\uFEFF/g, ''); if (!args.no_events)
                onPostProcess.dispatch(self, args); if (oldDoc)
                dom.doc = oldDoc; args.node = null; return args.content;
        }, addRules: function (rules) { schema.addValidElements(rules); }, setRules: function (rules) { schema.setValidElements(rules); } 
        };
    };
})(tinymce); (function (tinymce) {
    tinymce.dom.ScriptLoader = function (settings) {
        var QUEUED = 0, LOADING = 1, LOADED = 2, states = {}, queue = [], scriptLoadedCallbacks = {}, queueLoadedCallbacks = [], loading = 0, undef; function loadScript(url, callback) {
            var t = this, dom = tinymce.DOM, elm, uri, loc, id; function done() {
                dom.remove(id); if (elm)
                    elm.onreadystatechange = elm.onload = elm = null; callback();
            }; function error() {
                if (typeof (console) !== "undefined" && console.log)
                    console.log("Failed to load: " + url);
            }; id = dom.uniqueId(); if (tinymce.isIE6) { uri = new tinymce.util.URI(url); loc = location; if (uri.host == loc.hostname && uri.port == loc.port && (uri.protocol + ':') == loc.protocol && uri.protocol.toLowerCase() != 'file') { tinymce.util.XHR.send({ url: tinymce._addVer(uri.getURI()), success: function (content) { var script = dom.create('script', { type: 'text/javascript' }); script.text = content; document.getElementsByTagName('head')[0].appendChild(script); dom.remove(script); done(); }, error: error }); return; } }
            elm = document.createElement('script'); elm.id = id; elm.type = 'text/javascript'; elm.src = tinymce._addVer(url); if (!tinymce.isIE || tinymce.isIE11)
                elm.onload = done; elm.onerror = error; if (!tinymce.isOpera) {
                elm.onreadystatechange = function () {
                    var state = elm.readyState; if (state == 'complete' || state == 'loaded')
                        done();
                };
            }
            (document.getElementsByTagName('head')[0] || document.body).appendChild(elm);
        }; this.isDone = function (url) { return states[url] == LOADED; }; this.markDone = function (url) { states[url] = LOADED; }; this.add = this.load = function (url, callback, scope) {
            var item, state = states[url]; if (state == undef) { queue.push(url); states[url] = QUEUED; }
            if (callback) {
                if (!scriptLoadedCallbacks[url])
                    scriptLoadedCallbacks[url] = []; scriptLoadedCallbacks[url].push({ func: callback, scope: scope || this });
            } 
        }; this.loadQueue = function (callback, scope) { this.loadScripts(queue, callback, scope); }; this.loadScripts = function (scripts, callback, scope) {
            var loadScripts; function execScriptLoadedCallbacks(url) { tinymce.each(scriptLoadedCallbacks[url], function (callback) { callback.func.call(callback.scope); }); scriptLoadedCallbacks[url] = undef; }; queueLoadedCallbacks.push({ func: callback, scope: scope || this }); loadScripts = function () {
                var loadingScripts = tinymce.grep(scripts); scripts.length = 0; tinymce.each(loadingScripts, function (url) {
                    if (states[url] == LOADED) { execScriptLoadedCallbacks(url); return; }
                    if (states[url] != LOADING) { states[url] = LOADING; loading++; loadScript(url, function () { states[url] = LOADED; loading--; execScriptLoadedCallbacks(url); loadScripts(); }); } 
                }); if (!loading) { tinymce.each(queueLoadedCallbacks, function (callback) { callback.func.call(callback.scope); }); queueLoadedCallbacks.length = 0; } 
            }; loadScripts();
        };
    }; tinymce.ScriptLoader = new tinymce.dom.ScriptLoader();
})(tinymce); (function (tinymce) {
    tinymce.dom.RangeUtils = function (dom) {
        var INVISIBLE_CHAR = '\uFEFF'; this.walk = function (rng, callback) {
            var startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset, ancestor, startPoint, endPoint, node, parent, siblings, nodes; nodes = dom.select('td.mceSelected,th.mceSelected'); if (nodes.length > 0) { tinymce.each(nodes, function (node) { callback([node]); }); return; }
            function exclude(nodes) {
                var node; node = nodes[0]; if (node.nodeType === 3 && node === startContainer && startOffset >= node.nodeValue.length) { nodes.splice(0, 1); }
                node = nodes[nodes.length - 1]; if (endOffset === 0 && nodes.length > 0 && node === endContainer && node.nodeType === 3) { nodes.splice(nodes.length - 1, 1); }
                return nodes;
            }; function collectSiblings(node, name, end_node) {
                var siblings = []; for (; node && node != end_node; node = node[name])
                    siblings.push(node); return siblings;
            }; function findEndPoint(node, root) {
                do {
                    if (node.parentNode == root)
                        return node; node = node.parentNode;
                } while (node);
            }; function walkBoundary(start_node, end_node, next) {
                var siblingName = next ? 'nextSibling' : 'previousSibling'; for (node = start_node, parent = node.parentNode; node && node != end_node; node = parent) {
                    parent = node.parentNode; siblings = collectSiblings(node == start_node ? node : node[siblingName], siblingName); if (siblings.length) {
                        if (!next)
                            siblings.reverse(); callback(exclude(siblings));
                    } 
                } 
            }; if (startContainer.nodeType == 1 && startContainer.hasChildNodes())
                startContainer = startContainer.childNodes[startOffset]; if (endContainer.nodeType == 1 && endContainer.hasChildNodes())
                endContainer = endContainer.childNodes[Math.min(endOffset - 1, endContainer.childNodes.length - 1)]; if (startContainer == endContainer)
                return callback(exclude([startContainer])); ancestor = dom.findCommonAncestor(startContainer, endContainer); for (node = startContainer; node; node = node.parentNode) {
                if (node === endContainer)
                    return walkBoundary(startContainer, ancestor, true); if (node === ancestor)
                    break;
            }
            for (node = endContainer; node; node = node.parentNode) {
                if (node === startContainer)
                    return walkBoundary(endContainer, ancestor); if (node === ancestor)
                    break;
            }
            startPoint = findEndPoint(startContainer, ancestor) || startContainer; endPoint = findEndPoint(endContainer, ancestor) || endContainer; walkBoundary(startContainer, startPoint, true); siblings = collectSiblings(startPoint == startContainer ? startPoint : startPoint.nextSibling, 'nextSibling', endPoint == endContainer ? endPoint.nextSibling : endPoint); if (siblings.length)
                callback(exclude(siblings)); walkBoundary(endContainer, endPoint);
        }; this.split = function (rng) {
            var startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset; function splitText(node, offset) { return node.splitText(offset); }; if (startContainer == endContainer && startContainer.nodeType == 3) { if (startOffset > 0 && startOffset < startContainer.nodeValue.length) { endContainer = splitText(startContainer, startOffset); startContainer = endContainer.previousSibling; if (endOffset > startOffset) { endOffset = endOffset - startOffset; startContainer = endContainer = splitText(endContainer, endOffset).previousSibling; endOffset = endContainer.nodeValue.length; startOffset = 0; } else { endOffset = 0; } } } else {
                if (startContainer.nodeType == 3 && startOffset > 0 && startOffset < startContainer.nodeValue.length) { startContainer = splitText(startContainer, startOffset); startOffset = 0; }
                if (endContainer.nodeType == 3 && endOffset > 0 && endOffset < endContainer.nodeValue.length) { endContainer = splitText(endContainer, endOffset).previousSibling; endOffset = endContainer.nodeValue.length; } 
            }
            return { startContainer: startContainer, startOffset: startOffset, endContainer: endContainer, endOffset: endOffset };
        };
    }; tinymce.dom.RangeUtils.compareRanges = function (rng1, rng2) {
        if (rng1 && rng2) {
            if (rng1.item || rng1.duplicate) {
                if (rng1.item && rng2.item && rng1.item(0) === rng2.item(0))
                    return true; if (rng1.isEqual && rng2.isEqual && rng2.isEqual(rng1))
                    return true;
            } else { return rng1.startContainer == rng2.startContainer && rng1.startOffset == rng2.startOffset; } 
        }
        return false;
    };
})(tinymce); (function (tinymce) {
    var Event = tinymce.dom.Event, each = tinymce.each; tinymce.create('tinymce.ui.KeyboardNavigation', { KeyboardNavigation: function (settings, dom) {
        var t = this, root = settings.root, items = settings.items, enableUpDown = settings.enableUpDown, enableLeftRight = settings.enableLeftRight || !settings.enableUpDown, excludeFromTabOrder = settings.excludeFromTabOrder, itemFocussed, itemBlurred, rootKeydown, rootFocussed, focussedId; dom = dom || tinymce.DOM; itemFocussed = function (evt) { focussedId = evt.target.id; }; itemBlurred = function (evt) { dom.setAttrib(evt.target.id, 'tabindex', '-1'); }; rootFocussed = function (evt) { var item = dom.get(focussedId); dom.setAttrib(item, 'tabindex', '0'); item.focus(); }; t.focus = function () { dom.get(focussedId).focus(); }; t.destroy = function () { each(items, function (item) { var elm = dom.get(item.id); dom.unbind(elm, 'focus', itemFocussed); dom.unbind(elm, 'blur', itemBlurred); }); var rootElm = dom.get(root); dom.unbind(rootElm, 'focus', rootFocussed); dom.unbind(rootElm, 'keydown', rootKeydown); items = dom = root = t.focus = itemFocussed = itemBlurred = rootKeydown = rootFocussed = null; t.destroy = function () { }; }; t.moveFocus = function (dir, evt) {
            var idx = -1, controls = t.controls, newFocus; if (!focussedId)
                return; each(items, function (item, index) { if (item.id === focussedId) { idx = index; return false; } }); idx += dir; if (idx < 0) { idx = items.length - 1; } else if (idx >= items.length) { idx = 0; }
            newFocus = items[idx]; dom.setAttrib(focussedId, 'tabindex', '-1'); dom.setAttrib(newFocus.id, 'tabindex', '0'); dom.get(newFocus.id).focus(); if (settings.actOnFocus) { settings.onAction(newFocus.id); }
            if (evt)
                Event.cancel(evt);
        }; rootKeydown = function (evt) {
            var DOM_VK_LEFT = 37, DOM_VK_RIGHT = 39, DOM_VK_UP = 38, DOM_VK_DOWN = 40, DOM_VK_ESCAPE = 27, DOM_VK_ENTER = 14, DOM_VK_RETURN = 13, DOM_VK_SPACE = 32; switch (evt.keyCode) {
                case DOM_VK_LEFT: if (enableLeftRight) t.moveFocus(-1); Event.cancel(evt); break; case DOM_VK_RIGHT: if (enableLeftRight) t.moveFocus(1); Event.cancel(evt); break; case DOM_VK_UP: if (enableUpDown) t.moveFocus(-1); Event.cancel(evt); break; case DOM_VK_DOWN: if (enableUpDown) t.moveFocus(1); Event.cancel(evt); break; case DOM_VK_ESCAPE: if (settings.onCancel) { settings.onCancel(); Event.cancel(evt); }
                    break; case DOM_VK_ENTER: case DOM_VK_RETURN: case DOM_VK_SPACE: if (settings.onAction) { settings.onAction(focussedId); Event.cancel(evt); }
                    break;
            } 
        }; each(items, function (item, idx) {
            var tabindex, elm; if (!item.id) { item.id = dom.uniqueId('_mce_item_'); }
            elm = dom.get(item.id); if (excludeFromTabOrder) { dom.bind(elm, 'blur', itemBlurred); tabindex = '-1'; } else { tabindex = (idx === 0 ? '0' : '-1'); }
            elm.setAttribute('tabindex', tabindex); dom.bind(elm, 'focus', itemFocussed);
        }); if (items[0]) { focussedId = items[0].id; }
        dom.setAttrib(root, 'tabindex', '-1'); var rootElm = dom.get(root); dom.bind(rootElm, 'focus', rootFocussed); dom.bind(rootElm, 'keydown', rootKeydown);
    } 
    });
})(tinymce); (function (tinymce) {
    var DOM = tinymce.DOM, is = tinymce.is; tinymce.create('tinymce.ui.Control', { Control: function (id, s, editor) { this.id = id; this.settings = s = s || {}; this.rendered = false; this.onRender = new tinymce.util.Dispatcher(this); this.classPrefix = ''; this.scope = s.scope || this; this.disabled = 0; this.active = 0; this.editor = editor; }, setAriaProperty: function (property, value) { var element = DOM.get(this.id + '_aria') || DOM.get(this.id); if (element) { DOM.setAttrib(element, 'aria-' + property, !!value); } }, focus: function () { DOM.get(this.id).focus(); }, setDisabled: function (s) { if (s != this.disabled) { this.setAriaProperty('disabled', s); this.setState('Disabled', s); this.setState('Enabled', !s); this.disabled = s; } }, isDisabled: function () { return this.disabled; }, setActive: function (s) { if (s != this.active) { this.setState('Active', s); this.active = s; this.setAriaProperty('pressed', s); } }, isActive: function () { return this.active; }, setState: function (c, s) {
        var n = DOM.get(this.id); c = this.classPrefix + c; if (s)
            DOM.addClass(n, c); else
            DOM.removeClass(n, c);
    }, isRendered: function () { return this.rendered; }, renderHTML: function () { }, renderTo: function (n) { DOM.setHTML(n, this.renderHTML()); }, postRender: function () {
        var t = this, b; if (is(t.disabled)) { b = t.disabled; t.disabled = -1; t.setDisabled(b); }
        if (is(t.active)) { b = t.active; t.active = -1; t.setActive(b); } 
    }, remove: function () { DOM.remove(this.id); this.destroy(); }, destroy: function () { tinymce.dom.Event.clear(this.id); } 
    });
})(tinymce); tinymce.create('tinymce.ui.Container:tinymce.ui.Control', { Container: function (id, s, editor) { this.parent(id, s, editor); this.controls = []; this.lookup = {}; }, add: function (c) { this.lookup[c.id] = c; this.controls.push(c); return c; }, get: function (n) { return this.lookup[n]; } }); tinymce.create('tinymce.ui.Separator:tinymce.ui.Control', { Separator: function (id, s) { this.parent(id, s); this.classPrefix = 'mceSeparator'; this.setDisabled(true); }, renderHTML: function () { return tinymce.DOM.createHTML('span', { 'class': this.classPrefix, role: 'separator', 'aria-orientation': 'vertical', tabindex: '-1' }); } }); (function (tinymce) {
    var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, walk = tinymce.walk; tinymce.create('tinymce.ui.MenuItem:tinymce.ui.Control', { MenuItem: function (id, s) { this.parent(id, s); this.classPrefix = 'mceMenuItem'; }, setSelected: function (s) { this.setState('Selected', s); this.setAriaProperty('checked', !!s); this.selected = s; }, isSelected: function () { return this.selected; }, postRender: function () {
        var t = this; t.parent(); if (is(t.selected))
            t.setSelected(t.selected);
    } 
    });
})(tinymce); (function (tinymce) {
    var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, walk = tinymce.walk; tinymce.create('tinymce.ui.Menu:tinymce.ui.MenuItem', { Menu: function (id, s) { var t = this; t.parent(id, s); t.items = {}; t.collapsed = false; t.menuCount = 0; t.onAddItem = new tinymce.util.Dispatcher(this); }, expand: function (d) {
        var t = this; if (d) {
            walk(t, function (o) {
                if (o.expand)
                    o.expand();
            }, 'items', t);
        }
        t.collapsed = false;
    }, collapse: function (d) {
        var t = this; if (d) {
            walk(t, function (o) {
                if (o.collapse)
                    o.collapse();
            }, 'items', t);
        }
        t.collapsed = true;
    }, isCollapsed: function () { return this.collapsed; }, add: function (o) {
        if (!o.settings)
            o = new tinymce.ui.MenuItem(o.id || DOM.uniqueId(), o); this.onAddItem.dispatch(this, o); return this.items[o.id] = o;
    }, addSeparator: function () { return this.add({ separator: true }); }, addMenu: function (o) {
        if (!o.collapse)
            o = this.createMenu(o); this.menuCount++; return this.add(o);
    }, hasMenus: function () { return this.menuCount !== 0; }, remove: function (o) { delete this.items[o.id]; }, removeAll: function () {
        var t = this; walk(t, function (o) {
            if (o.removeAll)
                o.removeAll(); else
                o.remove(); o.destroy();
        }, 'items', t); t.items = {};
    }, createMenu: function (o) { var m = new tinymce.ui.Menu(o.id || DOM.uniqueId(), o); m.onAddItem.add(this.onAddItem.dispatch, this.onAddItem); return m; } 
    });
})(tinymce); (function (tinymce) {
    var is = tinymce.is, DOM = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event, Element = tinymce.dom.Element; tinymce.create('tinymce.ui.DropMenu:tinymce.ui.Menu', { DropMenu: function (id, s) {
        s = s || {}; s.container = s.container || DOM.doc.body; s.offset_x = s.offset_x || 0; s.offset_y = s.offset_y || 0; s.vp_offset_x = s.vp_offset_x || 0; s.vp_offset_y = s.vp_offset_y || 0; if (is(s.icons) && !s.icons)
            s['class'] += ' mceNoIcons'; this.parent(id, s); this.onShowMenu = new tinymce.util.Dispatcher(this); this.onHideMenu = new tinymce.util.Dispatcher(this); this.classPrefix = 'mceMenu';
    }, createMenu: function (s) { var t = this, cs = t.settings, m; s.container = s.container || cs.container; s.parent = t; s.constrain = s.constrain || cs.constrain; s['class'] = s['class'] || cs['class']; s.vp_offset_x = s.vp_offset_x || cs.vp_offset_x; s.vp_offset_y = s.vp_offset_y || cs.vp_offset_y; s.keyboard_focus = cs.keyboard_focus; m = new tinymce.ui.DropMenu(s.id || DOM.uniqueId(), s); m.onAddItem.add(t.onAddItem.dispatch, t.onAddItem); return m; }, focus: function () { var t = this; if (t.keyboardNav) { t.keyboardNav.focus(); } }, update: function () {
        var t = this, s = t.settings, tb = DOM.get('menu_' + t.id + '_tbl'), co = DOM.get('menu_' + t.id + '_co'), tw, th; tw = s.max_width ? Math.min(tb.offsetWidth, s.max_width) : tb.offsetWidth; th = s.max_height ? Math.min(tb.offsetHeight, s.max_height) : tb.offsetHeight; if (!DOM.boxModel)
            t.element.setStyles({ width: tw + 2, height: th + 2 }); else
            t.element.setStyles({ width: tw, height: th }); if (s.max_width)
            DOM.setStyle(co, 'width', tw); if (s.max_height) {
            DOM.setStyle(co, 'height', th); if (tb.clientHeight < s.max_height)
                DOM.setStyle(co, 'overflow', 'hidden');
        } 
    }, showMenu: function (x, y, px) {
        var t = this, s = t.settings, co, vp = DOM.getViewPort(), w, h, mx, my, ot = 2, dm, tb, cp = t.classPrefix; t.collapse(1); if (t.isMenuVisible)
            return; if (!t.rendered) { co = DOM.add(t.settings.container, t.renderNode()); each(t.items, function (o) { o.postRender(); }); t.element = new Element('menu_' + t.id, { blocker: 1, container: s.container }); } else
            co = DOM.get('menu_' + t.id); if (!tinymce.isOpera)
            DOM.setStyles(co, { left: -0xFFFF, top: -0xFFFF }); DOM.show(co); t.update(); x += s.offset_x || 0; y += s.offset_y || 0; vp.w -= 4; vp.h -= 4; if (s.constrain) {
            w = co.clientWidth - ot; h = co.clientHeight - ot; mx = vp.x + vp.w; my = vp.y + vp.h; if ((x + s.vp_offset_x + w) > mx)
                x = px ? px - w : Math.max(0, (mx - s.vp_offset_x) - w); if ((y + s.vp_offset_y + h) > my)
                y = Math.max(0, (my - s.vp_offset_y) - h);
        }
        DOM.setStyles(co, { left: x, top: y }); t.element.update(); t.isMenuVisible = 1; t.mouseClickFunc = Event.add(co, 'click', function (e) {
            var m; e = e.target; if (e && (e = DOM.getParent(e, 'tr')) && !DOM.hasClass(e, cp + 'ItemSub')) {
                m = t.items[e.id]; if (m.isDisabled())
                    return; dm = t; while (dm) {
                    if (dm.hideMenu)
                        dm.hideMenu(); dm = dm.settings.parent;
                }
                if (m.settings.onclick)
                    m.settings.onclick(e); return false;
            } 
        }); if (t.hasMenus()) {
            t.mouseOverFunc = Event.add(co, 'mouseover', function (e) {
                var m, r, mi; e = e.target; if (e && (e = DOM.getParent(e, 'tr'))) {
                    m = t.items[e.id]; if (t.lastMenu)
                        t.lastMenu.collapse(1); if (m.isDisabled())
                        return; if (e && DOM.hasClass(e, cp + 'ItemSub')) { r = DOM.getRect(e); m.showMenu((r.x + r.w - ot), r.y - ot, r.x); t.lastMenu = m; DOM.addClass(DOM.get(m.id).firstChild, cp + 'ItemActive'); } 
                } 
            });
        }
        Event.add(co, 'keydown', t._keyHandler, t); t.onShowMenu.dispatch(t); if (s.keyboard_focus) { t._setupKeyboardNav(); } 
    }, hideMenu: function (c) {
        var t = this, co = DOM.get('menu_' + t.id), e; if (!t.isMenuVisible)
            return; if (t.keyboardNav) t.keyboardNav.destroy(); Event.remove(co, 'mouseover', t.mouseOverFunc); Event.remove(co, 'click', t.mouseClickFunc); Event.remove(co, 'keydown', t._keyHandler); DOM.hide(co); t.isMenuVisible = 0; if (!c)
            t.collapse(1); if (t.element)
            t.element.hide(); if (e = DOM.get(t.id))
            DOM.removeClass(e.firstChild, t.classPrefix + 'ItemActive'); t.onHideMenu.dispatch(t);
    }, add: function (o) {
        var t = this, co; o = t.parent(o); if (t.isRendered && (co = DOM.get('menu_' + t.id)))
            t._add(DOM.select('tbody', co)[0], o); return o;
    }, collapse: function (d) { this.parent(d); this.hideMenu(1); }, remove: function (o) { DOM.remove(o.id); this.destroy(); return this.parent(o); }, destroy: function () {
        var t = this, co = DOM.get('menu_' + t.id); if (t.keyboardNav) t.keyboardNav.destroy(); Event.remove(co, 'mouseover', t.mouseOverFunc); Event.remove(DOM.select('a', co), 'focus', t.mouseOverFunc); Event.remove(co, 'click', t.mouseClickFunc); Event.remove(co, 'keydown', t._keyHandler); if (t.element)
            t.element.remove(); DOM.remove(co);
    }, renderNode: function () {
        var t = this, s = t.settings, n, tb, co, w; w = DOM.create('div', { role: 'listbox', id: 'menu_' + t.id, 'class': s['class'], 'style': 'position:absolute;left:0;top:0;z-index:200000;outline:0' }); if (t.settings.parent) { DOM.setAttrib(w, 'aria-parent', 'menu_' + t.settings.parent.id); }
        co = DOM.add(w, 'div', { role: 'presentation', id: 'menu_' + t.id + '_co', 'class': t.classPrefix + (s['class'] ? ' ' + s['class'] : '') }); t.element = new Element('menu_' + t.id, { blocker: 1, container: s.container }); if (s.menu_line)
            DOM.add(co, 'span', { 'class': t.classPrefix + 'Line' }); n = DOM.add(co, 'table', { role: 'presentation', id: 'menu_' + t.id + '_tbl', border: 0, cellPadding: 0, cellSpacing: 0 }); tb = DOM.add(n, 'tbody'); each(t.items, function (o) { t._add(tb, o); }); t.rendered = true; return w;
    }, _setupKeyboardNav: function () { var contextMenu, menuItems, t = this; contextMenu = DOM.get('menu_' + t.id); menuItems = DOM.select('a[role=option]', 'menu_' + t.id); menuItems.splice(0, 0, contextMenu); t.keyboardNav = new tinymce.ui.KeyboardNavigation({ root: 'menu_' + t.id, items: menuItems, onCancel: function () { t.hideMenu(); }, enableUpDown: true }); contextMenu.focus(); }, _keyHandler: function (evt) {
        var t = this, e; switch (evt.keyCode) {
            case 37: if (t.settings.parent) { t.hideMenu(); t.settings.parent.focus(); Event.cancel(evt); }
                break; case 39: if (t.mouseOverFunc)
                    t.mouseOverFunc(evt); break;
        } 
    }, _add: function (tb, o) {
        var n, s = o.settings, a, ro, it, cp = this.classPrefix, ic; if (s.separator) {
            ro = DOM.add(tb, 'tr', { id: o.id, 'class': cp + 'ItemSeparator' }); DOM.add(ro, 'td', { 'class': cp + 'ItemSeparator' }); if (n = ro.previousSibling)
                DOM.addClass(n, 'mceLast'); return;
        }
        n = ro = DOM.add(tb, 'tr', { id: o.id, 'class': cp + 'Item ' + cp + 'ItemEnabled' }); n = it = DOM.add(n, s.titleItem ? 'th' : 'td'); n = a = DOM.add(n, 'a', { id: o.id + '_aria', role: s.titleItem ? 'presentation' : 'option', href: 'javascript:;', onclick: "return false;", onmousedown: 'return false;' }); if (s.parent) { DOM.setAttrib(a, 'aria-haspopup', 'true'); DOM.setAttrib(a, 'aria-owns', 'menu_' + o.id); }
        DOM.addClass(it, s['class']); ic = DOM.add(n, 'span', { 'class': 'mceIcon' + (s.icon ? ' mce_' + s.icon : '') }); if (s.icon_src)
            DOM.add(ic, 'img', { src: s.icon_src }); n = DOM.add(n, s.element || 'span', { 'class': 'mceText', title: o.settings.title }, o.settings.title); if (o.settings.style) {
            if (typeof o.settings.style == "function")
                o.settings.style = o.settings.style(); DOM.setAttrib(n, 'style', o.settings.style);
        }
        if (tb.childNodes.length == 1)
            DOM.addClass(ro, 'mceFirst'); if ((n = ro.previousSibling) && DOM.hasClass(n, cp + 'ItemSeparator'))
            DOM.addClass(ro, 'mceFirst'); if (o.collapse)
            DOM.addClass(ro, cp + 'ItemSub'); if (n = ro.previousSibling)
            DOM.removeClass(n, 'mceLast'); DOM.addClass(ro, 'mceLast');
    } 
    });
})(tinymce); (function (tinymce) {
    var DOM = tinymce.DOM; tinymce.create('tinymce.ui.Button:tinymce.ui.Control', { Button: function (id, s, ed) { this.parent(id, s, ed); this.classPrefix = 'mceButton'; }, renderHTML: function () {
        var cp = this.classPrefix, s = this.settings, h, l; l = DOM.encode(s.label || ''); h = '<a role="button" id="' + this.id + '" href="javascript:;" class="' + cp + ' ' + cp + 'Enabled ' + s['class'] + (l ? ' ' + cp + 'Labeled' : '') + '" onmousedown="return false;" onclick="return false;" aria-labelledby="' + this.id + '_voice" title="' + DOM.encode(s.title) + '">'; if (s.image && !(this.editor && this.editor.forcedHighContrastMode))
            h += '<span class="mceIcon ' + s['class'] + '"><img class="mceIcon" src="' + s.image + '" alt="' + DOM.encode(s.title) + '" /></span>' + (l ? '<span class="' + cp + 'Label">' + l + '</span>' : ''); else
            h += '<span class="mceIcon ' + s['class'] + '"></span>' + (l ? '<span class="' + cp + 'Label">' + l + '</span>' : ''); h += '<span class="mceVoiceLabel mceIconOnly" style="display: none;" id="' + this.id + '_voice">' + s.title + '</span>'; h += '</a>'; return h;
    }, postRender: function () {
        var t = this, s = t.settings, imgBookmark; if (tinymce.isIE && t.editor) { tinymce.dom.Event.add(t.id, 'mousedown', function (e) { var nodeName = t.editor.selection.getNode().nodeName; imgBookmark = nodeName === 'IMG' ? t.editor.selection.getBookmark() : null; }); }
        tinymce.dom.Event.add(t.id, 'click', function (e) {
            if (!t.isDisabled()) {
                if (tinymce.isIE && t.editor && imgBookmark !== null) { t.editor.selection.moveToBookmark(imgBookmark); }
                return s.onclick.call(s.scope, e);
            } 
        }); tinymce.dom.Event.add(t.id, 'keydown', function (e) { if (!t.isDisabled() && e.keyCode == tinymce.VK.SPACEBAR) { tinymce.dom.Event.cancel(e); return s.onclick.call(s.scope, e); } });
    } 
    });
})(tinymce); (function (tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher, undef; tinymce.create('tinymce.ui.ListBox:tinymce.ui.Control', { ListBox: function (id, s, ed) { var t = this; t.parent(id, s, ed); t.items = []; t.onChange = new Dispatcher(t); t.onPostRender = new Dispatcher(t); t.onAdd = new Dispatcher(t); t.onRenderMenu = new tinymce.util.Dispatcher(this); t.classPrefix = 'mceListBox'; t.marked = {}; }, select: function (va) {
        var t = this, fv, f; t.marked = {}; if (va == undef)
            return t.selectByIndex(-1); if (va && typeof (va) == "function")
            f = va; else { f = function (v) { return v == va; }; }
        if (va != t.selectedValue) {
            each(t.items, function (o, i) { if (f(o.value)) { fv = 1; t.selectByIndex(i); return false; } }); if (!fv)
                t.selectByIndex(-1);
        } 
    }, selectByIndex: function (idx) {
        var t = this, e, o, label; t.marked = {}; if (idx != t.selectedIndex) {
            e = DOM.get(t.id + '_text'); label = DOM.get(t.id + '_voiceDesc'); o = t.items[idx]; if (o) { t.selectedValue = o.value; t.selectedIndex = idx; DOM.setHTML(e, DOM.encode(o.title)); DOM.setHTML(label, t.settings.title + " - " + o.title); DOM.removeClass(e, 'mceTitle'); DOM.setAttrib(t.id, 'aria-valuenow', o.title); } else { DOM.setHTML(e, DOM.encode(t.settings.title)); DOM.setHTML(label, DOM.encode(t.settings.title)); DOM.addClass(e, 'mceTitle'); t.selectedValue = t.selectedIndex = null; DOM.setAttrib(t.id, 'aria-valuenow', t.settings.title); }
            e = 0;
        } 
    }, mark: function (value) { this.marked[value] = true; }, add: function (n, v, o) { var t = this; o = o || {}; o = tinymce.extend(o, { title: n, value: v }); t.items.push(o); t.onAdd.dispatch(t, o); }, getLength: function () { return this.items.length; }, renderHTML: function () { var h = '', t = this, s = t.settings, cp = t.classPrefix; h = '<span role="listbox" aria-haspopup="true" aria-labelledby="' + t.id + '_voiceDesc" aria-describedby="' + t.id + '_voiceDesc"><table role="presentation" tabindex="0" id="' + t.id + '" cellpadding="0" cellspacing="0" class="' + cp + ' ' + cp + 'Enabled' + (s['class'] ? (' ' + s['class']) : '') + '"><tbody><tr>'; h += '<td>' + DOM.createHTML('span', { id: t.id + '_voiceDesc', 'class': 'voiceLabel', style: 'display:none;' }, t.settings.title); h += DOM.createHTML('a', { id: t.id + '_text', tabindex: -1, href: 'javascript:;', 'class': 'mceText', onclick: "return false;", onmousedown: 'return false;' }, DOM.encode(t.settings.title)) + '</td>'; h += '<td>' + DOM.createHTML('a', { id: t.id + '_open', tabindex: -1, href: 'javascript:;', 'class': 'mceOpen', onclick: "return false;", onmousedown: 'return false;' }, '<span><span style="display:none;" class="mceIconOnly" aria-hidden="true">\u25BC</span></span>') + '</td>'; h += '</tr></tbody></table></span>'; return h; }, showMenu: function () {
        var t = this, p2, e = DOM.get(this.id), m; if (t.isDisabled() || t.items.length === 0)
            return; if (t.menu && t.menu.isMenuVisible)
            return t.hideMenu(); if (!t.isMenuRendered) { t.renderMenu(); t.isMenuRendered = true; }
        p2 = DOM.getPos(e); m = t.menu; m.settings.offset_x = p2.x; m.settings.offset_y = p2.y; m.settings.keyboard_focus = !tinymce.isOpera; each(t.items, function (o) { if (m.items[o.id]) { m.items[o.id].setSelected(0); } }); each(t.items, function (o) {
            if (m.items[o.id] && t.marked[o.value]) { m.items[o.id].setSelected(1); }
            if (o.value === t.selectedValue) { m.items[o.id].setSelected(1); } 
        }); m.showMenu(0, e.clientHeight); Event.add(DOM.doc, 'mousedown', t.hideMenu, t); DOM.addClass(t.id, t.classPrefix + 'Selected');
    }, hideMenu: function (e) {
        var t = this; if (t.menu && t.menu.isMenuVisible) {
            DOM.removeClass(t.id, t.classPrefix + 'Selected'); if (e && e.type == "mousedown" && (e.target.id == t.id + '_text' || e.target.id == t.id + '_open'))
                return; if (!e || !DOM.getParent(e.target, '.mceMenu')) { DOM.removeClass(t.id, t.classPrefix + 'Selected'); Event.remove(DOM.doc, 'mousedown', t.hideMenu, t); t.menu.hideMenu(); } 
        } 
    }, renderMenu: function () {
        var t = this, m; m = t.settings.control_manager.createDropMenu(t.id + '_menu', { menu_line: 1, 'class': t.classPrefix + 'Menu mceNoIcons', max_width: 250, max_height: 150 }); m.onHideMenu.add(function () { t.hideMenu(); t.focus(); }); m.add({ title: t.settings.title, 'class': 'mceMenuItemTitle', onclick: function () {
            if (t.settings.onselect('') !== false)
                t.select('');
        } 
        }); each(t.items, function (o) {
            if (o.value === undef) {
                m.add({ title: o.title, role: "option", 'class': 'mceMenuItemTitle', onclick: function () {
                    if (t.settings.onselect('') !== false)
                        t.select('');
                } 
                });
            } else {
                o.id = DOM.uniqueId(); o.role = "option"; o.onclick = function () {
                    if (t.settings.onselect(o.value) !== false)
                        t.select(o.value);
                }; m.add(o);
            } 
        }); t.onRenderMenu.dispatch(t, m); t.menu = m;
    }, postRender: function () {
        var t = this, cp = t.classPrefix; Event.add(t.id, 'click', t.showMenu, t); Event.add(t.id, 'keydown', function (evt) { if (evt.keyCode == 32) { t.showMenu(evt); Event.cancel(evt); } }); Event.add(t.id, 'focus', function () {
            if (!t._focused) { t.keyDownHandler = Event.add(t.id, 'keydown', function (e) { if (e.keyCode == 40) { t.showMenu(); Event.cancel(e); } }); t.keyPressHandler = Event.add(t.id, 'keypress', function (e) { var v; if (e.keyCode == 13) { v = t.selectedValue; t.selectedValue = null; Event.cancel(e); t.settings.onselect(v); } }); }
            t._focused = 1;
        }); Event.add(t.id, 'blur', function () { Event.remove(t.id, 'keydown', t.keyDownHandler); Event.remove(t.id, 'keypress', t.keyPressHandler); t._focused = 0; }); if (tinymce.isIE6 || !DOM.boxModel) {
            Event.add(t.id, 'mouseover', function () {
                if (!DOM.hasClass(t.id, cp + 'Disabled'))
                    DOM.addClass(t.id, cp + 'Hover');
            }); Event.add(t.id, 'mouseout', function () {
                if (!DOM.hasClass(t.id, cp + 'Disabled'))
                    DOM.removeClass(t.id, cp + 'Hover');
            });
        }
        t.onPostRender.dispatch(t, DOM.get(t.id));
    }, destroy: function () { this.parent(); Event.clear(this.id + '_text'); Event.clear(this.id + '_open'); } 
    });
})(tinymce); (function (tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, Dispatcher = tinymce.util.Dispatcher, undef; tinymce.create('tinymce.ui.NativeListBox:tinymce.ui.ListBox', { NativeListBox: function (id, s) { this.parent(id, s); this.classPrefix = 'mceNativeListBox'; }, setDisabled: function (s) { DOM.get(this.id).disabled = s; this.setAriaProperty('disabled', s); }, isDisabled: function () { return DOM.get(this.id).disabled; }, select: function (va) {
        var t = this, fv, f; if (va == undef)
            return t.selectByIndex(-1); if (va && typeof (va) == "function")
            f = va; else { f = function (v) { return v == va; }; }
        if (va != t.selectedValue) {
            each(t.items, function (o, i) { if (f(o.value)) { fv = 1; t.selectByIndex(i); return false; } }); if (!fv)
                t.selectByIndex(-1);
        } 
    }, selectByIndex: function (idx) { DOM.get(this.id).selectedIndex = idx + 1; this.selectedValue = this.items[idx] ? this.items[idx].value : null; }, add: function (n, v, a) {
        var o, t = this; a = a || {}; a.value = v; if (t.isRendered())
            DOM.add(DOM.get(this.id), 'option', a, n); o = { title: n, value: v, attribs: a }; t.items.push(o); t.onAdd.dispatch(t, o);
    }, getLength: function () { return this.items.length; }, renderHTML: function () { var h, t = this; h = DOM.createHTML('option', { value: '' }, '-- ' + t.settings.title + ' --'); each(t.items, function (it) { h += DOM.createHTML('option', { value: it.value }, it.title); }); h = DOM.createHTML('select', { id: t.id, 'class': 'mceNativeListBox', 'aria-labelledby': t.id + '_aria' }, h); h += DOM.createHTML('span', { id: t.id + '_aria', 'style': 'display: none' }, t.settings.title); return h; }, postRender: function () {
        var t = this, ch, changeListenerAdded = true; t.rendered = true; function onChange(e) {
            var v = t.items[e.target.selectedIndex - 1]; if (v && (v = v.value)) {
                t.onChange.dispatch(t, v); if (t.settings.onselect)
                    t.settings.onselect(v);
            } 
        }; Event.add(t.id, 'change', onChange); Event.add(t.id, 'keydown', function (e) { var bf, DOM_VK_LEFT = 37, DOM_VK_RIGHT = 39, DOM_VK_UP = 38, DOM_VK_DOWN = 40, DOM_VK_RETURN = 13, DOM_VK_SPACE = 32; Event.remove(t.id, 'change', ch); changeListenerAdded = false; bf = Event.add(t.id, 'blur', function () { if (changeListenerAdded) return; changeListenerAdded = true; Event.add(t.id, 'change', onChange); Event.remove(t.id, 'blur', bf); }); if (e.keyCode == DOM_VK_RETURN || e.keyCode == DOM_VK_SPACE) { onChange(e); return Event.cancel(e); } else if (e.keyCode == DOM_VK_DOWN || e.keyCode == DOM_VK_UP) { e.stopImmediatePropagation(); } }); t.onPostRender.dispatch(t, DOM.get(t.id));
    } 
    });
})(tinymce); (function (tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each; tinymce.create('tinymce.ui.MenuButton:tinymce.ui.Button', { MenuButton: function (id, s, ed) { this.parent(id, s, ed); this.onRenderMenu = new tinymce.util.Dispatcher(this); s.menu_container = s.menu_container || DOM.doc.body; }, showMenu: function () {
        var t = this, p1, p2, e = DOM.get(t.id), m; if (t.isDisabled())
            return; if (!t.isMenuRendered) { t.renderMenu(); t.isMenuRendered = true; }
        if (t.isMenuVisible)
            return t.hideMenu(); p1 = DOM.getPos(t.settings.menu_container); p2 = DOM.getPos(e); m = t.menu; m.settings.offset_x = p2.x; m.settings.offset_y = p2.y; m.settings.vp_offset_x = p2.x; m.settings.vp_offset_y = p2.y; m.settings.keyboard_focus = t._focused; m.showMenu(0, e.firstChild.clientHeight); Event.add(DOM.doc, 'mousedown', t.hideMenu, t); t.setState('Selected', 1); t.isMenuVisible = 1;
    }, renderMenu: function () { var t = this, m; m = t.settings.control_manager.createDropMenu(t.id + '_menu', { menu_line: 1, 'class': this.classPrefix + 'Menu', icons: t.settings.icons }); m.onHideMenu.add(function () { t.hideMenu(); t.focus(); }); t.onRenderMenu.dispatch(t, m); t.menu = m; }, hideMenu: function (e) {
        var t = this; if (e && e.type == "mousedown" && DOM.getParent(e.target, function (e) { return e.id === t.id || e.id === t.id + '_open'; }))
            return; if (!e || !DOM.getParent(e.target, '.mceMenu')) {
            t.setState('Selected', 0); Event.remove(DOM.doc, 'mousedown', t.hideMenu, t); if (t.menu)
                t.menu.hideMenu();
        }
        t.isMenuVisible = 0;
    }, postRender: function () {
        var t = this, s = t.settings; Event.add(t.id, 'click', function () {
            if (!t.isDisabled()) {
                if (s.onclick)
                    s.onclick(t.value); t.showMenu();
            } 
        });
    } 
    });
})(tinymce); (function (tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each; tinymce.create('tinymce.ui.SplitButton:tinymce.ui.MenuButton', { SplitButton: function (id, s, ed) { this.parent(id, s, ed); this.classPrefix = 'mceSplitButton'; }, renderHTML: function () {
        var h, t = this, s = t.settings, h1; h = '<tbody><tr>'; if (s.image)
            h1 = DOM.createHTML('img ', { src: s.image, role: 'presentation', 'class': 'mceAction ' + s['class'] }); else
            h1 = DOM.createHTML('span', { 'class': 'mceAction ' + s['class'] }, ''); h1 += DOM.createHTML('span', { 'class': 'mceVoiceLabel mceIconOnly', id: t.id + '_voice', style: 'display:none;' }, s.title); h += '<td >' + DOM.createHTML('a', { role: 'button', id: t.id + '_action', tabindex: '-1', href: 'javascript:;', 'class': 'mceAction ' + s['class'], onclick: "return false;", onmousedown: 'return false;', title: s.title }, h1) + '</td>'; h1 = DOM.createHTML('span', { 'class': 'mceOpen ' + s['class'] }, '<span style="display:none;" class="mceIconOnly" aria-hidden="true">\u25BC</span>'); h += '<td >' + DOM.createHTML('a', { role: 'button', id: t.id + '_open', tabindex: '-1', href: 'javascript:;', 'class': 'mceOpen ' + s['class'], onclick: "return false;", onmousedown: 'return false;', title: s.title }, h1) + '</td>'; h += '</tr></tbody>'; h = DOM.createHTML('table', { role: 'presentation', 'class': 'mceSplitButton mceSplitButtonEnabled ' + s['class'], cellpadding: '0', cellspacing: '0', title: s.title }, h); return DOM.createHTML('div', { id: t.id, role: 'button', tabindex: '0', 'aria-labelledby': t.id + '_voice', 'aria-haspopup': 'true' }, h);
    }, postRender: function () {
        var t = this, s = t.settings, activate; if (s.onclick) { activate = function (evt) { if (!t.isDisabled()) { s.onclick(t.value); Event.cancel(evt); } }; Event.add(t.id + '_action', 'click', activate); Event.add(t.id, ['click', 'keydown'], function (evt) { var DOM_VK_SPACE = 32, DOM_VK_ENTER = 14, DOM_VK_RETURN = 13, DOM_VK_UP = 38, DOM_VK_DOWN = 40; if ((evt.keyCode === 32 || evt.keyCode === 13 || evt.keyCode === 14) && !evt.altKey && !evt.ctrlKey && !evt.metaKey) { activate(); Event.cancel(evt); } else if (evt.type === 'click' || evt.keyCode === DOM_VK_DOWN) { t.showMenu(); Event.cancel(evt); } }); }
        Event.add(t.id + '_open', 'click', function (evt) { t.showMenu(); Event.cancel(evt); }); Event.add([t.id, t.id + '_open'], 'focus', function () { t._focused = 1; }); Event.add([t.id, t.id + '_open'], 'blur', function () { t._focused = 0; }); if (tinymce.isIE6 || !DOM.boxModel) {
            Event.add(t.id, 'mouseover', function () {
                if (!DOM.hasClass(t.id, 'mceSplitButtonDisabled'))
                    DOM.addClass(t.id, 'mceSplitButtonHover');
            }); Event.add(t.id, 'mouseout', function () {
                if (!DOM.hasClass(t.id, 'mceSplitButtonDisabled'))
                    DOM.removeClass(t.id, 'mceSplitButtonHover');
            });
        } 
    }, destroy: function () { this.parent(); Event.clear(this.id + '_action'); Event.clear(this.id + '_open'); Event.clear(this.id); } 
    });
})(tinymce); (function (tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, is = tinymce.is, each = tinymce.each; tinymce.create('tinymce.ui.ColorSplitButton:tinymce.ui.SplitButton', { ColorSplitButton: function (id, s, ed) { var t = this; t.parent(id, s, ed); t.settings = s = tinymce.extend({ colors: '000000,993300,333300,003300,003366,000080,333399,333333,800000,FF6600,808000,008000,008080,0000FF,666699,808080,FF0000,FF9900,99CC00,339966,33CCCC,3366FF,800080,999999,FF00FF,FFCC00,FFFF00,00FF00,00FFFF,00CCFF,993366,C0C0C0,FF99CC,FFCC99,FFFF99,CCFFCC,CCFFFF,99CCFF,CC99FF,FFFFFF', grid_width: 8, default_color: '#888888' }, t.settings); t.onShowMenu = new tinymce.util.Dispatcher(t); t.onHideMenu = new tinymce.util.Dispatcher(t); t.value = s.default_color; }, showMenu: function () {
        var t = this, r, p, e, p2; if (t.isDisabled())
            return; if (!t.isMenuRendered) { t.renderMenu(); t.isMenuRendered = true; }
        if (t.isMenuVisible)
            return t.hideMenu(); e = DOM.get(t.id); DOM.show(t.id + '_menu'); DOM.addClass(e, 'mceSplitButtonSelected'); p2 = DOM.getPos(e); DOM.setStyles(t.id + '_menu', { left: p2.x, top: p2.y + e.firstChild.clientHeight, zIndex: 200000 }); e = 0; Event.add(DOM.doc, 'mousedown', t.hideMenu, t); t.onShowMenu.dispatch(t); if (t._focused) {
            t._keyHandler = Event.add(t.id + '_menu', 'keydown', function (e) {
                if (e.keyCode == 27)
                    t.hideMenu();
            }); DOM.select('a', t.id + '_menu')[0].focus();
        }
        t.keyboardNav = new tinymce.ui.KeyboardNavigation({ root: t.id + '_menu', items: DOM.select('a', t.id + '_menu'), onCancel: function () { t.hideMenu(); t.focus(); } }); t.keyboardNav.focus(); t.isMenuVisible = 1;
    }, hideMenu: function (e) {
        var t = this; if (t.isMenuVisible) {
            if (e && e.type == "mousedown" && DOM.getParent(e.target, function (e) { return e.id === t.id + '_open'; }))
                return; if (!e || !DOM.getParent(e.target, '.mceSplitButtonMenu')) { DOM.removeClass(t.id, 'mceSplitButtonSelected'); Event.remove(DOM.doc, 'mousedown', t.hideMenu, t); Event.remove(t.id + '_menu', 'keydown', t._keyHandler); DOM.hide(t.id + '_menu'); }
            t.isMenuVisible = 0; t.onHideMenu.dispatch(); t.keyboardNav.destroy();
        } 
    }, renderMenu: function () {
        var t = this, m, i = 0, s = t.settings, n, tb, tr, w, context; w = DOM.add(s.menu_container, 'div', { role: 'listbox', id: t.id + '_menu', 'class': s.menu_class + ' ' + s['class'], style: 'position:absolute;left:0;top:-1000px;' }); m = DOM.add(w, 'div', { 'class': s['class'] + ' mceSplitButtonMenu' }); DOM.add(m, 'span', { 'class': 'mceMenuLine' }); n = DOM.add(m, 'table', { role: 'presentation', 'class': 'mceColorSplitMenu' }); tb = DOM.add(n, 'tbody'); i = 0; each(is(s.colors, 'array') ? s.colors : s.colors.split(','), function (c) {
            c = c.replace(/^#/, ''); if (!i--) { tr = DOM.add(tb, 'tr'); i = s.grid_width - 1; }
            n = DOM.add(tr, 'td'); var settings = { href: 'javascript:;', style: { backgroundColor: '#' + c }, 'title': t.editor.getLang('colors.' + c, c), 'data-mce-color': '#' + c }; if (!tinymce.isIE) { settings.role = 'option'; }
            n = DOM.add(n, 'a', settings); if (t.editor.forcedHighContrastMode) { n = DOM.add(n, 'canvas', { width: 16, height: 16, 'aria-hidden': 'true' }); if (n.getContext && (context = n.getContext("2d"))) { context.fillStyle = '#' + c; context.fillRect(0, 0, 16, 16); } else { DOM.remove(n); } } 
        }); if (s.more_colors_func) { n = DOM.add(tb, 'tr'); n = DOM.add(n, 'td', { colspan: s.grid_width, 'class': 'mceMoreColors' }); n = DOM.add(n, 'a', { role: 'option', id: t.id + '_more', href: 'javascript:;', onclick: 'return false;', 'class': 'mceMoreColors' }, s.more_colors_title); Event.add(n, 'click', function (e) { s.more_colors_func.call(s.more_colors_scope || this); return Event.cancel(e); }); }
        DOM.addClass(m, 'mceColorSplitMenu'); Event.add(t.id + '_menu', 'mousedown', function (e) { return Event.cancel(e); }); Event.add(t.id + '_menu', 'click', function (e) {
            var c; e = DOM.getParent(e.target, 'a', tb); if (e && e.nodeName.toLowerCase() == 'a' && (c = e.getAttribute('data-mce-color')))
                t.setColor(c); return false;
        }); return w;
    }, setColor: function (c) { this.displayColor(c); this.hideMenu(); this.settings.onselect(c); }, displayColor: function (c) { var t = this; DOM.setStyle(t.id + '_preview', 'backgroundColor', c); t.value = c; }, postRender: function () { var t = this, id = t.id; t.parent(); DOM.add(id + '_action', 'div', { id: id + '_preview', 'class': 'mceColorPreview' }); DOM.setStyle(t.id + '_preview', 'backgroundColor', t.value); }, destroy: function () { var self = this; self.parent(); Event.clear(self.id + '_menu'); Event.clear(self.id + '_more'); DOM.remove(self.id + '_menu'); if (self.keyboardNav) { self.keyboardNav.destroy(); } } 
    });
})(tinymce); (function (tinymce) {
    var dom = tinymce.DOM, each = tinymce.each, Event = tinymce.dom.Event; tinymce.create('tinymce.ui.ToolbarGroup:tinymce.ui.Container', { renderHTML: function () { var t = this, h = [], controls = t.controls, each = tinymce.each, settings = t.settings; h.push('<div id="' + t.id + '" role="group" aria-labelledby="' + t.id + '_voice">'); h.push("<span role='application'>"); h.push('<span id="' + t.id + '_voice" class="mceVoiceLabel" style="display:none;">' + dom.encode(settings.name) + '</span>'); each(controls, function (toolbar) { h.push(toolbar.renderHTML()); }); h.push("</span>"); h.push('</div>'); return h.join(''); }, focus: function () { var t = this; dom.get(t.id).focus(); }, postRender: function () {
        var t = this, items = []; each(t.controls, function (toolbar) { each(toolbar.controls, function (control) { if (control.id) { items.push(control); } }); }); t.keyNav = new tinymce.ui.KeyboardNavigation({ root: t.id, items: items, onCancel: function () {
            if (tinymce.isWebKit) { dom.get(t.editor.id + "_ifr").focus(); }
            t.editor.focus();
        }, excludeFromTabOrder: !t.settings.tab_focus_toolbar
        });
    }, destroy: function () { var self = this; self.parent(); self.keyNav.destroy(); Event.clear(self.id); } 
    });
})(tinymce); (function (tinymce) {
    var dom = tinymce.DOM, each = tinymce.each; tinymce.create('tinymce.ui.Toolbar:tinymce.ui.Container', { renderHTML: function () {
        var t = this, h = '', c, co, s = t.settings, i, pr, nx, cl; cl = t.controls; for (i = 0; i < cl.length; i++) {
            co = cl[i]; pr = cl[i - 1]; nx = cl[i + 1]; if (i === 0) {
                c = 'mceToolbarStart'; if (co.Button)
                    c += ' mceToolbarStartButton'; else if (co.SplitButton)
                    c += ' mceToolbarStartSplitButton'; else if (co.ListBox)
                    c += ' mceToolbarStartListBox'; h += dom.createHTML('td', { 'class': c }, dom.createHTML('span', null, '<!-- IE -->'));
            }
            if (pr && co.ListBox) {
                if (pr.Button || pr.SplitButton)
                    h += dom.createHTML('td', { 'class': 'mceToolbarEnd' }, dom.createHTML('span', null, '<!-- IE -->'));
            }
            if (dom.stdMode)
                h += '<td style="position: relative">' + co.renderHTML() + '</td>'; else
                h += '<td>' + co.renderHTML() + '</td>'; if (nx && co.ListBox) {
                if (nx.Button || nx.SplitButton)
                    h += dom.createHTML('td', { 'class': 'mceToolbarStart' }, dom.createHTML('span', null, '<!-- IE -->'));
            } 
        }
        c = 'mceToolbarEnd'; if (co.Button)
            c += ' mceToolbarEndButton'; else if (co.SplitButton)
            c += ' mceToolbarEndSplitButton'; else if (co.ListBox)
            c += ' mceToolbarEndListBox'; h += dom.createHTML('td', { 'class': c }, dom.createHTML('span', null, '<!-- IE -->')); return dom.createHTML('table', { id: t.id, 'class': 'mceToolbar' + (s['class'] ? ' ' + s['class'] : ''), cellpadding: '0', cellspacing: '0', align: t.settings.align || '', role: 'presentation', tabindex: '-1' }, '<tbody><tr>' + h + '</tr></tbody>');
    } 
    });
})(tinymce); (function (tinymce) {
    var Dispatcher = tinymce.util.Dispatcher, each = tinymce.each; tinymce.create('tinymce.AddOnManager', { AddOnManager: function () { var self = this; self.items = []; self.urls = {}; self.lookup = {}; self.onAdd = new Dispatcher(self); }, get: function (n) { if (this.lookup[n]) { return this.lookup[n].instance; } else { return undefined; } }, dependencies: function (n) {
        var result; if (this.lookup[n]) { result = this.lookup[n].dependencies; }
        return result || [];
    }, requireLangPack: function (n) {
        var s = tinymce.settings; if (s && s.language && s.language_load !== false)
            tinymce.ScriptLoader.add(this.urls[n] + '/langs/' + s.language + '.js');
    }, add: function (id, o, dependencies) { this.items.push(o); this.lookup[id] = { instance: o, dependencies: dependencies }; this.onAdd.dispatch(this, id, o); return o; }, createUrl: function (baseUrl, dep) { if (typeof dep === "object") { return dep } else { return { prefix: baseUrl.prefix, resource: dep, suffix: baseUrl.suffix }; } }, addComponents: function (pluginName, scripts) { var pluginUrl = this.urls[pluginName]; tinymce.each(scripts, function (script) { tinymce.ScriptLoader.add(pluginUrl + "/" + script); }); }, load: function (n, u, cb, s) {
        var t = this, url = u; function loadDependencies() { var dependencies = t.dependencies(n); tinymce.each(dependencies, function (dep) { var newUrl = t.createUrl(u, dep); t.load(newUrl.resource, newUrl, undefined, undefined); }); if (cb) { if (s) { cb.call(s); } else { cb.call(tinymce.ScriptLoader); } } }
        if (t.urls[n])
            return; if (typeof u === "object")
            url = u.prefix + u.resource + u.suffix; if (url.indexOf('/') !== 0 && url.indexOf('://') == -1)
            url = tinymce.baseURL + '/' + url; t.urls[n] = url.substring(0, url.lastIndexOf('/')); if (t.lookup[n]) { loadDependencies(); } else { tinymce.ScriptLoader.add(url, loadDependencies, s); } 
    } 
    }); tinymce.PluginManager = new tinymce.AddOnManager(); tinymce.ThemeManager = new tinymce.AddOnManager();
} (tinymce)); (function (tinymce) {
    var each = tinymce.each, extend = tinymce.extend, DOM = tinymce.DOM, Event = tinymce.dom.Event, ThemeManager = tinymce.ThemeManager, PluginManager = tinymce.PluginManager, explode = tinymce.explode, Dispatcher = tinymce.util.Dispatcher, undef, instanceCounter = 0; tinymce.documentBaseURL = window.location.href.replace(/[\?#].*$/, '').replace(/[\/\\][^\/]+$/, ''); if (!/[\/\\]$/.test(tinymce.documentBaseURL))
        tinymce.documentBaseURL += '/'; tinymce.baseURL = new tinymce.util.URI(tinymce.documentBaseURL).toAbsolute(tinymce.baseURL); tinymce.baseURI = new tinymce.util.URI(tinymce.baseURL); tinymce.onBeforeUnload = new Dispatcher(tinymce); Event.add(window, 'beforeunload', function (e) { tinymce.onBeforeUnload.dispatch(tinymce, e); }); tinymce.onAddEditor = new Dispatcher(tinymce); tinymce.onRemoveEditor = new Dispatcher(tinymce); tinymce.EditorManager = extend(tinymce, { editors: [], i18n: {}, activeEditor: null, init: function (s) {
            var t = this, pl, sl = tinymce.ScriptLoader, e, el = [], ed; function createId(elm) {
                var id = elm.id; if (!id) {
                    id = elm.name; if (id && !DOM.get(id)) { id = elm.name; } else { id = DOM.uniqueId(); }
                    elm.setAttribute('id', id);
                }
                return id;
            }; function execCallback(se, n, s) {
                var f = se[n]; if (!f)
                    return; if (tinymce.is(f, 'string')) { s = f.replace(/\.\w+$/, ''); s = s ? tinymce.resolve(s) : 0; f = tinymce.resolve(f); }
                return f.apply(s || this, Array.prototype.slice.call(arguments, 2));
            }; function hasClass(n, c) { return c.constructor === RegExp ? c.test(n.className) : DOM.hasClass(n, c); }; t.settings = s; Event.bind(window, 'ready', function () {
                var l, co; execCallback(s, 'onpageload'); switch (s.mode) {
                    case "exact": l = s.elements || ''; if (l.length > 0) { each(explode(l), function (v) { if (DOM.get(v)) { ed = new tinymce.Editor(v, s); el.push(ed); ed.render(1); } else { each(document.forms, function (f) { each(f.elements, function (e) { if (e.name === v) { v = 'mce_editor_' + instanceCounter++; DOM.setAttrib(e, 'id', v); ed = new tinymce.Editor(v, s); el.push(ed); ed.render(1); } }); }); } }); }
                        break; case "textareas": case "specific_textareas": each(DOM.select('textarea'), function (elm) {
                            if (s.editor_deselector && hasClass(elm, s.editor_deselector))
                                return; if (!s.editor_selector || hasClass(elm, s.editor_selector)) { ed = new tinymce.Editor(createId(elm), s); el.push(ed); ed.render(1); } 
                        }); break; default: if (s.types) { each(s.types, function (type) { each(DOM.select(type.selector), function (elm) { var editor = new tinymce.Editor(createId(elm), tinymce.extend({}, s, type)); el.push(editor); editor.render(1); }); }); } else if (s.selector) { each(DOM.select(s.selector), function (elm) { var editor = new tinymce.Editor(createId(elm), s); el.push(editor); editor.render(1); }); } 
                }
                if (s.oninit) {
                    l = co = 0; each(el, function (ed) {
                        co++; if (!ed.initialized) {
                            ed.onInit.add(function () {
                                l++; if (l == co)
                                    execCallback(s, 'oninit');
                            });
                        } else
                            l++; if (l == co)
                            execCallback(s, 'oninit');
                    });
                } 
            });
        }, get: function (id) {
            if (id === undef)
                return this.editors; if (!this.editors.hasOwnProperty(id))
                return undef; return this.editors[id];
        }, getInstanceById: function (id) { return this.get(id); }, add: function (editor) {
            var self = this, editors = self.editors; editors[editor.id] = editor; editors.push(editor); self._setActive(editor); self.onAddEditor.dispatch(self, editor); if (tinymce.adapter)
                tinymce.adapter.patchEditor(editor); return editor;
        }, remove: function (editor) {
            var t = this, i, editors = t.editors; if (!editors[editor.id])
                return null; delete editors[editor.id]; for (i = 0; i < editors.length; i++) { if (editors[i] == editor) { editors.splice(i, 1); break; } }
            if (t.activeEditor == editor)
                t._setActive(editors[0]); editor.destroy(); t.onRemoveEditor.dispatch(t, editor); return editor;
        }, execCommand: function (c, u, v) {
            var t = this, ed = t.get(v), w; function clr() { ed.destroy(); w.detachEvent('onunload', clr); w = w.tinyMCE = w.tinymce = null; }; switch (c) {
                case "mceFocus": ed.focus(); return true; case "mceAddEditor": case "mceAddControl": if (!t.get(v))
                        new tinymce.Editor(v, t.settings).render(); return true; case "mceAddFrameControl": w = v.window; w.tinyMCE = tinyMCE; w.tinymce = tinymce; tinymce.DOM.doc = w.document; tinymce.DOM.win = w; ed = new tinymce.Editor(v.element_id, v); ed.render(); if (tinymce.isIE && !tinymce.isIE11) { w.attachEvent('onunload', clr); }
                    v.page_window = null; return true; case "mceRemoveEditor": case "mceRemoveControl": if (ed)
                        ed.remove(); return true; case 'mceToggleEditor': if (!ed) { t.execCommand('mceAddControl', 0, v); return true; }
                    if (ed.isHidden())
                        ed.show(); else
                        ed.hide(); return true;
            }
            if (t.activeEditor)
                return t.activeEditor.execCommand(c, u, v); return false;
        }, execInstanceCommand: function (id, c, u, v) {
            var ed = this.get(id); if (ed)
                return ed.execCommand(c, u, v); return false;
        }, triggerSave: function () { each(this.editors, function (e) { e.save(); }); }, addI18n: function (p, o) {
            var lo, i18n = this.i18n; if (!tinymce.is(p, 'string')) {
                each(p, function (o, lc) {
                    each(o, function (o, g) {
                        each(o, function (o, k) {
                            if (g === 'common')
                                i18n[lc + '.' + k] = o; else
                                i18n[lc + '.' + g + '.' + k] = o;
                        });
                    });
                });
            } else { each(o, function (o, k) { i18n[p + '.' + k] = o; }); } 
        }, _setActive: function (editor) { this.selectedInstance = this.activeEditor = editor; } 
        });
})(tinymce); (function (tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, extend = tinymce.extend, each = tinymce.each, isGecko = tinymce.isGecko, isIE = tinymce.isIE, isWebKit = tinymce.isWebKit, is = tinymce.is, ThemeManager = tinymce.ThemeManager, PluginManager = tinymce.PluginManager, explode = tinymce.explode; tinymce.create('tinymce.Editor', { Editor: function (id, settings) { var self = this, TRUE = true; self.settings = settings = extend({ id: id, language: 'en', theme: 'advanced', skin: 'default', delta_width: 0, delta_height: 0, popup_css: '', plugins: '', document_base_url: tinymce.documentBaseURL, add_form_submit_trigger: TRUE, submit_patch: TRUE, add_unload_trigger: TRUE, convert_urls: TRUE, relative_urls: TRUE, remove_script_host: TRUE, table_inline_editing: false, object_resizing: TRUE, accessibility_focus: TRUE, doctype: tinymce.isIE6 ? '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">' : '<!DOCTYPE>', visual: TRUE, font_size_style_values: 'xx-small,x-small,small,medium,large,x-large,xx-large', font_size_legacy_values: 'xx-small,small,medium,large,x-large,xx-large,300%', apply_source_formatting: TRUE, directionality: 'ltr', forced_root_block: 'p', hidden_input: TRUE, padd_empty_editor: TRUE, render_ui: TRUE, indentation: '30px', fix_table_elements: TRUE, inline_styles: TRUE, convert_fonts_to_spans: TRUE, indent: 'simple', indent_before: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist', indent_after: 'p,h1,h2,h3,h4,h5,h6,blockquote,div,title,style,pre,script,td,ul,li,area,table,thead,tfoot,tbody,tr,section,article,hgroup,aside,figure,option,optgroup,datalist', validate: TRUE, entity_encoding: 'named', url_converter: self.convertURL, url_converter_scope: self, ie7_compat: TRUE }, settings); self.id = self.editorId = id; self.isNotDirty = false; self.plugins = {}; self.documentBaseURI = new tinymce.util.URI(settings.document_base_url || tinymce.documentBaseURL, { base_uri: tinyMCE.baseURI }); self.baseURI = tinymce.baseURI; self.contentCSS = []; self.contentStyles = []; self.setupEvents(); self.execCommands = {}; self.queryStateCommands = {}; self.queryValueCommands = {}; self.execCallback('setup', self); }, render: function (nst) {
        var t = this, s = t.settings, id = t.id, sl = tinymce.ScriptLoader; if (!Event.domLoaded) { Event.add(window, 'ready', function () { t.render(); }); return; }
        tinyMCE.settings = s; if (!t.getElement())
            return; if (tinymce.isIDevice && !tinymce.isIOS5)
            return; if (!/TEXTAREA|INPUT/i.test(t.getElement().nodeName) && s.hidden_input && DOM.getParent(id, 'form'))
            DOM.insertAfter(DOM.create('input', { type: 'hidden', name: id }), id); if (!s.content_editable) { t.orgVisibility = t.getElement().style.visibility; t.getElement().style.visibility = 'hidden'; }
        if (tinymce.WindowManager)
            t.windowManager = new tinymce.WindowManager(t); if (s.encoding == 'xml') {
            t.onGetContent.add(function (ed, o) {
                if (o.save)
                    o.content = DOM.encode(o.content);
            });
        }
        if (s.add_form_submit_trigger) { t.onSubmit.addToTop(function () { if (t.initialized) { t.save(); t.isNotDirty = 1; } }); }
        if (s.add_unload_trigger) {
            t._beforeUnload = tinyMCE.onBeforeUnload.add(function () {
                if (t.initialized && !t.destroyed && !t.isHidden())
                    t.save({ format: 'raw', no_events: true });
            });
        }
        tinymce.addUnload(t.destroy, t); if (s.submit_patch) {
            t.onBeforeRenderUI.add(function () {
                var n = t.getElement().form; if (!n)
                    return; if (n._mceOldSubmit)
                    return; if (!n.submit.nodeType && !n.submit.length) { t.formElement = n; n._mceOldSubmit = n.submit; n.submit = function () { tinymce.triggerSave(); t.isNotDirty = 1; return t.formElement._mceOldSubmit(t.formElement); }; }
                n = null;
            });
        }
        function loadScripts() {
            if (s.language && s.language_load !== false)
                sl.add(tinymce.baseURL + '/langs/' + s.language + '.js'); if (s.theme && typeof s.theme != "function" && s.theme.charAt(0) != '-' && !ThemeManager.urls[s.theme])
                ThemeManager.load(s.theme, 'themes/' + s.theme + '/editor_template' + tinymce.suffix + '.js'); each(explode(s.plugins), function (p) {
                    if (p && !PluginManager.urls[p]) {
                        if (p.charAt(0) == '-') { p = p.substr(1, p.length); var dependencies = PluginManager.dependencies(p); each(dependencies, function (dep) { var defaultSettings = { prefix: 'plugins/', resource: dep, suffix: '/editor_plugin' + tinymce.suffix + '.js' }; dep = PluginManager.createUrl(defaultSettings, dep); PluginManager.load(dep.resource, dep); }); } else {
                            if (p == 'safari') { return; }
                            PluginManager.load(p, { prefix: 'plugins/', resource: p, suffix: '/editor_plugin' + tinymce.suffix + '.js' });
                        } 
                    } 
                }); sl.loadQueue(function () {
                    if (!t.removed)
                        t.init();
                });
        }; loadScripts();
    }, init: function () {
        var n, t = this, s = t.settings, w, h, mh, e = t.getElement(), o, ti, u, bi, bc, re, i, initializedPlugins = []; tinymce.add(t); s.aria_label = s.aria_label || DOM.getAttrib(e, 'aria-label', t.getLang('aria.rich_text_area')); if (s.theme) {
            if (typeof s.theme != "function") {
                s.theme = s.theme.replace(/-/, ''); o = ThemeManager.get(s.theme); t.theme = new o(); if (t.theme.init)
                    t.theme.init(t, ThemeManager.urls[s.theme] || tinymce.documentBaseURL.replace(/\/$/, ''));
            } else { t.theme = s.theme; } 
        }
        function initPlugin(p) { var c = PluginManager.get(p), u = PluginManager.urls[p] || tinymce.documentBaseURL.replace(/\/$/, ''), po; if (c && tinymce.inArray(initializedPlugins, p) === -1) { each(PluginManager.dependencies(p), function (dep) { initPlugin(dep); }); po = new c(t, u); t.plugins[p] = po; if (po.init) { po.init(t, u); initializedPlugins.push(p); } } }
        each(explode(s.plugins.replace(/\-/g, '')), initPlugin); if (s.popup_css !== false) {
            if (s.popup_css)
                s.popup_css = t.documentBaseURI.toAbsolute(s.popup_css); else
                s.popup_css = t.baseURI.toAbsolute("themes/" + s.theme + "/skins/" + s.skin + "/dialog.css");
        }
        if (s.popup_css_add)
            s.popup_css += ',' + t.documentBaseURI.toAbsolute(s.popup_css_add); t.controlManager = new tinymce.ControlManager(t); t.onBeforeRenderUI.dispatch(t, t.controlManager); if (s.render_ui && t.theme) {
            t.orgDisplay = e.style.display; if (typeof s.theme != "function") {
                w = s.width || e.style.width || e.offsetWidth; h = s.height || e.style.height || e.offsetHeight; mh = s.min_height || 100; re = /^[0-9\.]+(|px)$/i; if (re.test('' + w))
                    w = Math.max(parseInt(w, 10) + (o.deltaWidth || 0), 100); if (re.test('' + h))
                    h = Math.max(parseInt(h, 10) + (o.deltaHeight || 0), mh); o = t.theme.renderUI({ targetNode: e, width: w, height: h, deltaWidth: s.delta_width, deltaHeight: s.delta_height }); DOM.setStyles(o.sizeContainer || o.editorContainer, { width: w, height: h }); h = (o.iframeHeight || h) + (typeof (h) == 'number' ? (o.deltaHeight || 0) : ''); if (h < mh)
                    h = mh;
            } else {
                o = s.theme(t, e); if (o.editorContainer.nodeType) { o.editorContainer = o.editorContainer.id = o.editorContainer.id || t.id + "_parent"; }
                if (o.iframeContainer.nodeType) { o.iframeContainer = o.iframeContainer.id = o.iframeContainer.id || t.id + "_iframecontainer"; }
                h = o.iframeHeight || e.offsetHeight; if (isIE) { t.onInit.add(function (ed) { ed.dom.bind(ed.getBody(), 'beforedeactivate keydown keyup', function () { ed.bookmark = ed.selection.getBookmark(1); }); }); t.onNodeChange.add(function (ed) { if (document.activeElement.id == ed.id + "_ifr") { ed.bookmark = ed.selection.getBookmark(1); } }); } 
            }
            t.editorContainer = o.editorContainer;
        }
        if (s.content_css) { each(explode(s.content_css), function (u) { t.contentCSS.push(t.documentBaseURI.toAbsolute(u)); }); }
        if (s.content_style) { t.contentStyles.push(s.content_style); }
        if (s.content_editable) { e = n = o = null; return t.initContentBody(); }
        if (document.domain && location.hostname != document.domain)
            tinymce.relaxedDomain = document.domain; t.iframeHTML = s.doctype + '<html><head xmlns="http://www.w3.org/1999/xhtml">'; if (s.document_base_url != tinymce.documentBaseURL)
            t.iframeHTML += '<base href="' + t.documentBaseURI.getURI() + '" />'; if (tinymce.isIE8) {
            if (s.ie7_compat)
                t.iframeHTML += '<meta http-equiv="X-UA-Compatible" content="IE=7" />'; else
                t.iframeHTML += '<meta http-equiv="X-UA-Compatible" content="IE=edge" />';
        }
        t.iframeHTML += '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'; for (i = 0; i < t.contentCSS.length; i++) { t.iframeHTML += '<link type="text/css" rel="stylesheet" href="' + t.contentCSS[i] + '" />'; }
        t.contentCSS = []; bi = s.body_id || 'tinymce'; if (bi.indexOf('=') != -1) { bi = t.getParam('body_id', '', 'hash'); bi = bi[t.id] || bi; }
        bc = s.body_class || ''; if (bc.indexOf('=') != -1) { bc = t.getParam('body_class', '', 'hash'); bc = bc[t.id] || ''; }
        t.iframeHTML += '</head><body id="' + bi + '" class="mceContentBody ' + bc + '" onload="window.parent.tinyMCE.get(\'' + t.id + '\').onLoad.dispatch();"><br></body></html>'; if (tinymce.relaxedDomain && (isIE || (tinymce.isOpera && parseFloat(opera.version()) < 11))) { u = 'javascript:(function(){document.open();document.domain="' + document.domain + '";var ed = window.parent.tinyMCE.get("' + t.id + '");document.write(ed.iframeHTML);document.close();ed.initContentBody();})()'; }
        n = DOM.add(o.iframeContainer, 'iframe', { id: t.id + "_ifr", src: u || 'javascript:""', frameBorder: '0', allowTransparency: "true", title: s.aria_label, style: { width: '100%', height: h, display: 'block'} }); t.contentAreaContainer = o.iframeContainer; if (o.editorContainer) { DOM.get(o.editorContainer).style.display = t.orgDisplay; }
        e.style.visibility = t.orgVisibility; DOM.get(t.id).style.display = 'none'; DOM.setAttrib(t.id, 'aria-hidden', true); if (!tinymce.relaxedDomain || !u)
            t.initContentBody(); e = n = o = null;
    }, initContentBody: function () {
        var self = this, settings = self.settings, targetElm = DOM.get(self.id), doc = self.getDoc(), html, body, contentCssText; if ((!isIE || !tinymce.relaxedDomain) && !settings.content_editable) {
            doc.open(); doc.write(self.iframeHTML); doc.close(); if (tinymce.relaxedDomain)
                doc.domain = tinymce.relaxedDomain;
        }
        if (settings.content_editable) { DOM.addClass(targetElm, 'mceContentBody'); self.contentDocument = doc = settings.content_document || document; self.contentWindow = settings.content_window || window; self.bodyElement = targetElm; settings.content_document = settings.content_window = null; }
        body = self.getBody(); body.disabled = true; if (!settings.readonly)
            body.contentEditable = self.getParam('content_editable_state', true); body.disabled = false; self.schema = new tinymce.html.Schema(settings); self.dom = new tinymce.dom.DOMUtils(doc, { keep_values: true, url_converter: self.convertURL, url_converter_scope: self, hex_colors: settings.force_hex_style_colors, class_filter: settings.class_filter, update_styles: true, root_element: settings.content_editable ? self.id : null, schema: self.schema }); self.parser = new tinymce.html.DomParser(settings, self.schema); self.parser.addAttributeFilter('src,href,style', function (nodes, name) {
                var i = nodes.length, node, dom = self.dom, value, internalName; while (i--) {
                    node = nodes[i]; value = node.attr(name); internalName = 'data-mce-' + name; if (!node.attributes.map[internalName]) {
                        if (name === "style")
                            node.attr(internalName, dom.serializeStyle(dom.parseStyle(value), node.name)); else
                            node.attr(internalName, self.convertURL(value, name, node.name));
                    } 
                } 
            }); self.parser.addNodeFilter('script', function (nodes, name) { var i = nodes.length, node; while (i--) { node = nodes[i]; node.attr('type', 'mce-' + (node.attr('type') || 'text/javascript')); } }); self.parser.addNodeFilter('#cdata', function (nodes, name) { var i = nodes.length, node; while (i--) { node = nodes[i]; node.type = 8; node.name = '#comment'; node.value = '[CDATA[' + node.value + ']]'; } }); self.parser.addNodeFilter('p,h1,h2,h3,h4,h5,h6,div', function (nodes, name) {
                var i = nodes.length, node, nonEmptyElements = self.schema.getNonEmptyElements(); while (i--) {
                    node = nodes[i]; if (node.isEmpty(nonEmptyElements))
                        node.empty().append(new tinymce.html.Node('br', 1)).shortEnded = true;
                } 
            }); self.serializer = new tinymce.dom.Serializer(settings, self.dom, self.schema); self.selection = new tinymce.dom.Selection(self.dom, self.getWin(), self.serializer, self); self.formatter = new tinymce.Formatter(self); self.undoManager = new tinymce.UndoManager(self); self.forceBlocks = new tinymce.ForceBlocks(self); self.enterKey = new tinymce.EnterKey(self); self.editorCommands = new tinymce.EditorCommands(self); self.onExecCommand.add(function (editor, command) {
                if (!/^(FontName|FontSize)$/.test(command))
                    self.nodeChanged();
            }); self.serializer.onPreProcess.add(function (se, o) { return self.onPreProcess.dispatch(self, o, se); }); self.serializer.onPostProcess.add(function (se, o) { return self.onPostProcess.dispatch(self, o, se); }); self.onPreInit.dispatch(self); if (!settings.browser_spellcheck && !settings.gecko_spellcheck)
            doc.body.spellcheck = false; if (!settings.readonly) { self.bindNativeEvents(); }
        self.controlManager.onPostRender.dispatch(self, self.controlManager); self.onPostRender.dispatch(self); self.quirks = tinymce.util.Quirks(self); if (settings.directionality)
            body.dir = settings.directionality; if (settings.nowrap)
            body.style.whiteSpace = "nowrap"; if (settings.protect) { self.onBeforeSetContent.add(function (ed, o) { each(settings.protect, function (pattern) { o.content = o.content.replace(pattern, function (str) { return '<!--mce:protected ' + escape(str) + '-->'; }); }); }); }
        self.onSetContent.add(function () { self.addVisual(self.getBody()); }); if (settings.padd_empty_editor) { self.onPostProcess.add(function (ed, o) { o.content = o.content.replace(/^(<p[^>]*>(&nbsp;|&#160;|\s|\u00a0|)<\/p>[\r\n]*|<br \/>[\r\n]*)$/, ''); }); }
        self.load({ initial: true, format: 'html' }); self.startContent = self.getContent({ format: 'raw' }); self.initialized = true; self.onInit.dispatch(self); self.execCallback('setupcontent_callback', self.id, body, doc); self.execCallback('init_instance_callback', self); self.focus(true); self.nodeChanged({ initial: true }); if (self.contentStyles.length > 0) { contentCssText = ''; each(self.contentStyles, function (style) { contentCssText += style + "\r\n"; }); self.dom.addStyle(contentCssText); }
        each(self.contentCSS, function (url) { self.dom.loadCSS(url); }); if (settings.auto_focus) { setTimeout(function () { var ed = tinymce.get(settings.auto_focus); ed.selection.select(ed.getBody(), 1); ed.selection.collapse(1); ed.getBody().focus(); ed.getWin().focus(); }, 100); }
        targetElm = doc = body = null;
    }, focus: function (skip_focus) {
        var oed, self = this, selection = self.selection, contentEditable = self.settings.content_editable, ieRng, controlElm, doc = self.getDoc(), body; if (!skip_focus) {
            if (self.bookmark) { selection.moveToBookmark(self.bookmark); self.bookmark = null; }
            ieRng = selection.getRng(); if (ieRng.item) { controlElm = ieRng.item(0); }
            self._refreshContentEditable(); if (!contentEditable) { self.getWin().focus(); }
            if (tinymce.isGecko || contentEditable) {
                body = self.getBody(); if (body.setActive && !tinymce.isIE11) { body.setActive(); } else { body.focus(); }
                if (contentEditable) { selection.normalize(); } 
            }
            if (controlElm && controlElm.ownerDocument == doc) { ieRng = doc.body.createControlRange(); ieRng.addElement(controlElm); ieRng.select(); } 
        }
        if (tinymce.activeEditor != self) {
            if ((oed = tinymce.activeEditor) != null)
                oed.onDeactivate.dispatch(oed, self); self.onActivate.dispatch(self, oed);
        }
        tinymce._setActive(self);
    }, execCallback: function (n) {
        var t = this, f = t.settings[n], s; if (!f)
            return; if (t.callbackLookup && (s = t.callbackLookup[n])) { f = s.func; s = s.scope; }
        if (is(f, 'string')) { s = f.replace(/\.\w+$/, ''); s = s ? tinymce.resolve(s) : 0; f = tinymce.resolve(f); t.callbackLookup = t.callbackLookup || {}; t.callbackLookup[n] = { func: f, scope: s }; }
        return f.apply(s || t, Array.prototype.slice.call(arguments, 1));
    }, translate: function (s) {
        var c = this.settings.language || 'en', i18n = tinymce.i18n; if (!s)
            return ''; return i18n[c + '.' + s] || s.replace(/\{\#([^\}]+)\}/g, function (a, b) { return i18n[c + '.' + b] || '{#' + b + '}'; });
    }, getLang: function (n, dv) { return tinymce.i18n[(this.settings.language || 'en') + '.' + n] || (is(dv) ? dv : '{#' + n + '}'); }, getParam: function (n, dv, ty) {
        var tr = tinymce.trim, v = is(this.settings[n]) ? this.settings[n] : dv, o; if (ty === 'hash') {
            o = {}; if (is(v, 'string')) {
                each(v.indexOf('=') > 0 ? v.split(/[;,](?![^=;,]*(?:[;,]|$))/) : v.split(','), function (v) {
                    v = v.split('='); if (v.length > 1)
                        o[tr(v[0])] = tr(v[1]); else
                        o[tr(v[0])] = tr(v);
                });
            } else
                o = v; return o;
        }
        return v;
    }, nodeChanged: function (o) {
        var self = this, selection = self.selection, node; if (self.initialized) {
            o = o || {}; node = selection.getStart() || self.getBody(); node = isIE && node.ownerDocument != self.getDoc() ? self.getBody() : node; o.parents = []; self.dom.getParent(node, function (node) {
                if (node.nodeName == 'BODY')
                    return true; o.parents.push(node);
            }); self.onNodeChange.dispatch(self, o ? o.controlManager || self.controlManager : self.controlManager, node, selection.isCollapsed(), o);
        } 
    }, addButton: function (name, settings) { var self = this; self.buttons = self.buttons || {}; self.buttons[name] = settings; }, addCommand: function (name, callback, scope) { this.execCommands[name] = { func: callback, scope: scope || this }; }, addQueryStateHandler: function (name, callback, scope) { this.queryStateCommands[name] = { func: callback, scope: scope || this }; }, addQueryValueHandler: function (name, callback, scope) { this.queryValueCommands[name] = { func: callback, scope: scope || this }; }, addShortcut: function (pa, desc, cmd_func, sc) {
        var t = this, c; if (t.settings.custom_shortcuts === false)
            return false; t.shortcuts = t.shortcuts || {}; if (is(cmd_func, 'string')) { c = cmd_func; cmd_func = function () { t.execCommand(c, false, null); }; }
        if (is(cmd_func, 'object')) { c = cmd_func; cmd_func = function () { t.execCommand(c[0], c[1], c[2]); }; }
        each(explode(pa), function (pa) { var o = { func: cmd_func, scope: sc || this, desc: t.translate(desc), alt: false, ctrl: false, shift: false }; each(explode(pa, '+'), function (v) { switch (v) { case 'alt': case 'ctrl': case 'shift': o[v] = true; break; default: o.charCode = v.charCodeAt(0); o.keyCode = v.toUpperCase().charCodeAt(0); } }); t.shortcuts[(o.ctrl ? 'ctrl' : '') + ',' + (o.alt ? 'alt' : '') + ',' + (o.shift ? 'shift' : '') + ',' + o.keyCode] = o; }); return true;
    }, execCommand: function (cmd, ui, val, a) {
        var t = this, s = 0, o, st; if (!/^(mceAddUndoLevel|mceEndUndoLevel|mceBeginUndoLevel|mceRepaint|SelectAll)$/.test(cmd) && (!a || !a.skip_focus))
            t.focus(); a = extend({}, a); t.onBeforeExecCommand.dispatch(t, cmd, ui, val, a); if (a.terminate)
            return false; if (t.execCallback('execcommand_callback', t.id, t.selection.getNode(), cmd, ui, val)) { t.onExecCommand.dispatch(t, cmd, ui, val, a); return true; }
        if (o = t.execCommands[cmd]) { st = o.func.call(o.scope, ui, val); if (st !== true) { t.onExecCommand.dispatch(t, cmd, ui, val, a); return st; } }
        each(t.plugins, function (p) { if (p.execCommand && p.execCommand(cmd, ui, val)) { t.onExecCommand.dispatch(t, cmd, ui, val, a); s = 1; return false; } }); if (s)
            return true; if (t.theme && t.theme.execCommand && t.theme.execCommand(cmd, ui, val)) { t.onExecCommand.dispatch(t, cmd, ui, val, a); return true; }
        if (t.editorCommands.execCommand(cmd, ui, val)) { t.onExecCommand.dispatch(t, cmd, ui, val, a); return true; }
        t.getDoc().execCommand(cmd, ui, val); t.onExecCommand.dispatch(t, cmd, ui, val, a);
    }, queryCommandState: function (cmd) {
        var t = this, o, s; if (t._isHidden())
            return; if (o = t.queryStateCommands[cmd]) {
            s = o.func.call(o.scope); if (s !== true)
                return s;
        }
        o = t.editorCommands.queryCommandState(cmd); if (o !== -1)
            return o; try { return this.getDoc().queryCommandState(cmd); } catch (ex) { } 
    }, queryCommandValue: function (c) {
        var t = this, o, s; if (t._isHidden())
            return; if (o = t.queryValueCommands[c]) {
            s = o.func.call(o.scope); if (s !== true)
                return s;
        }
        o = t.editorCommands.queryCommandValue(c); if (is(o))
            return o; try { return this.getDoc().queryCommandValue(c); } catch (ex) { } 
    }, show: function () { var self = this; DOM.show(self.getContainer()); DOM.hide(self.id); self.load(); }, hide: function () {
        var self = this, doc = self.getDoc(); if (isIE && doc)
            doc.execCommand('SelectAll'); self.save(); DOM.hide(self.getContainer()); DOM.setStyle(self.id, 'display', self.orgDisplay);
    }, isHidden: function () { return !DOM.isHidden(this.id); }, setProgressState: function (b, ti, o) { this.onSetProgressState.dispatch(this, b, ti, o); return b; }, load: function (o) {
        var t = this, e = t.getElement(), h; if (e) {
            o = o || {}; o.load = true; h = t.setContent(is(e.value) ? e.value : e.innerHTML, o); o.element = e; if (!o.no_events)
                t.onLoadContent.dispatch(t, o); o.element = e = null; return h;
        } 
    }, save: function (o) {
        var t = this, e = t.getElement(), h, f; if (!e || !t.initialized)
            return; o = o || {}; o.save = true; o.element = e; h = o.content = t.getContent(o); if (!o.no_events)
            t.onSaveContent.dispatch(t, o); h = o.content; if (!/TEXTAREA|INPUT/i.test(e.nodeName)) { e.innerHTML = h; if (f = DOM.getParent(t.id, 'form')) { each(f.elements, function (e) { if (e.name == t.id) { e.value = h; return false; } }); } } else
            e.value = h; o.element = e = null; return h;
    }, setContent: function (content, args) {
        var self = this, rootNode, body = self.getBody(), forcedRootBlockName; args = args || {}; args.format = args.format || 'html'; args.set = true; args.content = content; if (!args.no_events)
            self.onBeforeSetContent.dispatch(self, args); content = args.content; if (!tinymce.isIE && (content.length === 0 || /^\s+$/.test(content))) {
            forcedRootBlockName = self.settings.forced_root_block; if (forcedRootBlockName)
                content = '<' + forcedRootBlockName + '><br data-mce-bogus="1"></' + forcedRootBlockName + '>'; else
                content = '<br data-mce-bogus="1">'; body.innerHTML = content; self.selection.select(body, true); self.selection.collapse(true); return;
        }
        if (args.format !== 'raw') { content = new tinymce.html.Serializer({}, self.schema).serialize(self.parser.parse(content)); }
        args.content = tinymce.trim(content); self.dom.setHTML(body, args.content); if (!args.no_events)
            self.onSetContent.dispatch(self, args); if (!self.settings.content_editable || document.activeElement === self.getBody()) { self.selection.normalize(); }
        return args.content;
    }, getContent: function (args) {
        var self = this, content, body = self.getBody(); args = args || {}; args.format = args.format || 'html'; args.get = true; args.getInner = true; if (!args.no_events)
            self.onBeforeGetContent.dispatch(self, args); if (args.format == 'raw')
            content = body.innerHTML; else if (args.format == 'text')
            content = body.innerText || body.textContent; else
            content = self.serializer.serialize(body, args); if (args.format != 'text') { args.content = tinymce.trim(content); } else { args.content = content; }
        if (!args.no_events)
            self.onGetContent.dispatch(self, args); return args.content;
    }, isDirty: function () { var self = this; return tinymce.trim(self.startContent) != tinymce.trim(self.getContent({ format: 'raw', no_events: 1 })) && !self.isNotDirty; }, getContainer: function () {
        var self = this; if (!self.container)
            self.container = DOM.get(self.editorContainer || self.id + '_parent'); return self.container;
    }, getContentAreaContainer: function () { return this.contentAreaContainer; }, getElement: function () { return DOM.get(this.settings.content_element || this.id); }, getWin: function () {
        var self = this, elm; if (!self.contentWindow) {
            elm = DOM.get(self.id + "_ifr"); if (elm)
                self.contentWindow = elm.contentWindow;
        }
        return self.contentWindow;
    }, getDoc: function () {
        var self = this, win; if (!self.contentDocument) {
            win = self.getWin(); if (win)
                self.contentDocument = win.document;
        }
        return self.contentDocument;
    }, getBody: function () { return this.bodyElement || this.getDoc().body; }, convertURL: function (url, name, elm) {
        var self = this, settings = self.settings; if (settings.urlconverter_callback)
            return self.execCallback('urlconverter_callback', url, elm, true, name); if (!settings.convert_urls || (elm && elm.nodeName == 'LINK') || url.indexOf('file:') === 0)
            return url; if (settings.relative_urls)
            return self.documentBaseURI.toRelative(url); url = self.documentBaseURI.toAbsolute(url, settings.remove_script_host); return url;
    }, addVisual: function (elm) {
        var self = this, settings = self.settings, dom = self.dom, cls; elm = elm || self.getBody(); if (!is(self.hasVisual))
            self.hasVisual = settings.visual; each(dom.select('table,a', elm), function (elm) {
                var value; switch (elm.nodeName) {
                    case 'TABLE': cls = settings.visual_table_class || 'mceItemTable'; value = dom.getAttrib(elm, 'border'); if (!value || value == '0') {
                            if (self.hasVisual)
                                dom.addClass(elm, cls); else
                                dom.removeClass(elm, cls);
                        }
                        return; case 'A': if (!dom.getAttrib(elm, 'href', false)) {
                            value = dom.getAttrib(elm, 'name') || elm.id; cls = 'mceItemAnchor'; if (value) {
                                if (self.hasVisual)
                                    dom.addClass(elm, cls); else
                                    dom.removeClass(elm, cls);
                            } 
                        }
                        return;
                } 
            }); self.onVisualAid.dispatch(self, elm, self.hasVisual);
    }, remove: function () {
        var self = this, elm = self.getContainer(), doc = self.getDoc(); if (!self.removed) {
            self.removed = 1; if (isIE && doc)
                doc.execCommand('SelectAll'); self.save(); DOM.setStyle(self.id, 'display', self.orgDisplay); if (!self.settings.content_editable) { Event.unbind(self.getWin()); Event.unbind(self.getDoc()); }
            Event.unbind(self.getBody()); Event.clear(elm); self.execCallback('remove_instance_callback', self); self.onRemove.dispatch(self); self.onExecCommand.listeners = []; tinymce.remove(self); DOM.remove(elm);
        } 
    }, destroy: function (s) {
        var t = this; if (t.destroyed)
            return; if (isGecko) { Event.unbind(t.getDoc()); Event.unbind(t.getWin()); Event.unbind(t.getBody()); }
        if (!s) {
            tinymce.removeUnload(t.destroy); tinyMCE.onBeforeUnload.remove(t._beforeUnload); if (t.theme && t.theme.destroy)
                t.theme.destroy(); t.controlManager.destroy(); t.selection.destroy(); t.dom.destroy();
        }
        if (t.formElement) { t.formElement.submit = t.formElement._mceOldSubmit; t.formElement._mceOldSubmit = null; }
        t.contentAreaContainer = t.formElement = t.container = t.settings.content_element = t.bodyElement = t.contentDocument = t.contentWindow = null; if (t.selection)
            t.selection = t.selection.win = t.selection.dom = t.selection.dom.doc = null; t.destroyed = 1;
    }, _refreshContentEditable: function () { var self = this, body, parent; if (self._isHidden()) { body = self.getBody(); parent = body.parentNode; parent.removeChild(body); parent.appendChild(body); body.focus(); } }, _isHidden: function () {
        var s; if (!isGecko)
            return 0; s = this.selection.getSel(); return (!s || !s.rangeCount || s.rangeCount === 0);
    } 
    });
})(tinymce); (function (tinymce) {
    var each = tinymce.each; tinymce.Editor.prototype.setupEvents = function () {
        var self = this, settings = self.settings; each(['onPreInit', 'onBeforeRenderUI', 'onPostRender', 'onLoad', 'onInit', 'onRemove', 'onActivate', 'onDeactivate', 'onClick', 'onEvent', 'onMouseUp', 'onMouseDown', 'onDblClick', 'onKeyDown', 'onKeyUp', 'onKeyPress', 'onContextMenu', 'onSubmit', 'onReset', 'onPaste', 'onPreProcess', 'onPostProcess', 'onBeforeSetContent', 'onBeforeGetContent', 'onSetContent', 'onGetContent', 'onLoadContent', 'onSaveContent', 'onNodeChange', 'onChange', 'onBeforeExecCommand', 'onExecCommand', 'onUndo', 'onRedo', 'onVisualAid', 'onSetProgressState', 'onSetAttrib'], function (name) { self[name] = new tinymce.util.Dispatcher(self); }); if (settings.cleanup_callback) {
            self.onBeforeSetContent.add(function (ed, o) { o.content = ed.execCallback('cleanup_callback', 'insert_to_editor', o.content, o); }); self.onPreProcess.add(function (ed, o) {
                if (o.set)
                    ed.execCallback('cleanup_callback', 'insert_to_editor_dom', o.node, o); if (o.get)
                    ed.execCallback('cleanup_callback', 'get_from_editor_dom', o.node, o);
            }); self.onPostProcess.add(function (ed, o) {
                if (o.set)
                    o.content = ed.execCallback('cleanup_callback', 'insert_to_editor', o.content, o); if (o.get)
                    o.content = ed.execCallback('cleanup_callback', 'get_from_editor', o.content, o);
            });
        }
        if (settings.save_callback) {
            self.onGetContent.add(function (ed, o) {
                if (o.save)
                    o.content = ed.execCallback('save_callback', ed.id, o.content, ed.getBody());
            });
        }
        if (settings.handle_event_callback) { self.onEvent.add(function (ed, e, o) { if (self.execCallback('handle_event_callback', e, ed, o) === false) { e.preventDefault(); e.stopPropagation(); } }); }
        if (settings.handle_node_change_callback) { self.onNodeChange.add(function (ed, cm, n) { ed.execCallback('handle_node_change_callback', ed.id, n, -1, -1, true, ed.selection.isCollapsed()); }); }
        if (settings.save_callback) {
            self.onSaveContent.add(function (ed, o) {
                var h = ed.execCallback('save_callback', ed.id, o.content, ed.getBody()); if (h)
                    o.content = h;
            });
        }
        if (settings.onchange_callback) { self.onChange.add(function (ed, l) { ed.execCallback('onchange_callback', ed, l); }); } 
    }; tinymce.Editor.prototype.bindNativeEvents = function () {
        var self = this, i, settings = self.settings, dom = self.dom, nativeToDispatcherMap; nativeToDispatcherMap = { mouseup: 'onMouseUp', mousedown: 'onMouseDown', click: 'onClick', keyup: 'onKeyUp', keydown: 'onKeyDown', keypress: 'onKeyPress', submit: 'onSubmit', reset: 'onReset', contextmenu: 'onContextMenu', dblclick: 'onDblClick', paste: 'onPaste' }; function eventHandler(evt, args) {
            var type = evt.type; if (self.removed)
                return; if (self.onEvent.dispatch(self, evt, args) !== false) { self[nativeToDispatcherMap[evt.fakeType || evt.type]].dispatch(self, evt, args); } 
        }; function doOperaFocus(e) { self.focus(true); }; function nodeChanged(ed, e) {
            if (e.keyCode != 65 || !tinymce.VK.metaKeyPressed(e)) { self.selection.normalize(); }
            self.nodeChanged();
        }
        each(nativeToDispatcherMap, function (dispatcherName, nativeName) { var root = settings.content_editable ? self.getBody() : self.getDoc(); switch (nativeName) { case 'contextmenu': dom.bind(root, nativeName, eventHandler); break; case 'paste': dom.bind(self.getBody(), nativeName, eventHandler); break; case 'submit': case 'reset': dom.bind(self.getElement().form || tinymce.DOM.getParent(self.id, 'form'), nativeName, eventHandler); break; default: dom.bind(root, nativeName, eventHandler); } }); dom.bind(settings.content_editable ? self.getBody() : (tinymce.isGecko ? self.getDoc() : self.getWin()), 'focus', function (e) { self.focus(true); }); if (settings.content_editable && tinymce.isOpera) { dom.bind(self.getBody(), 'click', doOperaFocus); dom.bind(self.getBody(), 'keydown', doOperaFocus); }
        self.onMouseUp.add(nodeChanged); self.onKeyUp.add(function (ed, e) {
            var keyCode = e.keyCode; if ((keyCode >= 33 && keyCode <= 36) || (keyCode >= 37 && keyCode <= 40) || keyCode == 13 || keyCode == 45 || keyCode == 46 || keyCode == 8 || (tinymce.isMac && (keyCode == 91 || keyCode == 93)) || e.ctrlKey)
                nodeChanged(ed, e);
        }); self.onReset.add(function () { self.setContent(self.startContent, { format: 'raw' }); }); function handleShortcut(e, execute) {
            if (e.altKey || e.ctrlKey || e.metaKey) {
                each(self.shortcuts, function (shortcut) {
                    var ctrlState = tinymce.isMac ? e.metaKey : e.ctrlKey; if (shortcut.ctrl != ctrlState || shortcut.alt != e.altKey || shortcut.shift != e.shiftKey)
                        return; if (e.keyCode == shortcut.keyCode || (e.charCode && e.charCode == shortcut.charCode)) {
                        e.preventDefault(); if (execute) { shortcut.func.call(shortcut.scope); }
                        return true;
                    } 
                });
            } 
        }; self.onKeyUp.add(function (ed, e) { handleShortcut(e); }); self.onKeyPress.add(function (ed, e) { handleShortcut(e); }); self.onKeyDown.add(function (ed, e) { handleShortcut(e, true); }); if (tinymce.isOpera) { self.onClick.add(function (ed, e) { e.preventDefault(); }); } 
    };
})(tinymce); (function (tinymce) {
    var each = tinymce.each, undef, TRUE = true, FALSE = false; tinymce.EditorCommands = function (editor) {
        var dom = editor.dom, selection = editor.selection, commands = { state: {}, exec: {}, value: {} }, settings = editor.settings, formatter = editor.formatter, bookmark; function execCommand(command, ui, value) {
            var func; command = command.toLowerCase(); if (func = commands.exec[command]) { func(command, ui, value); return TRUE; }
            return FALSE;
        }; function queryCommandState(command) {
            var func; command = command.toLowerCase(); if (func = commands.state[command])
                return func(command); return -1;
        }; function queryCommandValue(command) {
            var func; command = command.toLowerCase(); if (func = commands.value[command])
                return func(command); return FALSE;
        }; function addCommands(command_list, type) { type = type || 'exec'; each(command_list, function (callback, command) { each(command.toLowerCase().split(','), function (command) { commands[type][command] = callback; }); }); }; tinymce.extend(this, { execCommand: execCommand, queryCommandState: queryCommandState, queryCommandValue: queryCommandValue, addCommands: addCommands }); function execNativeCommand(command, ui, value) {
            if (ui === undef)
                ui = FALSE; if (value === undef)
                value = null; return editor.getDoc().execCommand(command, ui, value);
        }; function isFormatMatch(name) { return formatter.match(name); }; function toggleFormat(name, value) { formatter.toggle(name, value ? { value: value} : undef); }; function storeSelection(type) { bookmark = selection.getBookmark(type); }; function restoreSelection() { selection.moveToBookmark(bookmark); }; addCommands({ 'mceResetDesignMode,mceBeginUndoLevel': function () { }, 'mceEndUndoLevel,mceAddUndoLevel': function () { editor.undoManager.add(); }, 'Cut,Copy,Paste': function (command) {
            var doc = editor.getDoc(), failed; try { execNativeCommand(command); } catch (ex) { failed = TRUE; }
            if (failed || !doc.queryCommandSupported(command)) {
                if (tinymce.isGecko) {
                    editor.windowManager.confirm(editor.getLang('clipboard_msg'), function (state) {
                        if (state)
                            open('http://www.mozilla.org/editor/midasdemo/securityprefs.html', '_blank');
                    });
                } else
                    editor.windowManager.alert(editor.getLang('clipboard_no_support'));
            } 
        }, unlink: function (command) {
            if (selection.isCollapsed())
                selection.select(selection.getNode()); execNativeCommand(command); selection.collapse(FALSE);
        }, 'JustifyLeft,JustifyCenter,JustifyRight,JustifyFull': function (command) {
            var align = command.substring(7); each('left,center,right,full'.split(','), function (name) {
                if (align != name)
                    formatter.remove('align' + name);
            }); toggleFormat('align' + align); execCommand('mceRepaint');
        }, 'InsertUnorderedList,InsertOrderedList': function (command) { var listElm, listParent; execNativeCommand(command); listElm = dom.getParent(selection.getNode(), 'ol,ul'); if (listElm) { listParent = listElm.parentNode; if (/^(H[1-6]|P|ADDRESS|PRE)$/.test(listParent.nodeName)) { storeSelection(); dom.split(listParent, listElm); restoreSelection(); } } }, 'Bold,Italic,Underline,Strikethrough,Superscript,Subscript': function (command) { toggleFormat(command); }, 'ForeColor,HiliteColor,FontName': function (command, ui, value) { toggleFormat(command, value); }, FontSize: function (command, ui, value) {
            var fontClasses, fontSizes; if (value >= 1 && value <= 7) {
                fontSizes = tinymce.explode(settings.font_size_style_values); fontClasses = tinymce.explode(settings.font_size_classes); if (fontClasses)
                    value = fontClasses[value - 1] || value; else
                    value = fontSizes[value - 1] || value;
            }
            toggleFormat(command, value);
        }, RemoveFormat: function (command) { formatter.remove(command); }, mceBlockQuote: function (command) { toggleFormat('blockquote'); }, FormatBlock: function (command, ui, value) { return toggleFormat(value || 'p'); }, mceCleanup: function () { var bookmark = selection.getBookmark(); editor.setContent(editor.getContent({ cleanup: TRUE }), { cleanup: TRUE }); selection.moveToBookmark(bookmark); }, mceRemoveNode: function (command, ui, value) { var node = value || selection.getNode(); if (node != editor.getBody()) { storeSelection(); editor.dom.remove(node, TRUE); restoreSelection(); } }, mceSelectNodeDepth: function (command, ui, value) { var counter = 0; dom.getParent(selection.getNode(), function (node) { if (node.nodeType == 1 && counter++ == value) { selection.select(node); return FALSE; } }, editor.getBody()); }, mceSelectNode: function (command, ui, value) { selection.select(value); }, mceInsertContent: function (command, ui, value) {
            var parser, serializer, parentNode, rootNode, fragment, args, marker, nodeRect, viewPortRect, rng, node, node2, bookmarkHtml, viewportBodyElement; parser = editor.parser; serializer = new tinymce.html.Serializer({}, editor.schema); bookmarkHtml = '<span id="mce_marker" data-mce-type="bookmark">\uFEFF</span>'; args = { content: value, format: 'html' }; selection.onBeforeSetContent.dispatch(selection, args); value = args.content; if (value.indexOf('{$caret}') == -1)
                value += '{$caret}'; value = value.replace(/\{\$caret\}/, bookmarkHtml); if (!selection.isCollapsed())
                editor.getDoc().execCommand('Delete', false, null); parentNode = selection.getNode(); args = { context: parentNode.nodeName.toLowerCase() }; fragment = parser.parse(value, args); node = fragment.lastChild; if (node.attr('id') == 'mce_marker') { marker = node; for (node = node.prev; node; node = node.walk(true)) { if (node.type == 3 || !dom.isBlock(node.name)) { node.parent.insert(marker, node, node.name === 'br'); break; } } }
            if (!args.invalid) {
                value = serializer.serialize(fragment); node = parentNode.firstChild; node2 = parentNode.lastChild; if (!node || (node === node2 && node.nodeName === 'BR'))
                    dom.setHTML(parentNode, value); else
                    selection.setContent(value);
            } else {
                selection.setContent(bookmarkHtml); parentNode = selection.getNode(); rootNode = editor.getBody(); if (parentNode.nodeType == 9)
                    parentNode = node = rootNode; else
                    node = parentNode; while (node !== rootNode) { parentNode = node; node = node.parentNode; }
                value = parentNode == rootNode ? rootNode.innerHTML : dom.getOuterHTML(parentNode); value = serializer.serialize(parser.parse(value.replace(/<span (id="mce_marker"|id=mce_marker).+?<\/span>/i, function () { return serializer.serialize(fragment); }))); if (parentNode == rootNode)
                    dom.setHTML(rootNode, value); else
                    dom.setOuterHTML(parentNode, value);
            }
            marker = dom.get('mce_marker'); nodeRect = dom.getRect(marker); viewPortRect = dom.getViewPort(editor.getWin()); if ((nodeRect.y + nodeRect.h > viewPortRect.y + viewPortRect.h || nodeRect.y < viewPortRect.y) || (nodeRect.x > viewPortRect.x + viewPortRect.w || nodeRect.x < viewPortRect.x)) { viewportBodyElement = tinymce.isIE ? editor.getDoc().documentElement : editor.getBody(); viewportBodyElement.scrollLeft = nodeRect.x; viewportBodyElement.scrollTop = nodeRect.y - viewPortRect.h + 25; }
            rng = dom.createRng(); node = marker.previousSibling; if (node && node.nodeType == 3) { rng.setStart(node, node.nodeValue.length); } else { rng.setStartBefore(marker); rng.setEndBefore(marker); }
            dom.remove(marker); selection.setRng(rng); selection.onSetContent.dispatch(selection, args); editor.addVisual();
        }, mceInsertRawHTML: function (command, ui, value) { selection.setContent('tiny_mce_marker'); editor.setContent(editor.getContent().replace(/tiny_mce_marker/g, function () { return value })); }, mceToggleFormat: function (command, ui, value) { toggleFormat(value); }, mceSetContent: function (command, ui, value) { editor.setContent(value); }, 'Indent,Outdent': function (command) {
            var intentValue, indentUnit, value; intentValue = settings.indentation; indentUnit = /[a-z%]+$/i.exec(intentValue); intentValue = parseInt(intentValue); if (!queryCommandState('InsertUnorderedList') && !queryCommandState('InsertOrderedList')) {
                if (!settings.forced_root_block && !dom.getParent(selection.getNode(), dom.isBlock)) { formatter.apply('div'); }
                each(selection.getSelectedBlocks(), function (element) {
                    if (command == 'outdent') { value = Math.max(0, parseInt(element.style.paddingLeft || 0) - intentValue); dom.setStyle(element, 'paddingLeft', value ? value + indentUnit : ''); } else
                        dom.setStyle(element, 'paddingLeft', (parseInt(element.style.paddingLeft || 0) + intentValue) + indentUnit);
                });
            } else
                execNativeCommand(command);
        }, mceRepaint: function () {
            var bookmark; if (tinymce.isGecko) {
                try {
                    storeSelection(TRUE); if (selection.getSel())
                        selection.getSel().selectAllChildren(editor.getBody()); selection.collapse(TRUE); restoreSelection();
                } catch (ex) { } 
            } 
        }, mceToggleFormat: function (command, ui, value) { formatter.toggle(value); }, InsertHorizontalRule: function () { editor.execCommand('mceInsertContent', false, '<hr />'); }, mceToggleVisualAid: function () { editor.hasVisual = !editor.hasVisual; editor.addVisual(); }, mceReplaceContent: function (command, ui, value) { editor.execCommand('mceInsertContent', false, value.replace(/\{\$selection\}/g, selection.getContent({ format: 'text' }))); }, mceInsertLink: function (command, ui, value) {
            var anchor; if (typeof (value) == 'string')
                value = { href: value }; anchor = dom.getParent(selection.getNode(), 'a'); value.href = value.href.replace(' ', '%20'); if (!anchor || !value.href) { formatter.remove('link'); }
            if (value.href) { formatter.apply('link', value, anchor); } 
        }, selectAll: function () { var root = dom.getRoot(), rng = dom.createRng(); if (selection.getRng().setStart) { rng.setStart(root, 0); rng.setEnd(root, root.childNodes.length); selection.setRng(rng); } else { execNativeCommand('SelectAll'); } } 
        }); addCommands({ 'JustifyLeft,JustifyCenter,JustifyRight,JustifyFull': function (command) { var name = 'align' + command.substring(7); var nodes = selection.isCollapsed() ? [dom.getParent(selection.getNode(), dom.isBlock)] : selection.getSelectedBlocks(); var matches = tinymce.map(nodes, function (node) { return !!formatter.matchNode(node, name); }); return tinymce.inArray(matches, TRUE) !== -1; }, 'Bold,Italic,Underline,Strikethrough,Superscript,Subscript': function (command) { return isFormatMatch(command); }, mceBlockQuote: function () { return isFormatMatch('blockquote'); }, Outdent: function () {
            var node; if (settings.inline_styles) {
                if ((node = dom.getParent(selection.getStart(), dom.isBlock)) && parseInt(node.style.paddingLeft) > 0)
                    return TRUE; if ((node = dom.getParent(selection.getEnd(), dom.isBlock)) && parseInt(node.style.paddingLeft) > 0)
                    return TRUE;
            }
            return queryCommandState('InsertUnorderedList') || queryCommandState('InsertOrderedList') || (!settings.inline_styles && !!dom.getParent(selection.getNode(), 'BLOCKQUOTE'));
        }, 'InsertUnorderedList,InsertOrderedList': function (command) { var list = dom.getParent(selection.getNode(), 'ul,ol'); return list && (command === 'insertunorderedlist' && list.tagName === 'UL' || command === 'insertorderedlist' && list.tagName === 'OL'); } 
        }, 'state'); addCommands({ 'FontSize,FontName': function (command) {
            var value = 0, parent; if (parent = dom.getParent(selection.getNode(), 'span')) {
                if (command == 'fontsize')
                    value = parent.style.fontSize; else
                    value = parent.style.fontFamily.replace(/, /g, ',').replace(/[\'\"]/g, '').toLowerCase();
            }
            return value;
        } 
        }, 'value'); addCommands({ Undo: function () { editor.undoManager.undo(); }, Redo: function () { editor.undoManager.redo(); } });
    };
})(tinymce); (function (tinymce) {
    var Dispatcher = tinymce.util.Dispatcher; tinymce.UndoManager = function (editor) {
        var self, index = 0, data = [], beforeBookmark, onAdd, onUndo, onRedo; function getContent() { return tinymce.trim(editor.getContent({ format: 'raw', no_events: 1 }).replace(/<span[^>]+data-mce-bogus[^>]+>[\u200B\uFEFF]+<\/span>/g, '')); }; function addNonTypingUndoLevel() { self.typing = false; self.add(); }; onBeforeAdd = new Dispatcher(self); onAdd = new Dispatcher(self); onUndo = new Dispatcher(self); onRedo = new Dispatcher(self); onAdd.add(function (undoman, level) {
            if (undoman.hasUndo())
                return editor.onChange.dispatch(editor, level, undoman);
        }); onUndo.add(function (undoman, level) { return editor.onUndo.dispatch(editor, level, undoman); }); onRedo.add(function (undoman, level) { return editor.onRedo.dispatch(editor, level, undoman); }); editor.onInit.add(function () { self.add(); }); editor.onBeforeExecCommand.add(function (ed, cmd, ui, val, args) { if (cmd != 'Undo' && cmd != 'Redo' && cmd != 'mceRepaint' && (!args || !args.skip_undo)) { self.beforeChange(); } }); editor.onExecCommand.add(function (ed, cmd, ui, val, args) { if (cmd != 'Undo' && cmd != 'Redo' && cmd != 'mceRepaint' && (!args || !args.skip_undo)) { self.add(); } }); editor.onSaveContent.add(addNonTypingUndoLevel); editor.dom.bind(editor.dom.getRoot(), 'dragend', addNonTypingUndoLevel); editor.dom.bind(editor.getBody(), 'focusout', function (e) { if (!editor.removed && self.typing) { addNonTypingUndoLevel(); } }); editor.onKeyUp.add(function (editor, e) { var keyCode = e.keyCode; if ((keyCode >= 33 && keyCode <= 36) || (keyCode >= 37 && keyCode <= 40) || keyCode == 45 || keyCode == 13 || e.ctrlKey) { addNonTypingUndoLevel(); } }); editor.onKeyDown.add(function (editor, e) {
            var keyCode = e.keyCode; if ((keyCode >= 33 && keyCode <= 36) || (keyCode >= 37 && keyCode <= 40) || keyCode == 45) {
                if (self.typing) { addNonTypingUndoLevel(); }
                return;
            }
            if ((keyCode < 16 || keyCode > 20) && keyCode != 224 && keyCode != 91 && !self.typing) { self.beforeChange(); self.typing = true; self.add(); } 
        }); editor.onMouseDown.add(function (editor, e) { if (self.typing) { addNonTypingUndoLevel(); } }); editor.addShortcut('ctrl+z', 'undo_desc', 'Undo'); editor.addShortcut('ctrl+y', 'redo_desc', 'Redo'); self = { data: data, typing: false, onBeforeAdd: onBeforeAdd, onAdd: onAdd, onUndo: onUndo, onRedo: onRedo, beforeChange: function () { beforeBookmark = editor.selection.getBookmark(2, true); }, add: function (level) {
            var i, settings = editor.settings, lastLevel; level = level || {}; level.content = getContent(); self.onBeforeAdd.dispatch(self, level); lastLevel = data[index]; if (lastLevel && lastLevel.content == level.content)
                return null; if (data[index])
                data[index].beforeBookmark = beforeBookmark; if (settings.custom_undo_redo_levels) {
                if (data.length > settings.custom_undo_redo_levels) {
                    for (i = 0; i < data.length - 1; i++)
                        data[i] = data[i + 1]; data.length--; index = data.length;
                } 
            }
            level.bookmark = editor.selection.getBookmark(2, true); if (index < data.length - 1)
                data.length = index + 1; data.push(level); index = data.length - 1; self.onAdd.dispatch(self, level); editor.isNotDirty = 0; return level;
        }, undo: function () {
            var level, i; if (self.typing) { self.add(); self.typing = false; }
            if (index > 0) { level = data[--index]; editor.setContent(level.content, { format: 'raw' }); editor.selection.moveToBookmark(level.beforeBookmark); self.onUndo.dispatch(self, level); }
            return level;
        }, redo: function () {
            var level; if (index < data.length - 1) { level = data[++index]; editor.setContent(level.content, { format: 'raw' }); editor.selection.moveToBookmark(level.bookmark); self.onRedo.dispatch(self, level); }
            return level;
        }, clear: function () { data = []; index = 0; self.typing = false; }, hasUndo: function () { return index > 0 || this.typing; }, hasRedo: function () { return index < data.length - 1 && !this.typing; } 
        }; return self;
    };
})(tinymce); tinymce.ForceBlocks = function (editor) {
    var settings = editor.settings, dom = editor.dom, selection = editor.selection, blockElements = editor.schema.getBlockElements(); function addRootBlocks() {
        var node = selection.getStart(), rootNode = editor.getBody(), rng, startContainer, startOffset, endContainer, endOffset, rootBlockNode, tempNode, offset = -0xFFFFFF, wrapped, isInEditorDocument; if (!node || node.nodeType !== 1 || !settings.forced_root_block)
            return; while (node && node != rootNode) {
            if (blockElements[node.nodeName])
                return; node = node.parentNode;
        }
        rng = selection.getRng(); if (rng.setStart) { startContainer = rng.startContainer; startOffset = rng.startOffset; endContainer = rng.endContainer; endOffset = rng.endOffset; } else {
            if (rng.item) { node = rng.item(0); rng = editor.getDoc().body.createTextRange(); rng.moveToElementText(node); }
            isInEditorDocument = rng.parentElement().ownerDocument === editor.getDoc(); tmpRng = rng.duplicate(); tmpRng.collapse(true); startOffset = tmpRng.move('character', offset) * -1; if (!tmpRng.collapsed) { tmpRng = rng.duplicate(); tmpRng.collapse(false); endOffset = (tmpRng.move('character', offset) * -1) - startOffset; } 
        }
        node = rootNode.firstChild; while (node) {
            if (node.nodeType === 3 || (node.nodeType == 1 && !blockElements[node.nodeName])) {
                if (node.nodeType === 3 && node.nodeValue.length == 0) { tempNode = node; node = node.nextSibling; dom.remove(tempNode); continue; }
                if (!rootBlockNode) { rootBlockNode = dom.create(settings.forced_root_block); node.parentNode.insertBefore(rootBlockNode, node); wrapped = true; }
                tempNode = node; node = node.nextSibling; rootBlockNode.appendChild(tempNode);
            } else { rootBlockNode = null; node = node.nextSibling; } 
        }
        if (wrapped) {
            if (rng.setStart) { rng.setStart(startContainer, startOffset); rng.setEnd(endContainer, endOffset); selection.setRng(rng); } else {
                if (isInEditorDocument) {
                    try {
                        rng = editor.getDoc().body.createTextRange(); rng.moveToElementText(rootNode); rng.collapse(true); rng.moveStart('character', startOffset); if (endOffset > 0)
                            rng.moveEnd('character', endOffset); rng.select();
                    } catch (ex) { } 
                } 
            }
            editor.nodeChanged();
        } 
    }; if (settings.forced_root_block) { editor.onKeyUp.add(addRootBlocks); editor.onNodeChange.add(addRootBlocks); } 
}; (function (tinymce) {
    var DOM = tinymce.DOM, Event = tinymce.dom.Event, each = tinymce.each, extend = tinymce.extend; tinymce.create('tinymce.ControlManager', { ControlManager: function (ed, s) { var t = this, i; s = s || {}; t.editor = ed; t.controls = {}; t.onAdd = new tinymce.util.Dispatcher(t); t.onPostRender = new tinymce.util.Dispatcher(t); t.prefix = s.prefix || ed.id + '_'; t._cls = {}; t.onPostRender.add(function () { each(t.controls, function (c) { c.postRender(); }); }); }, get: function (id) { return this.controls[this.prefix + id] || this.controls[id]; }, setActive: function (id, s) {
        var c = null; if (c = this.get(id))
            c.setActive(s); return c;
    }, setDisabled: function (id, s) {
        var c = null; if (c = this.get(id))
            c.setDisabled(s); return c;
    }, add: function (c) {
        var t = this; if (c) { t.controls[c.id] = c; t.onAdd.dispatch(c, t); }
        return c;
    }, createControl: function (name) {
        var ctrl, i, l, self = this, editor = self.editor, factories, ctrlName; if (!self.controlFactories) { self.controlFactories = []; each(editor.plugins, function (plugin) { if (plugin.createControl) { self.controlFactories.push(plugin); } }); }
        factories = self.controlFactories; for (i = 0, l = factories.length; i < l; i++) { ctrl = factories[i].createControl(name, self); if (ctrl) { return self.add(ctrl); } }
        if (name === "|" || name === "separator") { return self.createSeparator(); }
        if (editor.buttons && (ctrl = editor.buttons[name])) { return self.createButton(name, ctrl); }
        return self.add(ctrl);
    }, createDropMenu: function (id, s, cc) {
        var t = this, ed = t.editor, c, bm, v, cls; s = extend({ 'class': 'mceDropDown', constrain: ed.settings.constrain_menus }, s); s['class'] = s['class'] + ' ' + ed.getParam('skin') + 'Skin'; if (v = ed.getParam('skin_variant'))
            s['class'] += ' ' + ed.getParam('skin') + 'Skin' + v.substring(0, 1).toUpperCase() + v.substring(1); s['class'] += ed.settings.directionality == "rtl" ? ' mceRtl' : ''; id = t.prefix + id; cls = cc || t._cls.dropmenu || tinymce.ui.DropMenu; c = t.controls[id] = new cls(id, s); c.onAddItem.add(function (c, o) {
                var s = o.settings; s.title = ed.getLang(s.title, s.title); if (!s.onclick) {
                    s.onclick = function (v) {
                        if (s.cmd)
                            ed.execCommand(s.cmd, s.ui || false, s.value);
                    };
                } 
            }); ed.onRemove.add(function () { c.destroy(); }); if (tinymce.isIE) { c.onShowMenu.add(function () { ed.focus(); bm = ed.selection.getBookmark(1); }); c.onHideMenu.add(function () { if (bm) { ed.selection.moveToBookmark(bm); bm = 0; } }); }
        return t.add(c);
    }, createListBox: function (id, s, cc) {
        var t = this, ed = t.editor, cmd, c, cls; if (t.get(id))
            return null; s.title = ed.translate(s.title); s.scope = s.scope || ed; if (!s.onselect) { s.onselect = function (v) { ed.execCommand(s.cmd, s.ui || false, v || s.value); }; }
        s = extend({ title: s.title, 'class': 'mce_' + id, scope: s.scope, control_manager: t }, s); id = t.prefix + id; function useNativeListForAccessibility(ed) { return ed.settings.use_accessible_selects && !tinymce.isGecko }
        if (ed.settings.use_native_selects || useNativeListForAccessibility(ed))
            c = new tinymce.ui.NativeListBox(id, s); else { cls = cc || t._cls.listbox || tinymce.ui.ListBox; c = new cls(id, s, ed); }
        t.controls[id] = c; if (tinymce.isWebKit) { c.onPostRender.add(function (c, n) { Event.add(n, 'mousedown', function () { ed.bookmark = ed.selection.getBookmark(1); }); Event.add(n, 'focus', function () { ed.selection.moveToBookmark(ed.bookmark); ed.bookmark = null; }); }); }
        if (c.hideMenu)
            ed.onMouseDown.add(c.hideMenu, c); return t.add(c);
    }, createButton: function (id, s, cc) {
        var t = this, ed = t.editor, o, c, cls; if (t.get(id))
            return null; s.title = ed.translate(s.title); s.label = ed.translate(s.label); s.scope = s.scope || ed; if (!s.onclick && !s.menu_button) { s.onclick = function () { ed.execCommand(s.cmd, s.ui || false, s.value); }; }
        s = extend({ title: s.title, 'class': 'mce_' + id, unavailable_prefix: ed.getLang('unavailable', ''), scope: s.scope, control_manager: t }, s); id = t.prefix + id; if (s.menu_button) { cls = cc || t._cls.menubutton || tinymce.ui.MenuButton; c = new cls(id, s, ed); ed.onMouseDown.add(c.hideMenu, c); } else { cls = t._cls.button || tinymce.ui.Button; c = new cls(id, s, ed); }
        return t.add(c);
    }, createMenuButton: function (id, s, cc) { s = s || {}; s.menu_button = 1; return this.createButton(id, s, cc); }, createSplitButton: function (id, s, cc) {
        var t = this, ed = t.editor, cmd, c, cls; if (t.get(id))
            return null; s.title = ed.translate(s.title); s.scope = s.scope || ed; if (!s.onclick) { s.onclick = function (v) { ed.execCommand(s.cmd, s.ui || false, v || s.value); }; }
        if (!s.onselect) { s.onselect = function (v) { ed.execCommand(s.cmd, s.ui || false, v || s.value); }; }
        s = extend({ title: s.title, 'class': 'mce_' + id, scope: s.scope, control_manager: t }, s); id = t.prefix + id; cls = cc || t._cls.splitbutton || tinymce.ui.SplitButton; c = t.add(new cls(id, s, ed)); ed.onMouseDown.add(c.hideMenu, c); return c;
    }, createColorSplitButton: function (id, s, cc) {
        var t = this, ed = t.editor, cmd, c, cls, bm; if (t.get(id))
            return null; s.title = ed.translate(s.title); s.scope = s.scope || ed; if (!s.onclick) {
            s.onclick = function (v) {
                if (tinymce.isIE)
                    bm = ed.selection.getBookmark(1); ed.execCommand(s.cmd, s.ui || false, v || s.value);
            };
        }
        if (!s.onselect) { s.onselect = function (v) { ed.execCommand(s.cmd, s.ui || false, v || s.value); }; }
        s = extend({ title: s.title, 'class': 'mce_' + id, 'menu_class': ed.getParam('skin') + 'Skin', scope: s.scope, more_colors_title: ed.getLang('more_colors') }, s); id = t.prefix + id; cls = cc || t._cls.colorsplitbutton || tinymce.ui.ColorSplitButton; c = new cls(id, s, ed); ed.onMouseDown.add(c.hideMenu, c); ed.onRemove.add(function () { c.destroy(); }); if (tinymce.isIE) { c.onShowMenu.add(function () { ed.focus(); bm = ed.selection.getBookmark(1); }); c.onHideMenu.add(function () { if (bm) { ed.selection.moveToBookmark(bm); bm = 0; } }); }
        return t.add(c);
    }, createToolbar: function (id, s, cc) {
        var c, t = this, cls; id = t.prefix + id; cls = cc || t._cls.toolbar || tinymce.ui.Toolbar; c = new cls(id, s, t.editor); if (t.get(id))
            return null; return t.add(c);
    }, createToolbarGroup: function (id, s, cc) {
        var c, t = this, cls; id = t.prefix + id; cls = cc || this._cls.toolbarGroup || tinymce.ui.ToolbarGroup; c = new cls(id, s, t.editor); if (t.get(id))
            return null; return t.add(c);
    }, createSeparator: function (cc) { var cls = cc || this._cls.separator || tinymce.ui.Separator; return new cls(); }, setControlType: function (n, c) { return this._cls[n.toLowerCase()] = c; }, destroy: function () { each(this.controls, function (c) { c.destroy(); }); this.controls = null; } 
    });
})(tinymce); (function (tinymce) {
    var Dispatcher = tinymce.util.Dispatcher, each = tinymce.each, isIE = tinymce.isIE, isOpera = tinymce.isOpera; tinymce.create('tinymce.WindowManager', { WindowManager: function (ed) { var t = this; t.editor = ed; t.onOpen = new Dispatcher(t); t.onClose = new Dispatcher(t); t.params = {}; t.features = {}; }, open: function (s, p) {
        var t = this, f = '', x, y, mo = t.editor.settings.dialog_type == 'modal', w, sw, sh, vp = tinymce.DOM.getViewPort(), u; s = s || {}; p = p || {}; sw = isOpera ? vp.w : screen.width; sh = isOpera ? vp.h : screen.height; s.name = s.name || 'mc_' + new Date().getTime(); s.width = parseInt(s.width || 320); s.height = parseInt(s.height || 240); s.resizable = true; s.left = s.left || parseInt(sw / 2.0) - (s.width / 2.0); s.top = s.top || parseInt(sh / 2.0) - (s.height / 2.0); p.inline = false; p.mce_width = s.width; p.mce_height = s.height; p.mce_auto_focus = s.auto_focus; if (mo) { if (isIE) { s.center = true; s.help = false; s.dialogWidth = s.width + 'px'; s.dialogHeight = s.height + 'px'; s.scroll = s.scrollbars || false; } }
        each(s, function (v, k) {
            if (tinymce.is(v, 'boolean'))
                v = v ? 'yes' : 'no'; if (!/^(name|url)$/.test(k)) {
                if (isIE && mo)
                    f += (f ? ';' : '') + k + ':' + v; else
                    f += (f ? ',' : '') + k + '=' + v;
            } 
        }); t.features = s; t.params = p; t.onOpen.dispatch(t, s, p); u = s.url || s.file; u = tinymce._addVer(u); try {
            if (isIE && mo) { w = 1; window.showModalDialog(u, window, f); } else
                w = window.open(u, s.name, f);
        } catch (ex) { }
        if (!w)
            alert(t.editor.getLang('popup_blocked'));
    }, close: function (w) { w.close(); this.onClose.dispatch(this); }, createInstance: function (cl, a, b, c, d, e) { var f = tinymce.resolve(cl); return new f(a, b, c, d, e); }, confirm: function (t, cb, s, w) { w = w || window; cb.call(s || this, w.confirm(this._decode(this.editor.getLang(t, t)))); }, alert: function (tx, cb, s, w) {
        var t = this; w = w || window; w.alert(t._decode(t.editor.getLang(tx, tx))); if (cb)
            cb.call(s || t);
    }, resizeBy: function (dw, dh, win) { win.resizeBy(dw, dh); }, _decode: function (s) { return tinymce.DOM.decode(s).replace(/\\n/g, '\n'); } 
    });
} (tinymce)); (function (tinymce) {
    tinymce.Formatter = function (ed) {
        var formats = {}, each = tinymce.each, dom = ed.dom, selection = ed.selection, TreeWalker = tinymce.dom.TreeWalker, rangeUtils = new tinymce.dom.RangeUtils(dom), isValid = ed.schema.isValidChild, isArray = tinymce.isArray, isBlock = dom.isBlock, forcedRootBlock = ed.settings.forced_root_block, nodeIndex = dom.nodeIndex, INVISIBLE_CHAR = '\uFEFF', MCE_ATTR_RE = /^(src|href|style)$/, FALSE = false, TRUE = true, formatChangeData, undef, getContentEditable = dom.getContentEditable; function isTextBlock(name) {
            if (name.nodeType) { name = name.nodeName; }
            return !!ed.schema.getTextBlockElements()[name.toLowerCase()];
        }
        function getParents(node, selector) { return dom.getParents(node, selector, dom.getRoot()); }; function isCaretNode(node) { return node.nodeType === 1 && node.id === '_mce_caret'; }; function defaultFormats() { register({ alignleft: [{ selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles: { textAlign: 'left' }, defaultBlock: 'div' }, { selector: 'img,table', collapsed: false, styles: { 'float': 'left'}}], aligncenter: [{ selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles: { textAlign: 'center' }, defaultBlock: 'div' }, { selector: 'img', collapsed: false, styles: { display: 'block', marginLeft: 'auto', marginRight: 'auto'} }, { selector: 'table', collapsed: false, styles: { marginLeft: 'auto', marginRight: 'auto'}}], alignright: [{ selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles: { textAlign: 'right' }, defaultBlock: 'div' }, { selector: 'img,table', collapsed: false, styles: { 'float': 'right'}}], alignfull: [{ selector: 'figure,p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li', styles: { textAlign: 'justify' }, defaultBlock: 'div'}], bold: [{ inline: 'strong', remove: 'all' }, { inline: 'span', styles: { fontWeight: 'bold'} }, { inline: 'b', remove: 'all'}], italic: [{ inline: 'em', remove: 'all' }, { inline: 'span', styles: { fontStyle: 'italic'} }, { inline: 'i', remove: 'all'}], underline: [{ inline: 'span', styles: { textDecoration: 'underline' }, exact: true }, { inline: 'u', remove: 'all'}], strikethrough: [{ inline: 'span', styles: { textDecoration: 'line-through' }, exact: true }, { inline: 'strike', remove: 'all'}], forecolor: { inline: 'span', styles: { color: '%value' }, wrap_links: false }, hilitecolor: { inline: 'span', styles: { backgroundColor: '%value' }, wrap_links: false }, fontname: { inline: 'span', styles: { fontFamily: '%value'} }, fontsize: { inline: 'span', styles: { fontSize: '%value'} }, fontsize_class: { inline: 'span', attributes: { 'class': '%value'} }, blockquote: { block: 'blockquote', wrapper: 1, remove: 'all' }, subscript: { inline: 'sub' }, superscript: { inline: 'sup' }, link: { inline: 'a', selector: 'a', remove: 'all', split: true, deep: true, onmatch: function (node) { return true; }, onformat: function (elm, fmt, vars) { each(vars, function (value, key) { dom.setAttrib(elm, key, value); }); } }, removeformat: [{ selector: 'b,strong,em,i,font,u,strike', remove: 'all', split: true, expand: false, block_expand: true, deep: true }, { selector: 'span', attributes: ['style', 'class'], remove: 'empty', split: true, expand: false, deep: true }, { selector: '*', attributes: ['style', 'class'], split: false, expand: false, deep: true}] }); each('p h1 h2 h3 h4 h5 h6 div address pre div code dt dd samp'.split(/\s/), function (name) { register(name, { block: name, remove: 'all' }); }); register(ed.settings.formats); }; function addKeyboardShortcuts() {
            ed.addShortcut('ctrl+b', 'bold_desc', 'Bold'); ed.addShortcut('ctrl+i', 'italic_desc', 'Italic'); ed.addShortcut('ctrl+u', 'underline_desc', 'Underline'); for (var i = 1; i <= 6; i++) { ed.addShortcut('ctrl+' + i, '', ['FormatBlock', false, 'h' + i]); }
            ed.addShortcut('ctrl+7', '', ['FormatBlock', false, 'p']); ed.addShortcut('ctrl+8', '', ['FormatBlock', false, 'div']); ed.addShortcut('ctrl+9', '', ['FormatBlock', false, 'address']);
        }; function get(name) { return name ? formats[name] : formats; }; function register(name, format) {
            if (name) {
                if (typeof (name) !== 'string') { each(name, function (format, name) { register(name, format); }); } else {
                    format = format.length ? format : [format]; each(format, function (format) {
                        if (format.deep === undef)
                            format.deep = !format.selector; if (format.split === undef)
                            format.split = !format.selector || format.inline; if (format.remove === undef && format.selector && !format.inline)
                            format.remove = 'none'; if (format.selector && format.inline) { format.mixed = true; format.block_expand = true; }
                        if (typeof (format.classes) === 'string')
                            format.classes = format.classes.split(/\s+/);
                    }); formats[name] = format;
                } 
            } 
        }; var getTextDecoration = function (node) { var decoration; ed.dom.getParent(node, function (n) { decoration = ed.dom.getStyle(n, 'text-decoration'); return decoration && decoration !== 'none'; }); return decoration; }; var processUnderlineAndColor = function (node) { var textDecoration; if (node.nodeType === 1 && node.parentNode && node.parentNode.nodeType === 1) { textDecoration = getTextDecoration(node.parentNode); if (ed.dom.getStyle(node, 'color') && textDecoration) { ed.dom.setStyle(node, 'text-decoration', textDecoration); } else if (ed.dom.getStyle(node, 'textdecoration') === textDecoration) { ed.dom.setStyle(node, 'text-decoration', null); } } }; function apply(name, vars, node) {
            var formatList = get(name), format = formatList[0], bookmark, rng, i, isCollapsed = selection.isCollapsed(); function setElementFormat(elm, fmt) {
                fmt = fmt || format; if (elm) {
                    if (fmt.onformat) { fmt.onformat(elm, fmt, vars, node); }
                    each(fmt.styles, function (value, name) { dom.setStyle(elm, name, replaceVars(value, vars)); }); each(fmt.attributes, function (value, name) { dom.setAttrib(elm, name, replaceVars(value, vars)); }); each(fmt.classes, function (value) {
                        value = replaceVars(value, vars); if (!dom.hasClass(elm, value))
                            dom.addClass(elm, value);
                    });
                } 
            }; function adjustSelectionToVisibleSelection() {
                function findSelectionEnd(start, end) { var walker = new TreeWalker(end); for (node = walker.current(); node; node = walker.prev()) { if (node.childNodes.length > 1 || node == start || node.tagName == 'BR') { return node; } } }; var rng = ed.selection.getRng(); var start = rng.startContainer; var end = rng.endContainer; if (start != end && rng.endOffset === 0) { var newEnd = findSelectionEnd(start, end); var endOffset = newEnd.nodeType == 3 ? newEnd.length : newEnd.childNodes.length; rng.setEnd(newEnd, endOffset); }
                return rng;
            }
            function applyStyleToList(node, bookmark, wrapElm, newWrappers, process) {
                var nodes = [], listIndex = -1, list, startIndex = -1, endIndex = -1, currentWrapElm; each(node.childNodes, function (n, index) { if (n.nodeName === "UL" || n.nodeName === "OL") { listIndex = index; list = n; return false; } }); each(node.childNodes, function (n, index) { if (n.nodeName === "SPAN" && dom.getAttrib(n, "data-mce-type") == "bookmark") { if (n.id == bookmark.id + "_start") { startIndex = index; } else if (n.id == bookmark.id + "_end") { endIndex = index; } } }); if (listIndex <= 0 || (startIndex < listIndex && endIndex > listIndex)) { each(tinymce.grep(node.childNodes), process); return 0; } else {
                    currentWrapElm = dom.clone(wrapElm, FALSE); each(tinymce.grep(node.childNodes), function (n, index) { if ((startIndex < listIndex && index < listIndex) || (startIndex > listIndex && index > listIndex)) { nodes.push(n); n.parentNode.removeChild(n); } }); if (startIndex < listIndex) { node.insertBefore(currentWrapElm, list); } else if (startIndex > listIndex) { node.insertBefore(currentWrapElm, list.nextSibling); }
                    newWrappers.push(currentWrapElm); each(nodes, function (node) { currentWrapElm.appendChild(node); }); return currentWrapElm;
                } 
            }; function applyRngStyle(rng, bookmark, node_specific) {
                var newWrappers = [], wrapName, wrapElm, contentEditable = true; wrapName = format.inline || format.block; wrapElm = dom.create(wrapName); setElementFormat(wrapElm); rangeUtils.walk(rng, function (nodes) {
                    var currentWrapElm; function process(node) {
                        var nodeName, parentName, found, hasContentEditableState, lastContentEditable; lastContentEditable = contentEditable; nodeName = node.nodeName.toLowerCase(); parentName = node.parentNode.nodeName.toLowerCase(); if (node.nodeType === 1 && getContentEditable(node)) { lastContentEditable = contentEditable; contentEditable = getContentEditable(node) === "true"; hasContentEditableState = true; }
                        if (isEq(nodeName, 'br')) {
                            currentWrapElm = 0; if (format.block)
                                dom.remove(node); return;
                        }
                        if (format.wrapper && matchNode(node, name, vars)) { currentWrapElm = 0; return; }
                        if (contentEditable && !hasContentEditableState && format.block && !format.wrapper && isTextBlock(nodeName)) { node = dom.rename(node, wrapName); setElementFormat(node); newWrappers.push(node); currentWrapElm = 0; return; }
                        if (format.selector) {
                            each(formatList, function (format) {
                                if ('collapsed' in format && format.collapsed !== isCollapsed) { return; }
                                if (dom.is(node, format.selector) && !isCaretNode(node)) { setElementFormat(node, format); found = true; } 
                            }); if (!format.inline || found) { currentWrapElm = 0; return; } 
                        }
                        if (contentEditable && !hasContentEditableState && isValid(wrapName, nodeName) && isValid(parentName, wrapName) && !(!node_specific && node.nodeType === 3 && node.nodeValue.length === 1 && node.nodeValue.charCodeAt(0) === 65279) && !isCaretNode(node) && (!format.inline || !isBlock(node))) {
                            if (!currentWrapElm) { currentWrapElm = dom.clone(wrapElm, FALSE); node.parentNode.insertBefore(currentWrapElm, node); newWrappers.push(currentWrapElm); }
                            currentWrapElm.appendChild(node);
                        } else if (nodeName == 'li' && bookmark) { currentWrapElm = applyStyleToList(node, bookmark, wrapElm, newWrappers, process); } else {
                            currentWrapElm = 0; each(tinymce.grep(node.childNodes), process); if (hasContentEditableState) { contentEditable = lastContentEditable; }
                            currentWrapElm = 0;
                        } 
                    }; each(nodes, process);
                }); if (format.wrap_links === false) {
                    each(newWrappers, function (node) {
                        function process(node) {
                            var i, currentWrapElm, children; if (node.nodeName === 'A') {
                                currentWrapElm = dom.clone(wrapElm, FALSE); newWrappers.push(currentWrapElm); children = tinymce.grep(node.childNodes); for (i = 0; i < children.length; i++)
                                    currentWrapElm.appendChild(children[i]); node.appendChild(currentWrapElm);
                            }
                            each(tinymce.grep(node.childNodes), process);
                        }; process(node);
                    });
                }
                each(newWrappers, function (node) {
                    var childCount; function getChildCount(node) {
                        var count = 0; each(node.childNodes, function (node) {
                            if (!isWhiteSpaceNode(node) && !isBookmarkNode(node))
                                count++;
                        }); return count;
                    }; function mergeStyles(node) {
                        var child, clone; each(node.childNodes, function (node) { if (node.nodeType == 1 && !isBookmarkNode(node) && !isCaretNode(node)) { child = node; return FALSE; } }); if (child && matchName(child, format)) { clone = dom.clone(child, FALSE); setElementFormat(clone); dom.replace(clone, node, TRUE); dom.remove(child, 1); }
                        return clone || node;
                    }; childCount = getChildCount(node); if ((newWrappers.length > 1 || !isBlock(node)) && childCount === 0) { dom.remove(node, 1); return; }
                    if (format.inline || format.wrapper) {
                        if (!format.exact && childCount === 1)
                            node = mergeStyles(node); each(formatList, function (format) {
                                each(dom.select(format.inline, node), function (child) {
                                    var parent; if (format.wrap_links === false) {
                                        parent = child.parentNode; do {
                                            if (parent.nodeName === 'A')
                                                return;
                                        } while (parent = parent.parentNode);
                                    }
                                    removeFormat(format, vars, child, format.exact ? child : null);
                                });
                            }); if (matchNode(node.parentNode, name, vars)) { dom.remove(node, 1); node = 0; return TRUE; }
                        if (format.merge_with_parents) { dom.getParent(node.parentNode, function (parent) { if (matchNode(parent, name, vars)) { dom.remove(node, 1); node = 0; return TRUE; } }); }
                        if (node && format.merge_siblings !== false) { node = mergeSiblings(getNonWhiteSpaceSibling(node), node); node = mergeSiblings(node, getNonWhiteSpaceSibling(node, TRUE)); } 
                    } 
                });
            }; if (format) {
                if (node) { if (node.nodeType) { rng = dom.createRng(); rng.setStartBefore(node); rng.setEndAfter(node); applyRngStyle(expandRng(rng, formatList), null, true); } else { applyRngStyle(node, null, true); } } else {
                    if (!isCollapsed || !format.inline || dom.select('td.mceSelected,th.mceSelected').length) {
                        var curSelNode = ed.selection.getNode(); if (!forcedRootBlock && formatList[0].defaultBlock && !dom.getParent(curSelNode, dom.isBlock)) { apply(formatList[0].defaultBlock); }
                        ed.selection.setRng(adjustSelectionToVisibleSelection()); bookmark = selection.getBookmark(); applyRngStyle(expandRng(selection.getRng(TRUE), formatList), bookmark); if (format.styles && (format.styles.color || format.styles.textDecoration)) { tinymce.walk(curSelNode, processUnderlineAndColor, 'childNodes'); processUnderlineAndColor(curSelNode); }
                        selection.moveToBookmark(bookmark); moveStart(selection.getRng(TRUE)); ed.nodeChanged();
                    } else
                        performCaretAction('apply', name, vars);
                } 
            } 
        }; function remove(name, vars, node) {
            var formatList = get(name), format = formatList[0], bookmark, i, rng, contentEditable = true; function process(node) {
                var children, i, l, localContentEditable, lastContentEditable, hasContentEditableState; if (node.nodeType === 3) { return; }
                if (node.nodeType === 1 && getContentEditable(node)) { lastContentEditable = contentEditable; contentEditable = getContentEditable(node) === "true"; hasContentEditableState = true; }
                children = tinymce.grep(node.childNodes); if (contentEditable && !hasContentEditableState) {
                    for (i = 0, l = formatList.length; i < l; i++) {
                        if (removeFormat(formatList[i], vars, node, node))
                            break;
                    } 
                }
                if (format.deep) {
                    if (children.length) {
                        for (i = 0, l = children.length; i < l; i++)
                            process(children[i]); if (hasContentEditableState) { contentEditable = lastContentEditable; } 
                    } 
                } 
            }; function findFormatRoot(container) {
                var formatRoot; each(getParents(container.parentNode).reverse(), function (parent) {
                    var format; if (!formatRoot && parent.id != '_start' && parent.id != '_end') {
                        format = matchNode(parent, name, vars); if (format && format.split !== false)
                            formatRoot = parent;
                    } 
                }); return formatRoot;
            }; function wrapAndSplit(format_root, container, target, split) {
                var parent, clone, lastClone, firstClone, i, formatRootParent; if (format_root) {
                    formatRootParent = format_root.parentNode; for (parent = container.parentNode; parent && parent != formatRootParent; parent = parent.parentNode) {
                        clone = dom.clone(parent, FALSE); for (i = 0; i < formatList.length; i++) { if (removeFormat(formatList[i], vars, clone, clone)) { clone = 0; break; } }
                        if (clone) {
                            if (lastClone)
                                clone.appendChild(lastClone); if (!firstClone)
                                firstClone = clone; lastClone = clone;
                        } 
                    }
                    if (split && (!format.mixed || !isBlock(format_root)))
                        container = dom.split(format_root, container); if (lastClone) { target.parentNode.insertBefore(lastClone, target); firstClone.appendChild(target); } 
                }
                return container;
            }; function splitToFormatRoot(container) { return wrapAndSplit(findFormatRoot(container), container, container, true); }; function unwrap(start) {
                var node = dom.get(start ? '_start' : '_end'), out = node[start ? 'firstChild' : 'lastChild']; if (isBookmarkNode(out))
                    out = out[start ? 'firstChild' : 'lastChild']; dom.remove(node, true); return out;
            }; function removeRngStyle(rng) {
                var startContainer, endContainer, node; rng = expandRng(rng, formatList, TRUE); if (format.split) {
                    startContainer = getContainer(rng, TRUE); endContainer = getContainer(rng); if (startContainer != endContainer) {
                        if (/^(TR|TD)$/.test(startContainer.nodeName) && startContainer.firstChild) { startContainer = (startContainer.nodeName == "TD" ? startContainer.firstChild : startContainer.firstChild.firstChild) || startContainer; }
                        startContainer = wrap(startContainer, 'span', { id: '_start', 'data-mce-type': 'bookmark' }); endContainer = wrap(endContainer, 'span', { id: '_end', 'data-mce-type': 'bookmark' }); splitToFormatRoot(startContainer); splitToFormatRoot(endContainer); startContainer = unwrap(TRUE); endContainer = unwrap();
                    } else
                        startContainer = endContainer = splitToFormatRoot(startContainer); rng.startContainer = startContainer.parentNode; rng.startOffset = nodeIndex(startContainer); rng.endContainer = endContainer.parentNode; rng.endOffset = nodeIndex(endContainer) + 1;
                }
                rangeUtils.walk(rng, function (nodes) { each(nodes, function (node) { process(node); if (node.nodeType === 1 && ed.dom.getStyle(node, 'text-decoration') === 'underline' && node.parentNode && getTextDecoration(node.parentNode) === 'underline') { removeFormat({ 'deep': false, 'exact': true, 'inline': 'span', 'styles': { 'textDecoration': 'underline'} }, null, node); } }); });
            }; if (node) {
                if (node.nodeType) { rng = dom.createRng(); rng.setStartBefore(node); rng.setEndAfter(node); removeRngStyle(rng); } else { removeRngStyle(node); }
                return;
            }
            if (!selection.isCollapsed() || !format.inline || dom.select('td.mceSelected,th.mceSelected').length) {
                bookmark = selection.getBookmark(); removeRngStyle(selection.getRng(TRUE)); selection.moveToBookmark(bookmark); if (format.inline && match(name, vars, selection.getStart())) { moveStart(selection.getRng(true)); }
                ed.nodeChanged();
            } else
                performCaretAction('remove', name, vars);
        }; function toggle(name, vars, node) {
            var fmt = get(name); if (match(name, vars, node) && (!('toggle' in fmt[0]) || fmt[0].toggle))
                remove(name, vars, node); else
                apply(name, vars, node);
        }; function matchNode(node, name, vars, similar) {
            var formatList = get(name), format, i, classes; function matchItems(node, format, item_name) {
                var key, value, items = format[item_name], i; if (format.onmatch) { return format.onmatch(node, format, item_name); }
                if (items) {
                    if (items.length === undef) {
                        for (key in items) {
                            if (items.hasOwnProperty(key)) {
                                if (item_name === 'attributes')
                                    value = dom.getAttrib(node, key); else
                                    value = getStyle(node, key); if (similar && !value && !format.exact)
                                    return; if ((!similar || format.exact) && !isEq(value, replaceVars(items[key], vars)))
                                    return;
                            } 
                        } 
                    } else {
                        for (i = 0; i < items.length; i++) {
                            if (item_name === 'attributes' ? dom.getAttrib(node, items[i]) : getStyle(node, items[i]))
                                return format;
                        } 
                    } 
                }
                return format;
            }; if (formatList && node) {
                for (i = 0; i < formatList.length; i++) {
                    format = formatList[i]; if (matchName(node, format) && matchItems(node, format, 'attributes') && matchItems(node, format, 'styles')) {
                        if (classes = format.classes) {
                            for (i = 0; i < classes.length; i++) {
                                if (!dom.hasClass(node, classes[i]))
                                    return;
                            } 
                        }
                        return format;
                    } 
                } 
            } 
        }; function match(name, vars, node) {
            var startNode; function matchParents(node) { node = dom.getParent(node, function (node) { return !!matchNode(node, name, vars, true); }); return matchNode(node, name, vars); }; if (node)
                return matchParents(node); node = selection.getNode(); if (matchParents(node))
                return TRUE; startNode = selection.getStart(); if (startNode != node) {
                if (matchParents(startNode))
                    return TRUE;
            }
            return FALSE;
        }; function matchAll(names, vars) { var startElement, matchedFormatNames = [], checkedMap = {}, i, ni, name; startElement = selection.getStart(); dom.getParent(startElement, function (node) { var i, name; for (i = 0; i < names.length; i++) { name = names[i]; if (!checkedMap[name] && matchNode(node, name, vars)) { checkedMap[name] = true; matchedFormatNames.push(name); } } }, dom.getRoot()); return matchedFormatNames; }; function canApply(name) {
            var formatList = get(name), startNode, parents, i, x, selector; if (formatList) {
                startNode = selection.getStart(); parents = getParents(startNode); for (x = formatList.length - 1; x >= 0; x--) {
                    selector = formatList[x].selector; if (!selector)
                        return TRUE; for (i = parents.length - 1; i >= 0; i--) {
                        if (dom.is(parents[i], selector))
                            return TRUE;
                    } 
                } 
            }
            return FALSE;
        }; function formatChanged(formats, callback, similar) {
            var currentFormats; if (!formatChangeData) {
                formatChangeData = {}; currentFormats = {}; ed.onNodeChange.addToTop(function (ed, cm, node) {
                    var parents = getParents(node), matchedFormats = {}; each(formatChangeData, function (callbacks, format) {
                        each(parents, function (node) {
                            if (matchNode(node, format, {}, callbacks.similar)) {
                                if (!currentFormats[format]) { each(callbacks, function (callback) { callback(true, { node: node, format: format, parents: parents }); }); currentFormats[format] = callbacks; }
                                matchedFormats[format] = callbacks; return false;
                            } 
                        });
                    }); each(currentFormats, function (callbacks, format) { if (!matchedFormats[format]) { delete currentFormats[format]; each(callbacks, function (callback) { callback(false, { node: node, format: format, parents: parents }); }); } });
                });
            }
            each(formats.split(','), function (format) {
                if (!formatChangeData[format]) { formatChangeData[format] = []; formatChangeData[format].similar = similar; }
                formatChangeData[format].push(callback);
            }); return this;
        }; tinymce.extend(this, { get: get, register: register, apply: apply, remove: remove, toggle: toggle, match: match, matchAll: matchAll, matchNode: matchNode, canApply: canApply, formatChanged: formatChanged }); defaultFormats(); addKeyboardShortcuts(); function matchName(node, format) {
            if (isEq(node, format.inline))
                return TRUE; if (isEq(node, format.block))
                return TRUE; if (format.selector)
                return dom.is(node, format.selector);
        }; function isEq(str1, str2) { str1 = str1 || ''; str2 = str2 || ''; str1 = '' + (str1.nodeName || str1); str2 = '' + (str2.nodeName || str2); return str1.toLowerCase() == str2.toLowerCase(); }; function getStyle(node, name) {
            var styleVal = dom.getStyle(node, name); if (name == 'color' || name == 'backgroundColor')
                styleVal = dom.toHex(styleVal); if (name == 'fontWeight' && styleVal == 700)
                styleVal = 'bold'; return '' + styleVal;
        }; function replaceVars(value, vars) {
            if (typeof (value) != "string")
                value = value(vars); else if (vars) { value = value.replace(/%(\w+)/g, function (str, name) { return vars[name] || str; }); }
            return value;
        }; function isWhiteSpaceNode(node) { return node && node.nodeType === 3 && /^([\t \r\n]+|)$/.test(node.nodeValue); }; function wrap(node, name, attrs) { var wrapper = dom.create(name, attrs); node.parentNode.insertBefore(wrapper, node); wrapper.appendChild(node); return wrapper; }; function expandRng(rng, format, remove) {
            var sibling, lastIdx, leaf, endPoint, startContainer = rng.startContainer, startOffset = rng.startOffset, endContainer = rng.endContainer, endOffset = rng.endOffset; function findParentContainer(start) {
                var container, parent, child, sibling, siblingName, root; container = parent = start ? startContainer : endContainer; siblingName = start ? 'previousSibling' : 'nextSibling'; root = dom.getRoot(); function isBogusBr(node) { return node.nodeName == "BR" && node.getAttribute('data-mce-bogus') && !node.nextSibling; }; if (container.nodeType == 3 && !isWhiteSpaceNode(container)) { if (start ? startOffset > 0 : endOffset < container.nodeValue.length) { return container; } }
                for (; ; ) {
                    if (!format[0].block_expand && isBlock(parent))
                        return parent; for (sibling = parent[siblingName]; sibling; sibling = sibling[siblingName]) { if (!isBookmarkNode(sibling) && !isWhiteSpaceNode(sibling) && !isBogusBr(sibling)) { return parent; } }
                    if (parent.parentNode == root) { container = parent; break; }
                    parent = parent.parentNode;
                }
                return container;
            }; function findLeaf(node, offset) {
                if (offset === undef)
                    offset = node.nodeType === 3 ? node.length : node.childNodes.length; while (node && node.hasChildNodes()) {
                    node = node.childNodes[offset]; if (node)
                        offset = node.nodeType === 3 ? node.length : node.childNodes.length;
                }
                return { node: node, offset: offset };
            }
            if (startContainer.nodeType == 1 && startContainer.hasChildNodes()) {
                lastIdx = startContainer.childNodes.length - 1; startContainer = startContainer.childNodes[startOffset > lastIdx ? lastIdx : startOffset]; if (startContainer.nodeType == 3)
                    startOffset = 0;
            }
            if (endContainer.nodeType == 1 && endContainer.hasChildNodes()) {
                lastIdx = endContainer.childNodes.length - 1; endContainer = endContainer.childNodes[endOffset > lastIdx ? lastIdx : endOffset - 1]; if (endContainer.nodeType == 3)
                    endOffset = endContainer.nodeValue.length;
            }
            function findParentContentEditable(node) {
                var parent = node; while (parent) {
                    if (parent.nodeType === 1 && getContentEditable(parent)) { return getContentEditable(parent) === "false" ? parent : node; }
                    parent = parent.parentNode;
                }
                return node;
            }; function findWordEndPoint(container, offset, start) {
                var walker, node, pos, lastTextNode; function findSpace(node, offset) {
                    var pos, pos2, str = node.nodeValue; if (typeof (offset) == "undefined") { offset = start ? str.length : 0; }
                    if (start) { pos = str.lastIndexOf(' ', offset); pos2 = str.lastIndexOf('\u00a0', offset); pos = pos > pos2 ? pos : pos2; if (pos !== -1 && !remove) { pos++; } } else { pos = str.indexOf(' ', offset); pos2 = str.indexOf('\u00a0', offset); pos = pos !== -1 && (pos2 === -1 || pos < pos2) ? pos : pos2; }
                    return pos;
                }; if (container.nodeType === 3) {
                    pos = findSpace(container, offset); if (pos !== -1) { return { container: container, offset: pos }; }
                    lastTextNode = container;
                }
                walker = new TreeWalker(container, dom.getParent(container, isBlock) || ed.getBody()); while (node = walker[start ? 'prev' : 'next']()) { if (node.nodeType === 3) { lastTextNode = node; pos = findSpace(node); if (pos !== -1) { return { container: node, offset: pos }; } } else if (isBlock(node)) { break; } }
                if (lastTextNode) {
                    if (start) { offset = 0; } else { offset = lastTextNode.length; }
                    return { container: lastTextNode, offset: offset };
                } 
            }; function findSelectorEndPoint(container, sibling_name) {
                var parents, i, y, curFormat; if (container.nodeType == 3 && container.nodeValue.length === 0 && container[sibling_name])
                    container = container[sibling_name]; parents = getParents(container); for (i = 0; i < parents.length; i++) {
                    for (y = 0; y < format.length; y++) {
                        curFormat = format[y]; if ("collapsed" in curFormat && curFormat.collapsed !== rng.collapsed)
                            continue; if (dom.is(parents[i], curFormat.selector))
                            return parents[i];
                    } 
                }
                return container;
            }; function findBlockEndPoint(container, sibling_name, sibling_name2) {
                var node; if (!format[0].wrapper)
                    node = dom.getParent(container, format[0].block); if (!node)
                    node = dom.getParent(container.nodeType == 3 ? container.parentNode : container, isTextBlock); if (node && format[0].wrapper)
                    node = getParents(node, 'ul,ol').reverse()[0] || node; if (!node) {
                    node = container; while (node[sibling_name] && !isBlock(node[sibling_name])) {
                        node = node[sibling_name]; if (isEq(node, 'br'))
                            break;
                    } 
                }
                return node || container;
            }; startContainer = findParentContentEditable(startContainer); endContainer = findParentContentEditable(endContainer); if (isBookmarkNode(startContainer.parentNode) || isBookmarkNode(startContainer)) {
                startContainer = isBookmarkNode(startContainer) ? startContainer : startContainer.parentNode; startContainer = startContainer.nextSibling || startContainer; if (startContainer.nodeType == 3)
                    startOffset = 0;
            }
            if (isBookmarkNode(endContainer.parentNode) || isBookmarkNode(endContainer)) {
                endContainer = isBookmarkNode(endContainer) ? endContainer : endContainer.parentNode; endContainer = endContainer.previousSibling || endContainer; if (endContainer.nodeType == 3)
                    endOffset = endContainer.length;
            }
            if (format[0].inline) {
                if (rng.collapsed) {
                    endPoint = findWordEndPoint(startContainer, startOffset, true); if (endPoint) { startContainer = endPoint.container; startOffset = endPoint.offset; }
                    endPoint = findWordEndPoint(endContainer, endOffset); if (endPoint) { endContainer = endPoint.container; endOffset = endPoint.offset; } 
                }
                leaf = findLeaf(endContainer, endOffset); if (leaf.node) {
                    while (leaf.node && leaf.offset === 0 && leaf.node.previousSibling)
                        leaf = findLeaf(leaf.node.previousSibling); if (leaf.node && leaf.offset > 0 && leaf.node.nodeType === 3 && leaf.node.nodeValue.charAt(leaf.offset - 1) === ' ') { if (leaf.offset > 1) { endContainer = leaf.node; endContainer.splitText(leaf.offset - 1); } } 
                } 
            }
            if (format[0].inline || format[0].block_expand) {
                if (!format[0].inline || (startContainer.nodeType != 3 || startOffset === 0)) { startContainer = findParentContainer(true); }
                if (!format[0].inline || (endContainer.nodeType != 3 || endOffset === endContainer.nodeValue.length)) { endContainer = findParentContainer(); } 
            }
            if (format[0].selector && format[0].expand !== FALSE && !format[0].inline) { startContainer = findSelectorEndPoint(startContainer, 'previousSibling'); endContainer = findSelectorEndPoint(endContainer, 'nextSibling'); }
            if (format[0].block || format[0].selector) {
                startContainer = findBlockEndPoint(startContainer, 'previousSibling'); endContainer = findBlockEndPoint(endContainer, 'nextSibling'); if (format[0].block) {
                    if (!isBlock(startContainer))
                        startContainer = findParentContainer(true); if (!isBlock(endContainer))
                        endContainer = findParentContainer();
                } 
            }
            if (startContainer.nodeType == 1) { startOffset = nodeIndex(startContainer); startContainer = startContainer.parentNode; }
            if (endContainer.nodeType == 1) { endOffset = nodeIndex(endContainer) + 1; endContainer = endContainer.parentNode; }
            return { startContainer: startContainer, startOffset: startOffset, endContainer: endContainer, endOffset: endOffset };
        }
        function removeFormat(format, vars, node, compare_node) {
            var i, attrs, stylesModified; if (!matchName(node, format))
                return FALSE; if (format.remove != 'all') {
                each(format.styles, function (value, name) {
                    value = replaceVars(value, vars); if (typeof (name) === 'number') { name = value; compare_node = 0; }
                    if (!compare_node || isEq(getStyle(compare_node, name), value))
                        dom.setStyle(node, name, ''); stylesModified = 1;
                }); if (stylesModified && dom.getAttrib(node, 'style') == '') { node.removeAttribute('style'); node.removeAttribute('data-mce-style'); }
                each(format.attributes, function (value, name) {
                    var valueOut; value = replaceVars(value, vars); if (typeof (name) === 'number') { name = value; compare_node = 0; }
                    if (!compare_node || isEq(dom.getAttrib(compare_node, name), value)) {
                        if (name == 'class') {
                            value = dom.getAttrib(node, name); if (value) {
                                valueOut = ''; each(value.split(/\s+/), function (cls) {
                                    if (/mce\w+/.test(cls))
                                        valueOut += (valueOut ? ' ' : '') + cls;
                                }); if (valueOut) { dom.setAttrib(node, name, valueOut); return; } 
                            } 
                        }
                        if (name == "class")
                            node.removeAttribute('className'); if (MCE_ATTR_RE.test(name))
                            node.removeAttribute('data-mce-' + name); node.removeAttribute(name);
                    } 
                }); each(format.classes, function (value) {
                    value = replaceVars(value, vars); if (!compare_node || dom.hasClass(compare_node, value))
                        dom.removeClass(node, value);
                }); attrs = dom.getAttribs(node); for (i = 0; i < attrs.length; i++) {
                    if (attrs[i].nodeName.indexOf('_') !== 0)
                        return FALSE;
                } 
            }
            if (format.remove != 'none') { removeNode(node, format); return TRUE; } 
        }; function removeNode(node, format) {
            var parentNode = node.parentNode, rootBlockElm; function find(node, next, inc) { node = getNonWhiteSpaceSibling(node, next, inc); return !node || (node.nodeName == 'BR' || isBlock(node)); }; if (format.block) {
                if (!forcedRootBlock) {
                    if (isBlock(node) && !isBlock(parentNode)) {
                        if (!find(node, FALSE) && !find(node.firstChild, TRUE, 1))
                            node.insertBefore(dom.create('br'), node.firstChild); if (!find(node, TRUE) && !find(node.lastChild, FALSE, 1))
                            node.appendChild(dom.create('br'));
                    } 
                } else {
                    if (parentNode == dom.getRoot()) {
                        if (!format.list_block || !isEq(node, format.list_block)) {
                            each(tinymce.grep(node.childNodes), function (node) {
                                if (isValid(forcedRootBlock, node.nodeName.toLowerCase())) {
                                    if (!rootBlockElm)
                                        rootBlockElm = wrap(node, forcedRootBlock); else
                                        rootBlockElm.appendChild(node);
                                } else
                                    rootBlockElm = 0;
                            });
                        } 
                    } 
                } 
            }
            if (format.selector && format.inline && !isEq(format.inline, node))
                return; dom.remove(node, 1);
        }; function getNonWhiteSpaceSibling(node, next, inc) {
            if (node) {
                next = next ? 'nextSibling' : 'previousSibling'; for (node = inc ? node : node[next]; node; node = node[next]) {
                    if (node.nodeType == 1 || !isWhiteSpaceNode(node))
                        return node;
                } 
            } 
        }; function isBookmarkNode(node) { return node && node.nodeType == 1 && node.getAttribute('data-mce-type') == 'bookmark'; }; function mergeSiblings(prev, next) {
            var marker, sibling, tmpSibling; function compareElements(node1, node2) {
                if (node1.nodeName != node2.nodeName)
                    return FALSE; function getAttribs(node) {
                        var attribs = {}; each(dom.getAttribs(node), function (attr) {
                            var name = attr.nodeName.toLowerCase(); if (name.indexOf('_') !== 0 && name !== 'style')
                                attribs[name] = dom.getAttrib(node, name);
                        }); return attribs;
                    }; function compareObjects(obj1, obj2) {
                        var value, name; for (name in obj1) {
                            if (obj1.hasOwnProperty(name)) {
                                value = obj2[name]; if (value === undef)
                                    return FALSE; if (obj1[name] != value)
                                    return FALSE; delete obj2[name];
                            } 
                        }
                        for (name in obj2) {
                            if (obj2.hasOwnProperty(name))
                                return FALSE;
                        }
                        return TRUE;
                    }; if (!compareObjects(getAttribs(node1), getAttribs(node2)))
                    return FALSE; if (!compareObjects(dom.parseStyle(dom.getAttrib(node1, 'style')), dom.parseStyle(dom.getAttrib(node2, 'style'))))
                    return FALSE; return TRUE;
            }; function findElementSibling(node, sibling_name) {
                for (sibling = node; sibling; sibling = sibling[sibling_name]) {
                    if (sibling.nodeType == 3 && sibling.nodeValue.length !== 0)
                        return node; if (sibling.nodeType == 1 && !isBookmarkNode(sibling))
                        return sibling;
                }
                return node;
            }; if (prev && next) {
                prev = findElementSibling(prev, 'previousSibling'); next = findElementSibling(next, 'nextSibling'); if (compareElements(prev, next)) {
                    for (sibling = prev.nextSibling; sibling && sibling != next; ) { tmpSibling = sibling; sibling = sibling.nextSibling; prev.appendChild(tmpSibling); }
                    dom.remove(next); each(tinymce.grep(next.childNodes), function (node) { prev.appendChild(node); }); return prev;
                } 
            }
            return next;
        }; function getContainer(rng, start) {
            var container, offset, lastIdx, walker; container = rng[start ? 'startContainer' : 'endContainer']; offset = rng[start ? 'startOffset' : 'endOffset']; if (container.nodeType == 1) {
                lastIdx = container.childNodes.length - 1; if (!start && offset)
                    offset--; container = container.childNodes[offset > lastIdx ? lastIdx : offset];
            }
            if (container.nodeType === 3 && start && offset >= container.nodeValue.length) { container = new TreeWalker(container, ed.getBody()).next() || container; }
            if (container.nodeType === 3 && !start && offset === 0) { container = new TreeWalker(container, ed.getBody()).prev() || container; }
            return container;
        }; function performCaretAction(type, name, vars) {
            var caretContainerId = '_mce_caret', debug = ed.settings.caret_debug; function createCaretContainer(fill) {
                var caretContainer = dom.create('span', { id: caretContainerId, 'data-mce-bogus': true, style: debug ? 'color:red' : '' }); if (fill) { caretContainer.appendChild(ed.getDoc().createTextNode(INVISIBLE_CHAR)); }
                return caretContainer;
            }; function isCaretContainerEmpty(node, nodes) {
                while (node) {
                    if ((node.nodeType === 3 && node.nodeValue !== INVISIBLE_CHAR) || node.childNodes.length > 1) { return false; }
                    if (nodes && node.nodeType === 1) { nodes.push(node); }
                    node = node.firstChild;
                }
                return true;
            }; function getParentCaretContainer(node) {
                while (node) {
                    if (node.id === caretContainerId) { return node; }
                    node = node.parentNode;
                } 
            }; function findFirstTextNode(node) { var walker; if (node) { walker = new TreeWalker(node, node); for (node = walker.current(); node; node = walker.next()) { if (node.nodeType === 3) { return node; } } } }; function removeCaretContainer(node, move_caret) {
                var child, rng; if (!node) { node = getParentCaretContainer(selection.getStart()); if (!node) { while (node = dom.get(caretContainerId)) { removeCaretContainer(node, false); } } } else {
                    rng = selection.getRng(true); if (isCaretContainerEmpty(node)) {
                        if (move_caret !== false) { rng.setStartBefore(node); rng.setEndBefore(node); }
                        dom.remove(node);
                    } else {
                        child = findFirstTextNode(node); if (child.nodeValue.charAt(0) === INVISIBLE_CHAR) { child = child.deleteData(0, 1); }
                        dom.remove(node, 1);
                    }
                    selection.setRng(rng);
                } 
            }; function applyCaretFormat() {
                var rng, caretContainer, textNode, offset, bookmark, container, text; rng = selection.getRng(true); offset = rng.startOffset; container = rng.startContainer; text = container.nodeValue; caretContainer = getParentCaretContainer(selection.getStart()); if (caretContainer) { textNode = findFirstTextNode(caretContainer); }
                if (text && offset > 0 && offset < text.length && /\w/.test(text.charAt(offset)) && /\w/.test(text.charAt(offset - 1))) { bookmark = selection.getBookmark(); rng.collapse(true); rng = expandRng(rng, get(name)); rng = rangeUtils.split(rng); apply(name, vars, rng); selection.moveToBookmark(bookmark); } else {
                    if (!caretContainer || textNode.nodeValue !== INVISIBLE_CHAR) { caretContainer = createCaretContainer(true); textNode = caretContainer.firstChild; rng.insertNode(caretContainer); offset = 1; apply(name, vars, caretContainer); } else { apply(name, vars, caretContainer); }
                    selection.setCursorLocation(textNode, offset);
                } 
            }; function removeCaretFormat() {
                var rng = selection.getRng(true), container, offset, bookmark, hasContentAfter, node, formatNode, parents = [], i, caretContainer; container = rng.startContainer; offset = rng.startOffset; node = container; if (container.nodeType == 3) {
                    if (offset != container.nodeValue.length || container.nodeValue === INVISIBLE_CHAR) { hasContentAfter = true; }
                    node = node.parentNode;
                }
                while (node) {
                    if (matchNode(node, name, vars)) { formatNode = node; break; }
                    if (node.nextSibling) { hasContentAfter = true; }
                    parents.push(node); node = node.parentNode;
                }
                if (!formatNode) { return; }
                if (hasContentAfter) { bookmark = selection.getBookmark(); rng.collapse(true); rng = expandRng(rng, get(name), true); rng = rangeUtils.split(rng); remove(name, vars, rng); selection.moveToBookmark(bookmark); } else {
                    caretContainer = createCaretContainer(); node = caretContainer; for (i = parents.length - 1; i >= 0; i--) { node.appendChild(dom.clone(parents[i], false)); node = node.firstChild; }
                    node.appendChild(dom.doc.createTextNode(INVISIBLE_CHAR)); node = node.firstChild; var block = dom.getParent(formatNode, isTextBlock); if (block && dom.isEmpty(block)) { formatNode.parentNode.replaceChild(caretContainer, formatNode); } else { dom.insertAfter(caretContainer, formatNode); }
                    selection.setCursorLocation(node, 1); if (dom.isEmpty(formatNode)) { dom.remove(formatNode); } 
                } 
            }; function unmarkBogusCaretParents() { var i, caretContainer, node; caretContainer = getParentCaretContainer(selection.getStart()); if (caretContainer && !dom.isEmpty(caretContainer)) { tinymce.walk(caretContainer, function (node) { if (node.nodeType == 1 && node.id !== caretContainerId && !dom.isEmpty(node)) { dom.setAttrib(node, 'data-mce-bogus', null); } }, 'childNodes'); } }; if (!self._hasCaretEvents) {
                ed.onBeforeGetContent.addToTop(function () { var nodes = [], i; if (isCaretContainerEmpty(getParentCaretContainer(selection.getStart()), nodes)) { i = nodes.length; while (i--) { dom.setAttrib(nodes[i], 'data-mce-bogus', '1'); } } }); tinymce.each('onMouseUp onKeyUp'.split(' '), function (name) { ed[name].addToTop(function () { removeCaretContainer(); unmarkBogusCaretParents(); }); }); ed.onKeyDown.addToTop(function (ed, e) {
                    var keyCode = e.keyCode; if (keyCode == 8 || keyCode == 37 || keyCode == 39) { removeCaretContainer(getParentCaretContainer(selection.getStart())); }
                    unmarkBogusCaretParents();
                }); selection.onSetContent.add(unmarkBogusCaretParents); self._hasCaretEvents = true;
            }
            if (type == "apply") { applyCaretFormat(); } else { removeCaretFormat(); } 
        }; function moveStart(rng) {
            var container = rng.startContainer, offset = rng.startOffset, isAtEndOfText, walker, node, nodes, tmpNode; if (container.nodeType == 3 && offset >= container.nodeValue.length) { offset = nodeIndex(container); container = container.parentNode; isAtEndOfText = true; }
            if (container.nodeType == 1) {
                nodes = container.childNodes; container = nodes[Math.min(offset, nodes.length - 1)]; walker = new TreeWalker(container, dom.getParent(container, dom.isBlock)); if (offset > nodes.length - 1 || isAtEndOfText)
                    walker.next(); for (node = walker.current(); node; node = walker.next()) { if (node.nodeType == 3 && !isWhiteSpaceNode(node)) { tmpNode = dom.create('a', null, INVISIBLE_CHAR); node.parentNode.insertBefore(tmpNode, node); rng.setStart(node, 0); selection.setRng(rng); dom.remove(tmpNode); return; } } 
            } 
        };
    };
})(tinymce); tinymce.onAddEditor.add(function (tinymce, ed) {
    var filters, fontSizes, dom, settings = ed.settings; function replaceWithSpan(node, styles) {
        tinymce.each(styles, function (value, name) {
            if (value)
                dom.setStyle(node, name, value);
        }); dom.rename(node, 'span');
    }; function convert(editor, params) { dom = editor.dom; if (settings.convert_fonts_to_spans) { tinymce.each(dom.select('font,u,strike', params.node), function (node) { filters[node.nodeName.toLowerCase()](ed.dom, node); }); } }; if (settings.inline_styles) { fontSizes = tinymce.explode(settings.font_size_legacy_values); filters = { font: function (dom, node) { replaceWithSpan(node, { backgroundColor: node.style.backgroundColor, color: node.color, fontFamily: node.face, fontSize: fontSizes[parseInt(node.size, 10) - 1] }); }, u: function (dom, node) { replaceWithSpan(node, { textDecoration: 'underline' }); }, strike: function (dom, node) { replaceWithSpan(node, { textDecoration: 'line-through' }); } }; ed.onPreProcess.add(convert); ed.onSetContent.add(convert); ed.onInit.add(function () { ed.selection.onSetContent.add(convert); }); } 
}); (function (tinymce) {
    var TreeWalker = tinymce.dom.TreeWalker; tinymce.EnterKey = function (editor) {
        var dom = editor.dom, selection = editor.selection, settings = editor.settings, undoManager = editor.undoManager, nonEmptyElementsMap = editor.schema.getNonEmptyElements(); function handleEnterKey(evt) {
            var rng = selection.getRng(true), tmpRng, editableRoot, container, offset, parentBlock, documentMode, shiftKey, newBlock, fragment, containerBlock, parentBlockName, containerBlockName, newBlockName, isAfterLastNodeInContainer; function canSplitBlock(node) { return node && dom.isBlock(node) && !/^(TD|TH|CAPTION|FORM)$/.test(node.nodeName) && !/^(fixed|absolute)/i.test(node.style.position) && dom.getContentEditable(node) !== "true"; }; function renderBlockOnIE(block) { var oldRng; if (tinymce.isIE && !tinymce.isIE11 && dom.isBlock(block)) { oldRng = selection.getRng(); block.appendChild(dom.create('span', null, '\u00a0')); selection.select(block); block.lastChild.outerHTML = ''; selection.setRng(oldRng); } }; function trimInlineElementsOnLeftSideOfBlock(block) {
                var node = block, firstChilds = [], i; while (node = node.firstChild) {
                    if (dom.isBlock(node)) { return; }
                    if (node.nodeType == 1 && !nonEmptyElementsMap[node.nodeName.toLowerCase()]) { firstChilds.push(node); } 
                }
                i = firstChilds.length; while (i--) { node = firstChilds[i]; if (!node.hasChildNodes() || (node.firstChild == node.lastChild && node.firstChild.nodeValue === '')) { dom.remove(node); } else { if (node.nodeName == "A" && (node.innerText || node.textContent) === ' ') { dom.remove(node); } } } 
            }; function moveToCaretPosition(root) {
                var walker, node, rng, y, viewPort, lastNode = root, tempElm; rng = dom.createRng(); if (root.hasChildNodes()) {
                    walker = new TreeWalker(root, root); while (node = walker.current()) {
                        if (node.nodeType == 3) { rng.setStart(node, 0); rng.setEnd(node, 0); break; }
                        if (nonEmptyElementsMap[node.nodeName.toLowerCase()]) { rng.setStartBefore(node); rng.setEndBefore(node); break; }
                        lastNode = node; node = walker.next();
                    }
                    if (!node) { rng.setStart(lastNode, 0); rng.setEnd(lastNode, 0); } 
                } else {
                    if (root.nodeName == 'BR') {
                        if (root.nextSibling && dom.isBlock(root.nextSibling)) {
                            if (!documentMode || documentMode < 9) { tempElm = dom.create('br'); root.parentNode.insertBefore(tempElm, root); }
                            rng.setStartBefore(root); rng.setEndBefore(root);
                        } else { rng.setStartAfter(root); rng.setEndAfter(root); } 
                    } else { rng.setStart(root, 0); rng.setEnd(root, 0); } 
                }
                selection.setRng(rng); dom.remove(tempElm); viewPort = dom.getViewPort(editor.getWin()); y = dom.getPos(root).y; if (y < viewPort.y || y + 25 > viewPort.y + viewPort.h) { editor.getWin().scrollTo(0, y < viewPort.y ? y : y - viewPort.h + 25); } 
            }; function createNewBlock(name) {
                var node = container, block, clonedNode, caretNode; block = name || parentBlockName == "TABLE" ? dom.create(name || newBlockName) : parentBlock.cloneNode(false); caretNode = block; if (settings.keep_styles !== false) {
                    do {
                        if (/^(SPAN|STRONG|B|EM|I|FONT|STRIKE|U)$/.test(node.nodeName)) {
                            if (node.id == '_mce_caret') { continue; }
                            clonedNode = node.cloneNode(false); dom.setAttrib(clonedNode, 'id', ''); if (block.hasChildNodes()) { clonedNode.appendChild(block.firstChild); block.appendChild(clonedNode); } else { caretNode = clonedNode; block.appendChild(clonedNode); } 
                        } 
                    } while (node = node.parentNode);
                }
                if (!tinymce.isIE || tinymce.isIE11) { caretNode.innerHTML = '<br data-mce-bogus="1">'; }
                return block;
            }; function isCaretAtStartOrEndOfBlock(start) {
                var walker, node, name; if (container.nodeType == 3 && (start ? offset > 0 : offset < container.nodeValue.length)) { return false; }
                if (container.parentNode == parentBlock && isAfterLastNodeInContainer && !start) { return true; }
                if (start && container.nodeType == 1 && container == parentBlock.firstChild) { return true; }
                if (container.nodeName === "TABLE" || (container.previousSibling && container.previousSibling.nodeName == "TABLE")) { return (isAfterLastNodeInContainer && !start) || (!isAfterLastNodeInContainer && start); }
                walker = new TreeWalker(container, parentBlock); if (container.nodeType == 3) { if (start && offset == 0) { walker.prev(); } else if (!start && offset == container.nodeValue.length) { walker.next(); } }
                while (node = walker.current()) {
                    if (node.nodeType === 1) { if (!node.getAttribute('data-mce-bogus')) { name = node.nodeName.toLowerCase(); if (nonEmptyElementsMap[name] && name !== 'br') { return false; } } } else if (node.nodeType === 3 && !/^[ \t\r\n]*$/.test(node.nodeValue)) { return false; }
                    if (start) { walker.prev(); } else { walker.next(); } 
                }
                return true;
            }; function wrapSelfAndSiblingsInDefaultBlock(container, offset) {
                var newBlock, parentBlock, startNode, node, next, blockName = newBlockName || 'P'; parentBlock = dom.getParent(container, dom.isBlock); if (!parentBlock || !canSplitBlock(parentBlock)) {
                    parentBlock = parentBlock || editableRoot; if (!parentBlock.hasChildNodes()) { newBlock = dom.create(blockName); parentBlock.appendChild(newBlock); rng.setStart(newBlock, 0); rng.setEnd(newBlock, 0); return newBlock; }
                    node = container; while (node.parentNode != parentBlock) { node = node.parentNode; }
                    while (node && !dom.isBlock(node)) { startNode = node; node = node.previousSibling; }
                    if (startNode) {
                        newBlock = dom.create(blockName); startNode.parentNode.insertBefore(newBlock, startNode); node = startNode; while (node && !dom.isBlock(node)) { next = node.nextSibling; newBlock.appendChild(node); node = next; }
                        rng.setStart(container, offset); rng.setEnd(container, offset);
                    } 
                }
                return container;
            }; function handleEmptyListItem() {
                function isFirstOrLastLi(first) {
                    var node = containerBlock[first ? 'firstChild' : 'lastChild']; while (node) {
                        if (node.nodeType == 1) { break; }
                        node = node[first ? 'nextSibling' : 'previousSibling'];
                    }
                    return node === parentBlock;
                }; newBlock = newBlockName ? createNewBlock(newBlockName) : dom.create('BR'); if (isFirstOrLastLi(true) && isFirstOrLastLi()) { dom.replace(newBlock, containerBlock); } else if (isFirstOrLastLi(true)) { containerBlock.parentNode.insertBefore(newBlock, containerBlock); } else if (isFirstOrLastLi()) { dom.insertAfter(newBlock, containerBlock); renderBlockOnIE(newBlock); } else { tmpRng = rng.cloneRange(); tmpRng.setStartAfter(parentBlock); tmpRng.setEndAfter(containerBlock); fragment = tmpRng.extractContents(); dom.insertAfter(fragment, containerBlock); dom.insertAfter(newBlock, containerBlock); }
                dom.remove(parentBlock); moveToCaretPosition(newBlock); undoManager.add();
            }; function hasRightSideContent() { var walker = new TreeWalker(container, parentBlock), node; while (node = walker.next()) { if (nonEmptyElementsMap[node.nodeName.toLowerCase()] || node.length > 0) { return true; } } }
            function insertBr() {
                var brElm, extraBr, marker; if (container && container.nodeType == 3 && offset >= container.nodeValue.length) { if ((!tinymce.isIE || tinymce.isIE11) && !hasRightSideContent()) { brElm = dom.create('br'); rng.insertNode(brElm); rng.setStartAfter(brElm); rng.setEndAfter(brElm); extraBr = true; } }
                brElm = dom.create('br'); rng.insertNode(brElm); if ((tinymce.isIE && !tinymce.isIE11) && parentBlockName == 'PRE' && (!documentMode || documentMode < 8)) { brElm.parentNode.insertBefore(dom.doc.createTextNode('\r'), brElm); }
                marker = dom.create('span', {}, '&nbsp;'); brElm.parentNode.insertBefore(marker, brElm); selection.scrollIntoView(marker); dom.remove(marker); if (!extraBr) { rng.setStartAfter(brElm); rng.setEndAfter(brElm); } else { rng.setStartBefore(brElm); rng.setEndBefore(brElm); }
                selection.setRng(rng); undoManager.add();
            }; function trimLeadingLineBreaks(node) {
                do {
                    if (node.nodeType === 3) { node.nodeValue = node.nodeValue.replace(/^[\r\n]+/, ''); }
                    node = node.firstChild;
                } while (node);
            }; function getEditableRoot(node) {
                var root = dom.getRoot(), parent, editableRoot; parent = node; while (parent !== root && dom.getContentEditable(parent) !== "false") {
                    if (dom.getContentEditable(parent) === "true") { editableRoot = parent; }
                    parent = parent.parentNode;
                }
                return parent !== root ? editableRoot : root;
            }; function addBrToBlockIfNeeded(block) { var lastChild; if (!tinymce.isIE || tinymce.isIE11) { block.normalize(); lastChild = block.lastChild; if (!lastChild || (/^(left|right)$/gi.test(dom.getStyle(lastChild, 'float', true)))) { dom.add(block, 'br'); } } }; if (!rng.collapsed) { editor.execCommand('Delete'); return; }
            if (evt.isDefaultPrevented()) { return; }
            container = rng.startContainer; offset = rng.startOffset; newBlockName = (settings.force_p_newlines ? 'p' : '') || settings.forced_root_block; newBlockName = newBlockName ? newBlockName.toUpperCase() : ''; documentMode = dom.doc.documentMode; shiftKey = evt.shiftKey; if (container.nodeType == 1 && container.hasChildNodes()) { isAfterLastNodeInContainer = offset > container.childNodes.length - 1; container = container.childNodes[Math.min(offset, container.childNodes.length - 1)] || container; if (isAfterLastNodeInContainer && container.nodeType == 3) { offset = container.nodeValue.length; } else { offset = 0; } }
            editableRoot = getEditableRoot(container); if (!editableRoot) { return; }
            undoManager.beforeChange(); if (!dom.isBlock(editableRoot) && editableRoot != dom.getRoot()) {
                if (!newBlockName || shiftKey) { insertBr(); }
                return;
            }
            if ((newBlockName && !shiftKey) || (!newBlockName && shiftKey)) { container = wrapSelfAndSiblingsInDefaultBlock(container, offset); }
            parentBlock = dom.getParent(container, dom.isBlock); containerBlock = parentBlock ? dom.getParent(parentBlock.parentNode, dom.isBlock) : null; parentBlockName = parentBlock ? parentBlock.nodeName.toUpperCase() : ''; containerBlockName = containerBlock ? containerBlock.nodeName.toUpperCase() : ''; if (containerBlockName == 'LI' && !evt.ctrlKey) { parentBlock = containerBlock; parentBlockName = containerBlockName; }
            if (parentBlockName == 'LI') {
                if (!newBlockName && shiftKey) { insertBr(); return; }
                if (dom.isEmpty(parentBlock)) {
                    if (/^(UL|OL|LI)$/.test(containerBlock.parentNode.nodeName)) { return false; }
                    handleEmptyListItem(); return;
                } 
            }
            if (parentBlockName == 'PRE' && settings.br_in_pre !== false) { if (!shiftKey) { insertBr(); return; } } else { if ((!newBlockName && !shiftKey && parentBlockName != 'LI') || (newBlockName && shiftKey)) { insertBr(); return; } }
            newBlockName = newBlockName || 'P'; if (isCaretAtStartOrEndOfBlock()) {
                if (/^(H[1-6]|PRE)$/.test(parentBlockName) && containerBlockName != 'HGROUP') { newBlock = createNewBlock(newBlockName); } else { newBlock = createNewBlock(); }
                if (settings.end_container_on_empty_block && canSplitBlock(containerBlock) && dom.isEmpty(parentBlock)) { newBlock = dom.split(containerBlock, parentBlock); } else { dom.insertAfter(newBlock, parentBlock); }
                moveToCaretPosition(newBlock);
            } else if (isCaretAtStartOrEndOfBlock(true)) { newBlock = parentBlock.parentNode.insertBefore(createNewBlock(), parentBlock); renderBlockOnIE(newBlock); } else { tmpRng = rng.cloneRange(); tmpRng.setEndAfter(parentBlock); fragment = tmpRng.extractContents(); trimLeadingLineBreaks(fragment); newBlock = fragment.firstChild; dom.insertAfter(fragment, parentBlock); trimInlineElementsOnLeftSideOfBlock(newBlock); addBrToBlockIfNeeded(parentBlock); moveToCaretPosition(newBlock); }
            dom.setAttrib(newBlock, 'id', ''); undoManager.add();
        }
        editor.onKeyDown.add(function (ed, evt) { if (evt.keyCode == 13) { if (handleEnterKey(evt) !== false) { evt.preventDefault(); } } });
    };
})(tinymce);