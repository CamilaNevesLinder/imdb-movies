import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { MyListStore } from '@/stores';
import { useEffect, useState } from 'react';
import { getTitleById, Title } from '@/services';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react-native';
import { ScrollView } from 'react-native';

export default function MovieDetails() {
  const { id } = useLocalSearchParams() as { id: string };
  const [movie, setMovie] = useState<Title | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { addToList, removeFromList, myList } = MyListStore();

  useEffect(() => {
    async function fetchMovie() {
      try {
        setLoading(true);
        const data = await getTitleById(id as string);
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
            <Plus color="white" size={24} />
            <Text className="text-white">
              {' '}
              {isInList ? 'Remover da minha lista' : 'Adicionar à minha lista'}
            </Text>
          </Button>
        </View>
        <Text className="mt-2 text-gray-400">{movie.genres?.join(' • ')}</Text>
        <Text className="mt-2">{movie.plot}</Text>
      </View>
    </ScrollView>
  );
}
