import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'

import * as position from './position'

export function actual(announcements) {
    const trains = map(groupby(announcements, 'AdvertisedTrainIdent'), latestAnnouncement)

    trains.sort(northToSouth)
    return trains

    function latestAnnouncement(v) {
        return maxby(v, a => a.TimeAtLocation + a.ActivityType)
    }
}

function northToSouth(a, b) {
    const pos = position.y(a.LocationSignature) - position.y(b.LocationSignature)

    if (pos) return pos

    const isSouthbound = /\d\d\d[13579]/.test(a.AdvertisedTrainIdent)
    const dir = isSouthbound ? -1 : 1

    if (a.ActivityType > b.ActivityType) return -dir
    if (a.ActivityType < b.ActivityType) return dir

    if (a.TimeAtLocation > b.TimeAtLocation) return dir
    if (a.TimeAtLocation < b.TimeAtLocation) return -dir

    return 0
}
