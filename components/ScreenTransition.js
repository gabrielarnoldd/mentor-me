import { useLayoutEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import useReducedMotion from './useReducedMotion';

export default function ScreenTransition({ children, screenKey }) {
  const reducedMotion = useReducedMotion();
  const progress = useRef(new Animated.Value(1)).current;
  const committedChildren = useRef(children);
  const [scene, setScene] = useState({ key: screenKey, previous: null });

  // Retain the mounted outgoing page behind the incoming page during the fade.
  if (scene.key !== screenKey) {
    setScene({
      key: screenKey,
      previous: { key: scene.key, children: committedChildren.current },
    });
  }

  useLayoutEffect(() => {
    committedChildren.current = children;
  });

  useLayoutEffect(() => {
    if (!scene.previous || reducedMotion) {
      progress.setValue(1);
      if (scene.previous) setScene((current) => ({ ...current, previous: null }));
      return;
    }
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 180,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) {
        setScene((current) => current.key === screenKey ? { ...current, previous: null } : current);
      }
    });
    return () => animation.stop();
  }, [scene.key, Boolean(scene.previous), progress, reducedMotion, screenKey]);

  return (
    <View style={styles.screen}>
      {scene.previous && (
        <Animated.View
          key={scene.previous.key}
          style={StyleSheet.absoluteFill}
          pointerEvents="none"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          {scene.previous.children}
        </Animated.View>
      )}
      <Animated.View key={screenKey} style={[styles.page, { opacity: progress }]}>
        {children}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#D7E8EF' },
  page: { flex: 1, backgroundColor: '#D7E8EF' },
});
