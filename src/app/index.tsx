import { getTitlesByGenre, Title } from '@/services';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { router } from 'expo-router';
import { MyListStore } from '@/stores';
import { Plus, BookmarkCheck } from 'lucide-react-native';
import { Button } from '@/components/ui/button';

export default function HomeScreen() {
  const [moviesByGenre, setMoviesByGenre] = useState<{
    [key: string]: Title[];
  }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { addToList } = MyListStore();

  const genreList = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance'];

  useEffect(() => {
    async function fetchAllGenres() {
      try {
        setLoading(true);
        const moviesGroupByGenre: { [key: string]: Title[] } = {};
        const genresRequest = genreList.map(async (genre) => {
          try {
            const response = await getTitlesByGenre(genre);
            return { genre, titles: response.titles };
          } catch {
            return { genre, titles: [] };
          }
        });

        const responses = await Promise.all(genresRequest);
        responses.forEach(({ genre, titles }) => {
          moviesGroupByGenre[genre] = titles;
        });

        setMoviesByGenre(moviesGroupByGenre);
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
    <View className="flex-1">
      <View className="flex-row items-center justify-between bg-black px-6 py-4">
        <Text className="text-2xl font-bold text-white">Movies</Text>
        <Pressable onPress={() => router.push('/movies/my-list')}>
          <BookmarkCheck color="white" size={28} />
        </Pressable>
      </View>

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
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: '/movies/[id]',
                    params: {
                      id: item.id,
                      movie: JSON.stringify(item),
                    },
                  })
                }
                style={{ width: Dimensions.get('window').width }}>
                <Image
                  source={{ uri: item.primaryImage?.url }}
                  className="h-[500px] w-full"
                  resizeMode="contain"
                />
                <View className="px-6 py-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="flex-1 text-2xl font-bold text-white">
                      {item.originalTitle}
                    </Text>
                    <Button
                      variant="ghost"
                      onPress={() => addToList(item)}
                      className="transition-transform active:scale-90">
                      <Plus color="white" size={24} />
                    </Button>
                  </View>
                  <Text className="text-sm text-gray-300">{item.genres?.join(' • ')}</Text>
                </View>
              </Pressable>
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
                <Pressable
                  onPress={() =>
                    router.push({
                      pathname: '/movies/[id]',
                      params: {
                        id: item.id,
                      },
                    })
                  }
                  className="w-[120px]">
                  <Image
                    source={{ uri: item.primaryImage?.url }}
                    className="h-[180] w-[120px] rounded-lg"
                  />
                  <Text numberOfLines={1}>{item.originalTitle}</Text>
                </Pressable>
              )}
            />
          </View>
        )}
      />
    </View>
  );
}
