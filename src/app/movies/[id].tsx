import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { MyListStore } from '@/stores';
import { useEffect, useState } from 'react';
import { getSeasons, getTitleById, Title, getEpisodes } from '@/services';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react-native';
import { ScrollView } from 'react-native';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Season = {
  season: string;
  episodeCount: number;
};

type Episode = {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  primaryTitle: string;
  plot?: string;
  runtimeSeconds?: number;
  primaryImage?: {
    url: string;
    width: number;
    height: number;
  };
};
export default function MovieDetails() {
  const { id } = useLocalSearchParams() as { id: string };
  const [movie, setMovie] = useState<Title | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [seasons, setSeasons] = useState<Season[] | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string>('1');
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);

  const { addToList, removeFromList, myList } = MyListStore();

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const data = await getTitleById(id as string);
        const seasonData = await getSeasons(data.id);
        setSeasons(seasonData.seasons);
        setMovie(data);
      } catch {
        setError('Erro ao carregar filme');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchMovie();
    }
  }, [id]);

  useEffect(() => {
    async function fetchEpisodes() {
      if (!movie || !selectedSeason) return;
      
      try {
        setLoadingEpisodes(true);
        const data = await getEpisodes(movie.id, selectedSeason);
        setEpisodes(data.episodes || []);
      } catch {
        setEpisodes([]);
      } finally {
        setLoadingEpisodes(false);
      }
    }

    fetchEpisodes();
  }, [movie, selectedSeason]);

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>{error}</Text>;
  if (!movie) return null;
  const isInList = myList.some((item) => item.id === movie.id);

  return (
    <ScrollView>
      <View className="gap-2 p-4">
        <Image source={{ uri: movie.primaryImage?.url }} className="h-[550px] w-full rounded-lg" />
        <Text className="text-2xl font-bold">{movie.originalTitle || movie.primaryTitle}</Text>
        <View className="ml-4 flex-row gap-2">
          <Text className="font-bold">{movie.startYear}</Text>
          <Text className="font-bold">{movie.rating?.aggregateRating}</Text>
        </View>
        <View className="rounded-sm bg-white/40">
          <Button
            variant="ghost"
            onPress={() => {
              if (isInList) {
                removeFromList(movie.id);
              } else {
                addToList({
                  ...movie,
                  originalTitle: movie.originalTitle || movie.primaryTitle,
                });
              }
            }}>
            {isInList ? <X color="white" size={24} /> : <Plus color="white" size={24} />}
            <Text className="text-white">
              {isInList ? 'Remover da minha lista' : 'Adicionar à minha lista'}
            </Text>
          </Button>
        </View>
        <Text className="mt-2 text-gray-400">{movie.genres?.join(' • ')}</Text>
        <Text className="mt-2">{movie.plot}</Text>
        
        {seasons && seasons.length > 0 && (
          <View className="mt-6 gap-4">
            <Text className="text-xl font-bold">Episódios</Text>
            
            <Select
              value={{ value: selectedSeason, label: `Temporada ${selectedSeason}` }}
              onValueChange={(option) => option && setSelectedSeason(option.value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a temporada" />
              </SelectTrigger>
              <SelectContent className="w-full">
                <SelectGroup>
                  {seasons.map((season) => (
                    <SelectItem
                      key={season.season}
                      label={`Temporada ${season.season}`}
                      value={season.season}>
                      Temporada {season.season}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            {loadingEpisodes ? (
              <Text className="text-center text-gray-400">Carregando episódios...</Text>
            ) : (
              <View className="gap-3">
                {episodes.map((episode) => (
                  <View
                    key={episode.id}
                    className="flex-row gap-3 rounded-lg bg-zinc-800/80 p-3">
                    {episode.primaryImage?.url ? (
                      <Image
                        source={{ uri: episode.primaryImage.url }}
                        className="h-20 w-36 rounded-md"
                        resizeMode="cover"
                      />
                    ) : (
                      <View className="h-20 w-36 rounded-md bg-zinc-700" />
                    )}
                    
                    <View className="flex-1 gap-1">
                      <Text className="text-base font-bold">
                        {episode.episodeNumber}. {episode.primaryTitle}
                      </Text>
                      {episode.runtimeSeconds && (
                        <Text className="text-sm text-gray-400">
                          {Math.floor(episode.runtimeSeconds / 60)} min
                        </Text>
                      )}
                      {episode.plot && (
                        <Text className="text-sm text-gray-300" numberOfLines={2}>
                          {episode.plot}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
