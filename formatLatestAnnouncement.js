import map from 'lodash.map'

import * as delay from './delay'

export default function formatLatestAnnouncement(a, stationNames) {
    if (!a)
        return 'Aktuell information saknas'

    const s = a.TimeAtLocation.substring(11, 16)

    return `Tåg ${id(a)} mot ${to(a)} ${activity(a)} ${location(a)} ${delay.precision(a)} kl ${ s}`

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
    return a.ActivityType === 'Ankomst' ? 'ankom till' : 'avgick från'
}
