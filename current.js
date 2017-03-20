import filter from 'lodash.filter'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'
import orderby from 'lodash.orderby'
import reject from 'lodash.reject'

import * as position from './position'

export default function current(announcements) {
    return reject(groupAnnouncements(filter(announcements, 'TimeAtLocation')), hasArrivedAtDestination)
}

function groupAnnouncements(announcements) {
    const dir = announcements.length && /\d\d\d[13579]/.test(announcements[0].AdvertisedTrainIdent)

    return orderby(
        map(groupby(announcements, 'AdvertisedTrainIdent'), latestAnnouncement),
        [a => position.y(a.LocationSignature), 'ActivityType', 'TimeAtLocation'],
        ['asc', dir ? 'asc' : 'desc', dir ? 'desc' : 'asc']
    )
}

function latestAnnouncement(v) {
    return maxby(v, a => a.TimeAtLocation + a.ActivityType)
}

function hasArrivedAtDestination(a) {
    return a.ActivityType === 'Ankomst' && map(a.ToLocation, 'LocationName').join() === a.LocationSignature
}