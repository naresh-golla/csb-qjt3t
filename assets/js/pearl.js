
var Pearl = (function (exports) {
    'use strict';

    var _auth0SpaJs = require("@auth0/auth0-spa-js");


    var JwtToken = /** @class */ (function () {
        function JwtToken(encoded) {
            this._encoded = encoded;
            var payload = encoded.split('.')[1];
            var decoded = atob(payload);
            var json = JSON.parse(decoded);
            Object.assign(this, json);
        }
        Object.defineProperty(JwtToken.prototype, "encoded", {
            get: function () { return this._encoded; },
            enumerable: false,
            configurable: true
        });
        JwtToken.prototype.isExpiring = function (validityMinutes) {
            var now = new Date();
            var expiration = new Date(this.exp * 1000);
            var nearExpiration = new Date(expiration);
            var durationMinutes = (this.exp - this.iat) / 60;
            var offsetMinutes = durationMinutes - validityMinutes;
            nearExpiration.setMinutes(expiration.getMinutes() - offsetMinutes);
            return nearExpiration < now;
        };
        return JwtToken;
    }());

    var StorageKeys = /** @class */ (function () {
        function StorageKeys() {
        }
        StorageKeys.AccessToken = 'ccy.b2c.access_token';
        StorageKeys.State = 'ccy.b2c.state';
        StorageKeys.Nonce = 'ccy.b2c.nonce';
        StorageKeys.Logout = 'ccy.b2c.isLogout';
        return StorageKeys;
    }());
    var Constants = /** @class */ (function () {
        function Constants() {
        }
        Constants.PopupId = 'ccy.authenticationPopup';
        Constants.RenewalFrameId = 'ccy.renewalFrame';
        Constants.AADRenewalFrameId = 'adalIdTokenFrame';
        Constants.LogoutInProgress = 'logoutInProgress';
        Constants.PasswordResetStorageKey = 'ccy.b2c.isPasswordReset';
        Constants.PasswordResetInProgress = 'passwordResetInProgress';
        return Constants;
    }());

    var B2CSettings = /** @class */ (function () {
        function B2CSettings(config) {
            this.workflowType = config.workflow || 'Redirect';
            this.client = config.client;
            this.audience = config.audience;
            this.durationMinutes = config.durationMinutes || 45;
            if (config.provider === 'b2clogin.com') {
                this.baseUri = "https://" + config.tenant + ".b2clogin.com/" + config.tenant + ".onmicrosoft.com"; // `
            }
            else {
                this.baseUri = "https://login.microsoftonline.com/te/" + config.tenant + ".onmicrosoft.com"; // `
            }
            var qualifiedScopes = config.scopes.map(function (scope) { return "https://" + config.tenant + ".onmicrosoft.com/" + config.audience + "/" + scope; });
            this.scopeUri = encodeURIComponent(qualifiedScopes.join(' ') + " openid profile"); // `
            this.policyUris = {
                Signin: config.policies.signin || config.policies.signinSignup || '',
                Signup: config.policies.signup || config.policies.signinSignup || '',
                SigninSignup: config.policies.signinSignup || config.policies.signinSignup || '',
                ChangePassword: config.policies.changePassword || '',
                EditProfile: config.policies.editProfile || ''
            };
            this.redirectUri = encodeURIComponent(config.redirectUri || window.location.origin);
            this.forgotPasswordUrl = this.getChangePasswordUrl();
            this.logoutUrl = this.getLogoutUrl();
        }
        // TODO: any
        B2CSettings.prototype.getPolicyUrl = function (policy, state, nonce, queryParameters) {
            if (queryParameters === void 0) { queryParameters = {}; }
            var uri = this.baseUri + "/" + this.policyUris[policy] + "/oauth2/v2.0/authorize"; // `
            uri += "?client_id=" + this.client; // `
            uri += "&scope=" + this.scopeUri; // `
            uri += '&response_type=token'; // `
            uri += '&response_mode=fragment'; // `
            uri += "&state=" + state; // `
            uri += "&nonce=" + nonce; // `
            uri += "&redirect_uri=" + this.redirectUri;
            // tslint:disable-next-line: forin
            for (var index in queryParameters) {
                uri += "&" + index + "=" + queryParameters[index];
            }
            return uri;
        };
        B2CSettings.prototype.getLogoutUrl = function () {
            var uri = this.baseUri + "/oauth2/v2.0/logout"; // `
            uri += "?p=" + this.policyUris.Signin; // `
            uri += "&post_logout_redirect_uri=" + this.redirectUri; // `
            return uri;
        };
        B2CSettings.prototype.getChangePasswordUrl = function () {
            var uri = this.baseUri + "/oauth2/v2.0/authorize"; // `
            uri += "?p=" + this.policyUris.ChangePassword; // `
            uri += "&client_id=" + this.client; // `
            uri += '&scope=openid'; // `
            uri += '&response_type=id_token'; // `
            uri += "&redirect_uri=" + this.redirectUri;
            return uri;
        };
        return B2CSettings;
    }());


    const auth0 = new _auth0SpaJs.Auth0Client({
        domain: 'authapi-dev.us.auth0.com',
        client_id: 'z9uTNZVFiFZjYLgU7Wjy2AOTmelmMVJy',
        redirect_uri: window.location.origin
    });

    try {
        await getTokenSilently();
    } catch (error) {
        if (error.error !== 'login_required') {
            throw error;
        }
    }

    document.getElementById('login').addEventListener('click', async () => {
        await auth0.loginWithRedirect();
    });
    window.addEventListener('load', async () => {
        const redirectResult = await auth0.handleRedirectCallback(); //logged in. you can get the user profile like this:

        const user = await auth0.getUser();
        console.log(user);
    });
    document.getElementById('logout').addEventListener('click', () => {
        auth0.logout();
    });
    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isFunction(x) {
        return typeof x === 'function';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var _enable_super_gross_mode_that_will_cause_bad_things = false;
    var config = {
        Promise: undefined,
        set useDeprecatedSynchronousErrorHandling(value) {
            if (value) {
                var error = /*@__PURE__*/ new Error();
                /*@__PURE__*/ console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
            }
            _enable_super_gross_mode_that_will_cause_bad_things = value;
        },
        get useDeprecatedSynchronousErrorHandling() {
            return _enable_super_gross_mode_that_will_cause_bad_things;
        },
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function hostReportError(err) {
        setTimeout(function () { throw err; }, 0);
    }

    /** PURE_IMPORTS_START _config,_util_hostReportError PURE_IMPORTS_END */
    var empty = {
        closed: true,
        next: function (value) { },
        error: function (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                throw err;
            }
            else {
                hostReportError(err);
            }
        },
        complete: function () { }
    };

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var isArray = /*@__PURE__*/ (function () { return Array.isArray || (function (x) { return x && typeof x.length === 'number'; }); })();

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function isObject(x) {
        return x !== null && typeof x === 'object';
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var UnsubscriptionErrorImpl = /*@__PURE__*/ (function () {
        function UnsubscriptionErrorImpl(errors) {
            Error.call(this);
            this.message = errors ?
                errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
            this.name = 'UnsubscriptionError';
            this.errors = errors;
            return this;
        }
        UnsubscriptionErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
        return UnsubscriptionErrorImpl;
    })();
    var UnsubscriptionError = UnsubscriptionErrorImpl;

    /** PURE_IMPORTS_START _util_isArray,_util_isObject,_util_isFunction,_util_UnsubscriptionError PURE_IMPORTS_END */
    var Subscription = /*@__PURE__*/ (function () {
        function Subscription(unsubscribe) {
            this.closed = false;
            this._parentOrParents = null;
            this._subscriptions = null;
            if (unsubscribe) {
                this._unsubscribe = unsubscribe;
            }
        }
        Subscription.prototype.unsubscribe = function () {
            var errors;
            if (this.closed) {
                return;
            }
            var _a = this, _parentOrParents = _a._parentOrParents, _unsubscribe = _a._unsubscribe, _subscriptions = _a._subscriptions;
            this.closed = true;
            this._parentOrParents = null;
            this._subscriptions = null;
            if (_parentOrParents instanceof Subscription) {
                _parentOrParents.remove(this);
            }
            else if (_parentOrParents !== null) {
                for (var index = 0; index < _parentOrParents.length; ++index) {
                    var parent_1 = _parentOrParents[index];
                    parent_1.remove(this);
                }
            }
            if (isFunction(_unsubscribe)) {
                try {
                    _unsubscribe.call(this);
                }
                catch (e) {
                    errors = e instanceof UnsubscriptionError ? flattenUnsubscriptionErrors(e.errors) : [e];
                }
            }
            if (isArray(_subscriptions)) {
                var index = -1;
                var len = _subscriptions.length;
                while (++index < len) {
                    var sub = _subscriptions[index];
                    if (isObject(sub)) {
                        try {
                            sub.unsubscribe();
                        }
                        catch (e) {
                            errors = errors || [];
                            if (e instanceof UnsubscriptionError) {
                                errors = errors.concat(flattenUnsubscriptionErrors(e.errors));
                            }
                            else {
                                errors.push(e);
                            }
                        }
                    }
                }
            }
            if (errors) {
                throw new UnsubscriptionError(errors);
            }
        };
        Subscription.prototype.add = function (teardown) {
            var subscription = teardown;
            if (!teardown) {
                return Subscription.EMPTY;
            }
            switch (typeof teardown) {
                case 'function':
                    subscription = new Subscription(teardown);
                case 'object':
                    if (subscription === this || subscription.closed || typeof subscription.unsubscribe !== 'function') {
                        return subscription;
                    }
                    else if (this.closed) {
                        subscription.unsubscribe();
                        return subscription;
                    }
                    else if (!(subscription instanceof Subscription)) {
                        var tmp = subscription;
                        subscription = new Subscription();
                        subscription._subscriptions = [tmp];
                    }
                    break;
                default: {
                    throw new Error('unrecognized teardown ' + teardown + ' added to Subscription.');
                }
            }
            var _parentOrParents = subscription._parentOrParents;
            if (_parentOrParents === null) {
                subscription._parentOrParents = this;
            }
            else if (_parentOrParents instanceof Subscription) {
                if (_parentOrParents === this) {
                    return subscription;
                }
                subscription._parentOrParents = [_parentOrParents, this];
            }
            else if (_parentOrParents.indexOf(this) === -1) {
                _parentOrParents.push(this);
            }
            else {
                return subscription;
            }
            var subscriptions = this._subscriptions;
            if (subscriptions === null) {
                this._subscriptions = [subscription];
            }
            else {
                subscriptions.push(subscription);
            }
            return subscription;
        };
        Subscription.prototype.remove = function (subscription) {
            var subscriptions = this._subscriptions;
            if (subscriptions) {
                var subscriptionIndex = subscriptions.indexOf(subscription);
                if (subscriptionIndex !== -1) {
                    subscriptions.splice(subscriptionIndex, 1);
                }
            }
        };
        Subscription.EMPTY = (function (empty) {
            empty.closed = true;
            return empty;
        }(new Subscription()));
        return Subscription;
    }());
    function flattenUnsubscriptionErrors(errors) {
        return errors.reduce(function (errs, err) { return errs.concat((err instanceof UnsubscriptionError) ? err.errors : err); }, []);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var rxSubscriber = /*@__PURE__*/ (function () {
        return typeof Symbol === 'function'
            ? /*@__PURE__*/ Symbol('rxSubscriber')
            : '@@rxSubscriber_' + /*@__PURE__*/ Math.random();
    })();

    /** PURE_IMPORTS_START tslib,_util_isFunction,_Observer,_Subscription,_internal_symbol_rxSubscriber,_config,_util_hostReportError PURE_IMPORTS_END */
    var Subscriber = /*@__PURE__*/ (function (_super) {
        __extends(Subscriber, _super);
        function Subscriber(destinationOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this.syncErrorValue = null;
            _this.syncErrorThrown = false;
            _this.syncErrorThrowable = false;
            _this.isStopped = false;
            switch (arguments.length) {
                case 0:
                    _this.destination = empty;
                    break;
                case 1:
                    if (!destinationOrNext) {
                        _this.destination = empty;
                        break;
                    }
                    if (typeof destinationOrNext === 'object') {
                        if (destinationOrNext instanceof Subscriber) {
                            _this.syncErrorThrowable = destinationOrNext.syncErrorThrowable;
                            _this.destination = destinationOrNext;
                            destinationOrNext.add(_this);
                        }
                        else {
                            _this.syncErrorThrowable = true;
                            _this.destination = new SafeSubscriber(_this, destinationOrNext);
                        }
                        break;
                    }
                default:
                    _this.syncErrorThrowable = true;
                    _this.destination = new SafeSubscriber(_this, destinationOrNext, error, complete);
                    break;
            }
            return _this;
        }
        Subscriber.prototype[rxSubscriber] = function () { return this; };
        Subscriber.create = function (next, error, complete) {
            var subscriber = new Subscriber(next, error, complete);
            subscriber.syncErrorThrowable = false;
            return subscriber;
        };
        Subscriber.prototype.next = function (value) {
            if (!this.isStopped) {
                this._next(value);
            }
        };
        Subscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                this.isStopped = true;
                this._error(err);
            }
        };
        Subscriber.prototype.complete = function () {
            if (!this.isStopped) {
                this.isStopped = true;
                this._complete();
            }
        };
        Subscriber.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
        };
        Subscriber.prototype._next = function (value) {
            this.destination.next(value);
        };
        Subscriber.prototype._error = function (err) {
            this.destination.error(err);
            this.unsubscribe();
        };
        Subscriber.prototype._complete = function () {
            this.destination.complete();
            this.unsubscribe();
        };
        Subscriber.prototype._unsubscribeAndRecycle = function () {
            var _parentOrParents = this._parentOrParents;
            this._parentOrParents = null;
            this.unsubscribe();
            this.closed = false;
            this.isStopped = false;
            this._parentOrParents = _parentOrParents;
            return this;
        };
        return Subscriber;
    }(Subscription));
    var SafeSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SafeSubscriber, _super);
        function SafeSubscriber(_parentSubscriber, observerOrNext, error, complete) {
            var _this = _super.call(this) || this;
            _this._parentSubscriber = _parentSubscriber;
            var next;
            var context = _this;
            if (isFunction(observerOrNext)) {
                next = observerOrNext;
            }
            else if (observerOrNext) {
                next = observerOrNext.next;
                error = observerOrNext.error;
                complete = observerOrNext.complete;
                if (observerOrNext !== empty) {
                    context = Object.create(observerOrNext);
                    if (isFunction(context.unsubscribe)) {
                        _this.add(context.unsubscribe.bind(context));
                    }
                    context.unsubscribe = _this.unsubscribe.bind(_this);
                }
            }
            _this._context = context;
            _this._next = next;
            _this._error = error;
            _this._complete = complete;
            return _this;
        }
        SafeSubscriber.prototype.next = function (value) {
            if (!this.isStopped && this._next) {
                var _parentSubscriber = this._parentSubscriber;
                if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                    this.__tryOrUnsub(this._next, value);
                }
                else if (this.__tryOrSetError(_parentSubscriber, this._next, value)) {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.error = function (err) {
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                var useDeprecatedSynchronousErrorHandling = config.useDeprecatedSynchronousErrorHandling;
                if (this._error) {
                    if (!useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(this._error, err);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, this._error, err);
                        this.unsubscribe();
                    }
                }
                else if (!_parentSubscriber.syncErrorThrowable) {
                    this.unsubscribe();
                    if (useDeprecatedSynchronousErrorHandling) {
                        throw err;
                    }
                    hostReportError(err);
                }
                else {
                    if (useDeprecatedSynchronousErrorHandling) {
                        _parentSubscriber.syncErrorValue = err;
                        _parentSubscriber.syncErrorThrown = true;
                    }
                    else {
                        hostReportError(err);
                    }
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.complete = function () {
            var _this = this;
            if (!this.isStopped) {
                var _parentSubscriber = this._parentSubscriber;
                if (this._complete) {
                    var wrappedComplete = function () { return _this._complete.call(_this._context); };
                    if (!config.useDeprecatedSynchronousErrorHandling || !_parentSubscriber.syncErrorThrowable) {
                        this.__tryOrUnsub(wrappedComplete);
                        this.unsubscribe();
                    }
                    else {
                        this.__tryOrSetError(_parentSubscriber, wrappedComplete);
                        this.unsubscribe();
                    }
                }
                else {
                    this.unsubscribe();
                }
            }
        };
        SafeSubscriber.prototype.__tryOrUnsub = function (fn, value) {
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                this.unsubscribe();
                if (config.useDeprecatedSynchronousErrorHandling) {
                    throw err;
                }
                else {
                    hostReportError(err);
                }
            }
        };
        SafeSubscriber.prototype.__tryOrSetError = function (parent, fn, value) {
            if (!config.useDeprecatedSynchronousErrorHandling) {
                throw new Error('bad call');
            }
            try {
                fn.call(this._context, value);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    parent.syncErrorValue = err;
                    parent.syncErrorThrown = true;
                    return true;
                }
                else {
                    hostReportError(err);
                    return true;
                }
            }
            return false;
        };
        SafeSubscriber.prototype._unsubscribe = function () {
            var _parentSubscriber = this._parentSubscriber;
            this._context = null;
            this._parentSubscriber = null;
            _parentSubscriber.unsubscribe();
        };
        return SafeSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START _Subscriber PURE_IMPORTS_END */
    function canReportError(observer) {
        while (observer) {
            var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
            if (closed_1 || isStopped) {
                return false;
            }
            else if (destination && destination instanceof Subscriber) {
                observer = destination;
            }
            else {
                observer = null;
            }
        }
        return true;
    }

    /** PURE_IMPORTS_START _Subscriber,_symbol_rxSubscriber,_Observer PURE_IMPORTS_END */
    function toSubscriber(nextOrObserver, error, complete) {
        if (nextOrObserver) {
            if (nextOrObserver instanceof Subscriber) {
                return nextOrObserver;
            }
            if (nextOrObserver[rxSubscriber]) {
                return nextOrObserver[rxSubscriber]();
            }
        }
        if (!nextOrObserver && !error && !complete) {
            return new Subscriber(empty);
        }
        return new Subscriber(nextOrObserver, error, complete);
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var observable = /*@__PURE__*/ (function () { return typeof Symbol === 'function' && Symbol.observable || '@@observable'; })();

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    function identity(x) {
        return x;
    }

    /** PURE_IMPORTS_START _identity PURE_IMPORTS_END */
    function pipeFromArray(fns) {
        if (fns.length === 0) {
            return identity;
        }
        if (fns.length === 1) {
            return fns[0];
        }
        return function piped(input) {
            return fns.reduce(function (prev, fn) { return fn(prev); }, input);
        };
    }

    /** PURE_IMPORTS_START _util_canReportError,_util_toSubscriber,_symbol_observable,_util_pipe,_config PURE_IMPORTS_END */
    var Observable = /*@__PURE__*/ (function () {
        function Observable(subscribe) {
            this._isScalar = false;
            if (subscribe) {
                this._subscribe = subscribe;
            }
        }
        Observable.prototype.lift = function (operator) {
            var observable = new Observable();
            observable.source = this;
            observable.operator = operator;
            return observable;
        };
        Observable.prototype.subscribe = function (observerOrNext, error, complete) {
            var operator = this.operator;
            var sink = toSubscriber(observerOrNext, error, complete);
            if (operator) {
                sink.add(operator.call(sink, this.source));
            }
            else {
                sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                    this._subscribe(sink) :
                    this._trySubscribe(sink));
            }
            if (config.useDeprecatedSynchronousErrorHandling) {
                if (sink.syncErrorThrowable) {
                    sink.syncErrorThrowable = false;
                    if (sink.syncErrorThrown) {
                        throw sink.syncErrorValue;
                    }
                }
            }
            return sink;
        };
        Observable.prototype._trySubscribe = function (sink) {
            try {
                return this._subscribe(sink);
            }
            catch (err) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    sink.syncErrorThrown = true;
                    sink.syncErrorValue = err;
                }
                if (canReportError(sink)) {
                    sink.error(err);
                }
                else {
                    console.warn(err);
                }
            }
        };
        Observable.prototype.forEach = function (next, promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var subscription;
                subscription = _this.subscribe(function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        if (subscription) {
                            subscription.unsubscribe();
                        }
                    }
                }, reject, resolve);
            });
        };
        Observable.prototype._subscribe = function (subscriber) {
            var source = this.source;
            return source && source.subscribe(subscriber);
        };
        Observable.prototype[observable] = function () {
            return this;
        };
        Observable.prototype.pipe = function () {
            var operations = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                operations[_i] = arguments[_i];
            }
            if (operations.length === 0) {
                return this;
            }
            return pipeFromArray(operations)(this);
        };
        Observable.prototype.toPromise = function (promiseCtor) {
            var _this = this;
            promiseCtor = getPromiseCtor(promiseCtor);
            return new promiseCtor(function (resolve, reject) {
                var value;
                _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
            });
        };
        Observable.create = function (subscribe) {
            return new Observable(subscribe);
        };
        return Observable;
    }());
    function getPromiseCtor(promiseCtor) {
        if (!promiseCtor) {
            promiseCtor = Promise;
        }
        if (!promiseCtor) {
            throw new Error('no Promise impl found');
        }
        return promiseCtor;
    }

    /** PURE_IMPORTS_START  PURE_IMPORTS_END */
    var ObjectUnsubscribedErrorImpl = /*@__PURE__*/ (function () {
        function ObjectUnsubscribedErrorImpl() {
            Error.call(this);
            this.message = 'object unsubscribed';
            this.name = 'ObjectUnsubscribedError';
            return this;
        }
        ObjectUnsubscribedErrorImpl.prototype = /*@__PURE__*/ Object.create(Error.prototype);
        return ObjectUnsubscribedErrorImpl;
    })();
    var ObjectUnsubscribedError = ObjectUnsubscribedErrorImpl;

    /** PURE_IMPORTS_START tslib,_Subscription PURE_IMPORTS_END */
    var SubjectSubscription = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscription, _super);
        function SubjectSubscription(subject, subscriber) {
            var _this = _super.call(this) || this;
            _this.subject = subject;
            _this.subscriber = subscriber;
            _this.closed = false;
            return _this;
        }
        SubjectSubscription.prototype.unsubscribe = function () {
            if (this.closed) {
                return;
            }
            this.closed = true;
            var subject = this.subject;
            var observers = subject.observers;
            this.subject = null;
            if (!observers || observers.length === 0 || subject.isStopped || subject.closed) {
                return;
            }
            var subscriberIndex = observers.indexOf(this.subscriber);
            if (subscriberIndex !== -1) {
                observers.splice(subscriberIndex, 1);
            }
        };
        return SubjectSubscription;
    }(Subscription));

    /** PURE_IMPORTS_START tslib,_Observable,_Subscriber,_Subscription,_util_ObjectUnsubscribedError,_SubjectSubscription,_internal_symbol_rxSubscriber PURE_IMPORTS_END */
    var SubjectSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(SubjectSubscriber, _super);
        function SubjectSubscriber(destination) {
            var _this = _super.call(this, destination) || this;
            _this.destination = destination;
            return _this;
        }
        return SubjectSubscriber;
    }(Subscriber));
    var Subject = /*@__PURE__*/ (function (_super) {
        __extends(Subject, _super);
        function Subject() {
            var _this = _super.call(this) || this;
            _this.observers = [];
            _this.closed = false;
            _this.isStopped = false;
            _this.hasError = false;
            _this.thrownError = null;
            return _this;
        }
        Subject.prototype[rxSubscriber] = function () {
            return new SubjectSubscriber(this);
        };
        Subject.prototype.lift = function (operator) {
            var subject = new AnonymousSubject(this, this);
            subject.operator = operator;
            return subject;
        };
        Subject.prototype.next = function (value) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            if (!this.isStopped) {
                var observers = this.observers;
                var len = observers.length;
                var copy = observers.slice();
                for (var i = 0; i < len; i++) {
                    copy[i].next(value);
                }
            }
        };
        Subject.prototype.error = function (err) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.hasError = true;
            this.thrownError = err;
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].error(err);
            }
            this.observers.length = 0;
        };
        Subject.prototype.complete = function () {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            this.isStopped = true;
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].complete();
            }
            this.observers.length = 0;
        };
        Subject.prototype.unsubscribe = function () {
            this.isStopped = true;
            this.closed = true;
            this.observers = null;
        };
        Subject.prototype._trySubscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else {
                return _super.prototype._trySubscribe.call(this, subscriber);
            }
        };
        Subject.prototype._subscribe = function (subscriber) {
            if (this.closed) {
                throw new ObjectUnsubscribedError();
            }
            else if (this.hasError) {
                subscriber.error(this.thrownError);
                return Subscription.EMPTY;
            }
            else if (this.isStopped) {
                subscriber.complete();
                return Subscription.EMPTY;
            }
            else {
                this.observers.push(subscriber);
                return new SubjectSubscription(this, subscriber);
            }
        };
        Subject.prototype.asObservable = function () {
            var observable = new Observable();
            observable.source = this;
            return observable;
        };
        Subject.create = function (destination, source) {
            return new AnonymousSubject(destination, source);
        };
        return Subject;
    }(Observable));
    var AnonymousSubject = /*@__PURE__*/ (function (_super) {
        __extends(AnonymousSubject, _super);
        function AnonymousSubject(destination, source) {
            var _this = _super.call(this) || this;
            _this.destination = destination;
            _this.source = source;
            return _this;
        }
        AnonymousSubject.prototype.next = function (value) {
            var destination = this.destination;
            if (destination && destination.next) {
                destination.next(value);
            }
        };
        AnonymousSubject.prototype.error = function (err) {
            var destination = this.destination;
            if (destination && destination.error) {
                this.destination.error(err);
            }
        };
        AnonymousSubject.prototype.complete = function () {
            var destination = this.destination;
            if (destination && destination.complete) {
                this.destination.complete();
            }
        };
        AnonymousSubject.prototype._subscribe = function (subscriber) {
            var source = this.source;
            if (source) {
                return this.source.subscribe(subscriber);
            }
            else {
                return Subscription.EMPTY;
            }
        };
        return AnonymousSubject;
    }(Subject));

    /** PURE_IMPORTS_START tslib,_Subscriber PURE_IMPORTS_END */
    function map(project, thisArg) {
        return function mapOperation(source) {
            if (typeof project !== 'function') {
                throw new TypeError('argument is not a function. Are you looking for `mapTo()`?');
            }
            return source.lift(new MapOperator(project, thisArg));
        };
    }
    var MapOperator = /*@__PURE__*/ (function () {
        function MapOperator(project, thisArg) {
            this.project = project;
            this.thisArg = thisArg;
        }
        MapOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new MapSubscriber(subscriber, this.project, this.thisArg));
        };
        return MapOperator;
    }());
    var MapSubscriber = /*@__PURE__*/ (function (_super) {
        __extends(MapSubscriber, _super);
        function MapSubscriber(destination, project, thisArg) {
            var _this = _super.call(this, destination) || this;
            _this.project = project;
            _this.count = 0;
            _this.thisArg = thisArg || _this;
            return _this;
        }
        MapSubscriber.prototype._next = function (value) {
            var result;
            try {
                result = this.project.call(this.thisArg, value, this.count++);
            }
            catch (err) {
                this.destination.error(err);
                return;
            }
            this.destination.next(result);
        };
        return MapSubscriber;
    }(Subscriber));

    /** PURE_IMPORTS_START tslib,_Subscriber,_Subscription PURE_IMPORTS_END */
    function finalize(callback) {
        return function (source) { return source.lift(new FinallyOperator(callback)); };
    }
    var FinallyOperator = /*@__PURE__*/ (function () {
        function FinallyOperator(callback) {
            this.callback = callback;
        }
        FinallyOperator.prototype.call = function (subscriber, source) {
            return source.subscribe(new FinallySubscriber(subscriber, this.callback));
        };
        return FinallyOperator;
    }());
    var FinallySubscriber = /*@__PURE__*/ (function (_super) {
        __extends(FinallySubscriber, _super);
        function FinallySubscriber(destination, callback) {
            var _this = _super.call(this, destination) || this;
            _this.add(new Subscription(callback));
            return _this;
        }
        return FinallySubscriber;
    }(Subscriber));

    var myContentUrl = "https://client-qa.duffandphelps.com/my-content";
    // Actually perform the validations described here:
    // https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-oidc
    var ConcurrencyAuthenticator = /** @class */ (function () {
        function ConcurrencyAuthenticator() {
        }
        Object.defineProperty(ConcurrencyAuthenticator, "storage", {
            get: function () {
                // return this.isEdgeOrIE() ? localStorage : sessionStorage;
                return localStorage;
            },
            enumerable: false,
            configurable: true
        });
        ConcurrencyAuthenticator.isEdgeOrIE = function () {
            var thisWindow = window;
            var thisDocument = document;
            var isIE11 = !!thisWindow.MSInputMethodContext && !!thisDocument.documentMode;
            var isEdge = navigator.userAgent.indexOf('Edge') > -1;
            var isIE = navigator.userAgent.indexOf('MSIE') > -1;
            return isIE11 || isEdge || isIE;
        };
        // Handles exactly one of the currently supported workflows:
        //  * Read the Token after returning from the OAuth Provider
        //  * Read the Token from within a Popup Window and communicate it to the Main Window
        //  * Read the Token from within an iFrame and communicate it to the Main Window
        //  * Redirect back to the OAuth provider for the Forgot Password workflow
        //  * Redirect back to the OAuth provider in the event of certain error states
        ConcurrencyAuthenticator.initializeWindow = function (b2c) {
            var isIrregularWindow = this.handleIrregularWorkflows(b2c);
            this.tryReadToken(b2c.audience);
            var isShortLivedWindow = this.getRenewalFrame() || this.isPopupWindow() || isIrregularWindow;
            return isShortLivedWindow ? 'ShortLivedWindow' : 'MainWindow';
        };
        ConcurrencyAuthenticator.handleIrregularWorkflows = function (settings) {
            var isForgotPassword = window.location.href.indexOf('AADB2C90118') > -1;
            var isConfused = window.location.href.indexOf('AADB2C90077') > -1;
            var isCancellation = window.location.href.indexOf('AADB2C90091') > -1;
            var isPasswordResetInProgress = localStorage.getItem(Constants.PasswordResetStorageKey) === Constants.PasswordResetInProgress;
            if (settings.workflowType === 'Popup') {
                if (isForgotPassword) {
                    window.location.href = settings.forgotPasswordUrl;
                    return true;
                }
                if (isCancellation || isConfused) {
                    // TODO: Ideally we could inform the main window that we want to login and then do that
                    window.close();
                }
            }
            else {
                if (isCancellation) {
                    localStorage.removeItem(Constants.PasswordResetStorageKey);
                    isPasswordResetInProgress = false;
                    this.cleanupUri();
                }
                if (isForgotPassword) {
                    localStorage.setItem(Constants.PasswordResetStorageKey, Constants.PasswordResetInProgress);
                    window.location.href = settings.forgotPasswordUrl;
                    return true;
                }
                if (isConfused || isPasswordResetInProgress) {
                    localStorage.removeItem(Constants.PasswordResetStorageKey);
                    if (this.isEdgeOrIE()) {
                        return false;
                    }
                    this.login(settings);
                    return true;
                }
            }
            return false;
        };
        ConcurrencyAuthenticator.invalidateSession = function () {
            var tokens = Object.keys(this.storage).filter(function (x) { return x.startsWith(StorageKeys.AccessToken); });
            for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                var token = tokens_1[_i];
                this.storage.removeItem(token);
            }
        };
        ConcurrencyAuthenticator.tryReadToken = function (audience) {
            var _a;
            var urlParameters = this.getParametersFromHash();
            var trust = urlParameters.access_token == null
                ? null
                : urlParameters.state === this.getState() ? 'Trusted' : 'Untrusted';
            if (trust === 'Trusted') {
                if (this.isPopupWindow()) {
                    window.opener.ccyAuthReceiveToken.call(window.opener, urlParameters.access_token);
                    window.close();
                }
                else {
                    var renewalFrame = this.getRenewalFrame();
                    if (renewalFrame != null) {
                        var audience_1 = renewalFrame.id.replace(Constants.RenewalFrameId + ".", '');
                        this.storage.setItem(StorageKeys.AccessToken + "." + audience_1, urlParameters.access_token);
                        (_a = renewalFrame.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(window.frameElement);
                    }
                    else {
                        this.invalidateSession();
                        this.storage.setItem(StorageKeys.AccessToken + "." + audience, urlParameters.access_token);
                    }
                }
                this.cleanupUri();
            }
            if (trust === null) {
                if (this.isPopupWindow()) {
                    var isLogoutInProgress = window.opener.ccyAuthIsLogoutInProgress.call(window.opener);
                    if (isLogoutInProgress) {
                        window.opener.ccyAuthConfirmLogout.call(window.opener);
                        window.close();
                    }
                }
            }
            this.cleanupLoginProcess();
            if (localStorage.bookmarkToAdd && checkTokenValid()) {
                var bookmarkItemData = JSON.parse(localStorage.bookmarkToAdd);
                bookmarkClient.write([bookmarkItemData]).then(function () {
                    localStorage.removeItem('bookmarkToAdd');
                    if (localStorage.getItem('loginInProgressKey')) {
                        localStorage.removeItem('loginInProgressKey');
                        $.ajax({
                            url: "/api/duff/contact/current",
                            success: function (data) {
                                window.location.href = myContentUrl + "?sitecore-user=" + data.id;
                            },
                            failure: function (data) {
                                window.location.href = myContentUrl;
                            }
                        });
                        // window.location.href = 'https://client-qa.duffandphelps.com/ ';
                    }
                });
            }
            else {
                if (this.hasToken('portal-api') && localStorage.getItem('loginInProgressKey')) {
                    localStorage.removeItem('loginInProgressKey');
                    $.ajax({
                        url: "/api/duff/contact/current",
                        success: function (data) {
                            window.location.href = myContentUrl + "?sitecore-user=" + data.id;
                        },
                        failure: function (data) {
                            window.location.href = myContentUrl;
                        }
                    });
                    // window.location.href = 'https://client-qa.duffandphelps.com/ ';
                }
            }
        };
        ConcurrencyAuthenticator.getState = function () {
            var state = this.storage.getItem(StorageKeys.State);
            if (state) {
                return state;
            }
            if (window.opener != null && window.opener.ccyGetState != null) {
                return window.opener.ccyGetState.call(window.opener);
            }
            return undefined;
        };
        // TODO: any
        ConcurrencyAuthenticator.signup = function (settings, email) {
            var queryParameters = email == null ? {} : { email: email };
            var url = this.initializePolicy('Signup', settings, queryParameters);
            if (settings.workflowType === 'Popup') {
                return this.openPopupLogin(url, settings.audience);
            }
            window.location.href = url;
            return new Observable();
        };
        ConcurrencyAuthenticator.login = function (settings) {
            var url = this.initializePolicy('Signin', settings);
            if (settings.workflowType === 'Popup') {
                return this.openPopupLogin(url, settings.audience);
            }
            window.location.href = url;
            return new Observable();
        };
        ConcurrencyAuthenticator.logout = function (settings) {
            this.invalidateSession();
            var url = settings.logoutUrl;
            if (settings.workflowType === 'Popup') {
                return this.openPopupLogout(url);
            }
            window.location.href = url;
            return new Observable();
        };
        ConcurrencyAuthenticator.editProfile = function (settings) {
            var url = this.initializePolicy('EditProfile', settings);
            if (settings.workflowType === 'Popup') {
                alert('not implemented');
                // return this.openPopupLogin(url);
            }
            window.location.href = url;
            return new Observable();
        };
        ConcurrencyAuthenticator.changePassword = function (settings) {
            var url = this.initializePolicy('ChangePassword', settings);
            if (settings.workflowType === 'Popup') {
                alert('not implemented');
                // return this.openPopupLogin(url);
            }
            window.location.href = url;
            return new Observable();
        };
        ConcurrencyAuthenticator.hasToken = function (audience) {
            return this.getJwtToken(audience) != null;
        };
        ConcurrencyAuthenticator.getToken = function (settings) {
            var _this = this;
            var result = new Subject();
            var isRefreshing = false;
            var isValidInterval = setInterval(function () {
                var token = _this.getJwtToken(settings.audience);
                if (token != null && token.isExpiring(settings.durationMinutes) === false) {
                    result.next(token.encoded);
                    result.complete();
                    clearInterval(isValidInterval);
                }
                else if (isRefreshing === false) {
                    var url = _this.initializePolicy('Signin', settings);
                    _this.refreshToken(url, settings.audience);
                    isRefreshing = true;
                }
            }, 1);
            return result.asObservable();
        };
        // TODO: don't use any
        ConcurrencyAuthenticator.initializePolicy = function (policy, settings, queryParameters) {
            if (queryParameters === void 0) { queryParameters = {}; }
            var state = this.uuidv4();
            var nonce = this.uuidv4();
            this.storage.setItem(StorageKeys.State, state);
            this.storage.setItem(StorageKeys.Nonce, nonce);
            return settings.getPolicyUrl(policy, state, nonce, queryParameters);
        };
        ConcurrencyAuthenticator.openPopup = function (url) {
            var result = new Subject();
            var thisWindow = window;
            if (thisWindow.opened) {
                thisWindow.opened.close();
            }
            var width = 620;
            var height = 800;
            var left = window.screenLeft + 100;
            var top = window.screenTop + 100;
            var features = "width=" + width + ", height=" + height + ", top=" + top + ", left=" + left; // `
            var initialUrl = this.isEdgeOrIE() ? url : 'about:blank';
            var popup = window.open(initialUrl, Constants.PopupId, features);
            if (popup != null) {
                popup.moveTo(left, top);
                popup.resizeTo(width, height);
                thisWindow.opened = popup;
                var popupPoller_1 = window.setInterval(function () {
                    if (popup.closed !== false) {
                        window.clearInterval(popupPoller_1);
                        result.next();
                        result.complete();
                    }
                }, 200);
            }
            if (this.isEdgeOrIE() === false) {
                window.open(url, Constants.PopupId, features);
            }
            setTimeout(function () {
                if (popup == null) {
                    result.error('Popup failed to open');
                }
            });
            return result.asObservable().pipe(map(function () { }));
        };
        ConcurrencyAuthenticator.openPopupLogin = function (url, audience) {
            var _this = this;
            var result = new Subject();
            window.ccyGetState = function () {
                return _this.storage.getItem(StorageKeys.State);
            };
            window.ccyAuthReceiveToken = function (token) {
                _this.storage.setItem(StorageKeys.AccessToken + "." + audience, token);
                _this.cleanupLoginProcess();
                result.next();
                result.complete();
                if (_this.isEdgeOrIE()) {
                    window.location.reload();
                }
            };
            var thing = this.openPopup(url);
            thing.pipe(finalize(function () {
                console.log('woah!');
                _this.cleanupLoginProcess();
                result.next();
                result.complete();
            })).subscribe();
            return result.asObservable().pipe(map(function () { }));
        };
        ConcurrencyAuthenticator.openPopupLogout = function (url) {
            var _this = this;
            var result = new Subject();
            window.ccyAuthIsLogoutInProgress = function () {
                return _this.storage.getItem(StorageKeys.Logout) === Constants.LogoutInProgress;
            };
            window.ccyAuthConfirmLogout = function () {
                result.next();
                result.complete();
                if (_this.isEdgeOrIE()) {
                    window.location.reload();
                }
            };
            this.storage.setItem(StorageKeys.Logout, Constants.LogoutInProgress);
            this.openPopup(url).pipe(finalize(function () {
                result.next();
                result.complete();
            }));
            return result.asObservable().pipe(map(function () { }));
        };
        ConcurrencyAuthenticator.cleanupLoginProcess = function () {
            this.storage.removeItem(StorageKeys.Nonce);
            this.storage.removeItem(StorageKeys.State);
        };
        ConcurrencyAuthenticator.cleanupUri = function () {
            // eslint-disable-next-line no-restricted-globals
            if (history.pushState != null) {
                // eslint-disable-next-line no-restricted-globals
                history.pushState('', document.title, window.location.pathname);
            }
        };
        ConcurrencyAuthenticator.refreshToken = function (url, audience) {
            var element = document.createElement('iframe');
            element.setAttribute('id', Constants.RenewalFrameId + "." + audience);
            element.style.display = 'none';
            var iframe = document.getElementsByTagName('body')[0].appendChild(element);
            iframe.src = url;
        };
        // https://stackoverflow.com/a/2117523
        ConcurrencyAuthenticator.uuidv4 = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                // tslint:disable-next-line:no-bitwise
                var r = Math.random() * 16 | 0;
                // tslint:disable-next-line:no-bitwise
                // eslint-disable-next-line no-mixed-operators
                var v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        ConcurrencyAuthenticator.getParametersFromHash = function () {
            var queryString = window.location.hash.replace('#', '');
            return this.getJson(queryString);
        };
        ConcurrencyAuthenticator.getJson = function (queryString) {
            var result = {};
            queryString.split('&').forEach(function (part) {
                var item = part.split('=');
                var key = item[0];
                result[key] = decodeURIComponent(item[1]);
            });
            return result;
        };
        ConcurrencyAuthenticator.getJwtToken = function (audience) {
            var raw = this.storage.getItem(StorageKeys.AccessToken + "." + audience);
            return raw ? new JwtToken(raw) : undefined;
        };
        ConcurrencyAuthenticator.getRenewalFrame = function () {
            try {
                if (window.frameElement.id.startsWith(Constants.RenewalFrameId) || window.frameElement.id === Constants.AADRenewalFrameId) {
                    return window.frameElement;
                }
                else {
                    return null;
                }
            }
            catch (e) {
                return null;
            }
        };
        ConcurrencyAuthenticator.isPopupWindow = function () {
            // try {
            //     if (this.isEdgeOrIE()) {
            //         // return window.opener != null || window.name === Constants.PopupId;
            //         return false;
            //     } else {
            //         return window.name === Constants.PopupId;
            //     }
            // } catch (e) {
            //     return false;
            // }
            return false;
        };
        return ConcurrencyAuthenticator;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics$1 = function (d, b) {
        extendStatics$1 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
        extendStatics$1(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var ApiClient = /** @class */ (function () {
        function ApiClient(accessSettings) {
            this.accessSettings = accessSettings;
        }
        ApiClient.prototype.fetch = function (path) {
            var action = function (headers) {
                return fetch("" + path, { headers: headers });
            };
            return this.doHttpAction(action);
        };
        ApiClient.prototype.delete = function (path, payload) {
            var action = function (headers) { return fetch("" + path, { headers: headers, method: 'DELETE', body: JSON.stringify(payload) }); };
            return this.doHttpAction(action);
        };
        ApiClient.prototype.put = function (path, payload) {
            var action = function (headers) { return fetch("" + path, { headers: headers, method: 'PUT', body: JSON.stringify(payload) }); };
            return this.doHttpAction(action);
        };
        ApiClient.prototype.post = function (path, payload) {
            var action = function (headers) { return fetch("" + path, { headers: headers, method: 'POST', body: JSON.stringify(payload) }); };
            return this.doHttpAction(action);
        };
        ApiClient.prototype.doHttpAction = function (httpAction) {
            return __awaiter(this, void 0, Promise, function () {
                var headers, response, content, errorMessage, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getHeaders()];
                        case 1:
                            headers = _a.sent();
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 8, , 9]);
                            return [4 /*yield*/, httpAction(headers)];
                        case 3:
                            response = _a.sent();
                            if (!response.ok) return [3 /*break*/, 5];
                            return [4 /*yield*/, response.text()];
                        case 4:
                            content = _a.sent();
                            if (content === "") {
                                return [2 /*return*/, {}];
                            }
                            else {
                                return [2 /*return*/, JSON.parse(content)];
                            }
                        case 5: return [4 /*yield*/, response.text()];
                        case 6:
                            errorMessage = _a.sent();
                            throw this.createError(response.status, errorMessage);
                        case 7: return [3 /*break*/, 9];
                        case 8:
                            error_1 = _a.sent();
                            console.error("Failed to call API: " + error_1);
                            throw error_1;
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        ApiClient.prototype.getHeaders = function () {
            return __awaiter(this, void 0, Promise, function () {
                var headers, token;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            headers = {};
                            headers.Accept = 'application/json';
                            headers['Content-Type'] = 'application/json';
                            headers['pragma'] = 'no-cache';
                            headers['cache-control'] = 'no-cache';
                            return [4 /*yield*/, ConcurrencyAuthenticator.getToken(this.accessSettings).toPromise()];
                        case 1:
                            token = _a.sent();
                            headers.Authorization = "Bearer " + token;
                            return [2 /*return*/, headers];
                    }
                });
            });
        };
        ApiClient.prototype.createError = function (status, error) {
            if (status === 400) {
                console.log('Server indicated the request was badly formed.');
            }
            if (status === 401) {
                console.log('User was not Authorized to make that request.');
            }
            return new Error(error);
        };
        return ApiClient;
    }());

    var BookmarkClient = /** @class */ (function (_super) {
        __extends$1(BookmarkClient, _super);
        function BookmarkClient(apiUrl, settings) {
            var _this = _super.call(this, settings) || this;
            _this.apiUrl = apiUrl;
            return _this;
        }
        BookmarkClient.prototype.get = function () {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.fetch(this.apiUrl + "/bookmark")];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        BookmarkClient.prototype.write = function (bookmark) {
            return __awaiter(this, void 0, Promise, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.post(this.apiUrl + "/bookmark/sitecorebookmark", bookmark)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        BookmarkClient.prototype.remove = function (identifiers) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.delete(this.apiUrl + "/bookmark", identifiers)];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        return BookmarkClient;
    }(ApiClient));

    exports.B2CSettings = B2CSettings;
    exports.BookmarkClient = BookmarkClient;
    exports.ConcurrencyAuthenticator = ConcurrencyAuthenticator;
    exports.Constants = Constants;
    exports.JwtToken = JwtToken;

    return exports;

}({}));
