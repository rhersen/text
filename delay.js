import difference_in_minutes from 'date-fns/difference_in_minutes'

module.exports = {
    color: function (a) {
        const delay = minutes(a)
        if (delay < 1) return '#0f0'
        if (delay < 2) return '#fff'
        if (delay < 4) return '#ff0'
        if (delay < 8) return '#f80'
        return '#f00'
    },

    precision: function (a) {
        const delay = minutes(a)

        if (delay === 1) return 'nästan i tid'
        if (delay > 0) return `${delay} minuter försenat`
        if (delay < -1) return 'i god tid'

        return 'i tid'
    }
}

function minutes(a) {
    return difference_in_minutes(a.TimeAtLocation, a.AdvertisedTimeAtLocation)
}
