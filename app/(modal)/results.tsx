import { ScrollView, Text, View, Pressable, Image, Share } from "react-native";
import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as MediaLibrary from "expo-media-library";

import { ScreenContainer } from "@/components/screen-container";

interface Enhancement {
  id: string;
  name: string;
  intensity: number;
}

export default function ResultsScreen() {
  const router = useRouter();
  const { originalUri, enhancedUri, enhancements: enhancementsStr } = useLocalSearchParams<{
    originalUri?: string;
    enhancedUri?: string;
    enhancements?: string;
  }>();

  const [sliderPosition, setSliderPosition] = useState(0.5);
  const [isSaving, setIsSaving] = useState(false);

  const enhancements: Enhancement[] = enhancementsStr ? JSON.parse(enhancementsStr) : [];

  const handleSaveToGallery = async () => {
    setIsSaving(true);
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access media library is required!");
        return;
      }

      if (enhancedUri) {
        await MediaLibrary.saveToLibraryAsync(enhancedUri);
        alert("✓ Photo saved to gallery!");
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save photo. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    try {
      if (enhancedUri) {
        await Share.share({
          url: enhancedUri,
          message: "Check out my enhanced photo from AI Photo Enhancer Pro! 📸✨",
          title: "Share Enhanced Photo",
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const handleEditAgain = () => {
    router.back();
  };

  const handleTryAnother = () => {
    router.dismissAll();
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Before/After Slider */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground px-2">Before / After</Text>
            <View className="relative bg-surface rounded-2xl overflow-hidden border border-border h-80">
              {/* Before Image */}
              {originalUri && (
                <Image
                  source={{ uri: originalUri }}
                  style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                />
              )}

              {/* After Image (Overlay) */}
              {enhancedUri && (
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: `${sliderPosition * 100}%`,
                    overflow: "hidden",
                  }}
                >
                  <Image
                    source={{ uri: enhancedUri }}
                    style={{ width: "100%", height: "100%", resizeMode: "contain" }}
                  />
                </View>
              )}

              {/* Slider Handle */}
              <Pressable
                onPress={(e) => {
                  const { locationX } = e.nativeEvent;
                  const width = 300; // approximate width
                  setSliderPosition(Math.max(0, Math.min(1, locationX / width)));
                }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: `${sliderPosition * 100}%`,
                  bottom: 0,
                  width: 4,
                  backgroundColor: "white",
                  transform: [{ translateX: -2 }],
                }}
              >
                <View className="w-full h-full bg-white" />
              </Pressable>

              {/* Labels */}
              <View className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded">
                <Text className="text-white text-xs font-semibold">BEFORE</Text>
              </View>
              <View className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded">
                <Text className="text-white text-xs font-semibold">AFTER</Text>
              </View>
            </View>
          </View>

          {/* Enhancement Details */}
          {enhancements.length > 0 && (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-foreground px-2">Applied Effects</Text>
              <View className="gap-2">
                {enhancements.map((enhancement, index) => (
                  <View
                    key={index}
                    className="bg-primary/10 rounded-lg p-3 border border-primary flex-row justify-between items-center"
                  >
                    <View>
                      <Text className="text-sm font-semibold text-foreground">
                        {enhancement.name}
                      </Text>
                      <Text className="text-xs text-muted">Intensity: {enhancement.intensity}</Text>
                    </View>
                    <Text className="text-lg">✓</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Export Quality Info */}
          <View className="bg-warning/10 border border-warning rounded-lg p-4">
            <Text className="text-sm font-semibold text-foreground mb-1">📊 Export Quality</Text>
            <Text className="text-xs text-muted">
              Standard quality (1080p). Upgrade to Pro for HD exports.
            </Text>
          </View>

          {/* Action Buttons */}
          <View className="gap-3 pt-4">
            {/* Primary: Save */}
            <Pressable
              onPress={handleSaveToGallery}
              disabled={isSaving}
              style={({ pressed }) => ({
                opacity: pressed && !isSaving ? 0.9 : 1,
                transform: [{ scale: pressed && !isSaving ? 0.97 : 1 }],
              })}
            >
              <View className="bg-primary rounded-xl py-4 px-6 items-center">
                <Text className="text-white font-bold text-base">
                  {isSaving ? "Saving..." : "💾 Save to Gallery"}
                </Text>
              </View>
            </Pressable>

            {/* Secondary Actions */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={handleShare}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
                className="flex-1"
              >
                <View className="bg-surface border border-border rounded-xl py-3 px-4 items-center">
                  <Text className="text-foreground font-semibold">📤 Share</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleEditAgain}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
                className="flex-1"
              >
                <View className="bg-surface border border-border rounded-xl py-3 px-4 items-center">
                  <Text className="text-foreground font-semibold">✏️ Edit</Text>
                </View>
              </Pressable>
            </View>

            {/* Try Another */}
            <Pressable
              onPress={handleTryAnother}
              style={({ pressed }) => ({
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View className="bg-surface border border-border rounded-xl py-3 px-4 items-center">
                <Text className="text-foreground font-semibold">➕ Try Another Photo</Text>
              </View>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
