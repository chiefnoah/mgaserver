function series(title, cover, year, authors, artists, publisher, status, genres, aliases, rating, description) {
  this.title = title;
  this.cover = cover;
  this.year = year;
  this.authors = authors;
  this.artists = artists;
  this.publisher = publisher;
  this.status = status;
  this.genres = genres;
  this.aliases = aliases;
  this.rating = rating;
  this.description = description;
}

module.exports = series;