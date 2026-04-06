import { getTitlesByGenre, Title } from '@/services';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, View } from 'react-native';
import { Text } from '@/components/ui/text';

export default function HomeScreen() {
  const [moviesByGenre, setMoviesByGenre] = useState<{
    [key: string]: Title[]; //objeto dinamico
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const genreList = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance'];

  useEffect(() => {
    async function fetchAllGenres() {
      try {
        setLoading(true);
        const result: { [key: string]: Title[] } = {};

        const promises = genreList.map(async (genre) => {
          try {
            const response = await getTitlesByGenre(genre);
            return { genre, titles: response.titles };
          } catch {
            return { genre, titles: [] };
          }
        });

        const responses = await Promise.all(promises);
        responses.forEach(({ genre, titles }) => {
          result[genre] = titles;
        });

        setMoviesByGenre(result);
      } catch {
        setError('Erro ao buscar filmes');
      } finally {
        setLoading(false);
      }
    }

    fetchAllGenres();
  }, []);

  if (loading) return <Text>Carregando...</Text>;
  if (error) return <Text>{error}</Text>;

  const featureMovies = moviesByGenre['Action']?.slice(0, 5) || [];

  return (
    <FlatList
      data={genreList}
      keyExtractor={(genre) => genre}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={() => (
        <FlatList
          data={featureMovies}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={Dimensions.get('window').width}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <View style={{ width: Dimensions.get('window').width }}>
              <Image
                source={{ uri: item.primaryImage?.url }}
                className="h-[500px] w-full"
                resizeMode="contain"
              />
              <View className="px-6 py-4">
                <Text className="text-2xl font-bold text-white mb-2">
                  {item.originalTitle}
                </Text>
                <Text className="text-sm text-gray-300">
                  {item.genres?.join(' • ')}
                </Text>
              </View>
            </View>
          )}
        />
      )}
      renderItem={({ item: genre }) => (
        <View className="mb-4">
          <Text className="mb-2 text-lg font-bold">{genre}</Text>

          <FlatList
            data={moviesByGenre[genre]}
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
