export type Genre = {
  id: string;
  name: string;
};

export type ProductionCompanies = {
  id: string;
  logo_path: string;
  name: string;
  origin_country: string;
};

export type ProductionCountries = {
  iso_3166_1: string;
  name: string;
};

export type SpokenLanguages = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

export type Collection = {
  id: string;
  name: string;
  poster_path: string;
  backdrop_path: string;
};
