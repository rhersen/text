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
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Tul',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}],
            'TimeAtLocation': '2017-02-06T07:42:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Tu',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}],
            'TimeAtLocation': '2017-02-06T07:45:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2611',
            'LocationSignature': 'Åbe',
            'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
            'TimeAtLocation': '2017-02-06T07:37:00'
        }])

        expect(actual).to.match(/Tåg 2611/)
        expect(actual).to.not.match(/Tåg 2909/)
    })

    it('sorts according to time if ActivityType is same', function () {
        const actual = getHtml([{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2664',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-06T20:49:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2864',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-06T20:48:00'
        }])

        expect(actual).to.match(/2864.*\n.*2664/)
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

    it('returns only the latest announcement for each train', function () {
        const announcements = [{
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Cst',
            'TimeAtLocation': '2017-02-02T07:11:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Ke',
            'TimeAtLocation': '2017-02-02T07:14:00'
        }]

        const actual = latestAnnouncementForEachTrain(announcements)

        expect(actual).to.deep.equal([announcements[1]])
    })

    it('Avgang is later than Ankomst', function () {
        const announcements = [{
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Ke',
            'TimeAtLocation': '2017-02-02T07:14:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Ke',
            'TimeAtLocation': '2017-02-02T07:14:00'
        }]

        const actual = latestAnnouncementForEachTrain(announcements)

        expect(actual[0].ActivityType).to.equal('Avgang')
    })

    it('returns only the latest announcement for each train', function () {
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
