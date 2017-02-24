import map from 'lodash.map'

import * as delay from './delay'
import * as stations from './stations'

export default function formatLatestAnnouncement(a) {
    function to() {
        return map(map(a.ToLocation, 'LocationName'), stationName)
    }

    function location() {
        return stationName(a.LocationSignature)
    }

    function stationName(locationSignature) {
        return stations.get(locationSignature, 'AdvertisedShortLocationName') || locationSignature
    }

    return a ?
        `<span class="wide">Tåg ${id(a)} mot </span>${to(a)} ${activity(a)} ${location(a)} ${delay.precision(a)} <span class="wide">kl</span> ${a.TimeAtLocation.substring(11, 16)}` :
        'Aktuell information saknas';

}

function id(a) {
    return a.AdvertisedTrainIdent
}

function activity(a) {
    return a.ActivityType === 'Ankomst' ?
        'ank<span class="wide">om till</span>' :
        'avg<span class="wide">ick från</span>';
}
