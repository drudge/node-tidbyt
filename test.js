const { promises: fs } = require('fs')

const Tidbyt = require('./index')

async function main() {
    const deviceId = process.argv[2]
    const tidbyt = new Tidbyt(process.env.TIDBYT_API_TOKEN)

    // get our requested device
    const device = await tidbyt.devices.get(deviceId)

    const { displayName } = device

    console.log(displayName, `Last Seen: (${device.lastSeen.toLocaleString()})`)

    // get a list of officially available apps
    // return as map so we can lookup app name/descriptions by id
    const apps = await tidbyt.apps.list({ asMap: true })

    // get the list of installations for this device
    const installations = await device.installations.list()

    // for (const { id, appID } of installations) {
    //     const {
    //         name = 'Custom',
    //         description = `Unlike a regular Tidbyt app, this "installation" was pushed to ${displayName} via Tidbyt's API.`,
    //     } = apps.get(appID) || {}

    //     console.log(``)
    //     console.log(`  ${name} - ${id}`)
    //     console.log(`      ${description}`)

    // }

    // delete an installation
    try {
        const deleteResults = await device.installations.delete('NyanCat')
        console.log(deleteResults)
    } catch (e) {
        console.error(`Failed to delete installation: ${e.message}`)
    }

    // push a new installation from a local file
    const nyan = await fs.readFile('nyan.webp')
    await device.push(nyan, { installationID: 'NyanCat', background: true })

    // // download a webp preview buffer of an installation
    // const preview = await device.installations.preview('NyanCat')
    // // save the preview to a file
    // await fs.writeFile('preview.webp', preview, { encoding: 'base64' })

    // // update an installation from a local file after some time
    // setTimeout(async () => {
    //     console.log('updating nyan cat installation')
    //     const updateResults = await device.installations.update('NyanCat', nyan)
    // }, 5000)

    // // update some device settings
    // const updatedDevice = await device.update({ brightness: 10 })
    // console.log(`updated brightness from ${device.brightness}% to ${updatedDevice.brightness}%`)
}

main()
