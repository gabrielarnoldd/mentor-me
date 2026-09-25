import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function useNativeLayout() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const availableWidth = width - insets.left - insets.right;
  const profileCardSize = Math.min(130, Math.max(0, Math.min(480, availableWidth) - 44) * 0.3);
  return {
    bottomInset: insets.bottom,
    // Count the safe area within the 100-point header instead of adding a
    // second full header underneath it. Keep the 56-point logo unobstructed.
    headerStyle: { height: Math.max(56, 100 - insets.top), paddingTop: 0 },
    // Resolve percentage/maxWidth combinations explicitly for native Yoga.
    homeCardStyle: { width: Math.min(340, availableWidth), flexShrink: 0 },
    quizCardStyle: { width: Math.min(340, Math.max(0, Math.min(480, availableWidth) - 56)), flexShrink: 0 },
    // Explicit height avoids collapsing percentage-sized cards inside the
    // profile's wrapping row in a native ScrollView.
    profileCardStyle: { width: profileCardSize, height: profileCardSize, flexShrink: 0 },
    // The frame handles the top inset; bottom spacing belongs to the content.
    scrollProps: { contentInsetAdjustmentBehavior: 'never', automaticallyAdjustContentInsets: false },
  };
}
