/* eslint better/explicit-return: 0, fp/no-nil: 0, fp/no-unused-expression: 0 */

import {expect} from 'chai'

import getHtml from '../getHtml'
import * as groupAnnouncements from '../groupAnnouncements'
import * as position from '../position'

describe('getHtml', function () {
    it('returns empty div', function () {
        const actual = getHtml([])

        expect(actual).to.equal('<div id="sheet"><h1>undefined</h1>\n</div>')
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

    it('removes trains that have no TimeAtLocation', function () {
        const actual = getHtml([{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2909',
            'LocationSignature': 'Tul',
            'ToLocation': [{'LocationName': 'Tu', 'Priority': 1, 'Order': 0}]
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
})

describe('groupAnnouncements', function () {
    it('returns empty array', function () {
        const actual = groupAnnouncements.actual([])

        expect(actual).to.be.an('array').that.is.empty
    })

    it('does nothing to single train', function () {
        const announcements = [{
            'AdvertisedTrainIdent': '2608',
            'LocationSignature': 'Cst',
            'TimeAtLocation': '2017-02-02T07:11:00'
        }]

        const actual = groupAnnouncements.actual(announcements)

        expect(actual).to.deep.equal(announcements)
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

        const actual = groupAnnouncements.actual(announcements)

        expect(actual[0].TimeAtLocation).to.match(/7:14/)
    })

    it('Avgang is considered more recent than Ankomst', function () {
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

        const actual = groupAnnouncements.actual(announcements)

        expect(actual[0].ActivityType).to.equal('Avgang')
    })

    it('sorts Avgang below Ankomst for southbound', function () {
        const announcements = [{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2653',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-07T18:11:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2853',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-07T18:12:00'
        }]

        const actual = groupAnnouncements.actual(announcements)

        expect(actual[0].ActivityType).to.equal('Ankomst')
        expect(actual[1].ActivityType).to.equal('Avgang')
    })

    it('sorts northbound by time, ascending, if ActivityType is same', function () {
        const announcements = [{
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2664',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-06T20:49:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTrainIdent': '2864',
            'LocationSignature': 'Äs',
            'TimeAtLocation': '2017-02-06T20:48:00'
        }]

        const actual = groupAnnouncements.actual(announcements)

        expect(actual[0].TimeAtLocation).to.match(/20:48/)
        expect(actual[1].TimeAtLocation).to.match(/20:49/)
    })

    it('sorts southbound by time, descending, if ActivityType is same', function () {
        const announcements = [{
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2849',
            'LocationSignature': 'Cst',
            'TimeAtLocation': '2017-02-07T17:01:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTrainIdent': '2949',
            'LocationSignature': 'Cst',
            'TimeAtLocation': '2017-02-07T17:05:00'
        }]

        const actual = groupAnnouncements.actual(announcements)

        expect(actual[0].TimeAtLocation).to.match(/17:05/)
        expect(actual[1].TimeAtLocation).to.match(/17:01/)
    })

    it('returns the latest actual and the earliest estimated', function () {
        const announcements = [{
            'ActivityType': 'Ankomst',
            'AdvertisedTimeAtLocation': '2017-02-17T17:43:00',
            'AdvertisedTrainIdent': '2651',
            'LocationSignature': 'Sta',
            'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
            'ModifiedTime': '2017-02-17T16:43:38.824Z',
            'EstimatedTimeAtLocation': '2017-02-17T17:44:00',
            'TimeAtLocation': '2017-02-17T17:43:00'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTimeAtLocation': '2017-02-17T17:43:00',
            'AdvertisedTrainIdent': '2651',
            'LocationSignature': 'Sta',
            'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
            'ModifiedTime': '2017-02-17T16:45:16.562Z',
            'EstimatedTimeAtLocation': '2017-02-17T17:44:00',
            'TimeAtLocation': '2017-02-17T17:44:00'
        }, {
            'ActivityType': 'Ankomst',
            'AdvertisedTimeAtLocation': '2017-02-17T17:46:00',
            'AdvertisedTrainIdent': '2651',
            'LocationSignature': 'Hu',
            'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
            'ModifiedTime': '2017-02-17T16:43:37.467Z'
        }, {
            'ActivityType': 'Avgang',
            'AdvertisedTimeAtLocation': '2017-02-17T17:46:00',
            'AdvertisedTrainIdent': '2651',
            'LocationSignature': 'Hu',
            'ToLocation': [{'LocationName': 'Söc', 'Priority': 1, 'Order': 0}],
            'ModifiedTime': '2017-02-17T16:43:37.483Z'
        }]

        const actual = groupAnnouncements.nearest(announcements)

        expect(actual.prev.TimeAtLocation).to.match(/17:44/)
        expect(actual.next.ActivityType).to.equal('Ankomst')
        expect(actual.next.AdvertisedTimeAtLocation).to.match(/17:46/)
    })
})

describe('position', function () {
    describe('y', function () {
        describe('sorts according to location, north to south', function () {
            it('within each branch', function () {
                expect(position.y('Udl')).to.be.above(position.y('Upv'))
                expect(position.y('Sst')).to.be.above(position.y('Cst'))
                expect(position.y('Bkb')).to.be.above(position.y('Bro'))
                expect(position.y('Tul')).to.be.above(position.y('Flb'))
                expect(position.y('Nyh')).to.be.above(position.y('Fas'))
            })

            it('between branches', function () {
                expect(position.y('Cst')).to.be.above(position.y('Udl'))
                expect(position.y('Cst')).to.be.above(position.y('Sub'))
                expect(position.y('Flb')).to.be.above(position.y('Sst'))
                expect(position.y('Fas')).to.be.above(position.y('Sst'))
            })

            it('Gröndalsviken between Nynäsgård and Nynäshamn', function () {
                expect(position.y('Gdv')).to.be.above(position.y('Ngd'))
                expect(position.y('Nyh')).to.be.above(position.y('Gdv'))
            })

            it('Södertälje Centrum between Hamn and Syd', function () {
                expect(position.y('Söc')).to.be.above(position.y('Söd'))
                expect(position.y('Söu')).to.be.above(position.y('Söc'))
            })

            it('Gnesta after Mölnbo', function () {
                expect(position.y('Gn')).to.be.above(position.y('Mö'))
            })
        })
    })
})
