import { Image } from "expo-image";
import { type Asset, getAssetsAsync } from "expo-media-library";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { s } from "@/assets/styles/utility.styles";

export default function MediaLibrary() {
  const [assets, setAssets] = useState<Asset[]>([]);

  const getAlbum = async () => {
    const album = await getAssetsAsync({
      mediaType: "photo",
      sortBy: "creationTime",
    });
    setAssets(album.assets);
  };

  useEffect(() => {
    getAlbum();
  });

  return (
    <ScrollView contentContainerStyle={[s.flexRow, s.flexWrap]}>
      {assets.map((photo) => (
        <Image
          key={photo.id}
          source={photo.uri}
          style={{ width: "25%", height: 100 }}
        />
      ))}
    </ScrollView>
  );
}
