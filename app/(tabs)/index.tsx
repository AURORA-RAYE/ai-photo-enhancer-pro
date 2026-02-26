import { ScrollView, Text, View, TouchableOpacity, Pressable } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

import { ScreenContainer } from "@/components/screen-container";

interface EnhancementTool {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const ENHANCEMENT_TOOLS: EnhancementTool[] = [
  {
    id: "upscale",
    name: "AI Upscale",
    description: "2x, 4x resolution",
    icon: "📈",
  },
  {
    id: "background",
    name: "Remove Background",
    description: "Clean extraction",
    icon: "🎨",
  },
  {
    id: "face",
    name: "Face Enhancement",
    description: "Smooth & bright",
    icon: "✨",
  },
  {
    id: "color",
    name: "Color Correction",
    description: "Vibrant colors",
    icon: "🎭",
  },
  {
    id: "filter",
    name: "Artistic Filters",
    description: "Creative styles",
    icon: "🖼️",
  },
  {
    id: "batch",
    name: "Batch Processing",
    description: "Multiple photos",
    icon: "📦",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [recentPhotos] = useState<string[]>([]);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      // Navigate to editor with selected image
      router.push({
        pathname: "/editor",
        params: { imageUri: result.assets[0].uri },
      });
    }
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Hero Section */}
          <View className="items-center gap-3 py-4">
            <Text className="text-5xl font-bold text-foreground">Enhance</Text>
            <Text className="text-base text-muted text-center max-w-xs">
              Transform your photos with AI-powered tools
            </Text>
          </View>

          {/* Main CTA Button */}
          <Pressable
            onPress={handlePickImage}
            style={({ pressed }) => ({
              opacity: pressed ? 0.9 : 1,
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <View className="bg-primary rounded-2xl py-4 px-6 items-center">
              <Text className="text-white text-lg font-bold">📸 Choose Photo</Text>
            </View>
          </Pressable>

          {/* Feature Grid */}
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground px-2">Available Tools</Text>
            <View className="flex-row flex-wrap gap-3 justify-between">
              {ENHANCEMENT_TOOLS.map((tool) => (
                <Pressable
                  key={tool.id}
                  onPress={handlePickImage}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                  className="flex-1 min-w-[48%]"
                >
                  <View className="bg-surface rounded-xl p-4 border border-border items-center">
                    <Text className="text-3xl mb-2">{tool.icon}</Text>
                    <Text className="text-sm font-semibold text-foreground text-center">
                      {tool.name}
                    </Text>
                    <Text className="text-xs text-muted text-center mt-1">
                      {tool.description}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Recent Edits Section */}
          {recentPhotos.length > 0 && (
            <View className="gap-3">
              <Text className="text-lg font-semibold text-foreground px-2">Recent Edits</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="gap-3"
              >
                {recentPhotos.map((photo, index) => (
                  <View
                    key={index}
                    className="w-24 h-24 bg-surface rounded-lg border border-border"
                  />
                ))}
              </ScrollView>
            </View>
          )}

          {/* Premium Banner */}
          <View className="bg-warning/10 border border-warning rounded-xl p-4">
            <Text className="text-sm font-semibold text-foreground mb-1">⭐ Upgrade to Pro</Text>
            <Text className="text-xs text-muted mb-3">
              Unlimited exports, no watermarks, batch processing
            </Text>
            <Pressable
              style={({ pressed }) => ({
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Text className="text-sm font-bold text-warning">View Plans →</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
