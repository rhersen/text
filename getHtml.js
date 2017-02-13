import foreach from 'lodash.foreach'
import filter from 'lodash.filter'
import map from 'lodash.map'
import includes from 'lodash.includes'
import reject from 'lodash.reject'

import * as delay from './delay'
import formatLatestAnnouncement from './formatLatestAnnouncement'
import latestAnnouncementForEachTrain from './latestAnnouncementForEachTrain'
import * as position from './position'

export default function getHtml(announcements, stationNames, lastModified) {
    let s = `<div id="sheet"><h1>${lastModified}</h1>`

    foreach(latestAnnouncementForEachTrain(removeArrivedTrains(filter(announcements, 'TimeAtLocation'))), a => {
        s += `<div style="color: ${delay.color(a)}; text-align: ${position.x(a.LocationSignature)};">`
        s += `${formatLatestAnnouncement(a, stationNames)}`
        s += '</div>'
    })

    s += '</div>'
    return s
}

function removeArrivedTrains(announcements) {
    const arrivedTrains = map(filter(announcements, isArrivalAtFinalDestination), 'AdvertisedTrainIdent')

    return reject(announcements, isArrivedTrain)

    function isArrivedTrain(announcement) {
        return includes(arrivedTrains, announcement.AdvertisedTrainIdent)
    }
}

function isArrivalAtFinalDestination(a) {
    return a.ActivityType === 'Ankomst' && map(a.ToLocation, 'LocationName').join() === a.LocationSignature
}