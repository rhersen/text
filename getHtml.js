import foreach from 'lodash.foreach'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'

import * as delay from './delay'
import formatLatestAnnouncement from './formatLatestAnnouncement'
import * as position from './position'

export default function getHtml(announcements, stationNames, lastModified) {
    let s = '<div id="sheet">'

    const latest = map(groupby(announcements, 'AdvertisedTrainIdent'), v => maxby(v, 'TimeAtLocation'))

    foreach(groupby(latest, direction), (trains, dir) => {
        s += `<h1>${dir} ${lastModified}</h1>`

        trains.sort((a, b) => position.y(a.LocationSignature) - position.y(b.LocationSignature))

        foreach(trains, a => {
            s += `<div style="color: ${delay.color(a)}; text-align: ${position.x(a.LocationSignature)};">`
            s += `${formatLatestAnnouncement(a, stationNames)}`
            s += '</div>'
        })

    })

    s += '</div>'
    return s
}

function direction(t) {
    return /[13579]$/.test(t.AdvertisedTrainIdent) ? 'söderut' : 'norrut'
}
