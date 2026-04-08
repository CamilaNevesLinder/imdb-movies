import { View, FlatList, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { appStore } from '@/stores';

export default function MyListScreen() {
  const { myList } = appStore();

  if (myList.length === 0) {
    return <Text>Sua lista está vazia</Text>;
  }

  return (
    <FlatList
      data={myList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="p-4">
          <Image source={{ uri: item.primaryImage?.url }} className="h-[200] w-full rounded-lg" />

          <Text className="mt-2 text-lg font-bold">{item.originalTitle}</Text>
        </View>
      )}
    />
  );
}
