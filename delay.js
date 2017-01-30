import difference_in_minutes from 'date-fns/difference_in_minutes'

export function color(a) {
    const delay = minutes(a)
    if (delay < 1) return '#0f0'
    if (delay < 2) return '#fff'
    if (delay < 4) return '#ff0'
    if (delay < 8) return '#f80'
    return '#f00'
}

export function precision(a) {
    const delay = minutes(a)

    if (delay === 1) return '<span class="wide">nästan i tid</span>'
    if (delay > 0) return `${delay} min<span class="wide">uter</span>
                           <span class="wide">för</span>sen<span class="wide">a</span>t`
    if (delay < -1) return 'i god tid'

    return '<span class="wide">i tid</span>'
}

function minutes(a) {
    return difference_in_minutes(a.TimeAtLocation, a.AdvertisedTimeAtLocation)
}
