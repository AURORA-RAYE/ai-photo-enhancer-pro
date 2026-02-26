import { ScrollView, Text, View, FlatList, Image, Pressable, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import * as MediaLibrary from "expo-media-library";

import { ScreenContainer } from "@/components/screen-container";

interface Photo {
  id: string;
  uri: string;
  filename: string;
  createdAt: Date;
}

export default function GalleryScreen() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        setIsLoading(false);
        return;
      }

      const albums = await MediaLibrary.getAlbumsAsync();
      const recentAlbum = albums.find((album) => album.title === "Recent");

      if (recentAlbum) {
        const assets = await MediaLibrary.getAssetsAsync({
          album: recentAlbum,
          first: 50,
          mediaType: "photo",
        });

        const formattedPhotos = assets.assets.map((asset) => ({
          id: asset.id,
          uri: asset.uri,
          filename: asset.filename || "Photo",
          createdAt: new Date(asset.creationTime),
        }));

        setPhotos(formattedPhotos);
      }
    } catch (error) {
      console.error("Failed to load photos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    try {
      await MediaLibrary.deleteAssetsAsync([photoId]);
      setPhotos(photos.filter((p) => p.id !== photoId));
    } catch (error) {
      console.error("Failed to delete photo:", error);
      alert("Failed to delete photo");
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer className="items-center justify-center">
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  if (photos.length === 0) {
    return (
      <ScreenContainer className="items-center justify-center p-6">
        <View className="gap-4 items-center">
          <Text className="text-5xl">📸</Text>
          <Text className="text-xl font-bold text-foreground">No Photos Yet</Text>
          <Text className="text-sm text-muted text-center">
            Your enhanced photos will appear here. Start by enhancing a photo from the Home tab.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <View className="gap-4 flex-1">
        <View className="gap-2">
          <Text className="text-2xl font-bold text-foreground">Gallery</Text>
          <Text className="text-sm text-muted">{photos.length} photos</Text>
        </View>

        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ gap: 12 }}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View className="flex-1">
              <Pressable
                onLongPress={() => handleDeletePhoto(item.id)}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View className="bg-surface rounded-lg overflow-hidden border border-border aspect-square">
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: "100%", height: "100%", resizeMode: "cover" }}
                  />
                  <View className="absolute inset-0 bg-black/0 hover:bg-black/20" />
                </View>
              </Pressable>
              <Text className="text-xs text-muted mt-2 truncate">{item.filename}</Text>
            </View>
          )}
        />
      </View>
    </ScreenContainer>
  );
}
