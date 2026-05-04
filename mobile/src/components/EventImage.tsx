import React from 'react';
import { Image, ImageProps } from 'expo-image';

// Blurhash neutre (gris bleuté) utilisé comme placeholder en attendant le téléchargement.
// Évite l'effet "boîte vide" et donne une sensation de fluidité.
const DEFAULT_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

type Props = Omit<ImageProps, 'source'> & {
  source: ImageProps['source'];
  /** Couleur ou blurhash de placeholder */
  placeholder?: ImageProps['placeholder'];
};

/**
 * Wrapper expo-image avec cache mémoire+disque, transition courte et placeholder.
 * Pour une URL, expo-image télécharge une seule fois ; chaque navigation suivante
 * affiche l'image instantanément depuis le cache disque (gain énorme à 10K users).
 */
const EventImage: React.FC<Props> = ({
  source,
  placeholder = DEFAULT_BLURHASH,
  contentFit = 'cover',
  transition = 180,
  cachePolicy = 'memory-disk',
  ...rest
}) => {
  return (
    <Image
      source={source}
      placeholder={placeholder}
      contentFit={contentFit}
      transition={transition}
      cachePolicy={cachePolicy}
      {...rest}
    />
  );
};

export default React.memo(EventImage);
