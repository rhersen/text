import filter from 'lodash.filter'
import map from 'lodash.map'
import reject from 'lodash.reject'

import * as delay from './delay'
import formatLatestAnnouncement from './formatLatestAnnouncement'
import * as groupAnnouncements from './groupAnnouncements'
import * as position from './position'

export default function getHtml(announcements, lastModified) {
    const actual = filter(announcements, 'TimeAtLocation')
    const trains = groupAnnouncements.actual(actual)

    function htmlForTrain(a) {
        return `<div style="color: ${delay.color(a)}; text-align: ${position.x(a.LocationSignature)};">${formatLatestAnnouncement(a)}</div>`;
    }

    return [`<div id="sheet"><h1>${lastModified}</h1>`]
        .concat(map(reject(trains, hasArrivedAtDestination), htmlForTrain)
            .concat('</div>')).join('\n')
}

function hasArrivedAtDestination(a) {
    return a.ActivityType === 'Ankomst' && map(a.ToLocation, 'LocationName').join() === a.LocationSignature
}