#MgaServer
* Author: Noah Pederson
* Email: pedersonnoah@gmail.com

* Description: A server that hosts cbz and cbr files.

###About
MgaServer came from my need for a centralized comic server that maintains reading position and progress through a series. The name comes from "manga" (the japanese word for comic book) -> "mngaserver" -> mgaserver. Because it isn't *only* for manga, the name is pronounced "megaserver." The first version tried to parses file and directory names and was able to scrape [MyAnimeList](http://myanimelist.net/) for some metadata and store it in a database. The current version (lite branch) uses [YACReaderLibrary](http://www.yacreader.com/) as a database manager and serves the data and comic files from that. There's more data than is actually defined in ComicStreamers API, but adding more shouldn't be a problem while still maintaining backwards compatibility.

So far I've gotten Astonishing Comic Reader for Android to work pretty well.

###Installation
Prerequisites: NodeJS + npm, [YACReaderLibrary](http://www.yacreader.com/) and a comic database set up

###Setup

Step 1: Clone the repository. To do this, open up command prompt and run `git https://github.com/chiefnoah/mgaserver.git`

Step 2. Install the necessary dependencies. Again, from command prompt run `npm install`

Step 3. Finally, run the server by executing the `www` file in side the `bin` folder. To do this type `node bin/www` into command prompt and hit enter.

###Planned Features
* Standalone parsing and ComicVine + MyAnimeList scraping
* YACReader multiuser (possibly)
* YACReaderLibrary + YACReader iOS API backwards compatibility <- This is complex and undocumented. Probably not goint to prioritize
* Webpage configuration and management
