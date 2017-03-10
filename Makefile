install:	pull mocha /opt/nginx-1.10.2/text/browser-bundle.js /opt/nginx-1.10.2/text/index.html

pull:
	git pull

mocha:
	npm run test

browser-bundle.js:	index.js getHtml.js formatLatestAnnouncement.js groupAnnouncements.js position.js delay.js
	npm run build

/opt/nginx-1.10.2/text/browser-bundle.js:	browser-bundle.js
	cp browser-bundle.js /opt/nginx-1.10.2/text/

/opt/nginx-1.10.2/text/index.html:	index.html
	cp index.html /opt/nginx-1.10.2/text/

