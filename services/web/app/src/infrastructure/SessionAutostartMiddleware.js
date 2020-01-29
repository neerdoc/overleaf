const Settings = require('settings-sharelatex')
const Errors = require('../Features/Errors/Errors')

// SessionAutostartMiddleware provides a mechanism to force certain routes not
// to get an automatic session where they don't have one already. This allows us
// to work around issues where we might overwrite a user's login cookie with one
// that is hidden by a `SameSite` setting.
//
// When registering a route with disableSessionAutostartForRoute, a callback
// should be provided that handles the case that a session is not available.
// This will be called as a standard middleware with (req, res, next) - calling
// next will continue and sett up a session as normal, otherwise the app can
// perform a different operation as usual

class SessionAutostartMiddleware {
  constructor() {
    this.middleware = this.middleware.bind(this)
    this._cookieName = Settings.cookieName
    this._noAutostartCallbacks = new Map()
  }

  static applyInitialMiddleware(router) {
    const middleware = new SessionAutostartMiddleware()
    router.sessionAutostartMiddleware = middleware
    router.use(middleware.middleware)
  }

  disableSessionAutostartForRoute(route, method, callback) {
    if (typeof callback !== 'function') {
      throw new Error('callback not provided when disabling session autostart')
    }

    if (!this._noAutostartCallbacks[route]) {
      this._noAutostartCallbacks[route] = new Map()
    }

    this._noAutostartCallbacks[route][method] = callback
  }

  applyDefaultPostGatewayForRoute(route) {
    this.disableSessionAutostartForRoute(
      route,
      'POST',
      SessionAutostartMiddleware.genericPostGatewayMiddleware
    )
  }

  autostartCallbackForRequest(req) {
    return (
      this._noAutostartCallbacks[req.path] &&
      this._noAutostartCallbacks[req.path][req.method]
    )
  }

  middleware(req, res, next) {
    if (!req.signedCookies[this._cookieName]) {
      const callback = this.autostartCallbackForRequest(req)
      if (callback) {
        req.session = {
          noSessionCallback: callback
        }
      }
    }

    next()
  }

  static invokeCallbackMiddleware(req, res, next) {
    if (req.session.noSessionCallback) {
      return req.session.noSessionCallback(req, res, next)
    }
    next()
  }

  static genericPostGatewayMiddleware(req, res, next) {
    if (req.method !== 'POST') {
      return next(
        new Errors.OError({
          message: 'post gateway invoked for non-POST request',
          info: {
            path: req.path,
            method: req.method
          }
        })
      )
    }

    if (req.body.viaGateway) {
      return next()
    }

    res.render('general/post-gateway', { form_data: req.body })
  }
}

module.exports = SessionAutostartMiddleware
