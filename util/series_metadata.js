function series(title, cover, start_date, end_date, authors, artists, publisher, status, genres, aliases, rating, chapters, volumes, description, levenshtein) {
  this.title = title;
  this.cover = cover;
  this.start_date = start_date;
  this.end_date = end_date;
  this.authors = authors;
  this.artists = artists;
  this.publisher = publisher;
  this.status = status;
  this.genres = genres;
  this.aliases = aliases;
  this.rating = rating;
  this.chapters = chapters;
  this.volumes = volumes;
  this.description = description;
  this.levenshtein = levenshtein;
}

module.exports = series;