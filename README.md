Tidbyt Client for Node.js
==========================

Unofficial API client for the [Tidbyt API](https://tidbyt.dev/docs/tidbyt-api). Use this client to control Tidbyt devices and integrate with other services.


## Installation

You can install the package with [npm](https://www.npmjs.org):

```bash
> npm install tidbyt
```

## Usage

```js
const Tidbyt = require('tidbyt')

async function main() {
    const deviceId = process.argv[2]
    const tidbyt = new Tidbyt(process.env.TIDBYT_API_TOKEN)

    // get our requested device
    const device = await tidbyt.devices.get(deviceId)
    const { displayName, lastSeen } = device

    console.log(displayName, `Last Seen: (${lastSeen})`)

    // get a list of officially available apps
    // return as map so we can lookup app name/descriptions by id
    const apps = await tidbyt.apps.list({ asMap: true })

    // get the list of installations for this device
    const installations = await device.installations.list()

    for (const { id, appID } of installations) {
        const {
            name = 'Custom',
            description = `Unlike a regular Tidbyt app, this "installation" was pushed to ${displayName} via Tidbyt's API.`,
        } = apps.get(appID) || {}

        console.log(``)
        console.log(`  ${name} - ${id}`)
        console.log(`      ${description}`)
    }
}
main()
```
## Classes

<dl>
<dt><a href="#TidbytDevice">TidbytDevice</a></dt>
<dd></dd>
<dt><a href="#Tidbyt">Tidbyt</a></dt>
<dd></dd>
</dl>

<a name="TidbytDevice"></a>

## TidbytDevice
**Kind**: global class  
**Scope**: Tidbyt  

* [TidbytDevice](#TidbytDevice)
    * [new TidbytDevice(options, client)](#new_TidbytDevice_new)
    * [.installations](#TidbytDevice+installations) : <code>object</code>
        * [.list()](#TidbytDevice+installations+list) ⇒ <code>Promise.&lt;Array.&lt;TidbytDeviceInstallation&gt;&gt;</code>
        * [.update(installationID, image)](#TidbytDevice+installations+update) ⇒ <code>Promise.&lt;Object&gt;</code>
        * [.delete(installationID)](#TidbytDevice+installations+delete) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.update(updates)](#TidbytDevice+update) ⇒ [<code>Promise.&lt;TidbytDevice&gt;</code>](#TidbytDevice)
    * [.push(image, options)](#TidbytDevice+push) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="new_TidbytDevice_new"></a>

### new TidbytDevice(options, client)
Construct a TidbytDevice with provided options.

A valid `client` is required to use any methods.

Available options:

     - `id`: the device id

     - `lastSeen`: the last time the device was seen

     - `brightness`: the brightness of the device from 0-100

     - `displayName`: the display name of the device

     - `autoDim`: whether the device is auto dimming at night


| Param | Type |
| --- | --- |
| options | <code>Object</code> | 
| client | <code>TidByt</code> | 

<a name="TidbytDevice+installations"></a>

### tidbytDevice.installations : <code>object</code>
**Kind**: instance property of [<code>TidbytDevice</code>](#TidbytDevice)  

* [.installations](#TidbytDevice+installations) : <code>object</code>
    * [.list()](#TidbytDevice+installations+list) ⇒ <code>Promise.&lt;Array.&lt;TidbytDeviceInstallation&gt;&gt;</code>
    * [.update(installationID, image)](#TidbytDevice+installations+update) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.delete(installationID)](#TidbytDevice+installations+delete) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="TidbytDevice+installations+list"></a>

#### installations.list() ⇒ <code>Promise.&lt;Array.&lt;TidbytDeviceInstallation&gt;&gt;</code>
Return a list of installations on the device from the Tidbyt API.

**Kind**: instance method of [<code>installations</code>](#TidbytDevice+installations)  
<a name="TidbytDevice+installations+update"></a>

#### installations.update(installationID, image) ⇒ <code>Promise.&lt;Object&gt;</code>
Update an existing installation with a new image.

Throws if not client is intialized.

**Kind**: instance method of [<code>installations</code>](#TidbytDevice+installations)  

| Param | Type | Description |
| --- | --- | --- |
| installationID | <code>String</code> | Optional installation ID to create/update |
| image | <code>Buffer</code> | Buffer containing the images to push |

<a name="TidbytDevice+installations+delete"></a>

#### installations.delete(installationID) ⇒ <code>Promise.&lt;Object&gt;</code>
Delete an existing installation from the device.

Throws if not client is intialized.

**Kind**: instance method of [<code>installations</code>](#TidbytDevice+installations)  

| Param | Type | Description |
| --- | --- | --- |
| installationID | <code>String</code> | Optional installation ID to create/update |

<a name="TidbytDevice+update"></a>

### tidbytDevice.update(updates) ⇒ [<code>Promise.&lt;TidbytDevice&gt;</code>](#TidbytDevice)
Update a device with the provided values.

Throws if not client is intialized.

Available fields:

     - `autoDim`: whether the device is auto dimming at night

     - `brightness`: the brightness of the device from 0-100

     - `displayName`: the display name of the device

**Kind**: instance method of [<code>TidbytDevice</code>](#TidbytDevice)  

| Param | Type |
| --- | --- |
| updates | <code>Object</code> | 

<a name="TidbytDevice+push"></a>

### tidbytDevice.push(image, options) ⇒ <code>Promise.&lt;Object&gt;</code>
Push a new installation to the device.

Throws if not client is intialized.


Available options:

`installationID`: Installation ID to create/update

`background`: Whether the installation should not interrupt the rotation

**Kind**: instance method of [<code>TidbytDevice</code>](#TidbytDevice)  

| Param | Type | Description |
| --- | --- | --- |
| image | <code>Buffer</code> | Buffer containing the images to push |
| options | <code>Object</code> |  |

<a name="Tidbyt"></a>

## Tidbyt
**Kind**: global class  

* [Tidbyt](#Tidbyt)
    * [new Tidbyt(apiToken, version)](#new_Tidbyt_new)
    * [.apps](#Tidbyt+apps) : <code>object</code>
        * [.list(options)](#Tidbyt+apps+list) ⇒ <code>Promise.&lt;(Array.&lt;Object&gt;\|Map)&gt;</code>
    * [.devices](#Tidbyt+devices) : <code>object</code>
        * [.get(deviceId)](#Tidbyt+devices+get) ⇒ [<code>Promise.&lt;TidbytDevice&gt;</code>](#TidbytDevice)
        * [.update(deviceId, updates)](#Tidbyt+devices+update) ⇒ [<code>Promise.&lt;TidbytDevice&gt;</code>](#TidbytDevice)
        * [.push(deviceId, image, [options])](#Tidbyt+devices+push) ⇒ <code>Promise.&lt;Object&gt;</code>
    * [.request(path, method, body, headers, raw, encoding)](#Tidbyt+request) ⇒ <code>Promise.&lt;(Object\|Buffer)&gt;</code>

<a name="new_Tidbyt_new"></a>

### new Tidbyt(apiToken, version)
Construct a Tidbyt with provided options.

Available options:

     - `apiToken`: the API token

     - `apiVersion`: the API version. Defaults to `v0`


| Param | Type | Default |
| --- | --- | --- |
| apiToken | <code>String</code> |  | 
| version | <code>String</code> | <code>&#x27;v0&#x27;</code> | 

<a name="Tidbyt+apps"></a>

### tidbyt.apps : <code>object</code>
**Kind**: instance property of [<code>Tidbyt</code>](#Tidbyt)  
<a name="Tidbyt+apps+list"></a>

#### apps.list(options) ⇒ <code>Promise.&lt;(Array.&lt;Object&gt;\|Map)&gt;</code>
Return a list of available apps from the Tidbyt API.

Available options:

     - `asMap`: Defaults to false. If true, returns a map of app ids to app objects instead of an array of app objects.

**Kind**: instance method of [<code>apps</code>](#Tidbyt+apps)  

| Param | Type |
| --- | --- |
| options | <code>Object</code> | 

<a name="Tidbyt+devices"></a>

### tidbyt.devices : <code>object</code>
**Kind**: instance property of [<code>Tidbyt</code>](#Tidbyt)  

* [.devices](#Tidbyt+devices) : <code>object</code>
    * [.get(deviceId)](#Tidbyt+devices+get) ⇒ [<code>Promise.&lt;TidbytDevice&gt;</code>](#TidbytDevice)
    * [.update(deviceId, updates)](#Tidbyt+devices+update) ⇒ [<code>Promise.&lt;TidbytDevice&gt;</code>](#TidbytDevice)
    * [.push(deviceId, image, [options])](#Tidbyt+devices+push) ⇒ <code>Promise.&lt;Object&gt;</code>

<a name="Tidbyt+devices+get"></a>

#### devices.get(deviceId) ⇒ [<code>Promise.&lt;TidbytDevice&gt;</code>](#TidbytDevice)
Get a device by id from the Tidbyt API.

**Kind**: instance method of [<code>devices</code>](#Tidbyt+devices)  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>String</code> | The device id |

<a name="Tidbyt+devices+update"></a>

#### devices.update(deviceId, updates) ⇒ [<code>Promise.&lt;TidbytDevice&gt;</code>](#TidbytDevice)
Update a device with the provided values by ID.

Available updates:

     - `autoDim`: whether the device is auto dimming at night

     - `brightness`: the brightness of the device from 0-100

     - `displayName`: the display name of the device

**Kind**: instance method of [<code>devices</code>](#Tidbyt+devices)  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>String</code> | The device id |
| updates | <code>Object</code> |  |

<a name="Tidbyt+devices+push"></a>

#### devices.push(deviceId, image, [options]) ⇒ <code>Promise.&lt;Object&gt;</code>
Push a new installation to a device by ID.

Throws if not client is intialized.

Available options:

`installationID`: Installation ID to create/update

`background`: Whether the installation should not interrupt the rotation

**Kind**: instance method of [<code>devices</code>](#Tidbyt+devices)  

| Param | Type | Description |
| --- | --- | --- |
| deviceId | <code>String</code> | The device id |
| image | <code>Buffer</code> | Buffer containing the images to push |
| [options] | <code>Object</code> | Push options |

<a name="Tidbyt+request"></a>

### tidbyt.request(path, method, body, headers, raw, encoding) ⇒ <code>Promise.&lt;(Object\|Buffer)&gt;</code>
Send a request to the Tidbyt API.

**Kind**: instance method of [<code>Tidbyt</code>](#Tidbyt)  

| Param | Type | Default |
| --- | --- | --- |
| path | <code>String</code> |  | 
| method | <code>String</code> | <code>&#x27;GET&#x27;</code> | 
| body | <code>Object</code> | <code></code> | 
| headers | <code>Object</code> | <code>{}</code> | 
| raw | <code>Boolean</code> |  | 
| encoding | <code>String</code> |  | 

