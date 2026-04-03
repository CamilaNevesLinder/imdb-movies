import { Title } from '@/services/movie-service';
import { Image } from 'react-native';

type MovieHeroProps = {
  movie: Title;
};

export function MovieHero({ movie }: MovieHeroProps) {
  return <Image source={{ uri: movie.primaryImage?.url }} />;
}
