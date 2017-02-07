install:	pull mocha /opt/nginx-1.10.2/text/browser-bundle.js /opt/nginx-1.10.2/text/index.html

pull:
	git pull

mocha:
	node_modules/.bin/mocha --compilers js:babel-core/register

browser-bundle.js:	index.js getHtml.js formatLatestAnnouncement.js latestAnnouncementForEachTrain.js position.js delay.js
	node_modules/.bin/webpack --optimize-minimize

/opt/nginx-1.10.2/text/browser-bundle.js:	browser-bundle.js
	cp browser-bundle.js /opt/nginx-1.10.2/text/

/opt/nginx-1.10.2/text/index.html:	index.html
	cp index.html /opt/nginx-1.10.2/text/

