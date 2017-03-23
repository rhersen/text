import map from 'lodash.map'

import * as delay from './delay'
import formatLatestAnnouncement from './formatLatestAnnouncement'
import current from './current'
import * as position from './position'

export default function getHtml(announcements, lastModified) {
    const trains = current(announcements)

    function htmlForTrain(train) {
        const a = train.actual
        return `<div style="color: ${delay.color(a)}; text-align: ${position.x(a.LocationSignature)};">${formatLatestAnnouncement(a)}</div>`
    }

    return [`<div id="sheet"><h1>${lastModified}</h1>`]
        .concat(map(trains, htmlForTrain)
            .concat('</div>')).join('\n')
}
