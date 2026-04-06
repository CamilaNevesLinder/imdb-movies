import { ApiResponse, getTitles, Title } from '@/services';
import { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, View } from 'react-native';
import { Text } from 'src/components/ui/text';

export default function HomeScreen() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchTitles() {
      try {
        setLoading(true);
        setError('');
        const response = await getTitles();
        setData(response);
      } catch {
        setError('Títulos não encontrado');
      } finally {
        setLoading(false);
      }
    }

    fetchTitles();
  }, []);

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>{error}</Text>;

  const genres = data
    ? Array.from(new Set(data.titles.flatMap((title) => title.genres || [])))
    : [];

  const featureMovies = data?.titles.slice(0, 5) || [];

  return (
    <FlatList
      data={genres}
      keyExtractor={(genre) => genre}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <FlatList
          data={featureMovies}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View>
              <Image source={{ uri: item.primaryImage?.url }} className="h-[200] w-full" />
              <Text className="text-lg font-bold text-white">{item.originalTitle}</Text>
              <Text className="text-white">{item.genres?.join(', ')}</Text>
            </View>
          )}
        />
      )}
      renderItem={({ item: genre }) => (
        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold">{genre}</Text>

          <FlatList
            data={data?.titles.filter((title) => title.genres?.includes(genre))}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <View className="w-[120px]">
                <Image
                  source={{ uri: item.primaryImage?.url }}
                  className="h-[180] w-[120px] rounded-lg"
                />
                <Text numberOfLines={1}>{item.originalTitle}</Text>
              </View>
            )}
          />
        </View>
      )}
    />
  );
}
