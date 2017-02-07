import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'

import * as position from './position'

export default function latestAnnouncementForEachTrain(announcements) {
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

    return 1
}
