import {expect} from 'chai'

import getHtml from '../getHtml'
import latestAnnouncementForEachTrain from '../latestAnnouncementForEachTrain'

describe('getHtml', function () {
    it('returns empty div', function () {
        const actual = getHtml([])

        expect(actual).to.equal('<div id="sheet"><h1>undefined</h1></div>')
    })

    it('removes arrival to ToLocation', function () {
        const actual = getHtml([{
            'ActivityType': 'Avgang',
            'AdvertisedTimeAtLocation': '2017-02-06T07:33:00',
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Tul',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}],
            'ModifiedTime': '2017-02-06T06:42:42.431Z',
            'EstimatedTimeAtLocation': '2017-02-06T07:41:00',
            'TimeAtLocation': '2017-02-06T07:42:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTimeAtLocation': '2017-02-06T07:37:00',
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Tu',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}],
            'ModifiedTime': '2017-02-06T06:44:57.671Z',
            'EstimatedTimeAtLocation': '2017-02-06T07:45:00',
            'TimeAtLocation': '2017-02-06T07:45:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTimeAtLocation': '2017-02-06T07:37:00',
            'AdvertisedTrainIdent': '2611',
            'LocationSignature': 'Åbe',
            'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
            'ModifiedTime': '2017-02-06T06:37:27.195Z',
            'TimeAtLocation': '2017-02-06T07:37:00'
        }])

        expect(actual).to.match(/Tåg 2611/)
        expect(actual).to.not.match(/Tåg 2909/)
    })
})

describe('latestAnnouncementForEachTrain', function () {
    it('returns empty array', function () {
        const actual = latestAnnouncementForEachTrain([])

        expect(actual).to.be.an('array').that.is.empty
    })

    it('does nothing to single train', function () {
        const announcements = [{
            'AdvertisedTrainIdent': '2608',
            'TimeAtLocation': '2017-02-02T07:11:00'
        }]

        const actual = latestAnnouncementForEachTrain(announcements)

        expect(actual).to.deep.equal(announcements)
    })

    it('sorts according to location, north to south', function () {
        const announcements = [{
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Udl',
            'TimeAtLocation': '2017-02-02T07:21:00'
        }, {
            'AdvertisedTrainIdent': '2708',
            'LocationSignature': 'R',
            'TimeAtLocation': '2017-02-02T07:11:00'
        }]

        const actual = latestAnnouncementForEachTrain(announcements)

        expect(actual[0].LocationSignature).to.equal('R')
        expect(actual[1].LocationSignature).to.equal('Udl')
    })

    it('returns only the latest announcment for each train', function () {
        const announcements = [{
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Cst',
            'TimeAtLocation': '2017-02-02T07:11:00'
        }, {
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Ke',
            'TimeAtLocation': '2017-02-02T07:14:00'
        }]

        const actual = latestAnnouncementForEachTrain(announcements)

        expect(actual).to.deep.equal([announcements[1]])
    })
})
