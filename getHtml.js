import foreach from 'lodash.foreach'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'

import * as delay from './delay'
import formatLatestAnnouncement from './formatLatestAnnouncement'
import * as position from './position'

export default function getHtml(announcements, stationNames, lastModified) {
    let s = `<div id="sheet"><h1>${lastModified}</h1>`

    const trains = map(groupby(announcements, 'AdvertisedTrainIdent'), v => maxby(v, 'TimeAtLocation'))

    trains.sort((a, b) => position.y(a.LocationSignature) - position.y(b.LocationSignature))

    foreach(trains, a => {
        s += `<div style="color: ${delay.color(a)}; text-align: ${position.x(a.LocationSignature)};">`
        s += `${formatLatestAnnouncement(a, stationNames)}`
        s += '</div>'
    })

    s += '</div>'
    return s
}

