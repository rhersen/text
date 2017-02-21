import filter from 'lodash.filter'
import groupby from 'lodash.groupby'
import map from 'lodash.map'
import maxby from 'lodash.maxby'
import orderby from 'lodash.orderby'
import reject from 'lodash.reject'

import * as position from './position'

export function actual(announcements) {
    function latestAnnouncement(v) {
        return maxby(v, a => a.TimeAtLocation + a.ActivityType)
    }

    const dir = announcements.length && /\d\d\d[13579]/.test(announcements[0].AdvertisedTrainIdent)

    return orderby(
        map(groupby(announcements, 'AdvertisedTrainIdent'), latestAnnouncement),
        [a => position.y(a.LocationSignature), 'ActivityType', 'TimeAtLocation'],
        ['asc', (dir ? 'asc' : 'desc'), (dir ? 'desc' : 'asc')]
    )
}

export function nearest(announcements) {
    return {
        prev: actual(filter(announcements, 'TimeAtLocation'))[0],
        next: reject(announcements, 'TimeAtLocation')[0]
    }
}
