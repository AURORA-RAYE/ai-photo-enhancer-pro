import { ScrollView, Text, View, Pressable, Image, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ImageManipulator from "expo-image-manipulator";

import { ScreenContainer } from "@/components/screen-container";

interface Enhancement {
  id: string;
  name: string;
  intensity: number;
}

const ENHANCEMENT_TYPES = [
  { id: "upscale", name: "Upscale", min: 1, max: 4, step: 1 },
  { id: "brightness", name: "Brightness", min: -50, max: 50, step: 1 },
  { id: "contrast", name: "Contrast", min: -50, max: 50, step: 1 },
  { id: "saturation", name: "Saturation", min: -50, max: 50, step: 1 },
];

export default function EditorScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri?: string }>();
  const [currentImage, setCurrentImage] = useState<string | null>(imageUri || null);
  const [selectedTool, setSelectedTool] = useState<string>("upscale");
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (!currentImage) {
      router.back();
    }
  }, [currentImage, router]);

  const handleReset = () => {
    setEnhancements([]);
    setCurrentImage(imageUri || null);
    setSliderValue(0);
  };

  const handleEnhance = async () => {
    if (!currentImage) return;

    setIsProcessing(true);
    try {
      // Simulate AI processing with a delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real app, this would call your backend API
      // For now, we'll just apply basic image manipulation
      const result = await ImageManipulator.manipulateAsync(
        currentImage,
        [{ resize: { width: 800 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      setCurrentImage(result.uri);
      setEnhancements([
        ...enhancements,
        {
          id: selectedTool,
          name: ENHANCEMENT_TYPES.find((t) => t.id === selectedTool)?.name || selectedTool,
          intensity: sliderValue,
        },
      ]);

      // Navigate to results screen
      router.push({
        pathname: "../results",
        params: {
          originalUri: imageUri,
          enhancedUri: result.uri,
          enhancements: JSON.stringify(enhancements),
        },
      }) as any;
    } catch (error) {
      console.error("Enhancement failed:", error);
      alert("Enhancement failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!currentImage) {
    return (
      <ScreenContainer className="items-center justify-center">
        <Text className="text-foreground">Loading image...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-4 pb-8">
          {/* Image Preview */}
          <View className="bg-surface rounded-2xl overflow-hidden border border-border">
            <Image
              source={{ uri: currentImage }}
              style={{ width: "100%", height: 300, resizeMode: "contain" }}
            />
          </View>

          {/* Tool Selector */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground px-2">Enhancement Tool</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {ENHANCEMENT_TYPES.map((tool) => (
                <Pressable
                  key={tool.id}
                  onPress={() => {
                    setSelectedTool(tool.id);
                    setSliderValue(0);
                  }}
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                >
                  <View
                    className={`px-4 py-2 rounded-full border ${
                      selectedTool === tool.id
                        ? "bg-primary border-primary"
                        : "bg-surface border-border"
                    }`}
                  >
                    <Text
                      className={`font-medium ${
                        selectedTool === tool.id ? "text-white" : "text-foreground"
                      }`}
                    >
                      {tool.name}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Adjustment Slider */}
          {selectedTool && (
            <View className="gap-3 bg-surface rounded-xl p-4 border border-border">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm font-semibold text-foreground">
                  {ENHANCEMENT_TYPES.find((t) => t.id === selectedTool)?.name} Intensity
                </Text>
                <Text className="text-sm font-bold text-primary">{sliderValue}</Text>
              </View>
              <View className="h-2 bg-border rounded-full overflow-hidden">
                <View
                  className="h-full bg-primary"
                  style={{
                    width: `${
                      ((sliderValue -
                        (ENHANCEMENT_TYPES.find((t) => t.id === selectedTool)?.min || 0)) /
                        ((ENHANCEMENT_TYPES.find((t) => t.id === selectedTool)?.max || 100) -
                          (ENHANCEMENT_TYPES.find((t) => t.id === selectedTool)?.min || 0))) *
                      100
                    }%`,
                  }}
                />
              </View>
              <View className="flex-row justify-between text-xs text-muted">
                <Text>
                  {ENHANCEMENT_TYPES.find((t) => t.id === selectedTool)?.min || 0}
                </Text>
                <Text>
                  {ENHANCEMENT_TYPES.find((t) => t.id === selectedTool)?.max || 100}
                </Text>
              </View>
            </View>
          )}

          {/* Applied Enhancements */}
          {enhancements.length > 0 && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-foreground px-2\">Applied Effects</Text>
              <View className="gap-2">
                {enhancements.map((enhancement, index) => (
                  <View key={index} className="bg-success/10 rounded-lg p-3 border border-success">
                    <Text className="text-sm font-medium text-foreground">
                      ✓ {enhancement.name}
                    </Text>
                    <Text className="text-xs text-muted">Intensity: {enhancement.intensity}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="gap-3 pt-4">
            <Pressable
              onPress={handleEnhance}
              disabled={isProcessing}
              style={({ pressed }) => ({
                opacity: pressed && !isProcessing ? 0.9 : 1,
                transform: [{ scale: pressed && !isProcessing ? 0.97 : 1 }],
              })}
            >
              <View className="bg-primary rounded-xl py-4 px-6 items-center flex-row justify-center gap-2">
                {isProcessing && <ActivityIndicator color="white" />}
                <Text className="text-white font-bold text-base">
                  {isProcessing ? "Processing..." : "✨ Enhance Photo"}
                </Text>
              </View>
            </Pressable>

            <View className="flex-row gap-3">
              <Pressable
                onPress={handleReset}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
                className="flex-1"
              >
                <View className="bg-surface border border-border rounded-xl py-3 px-4 items-center">
                  <Text className="text-foreground font-semibold">Reset</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
                className="flex-1"
              >
                <View className="bg-surface border border-border rounded-xl py-3 px-4 items-center">
                  <Text className="text-foreground font-semibold">Cancel</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
