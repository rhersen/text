import foreach from 'lodash.foreach'
import filter from 'lodash.filter'
import map from 'lodash.map'
import reject from 'lodash.reject'

import * as delay from './delay'
import formatLatestAnnouncement from './formatLatestAnnouncement'
import latestAnnouncementForEachTrain from './latestAnnouncementForEachTrain'
import * as position from './position'

export default function getHtml(announcements, stationNames, lastModified) {
    let s = `<div id="sheet"><h1>${lastModified}</h1>`

    const actual = filter(announcements, 'TimeAtLocation')
    const trains = latestAnnouncementForEachTrain(actual)

    foreach(reject(trains, hasArrivedAtDestination), a => {
        s += `<div style="color: ${delay.color(a)}; text-align: ${position.x(a.LocationSignature)};">`
        s += `${formatLatestAnnouncement(a, stationNames)}`
        s += '</div>'
    })

    s += '</div>'
    return s
}

function hasArrivedAtDestination(a) {
    return a.ActivityType === 'Ankomst' && map(a.ToLocation, 'LocationName').join() === a.LocationSignature
}