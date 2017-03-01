import difference_in_minutes from 'date-fns/difference_in_minutes'

export function color(a) {
    const delay = minutes(a)
    return delay < 1 ? '#0f0' : delay < 2 ? '#fff' : delay < 4 ? '#ff0' : delay < 8 ? '#f80' : '#f00'
}

export function precision(a) {
    const delay = minutes(a)

    return delay === 1 ? '<span class="wide">nästan i tid</span>' :
        delay > 0 ? `${delay} min<span class="wide">uter</span>
                           <span class="wide">för</span>sen<span class="wide">a</span>t` : delay < -1 ? 'i god tid' :
                '<span class="wide">i tid</span>'

}

function minutes(a) {
    return difference_in_minutes(a.TimeAtLocation, a.AdvertisedTimeAtLocation)
}
