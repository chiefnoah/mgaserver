#MgaServer
* Author: Noah Pederson
* Email: pedersonnoah@gmail.com

* Description: A server that hosts cbz and cbr files.

###About
MgaServer came from my need for a centralized comic server that maintains reading position and progress through a series. The name comes from "manga" (the japanese word for comic book) -> "mngaserver" -> mgaserver. Because it isn't *only* for manga, the name is pronounced "megaserver." The first version tried to parses file and directory names and was able to scrape [MyAnimeList](http://myanimelist.net/) for some metadata and store it in a database. The current version (lite branch) uses [YACReaderLibrary](http://www.yacreader.com/) as a database manager and serves the data and comic files from that. There's more data than is actually defined in ComicStreamers API, but adding more shouldn't be a problem while still maintaining backwards compatibility.

So far I've gotten Astonishing Comic Reader for Android to work pretty well.

###Installation
Prerequisites: NodeJS + npm, [YACReaderLibrary](http://www.yacreader.com/) and a comic database set up

1. Run`git https://github.com/chiefnoah/mgaserver.git`
2. `get branch lite` 
3. Run `npm install`
4. Run `node bin/www`

###Planned Features
* Multiple backends (ie. ComicRack sync)
* Standalone parsing and ComicVine + MyAnimeList scraping
* YACReader multiuser
* more that I can't think of right now. It's 4 AM here, I need to go to bed
* YACReaderLibrary + YACReader iOS API backwards compatibility
* Webpage configuration, so you don't have to edit config.json
