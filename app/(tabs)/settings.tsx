import { ScrollView, Text, View, Pressable, Switch, Linking } from "react-native";
import { useState } from "react";

import { ScreenContainer } from "@/components/screen-container";

interface SettingsState {
  exportQuality: "standard" | "hd";
  autoSaveToGallery: boolean;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState<SettingsState>({
    exportQuality: "standard",
    autoSaveToGallery: true,
    notificationsEnabled: true,
    darkModeEnabled: false,
  });

  const [isSubscribed] = useState(false);

  const handleToggle = (key: keyof SettingsState) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }));
  };

  const handleExportQualityChange = () => {
    setSettings((prev) => ({
      ...prev,
      exportQuality: prev.exportQuality === "standard" ? "hd" : "standard",
    }));
  };

  const handleOpenURL = (url: string) => {
    Linking.openURL(url).catch(() => {
      alert("Unable to open URL");
    });
  };

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-2xl font-bold text-foreground">Settings</Text>
            <Text className="text-sm text-muted">Manage your preferences</Text>
          </View>

          {/* Account Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground px-2">Account</Text>
            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              <View className="p-4 border-b border-border flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold text-foreground">Subscription Status</Text>
                  <Text className="text-xs text-muted mt-1">
                    {isSubscribed ? "Pro Member" : "Free Plan"}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    isSubscribed ? "bg-success" : "bg-muted"
                  }`}
                >
                  <Text className="text-xs font-bold text-white">
                    {isSubscribed ? "ACTIVE" : "FREE"}
                  </Text>
                </View>
              </View>
              {!isSubscribed && (
                <Pressable
                  style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                  })}
                  onPress={() => {}}
                >
                  <View className="p-4 flex-row justify-between items-center">
                    <Text className="font-semibold text-primary">Upgrade to Pro</Text>
                    <Text className="text-primary">→</Text>
                  </View>
                </Pressable>
              )}
            </View>
          </View>

          {/* Export Settings */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground px-2">Export</Text>
            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              <Pressable
                onPress={handleExportQualityChange}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View className="p-4 border-b border-border flex-row justify-between items-center">
                  <View>
                    <Text className="font-semibold text-foreground">Default Quality</Text>
                    <Text className="text-xs text-muted mt-1">
                      {settings.exportQuality === "standard" ? "1080p" : "4K"}
                    </Text>
                  </View>
                  <Text className="text-foreground font-semibold">
                    {settings.exportQuality === "standard" ? "Standard" : "HD"}
                  </Text>
                </View>
              </Pressable>
              <View className="p-4 flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold text-foreground">Auto-save to Gallery</Text>
                  <Text className="text-xs text-muted mt-1">Save enhanced photos automatically</Text>
                </View>
                <Switch
                  value={settings.autoSaveToGallery}
                  onValueChange={() => handleToggle("autoSaveToGallery")}
                />
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground px-2">Notifications</Text>
            <View className="bg-surface rounded-xl border border-border p-4">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold text-foreground">Enable Notifications</Text>
                  <Text className="text-xs text-muted mt-1">Get updates and tips</Text>
                </View>
                <Switch
                  value={settings.notificationsEnabled}
                  onValueChange={() => handleToggle("notificationsEnabled")}
                />
              </View>
            </View>
          </View>

          {/* About Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground px-2">About</Text>
            <View className="bg-surface rounded-xl border border-border overflow-hidden">
              <View className="p-4 border-b border-border">
                <Text className="font-semibold text-foreground">App Version</Text>
                <Text className="text-sm text-muted mt-1">1.0.0</Text>
              </View>
              <Pressable
                onPress={() => handleOpenURL("https://appstoreurl.com/rate")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View className="p-4 border-b border-border flex-row justify-between items-center">
                  <Text className="font-semibold text-foreground">⭐ Rate App</Text>
                  <Text className="text-muted">→</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => handleOpenURL("mailto:support@example.com")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View className="p-4 border-b border-border flex-row justify-between items-center">
                  <Text className="font-semibold text-foreground">💬 Contact Support</Text>
                  <Text className="text-muted">→</Text>
                </View>
              </Pressable>
              <Pressable
                onPress={() => handleOpenURL("https://example.com/privacy")}
                style={({ pressed }) => ({
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <View className="p-4 flex-row justify-between items-center">
                  <Text className="font-semibold text-foreground">Privacy Policy</Text>
                  <Text className="text-muted">→</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
