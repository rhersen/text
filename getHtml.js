import foreach from 'lodash.foreach'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'

import delay from './delay'
import formatLatestAnnouncement from './formatLatestAnnouncement'
import position from './position'

function getHtml(announcements, stationNames) {
    let s = '<div id="sheet">'

    const latest = map(groupby(announcements, 'AdvertisedTrainIdent'), v => maxby(v, 'TimeAtLocation'))

    foreach(groupby(latest, direction), (trains, dir) => {
        s += `<h1>${dir}</h1>`

        trains.sort((a, b) => position.y(a.LocationSignature) - position.y(b.LocationSignature))

        foreach(trains, a => {
            s += `<div class="${position.x(a.LocationSignature)} ${delay.className(a)}">`
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

module.exports = getHtml
