import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, StatusBar, StyleSheet, useWindowDimensions, View } from 'react-native';
import useReducedMotion from './useReducedMotion';
import BrandLogo from './BrandLogo';

export default function StartupAnimation({ ready, onFinish }) {
  const reducedMotion = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const motion = useRef(new Animated.Value(0)).current;
  const exit = useRef(new Animated.Value(0)).current;
  const [entranceFinished, setEntranceFinished] = useState(false);
  const diameter = Math.max(width, height) * 1.6;
  const logoWidth = Math.min(width * 0.82, 480);

  useEffect(() => {
    if (reducedMotion) {
      motion.setValue(1);
      setEntranceFinished(true);
      return;
    }
    const animation = Animated.timing(motion, {
      toValue: 1,
      duration: 2400,
      easing: Easing.linear,
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) setEntranceFinished(true);
    });
    return () => animation.stop();
  }, [motion, reducedMotion]);

  useEffect(() => {
    if (!ready || !entranceFinished) return;
    const animation = Animated.timing(exit, {
      toValue: 1,
      duration: reducedMotion ? 0 : 500,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start(({ finished }) => {
      if (finished) onFinish();
    });
    return () => animation.stop();
  }, [ready, entranceFinished, reducedMotion, exit, onFinish]);

  const interpolate = (inputRange, outputRange) => motion.interpolate({ inputRange, outputRange, extrapolate: 'clamp' });

  return (
    <Modal visible transparent animationType="none" presentationStyle="overFullScreen" statusBarTranslucent navigationBarTranslucent onRequestClose={() => {}}>
      <StatusBar hidden />
      <Animated.View style={[styles.stage, { opacity: exit.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }) }]} accessibilityLabel="Iniciando Mentor Me" accessibilityRole="progressbar">
        {[0, 1, 2].map((index) => (
          <Animated.View key={index} style={[styles.wave, {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
            backgroundColor: ['#02457C', '#028BBF', '#D7E8EF'][index],
            transform: [{ scale: reducedMotion ? 1 : interpolate([index * 0.11, 0.48 + index * 0.13, 1], [0, 1, 1]) }],
          }]} />
        ))}
        <Animated.View style={{
          opacity: reducedMotion ? 1 : interpolate([0, 0.22, 0.4, 1], [0, 0, 1, 1]),
          transform: [
            { translateY: reducedMotion ? 0 : interpolate([0, 0.22, 0.48, 0.62, 1], [70, 70, -8, 0, 0]) },
            { rotate: reducedMotion ? '0deg' : interpolate([0, 0.22, 0.48, 0.65, 1], ['-12deg', '-12deg', '3deg', '0deg', '0deg']) },
            { scale: reducedMotion ? 1 : Animated.multiply(
              interpolate([0, 0.22, 0.48, 0.65, 0.85, 1], [0.45, 0.45, 1.08, 1, 1, 1.04]),
              exit.interpolate({ inputRange: [0, 1], outputRange: [1, 1.65] }),
            ) },
          ],
        }}>
          <BrandLogo width={logoWidth} />
        </Animated.View>
        <Animated.View style={[styles.caption, { opacity: reducedMotion ? 1 : interpolate([0, 0.55, 0.75, 1], [0, 0, 1, 1]) }]}>
          <View style={styles.line} />
          <Animated.Text style={styles.wordmark}>MENTOR ME</Animated.Text>
          <Animated.Text style={styles.tagline}>Sua carreira em foco</Animated.Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  stage: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: '#D7E8EF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wave: { position: 'absolute' },
  caption: { position: 'absolute', bottom: '13%', alignItems: 'center' },
  line: { width: 36, height: 3, borderRadius: 2, backgroundColor: '#028BBF', marginBottom: 20 },
  wordmark: { color: '#02457C', fontSize: 22, fontWeight: '800', letterSpacing: 5 },
  tagline: { color: '#02457C', fontSize: 14, letterSpacing: 1, marginTop: 10 },
});
