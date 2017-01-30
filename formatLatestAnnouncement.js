import map from 'lodash.map'

import * as delay from './delay'

export default function formatLatestAnnouncement(a, stationNames) {
    if (!a)
        return 'Aktuell information saknas'

    const s = a.TimeAtLocation.substring(11, 16)

    return `<span class="wide">Tåg ${id(a)} mot </span>${to(a)}
            ${activity(a)} ${location(a)} ${delay.precision(a)} <span class="wide">kl</span> ${s}`

    function to() {
        return map(map(a.ToLocation, 'LocationName'), stationName)
    }

    function location() {
        return stationName(a.LocationSignature)
    }

    function stationName(locationSignature) {
        return stationNames ? stationNames[locationSignature] : locationSignature
    }
}

function id(a) {
    return a.AdvertisedTrainIdent
}

function activity(a) {
    if (a.ActivityType === 'Ankomst')
        return 'ank<span class="wide">om till</span>'

    return 'avg<span class="wide">ick från</span>'
}
