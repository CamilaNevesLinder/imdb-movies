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
