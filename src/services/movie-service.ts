export type Title = {
  id: string;
  type: string;
  primaryTitle: string;
  originalTitle: string;
  primaryImage?: {
    url: string;
    width: number;
    height: number;
  };
  startYear?: number;
  endYear?: number;
  runtimeSeconds?: number;
  genres?: string[];
  rating?: {
    aggregateRating: number;
    voteCount: number;
  };
  plot?: string;
};

export type ApiResponse = {
  titles: Title[];
  totalCount: number;
  nextPageToken?: string;
};

export async function getTitlesByGenre(genre: string): Promise<ApiResponse> {
  const response = await fetch(`https://api.imdbapi.dev/titles?genres=${genre}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar filmes');
  }
  return response.json();
}

export async function getTitleById(id: string): Promise<Title> {
  const response = await fetch(`https://api.imdbapi.dev/titles/${id}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar filmes por ID');
  }
  return response.json();
}

export async function getSeasons(titleId: string) {
  const response = await fetch(`https://api.imdbapi.dev/titles/${titleId}/seasons`);

  if (!response.ok) {
    throw new Error('Erro ao buscar temporadas');
  }

  return response.json();
}

export async function getEpisodes(titleId: string, season: string) {
  const response = await fetch(
    `https://api.imdbapi.dev/titles/${titleId}/episodes?season=${season}`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar episodios');
  }

  return response.json();
}

export async function getImages(titleId: string) {
  const response = await fetch(`https://api.imdbapi.dev/titles/${titleId}/images`);

  if (!response.ok) {
    throw new Error('Erro ao buscar imagens');
  }

  return response.json();
}
