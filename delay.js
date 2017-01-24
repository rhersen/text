import difference_in_minutes from 'date-fns/difference_in_minutes'

module.exports = {
    className: function className(a) {
        const delay = minutes(a)
        if (delay < 1) return 'delay0'
        if (delay < 2) return 'delay1'
        if (delay < 4) return 'delay2'
        if (delay < 8) return 'delay4'
        return 'delay8'
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
