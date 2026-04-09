import { View, FlatList, Image, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { MyListStore } from '@/stores';
import { X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';

export default function MyListScreen() {
  const { myList, removeFromList } = MyListStore();

  if (myList.length === 0) {
    return <Text className="text-center">Sua lista está vazia ...</Text>;
  }

  return (
    <FlatList
      data={myList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="p-4">
          <Pressable
            onPress={() => {
              router.push({
                pathname: '/movies/[id]',
                params: { id: item.id },
              });
            }}>
            <Image source={{ uri: item.primaryImage?.url }} className="h-[500] w-full rounded-lg" />
          </Pressable>
          <View className="mt-2 flex-row justify-between">
            <Text className="mt-2 text-lg font-bold">{item.originalTitle}</Text>

            <Button
              variant="ghost"
              onPress={() => {
                removeFromList(item.id);
              }}>
              <X color="white" size={24} className="transition-all hover:scale-105" />
            </Button>
          </View>
        </View>
      )}
    />
  );
}
