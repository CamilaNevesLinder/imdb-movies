import { ApiResponse, getTitles } from '@/services';
import { useEffect, useState } from 'react';
import { FlatList, Image, View } from 'react-native';
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

  return (
    <View>
      <FlatList
        data={data?.titles}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={{ marginRight: 12 }}>
            <Image
              source={{ uri: item.primaryImage?.url }}
              style={{ width: 120, height: 180, borderRadius: 8 }}
            />
            <Text>{item.originalTitle}</Text>
          </View>
        )}
      />
    </View>
  );
}
