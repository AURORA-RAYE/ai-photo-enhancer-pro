# AI Photo Enhancer Pro — Design Document

## Overview
A viral AI-powered photo enhancer that fixes blurry photos, removes backgrounds, and applies artistic filters. Built for iOS/Android with weekly subscription monetization.

---

## Screen List

1. **Home Screen** — Feature grid with quick-access enhancement options
2. **Editor Screen** — Image preview with tool palette and adjustment sliders
3. **Processing Screen** — AI processing animation with progress indicator
4. **Results Screen** — Before/after comparison with save/share options
5. **Subscription Paywall** — Weekly/monthly subscription options
6. **Settings Screen** — App preferences and account management

---

## Primary Content and Functionality

### Home Screen
- **Hero Section**: Large "Enhance Photo" button with icon
- **Feature Grid**: 6 cards showing available tools:
  - AI Upscale (2x, 4x)
  - Background Remover
  - Face Enhancement
  - Color Correction
  - Artistic Filters
  - Batch Processing (future)
- **Recent Edits**: Carousel showing last 3 enhanced photos
- **Subscription Banner**: Subtle CTA for premium features (if free user)
- **Navigation**: Tab bar with Home, Editor, Gallery, Settings

### Editor Screen
- **Image Preview Area**: Large preview of selected/current photo (top 60% of screen)
- **Tool Palette**: Horizontal scrollable list of enhancement tools
- **Adjustment Sliders**: Dynamic sliders for selected tool (intensity, strength, etc.)
- **Action Buttons**:
  - "Enhance" (primary action, triggers processing)
  - "Reset" (undo all changes)
  - "Cancel" (discard and go back)
- **Image Picker Button**: "Choose Photo" to select from library or take new photo

### Processing Screen
- **Animated Progress**: Circular progress indicator with percentage
- **Status Text**: "Enhancing your photo..." with tool name
- **Estimated Time**: "This usually takes 5-10 seconds"
- **Cancel Button**: Allow user to cancel mid-processing

### Results Screen
- **Before/After Slider**: Interactive slider to compare original vs enhanced
- **Enhancement Details**: Show which tools were applied and their settings
- **Action Buttons**:
  - "Save to Gallery" (primary)
  - "Share" (opens share sheet)
  - "Edit Again" (back to editor with same photo)
  - "Try Another" (back to home)
- **Export Options**: HD/Standard quality selector

### Subscription Paywall
- **Hero Image**: Showcase of enhanced photos
- **Feature List**: 
  - Unlimited upscaling
  - Batch processing
  - Priority processing
  - No watermarks
  - Cloud storage (future)
- **Pricing Options**:
  - Weekly: $4.99/week
  - Monthly: $14.99/month
  - Annual: $99.99/year (best value)
- **Buttons**: "Subscribe" (primary), "Continue Free" (secondary)
- **Legal**: Terms, Privacy Policy links

### Settings Screen
- **Account Section**:
  - Subscription status
  - Manage subscription
  - Restore purchases
- **Preferences**:
  - Default export quality
  - Auto-save to gallery toggle
  - Notification preferences
- **About**:
  - App version
  - Rate app
  - Contact support
  - Privacy policy

---

## Key User Flows

### Flow 1: Basic Enhancement
1. User taps "Enhance Photo" on Home
2. System opens image picker
3. User selects photo from library
4. Editor screen loads with photo
5. User taps enhancement tool (e.g., "AI Upscale")
6. Sliders appear for adjustment
7. User adjusts intensity slider
8. User taps "Enhance" button
9. Processing screen shows progress
10. Results screen displays before/after
11. User taps "Save to Gallery"
12. Photo saved, success toast shown
13. User returns to Home

### Flow 2: Subscription Paywall
1. Free user attempts 4th export
2. Paywall modal appears
3. User reviews pricing options
4. User taps "Subscribe"
5. App Store billing sheet opens
6. User completes purchase
7. Subscription activated
8. Paywall closes
9. Photo export completes

### Flow 3: Settings & Preferences
1. User taps Settings tab
2. Settings screen loads
3. User adjusts export quality preference
4. User checks subscription status
5. User taps "Manage Subscription"
6. App opens App Store subscription management
7. User returns to Settings

---

## Color Choices

| Element | Color | Usage |
|---------|-------|-------|
| **Primary** | `#0A7EA4` (Teal) | Buttons, highlights, active states |
| **Background** | `#FFFFFF` (Light) / `#151718` (Dark) | Screen backgrounds |
| **Surface** | `#F5F5F5` (Light) / `#1E2022` (Dark) | Cards, panels |
| **Foreground** | `#11181C` (Light) / `#ECEDEE` (Dark) | Primary text |
| **Muted** | `#687076` (Light) / `#9BA1A6` (Dark) | Secondary text |
| **Success** | `#22C55E` (Green) | Success states, checkmarks |
| **Warning** | `#F59E0B` (Amber) | Warnings, premium badges |
| **Error** | `#EF4444` (Red) | Errors, destructive actions |

**Brand Accent**: Teal (#0A7EA4) — conveys tech, trust, and enhancement

---

## Component Architecture

- **ImagePicker**: Wrapper around expo-image-picker for library/camera selection
- **EnhanceButton**: Primary CTA button with haptic feedback
- **FilterCarousel**: Horizontal scrollable list of enhancement tools
- **BeforeAfterSlider**: Interactive slider comparing two images
- **SubscriptionModal**: Modal presenting pricing and subscription options
- **ProcessingIndicator**: Animated progress circle with status text
- **ToolAdjustmentPanel**: Sliders and controls for selected enhancement tool
- **ResultCard**: Displays enhancement metadata and action buttons
- **SettingsPanel**: Scrollable list of preferences and account options

---

## Navigation Map

```
Home (Tab 1)
├── Editor (modal or push)
│   ├── Image Picker
│   └── Processing → Results
└── Subscription Paywall (modal)

Gallery (Tab 2)
└── Photo Detail → Editor

Settings (Tab 3)
├── Subscription Management
├── Preferences
└── About

Results Screen
├── Save to Gallery
├── Share
└── Edit Again (back to Editor)
```

---

## Data Models

```typescript
// Photo with enhancement metadata
interface Photo {
  id: string;                    // Unique identifier
  uri: string;                   // Original photo URI
  editedUri: string;             // Enhanced photo URI
  enhancements: Enhancement[];   // Applied enhancements
  createdAt: Date;               // When photo was enhanced
  exportedAt?: Date;             // When photo was exported
}

// Individual enhancement applied
interface Enhancement {
  id: string;
  type: 'upscale' | 'background-remover' | 'face-enhance' | 'color-correct' | 'filter';
  intensity: number;             // 0-100
  settings: Record<string, any>; // Tool-specific settings
  appliedAt: Date;
}

// Subscription state
interface SubscriptionState {
  isSubscribed: boolean;
  planType?: 'weekly' | 'monthly' | 'annual';
  expiresAt?: Date;
  freeExportsRemaining: number;
  totalExportsUsed: number;
}

// User preferences
interface UserPreferences {
  defaultExportQuality: 'standard' | 'hd';
  autoSaveToGallery: boolean;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
}
```

---

## Interaction Patterns

### Press Feedback
- **Primary Buttons** (Enhance, Subscribe): Scale 0.97 + light haptic
- **Tool Cards**: Opacity 0.7 on press
- **Sliders**: Smooth drag with haptic pulse on value change
- **Before/After Slider**: Haptic feedback at 25%, 50%, 75% positions

### Loading States
- Processing screen: Animated circular progress (0-100%)
- Tool application: Skeleton loading on image preview
- Subscription check: Loading spinner in paywall

### Empty States
- No recent edits: "Start by enhancing your first photo"
- No gallery: "Your saved photos will appear here"

---

## Accessibility Considerations

- All buttons have minimum 44pt touch target
- Color is not the only indicator (use icons + text)
- Text contrast meets WCAG AA standards
- VoiceOver labels for all interactive elements
- Slider values announced as percentage
- Processing progress announced periodically

---

## Performance Notes

- Image preview: Downsampled to screen resolution (avoid memory issues)
- Before/after slider: Use image caching to prevent reloading
- Processing: Offload to backend API (don't block UI)
- Gallery: Lazy-load thumbnails with FlatList
- Subscription check: Cache result for 24 hours

---

## Monetization Integration Points

1. **Paywall Trigger**: After 3 free exports
2. **Paywall Presentation**: Modal with pricing tiers
3. **Purchase Flow**: Use Stripe or App Store IAP
4. **Subscription Check**: On app launch and before export
5. **Watermark**: Add to free exports only
6. **Feature Gating**: Some tools (batch processing) premium-only

