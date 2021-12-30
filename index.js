/*!
 * Tidbyt - Unofficial API client for Tidbyt devices.
 *
 * Copyright (c) 2021, Nicholas Penree <nick@penree.com>
 * @license MIT
 * @author Nicholas Penree <nick@penree.com>
 * @version 0.2.0
 */

const requestFromApi = require('./request')

/**
 * @scope Tidbyt
 */
class TidbytDevice {
    /**
     * Construct a TidbytDevice with provided options.
     * 
     * A valid `client` is required to use any methods.
     * 
     * Available options:
     * 
     *      - `id`: the device id
     * 
     *      - `lastSeen`: the last time the device was seen
     * 
     *      - `brightness`: the brightness of the device from 0-100
     * 
     *      - `displayName`: the display name of the device
     * 
     *      - `autoDim`: whether the device is auto dimming at night
     * 
     * @constructor
     * @param {Object} options
     * @param  {TidByt} client
     */
    constructor(options = {}, client) {
        this.id = options.id
        this.displayName = options.displayName
        this.brightness = options.brightness
        this.autoDim = options.autoDim
        this.lastSeen = new Date(Number(options.lastSeen) * 1000)

        if (client) {
            this.tidbyt = client
        }

        this.basePath = `/devices/${this.id}`
    }

    /**
     * Update a device with the provided values.
     * 
     * Throws if not client is intialized.
     * 
     * Available fields:
     * 
     *      - `autoDim`: whether the device is auto dimming at night
     * 
     *      - `brightness`: the brightness of the device from 0-100
     * 
     *      - `displayName`: the display name of the device
     * @memberof TidbytDevice
     * @param  {Object} updates
     * @return {Promise<TidbytDevice>}
     */
    async update(updates = {}) {
        if (!this.tidbyt) throw new Error('TidbytClient is not initialized')
        return this.tidbyt.devices.update(this.id, updates)
    }

    /**
     * Push a new installation to the device.
     * 
     * Throws if not client is intialized.
     * 
     * 
     * Available options:
     * 
     * `installationID`: Installation ID to create/update
     * 
     * `background`: Whether the installation should not interrupt the rotation
     * 
     * @memberof TidbytDevice
     * @param  {Buffer} image - Buffer containing the images to push
     * @param  {Object} options 
     * @return {Promise<Object>}
     */
    async push(image, options) {
        if (!this.tidbyt) throw new Error('TidbytClient is not initialized')
        return this.tidbyt.devices.push(this.id, image, options)
    }

    /**
     * @type {object}
     */
    installations = {
        /**
         * Return a list of installations on the device from the Tidbyt API.
         * 
         * @async
         * @memberof TidbytDevice#installations
         * @instance
         * @return {Promise<TidbytDeviceInstallation[]>}
         */
        list: async () => {
            if (!this.tidbyt) throw new Error('TidbytClient is not initialized')
            const res = await this.tidbyt.request({
                path: `${this.basePath}/installations`,
            })
            return res.installations || []
        },

        /**
         * Update an existing installation with a new image.
         * 
         * Throws if not client is intialized.
         * 
         * @async
         * @memberof TidbytDevice#installations
         * @instance
         * @param  {String} installationID - Optional installation ID to create/update
         * @param  {Buffer} image - Buffer containing the images to push
         * @return {Promise<Object>}
         */
        update: async (installationID, image) => {
            if (!installationID) throw new Error('Installation ID is required')
            return this.push(image, { installationID })
        },

        /**
         * Delete an existing installation from the device.
         * 
         * Throws if not client is intialized.
         * 
         * @async
         * @instance
         * @memberof TidbytDevice#installations
         * @param  {String} installationID - Optional installation ID to create/update
         * @return {Promise<Object>}
         */
        delete: async(installationID) => {
            if (!installationID) throw new Error('Installation ID is required')
            if (!this.tidbyt) throw new Error('TidbytClient is not initialized')
            return this.tidbyt.request({
                path: `${this.basePath}/installations/${installationID}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
        },

        /**
         * Fetch a preview from the Tidbyt API and return it as a `Buffer`.
         * 
         * Throws if not client is intialized.
         * 
         * @memberof TidbytDevice.installations
         * @param  {String} installationID - Optional installation ID to create/update
         * @return {Promise<Buffer>}
         */
        preview: async(installationID) => {
            if (!installationID) throw new Error('Installation ID is required')
            if (!this.tidbyt) throw new Error('TidbytClient is not initialized')
            return this.tidbyt.request({
                path: `${this.basePath}/installations/${installationID}/preview`,
                raw: true,
            })
        },
    }
}

class Tidbyt {
    /**
     * Construct a Tidbyt with provided options.
     * 
     * Available options:
     * 
     *      - `apiToken`: the API token
     * 
     *      - `apiVersion`: the API version. Defaults to `v0`
     * 
     * @constructor
     * @param  {String} apiToken
     * @param  {String} version='v0'
     */
    constructor(apiToken, version = 'v0') {
        this.apiToken = apiToken
        this.apiVersion = version
    }

    /**
     * Send a request to the Tidbyt API.
     * 
     * @instance
     * @param  {String} path
     * @param  {String} method='GET'
     * @param  {Object} body=null
     * @param  {Object} headers={}
     * @param  {Boolean} raw
     * @param  {String} encoding
     * @return {Promise<Object|Buffer>}
     */
    async request({ path, method = 'GET', body = null, headers = {}, raw, encoding }) {
        return requestFromApi({
            apiToken: this.apiToken,
            path: `/${this.apiVersion}${path}`,
            method,
            body,
            headers,
            raw,
            encoding,
        })
    }

    /**
     * @type {object}
     */
    apps = {
        /**
         * Return a list of available apps from the Tidbyt API.
         * 
         * Available options:
         * 
         *      - `asMap`: Defaults to false. If true, returns a map of app ids to app objects instead of an array of app objects.
         * @async
         * @memberof Tidbyt#apps
         * @instance
         * @param  {Object} options
         * @return {Promise<Object[]|Map>}
         */
        list: async ({ asMap = false } = {}) => {
            const res = await this.request({ path: `/apps` })
            let apps = res.apps || []
            if (asMap) {
                apps = apps.reduce((list, app) => {
                    list.set(app.id, app)
                    return list
                }, new Map())
            }
            return apps
        }
    }

    /**
     * @type {object}
     */
    devices = {
        /**
         * Get a device by id from the Tidbyt API.
         * 
         * @async
         * @memberof Tidbyt#devices
         * @instance
         * @param  {String} deviceId - The device id
         * @return {Promise<TidbytDevice>}
         */
        get: async (deviceId) => {
            const json = await this.request({ path: `/devices/${deviceId}` })
            return new TidbytDevice(json, this)
        },

        /**
         * Update a device with the provided values by ID.
         * 
         * Available updates:
         * 
         *      - `autoDim`: whether the device is auto dimming at night
         * 
         *      - `brightness`: the brightness of the device from 0-100
         * 
         *      - `displayName`: the display name of the device
         * 
         * @async
         * @memberof Tidbyt#devices
         * @instance
         * @param  {String} deviceId - The device id
         * @param  {Object} updates
         * @return {Promise<TidbytDevice>}
         */
        update: async (deviceId, { displayName, brightness, autoDim } = {}) => {
            const body = {}
            if (typeof displayName !== 'undefined') body.displayName = displayName
            if (typeof brightness !== 'undefined') body.brightness = brightness
            if (typeof autoDim !== 'undefined') body.autoDim = autoDim
            const json = await this.request({
                path: `/devices/${deviceId}`,
                method: 'PATCH',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            return new TidbytDevice(json, this)
        },

        /**
         * Push a new installation to a device by ID.
         * 
         * Throws if not client is intialized.
         * 
         * Available options:
         * 
         * `installationID`: Installation ID to create/update
         * 
         * `background`: Whether the installation should not interrupt the rotation
         *  
         * @async
         * @memberof Tidbyt#devices
         * @instance
         * @param  {String} deviceId - The device id
         * @param  {Buffer} image - Buffer containing the images to push
         * @param  {Object} [options] - Push options
         * @return {Promise<Object>}
         */
        push: async(deviceId, image, { installationID, background  = {}}) => {
            if (!image) throw new Error('Image is required')
            const encodedImage = image.toString('base64')
            const body = {
                image: encodedImage,
            }
            if (installationID) {
                body.installationID = installationID
            }
            if (typeof background !== 'undefined') {
                body.background = background;
            }
            return this.request({
                path: `/devices/${deviceId}/push`,
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json',
                },
            });     
        },
    }
}

module.exports = Tidbyt