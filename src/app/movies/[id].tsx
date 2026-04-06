import { View, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { useLocalSearchParams } from 'expo-router';
import { appStore } from '@/stores';
import { useEffect, useState } from 'react';
import { getTitleById, Title } from '@/services';

export default function MovieDetails() {
  const { id } = useLocalSearchParams() as { id: string };
  const [movie, setMovie] = useState<Title | null>(null);
  const { loading, error, setLoading, setError } = appStore();

  console.log('Movie ID:', id);

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

  return (
    <View className="p-4">
      <Image source={{ uri: movie.primaryImage?.url }} className="h-[300px] w-full rounded-lg" />

      <Text className="mt-4 text-2xl font-bold">{movie.originalTitle}</Text>

      <Text className="mt-2 text-gray-400">{movie.genres?.join(' • ')}</Text>

      <Text className="mt-4">{movie.plot}</Text>
    </View>
  );
}
