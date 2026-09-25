import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  ArrowRight,
  ArrowLeft,
  Menu,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
} from 'lucide-react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import MenuDrawer from '../components/MenuDrawer';
import useNativeLayout from '../components/useNativeLayout';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
};

export default function VideoPlayerScreen({
  title = 'Vídeo',
  partTitle,
  source,
  partNumber = 1,
  partCount = 1,
  initialDuration = 0,
  onPrevious,
  isLastVideo = false,
  onLogout,
  onNavigate,
  onHome,
  onFinish,
}) {
  const nativeLayout = useNativeLayout();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(initialDuration);
  const { width, height } = useWindowDimensions();
  const [videoAreaWidth, setVideoAreaWidth] = useState(null);
  const videoAreaHeight = Math.max(260, Math.min(440, height - 430));
  // All current lesson files are 576 x 1024. Clip the image bounds,
  // rather than the wider area containing the portrait video.
  const videoWidth = Math.min(videoAreaWidth ?? Math.min(width, 480) - 44, videoAreaHeight * 9 / 16);
  const [menuOpen, setMenuOpen] = useState(false);
  const player = useVideoPlayer(source || null, (nextPlayer) => {
    nextPlayer.timeUpdateEventInterval = 0.25;
  });
  const progress = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;

  useEffect(() => {
    setPlaying(player.playing);
    setCurrentTime(0);
    setDuration(player.duration || initialDuration);

    const playingSubscription = player.addListener('playingChange', ({ isPlaying }) => {
      setPlaying(isPlaying);
    });
    const timeSubscription = player.addListener('timeUpdate', ({ currentTime: nextTime }) => {
      setCurrentTime(nextTime);
      setDuration(player.duration || initialDuration);
    });

    const sourceSubscription = player.addListener('sourceLoad', ({ duration: sourceDuration }) => {
      setDuration(sourceDuration || 0);
      player.currentTime = Math.min(0.01, sourceDuration || 0);
      player.pause();
    });

    return () => {
      playingSubscription.remove();
      timeSubscription.remove();
      sourceSubscription.remove();
    };
  }, [player, initialDuration]);

  const togglePlayback = () => {
    if (!source) return;
    if (player.playing) player.pause();
    else player.play();
  };

  const finishVideo = () => {
    player.pause();
    onFinish?.();
  };

  const previousVideo = () => {
    player.pause();
    onPrevious?.();
  };

  return (
    <View style={styles.flex}>
      <View style={[styles.header, nativeLayout.headerStyle]}>
        <Pressable onPress={onHome} hitSlop={8}>
          <Image
            source={require('../assets/logo-sistema.png')}
            style={styles.headerLogo}
            resizeMode="contain"
          />
        </Pressable>
        <Pressable
          onPress={() => setMenuOpen(true)}
          hitSlop={12}
          style={styles.menuButton}
        >
          <Menu size={32} color={COLORS.inputBg} />
        </Pressable>
      </View>

      <ScrollView {...nativeLayout.scrollProps} style={styles.scroll} contentContainerStyle={[styles.body, { paddingBottom: 22 + nativeLayout.bottomInset }]}>
        <View style={styles.titleSection}>
          <Text style={styles.titleText} accessibilityRole="header">{title}</Text>
          <View style={styles.partRow}>
          {partTitle ? (
            <View style={styles.partBadge}>
              <Text style={styles.partText}>{partTitle}</Text>
            </View>
          ) : null}
          {partCount > 1 ? <Text style={styles.partCount}>{partNumber} de {partCount} vídeos</Text> : null}
          </View>
        </View>
        <View style={[styles.videoArea, { height: videoAreaHeight }]} onLayout={({ nativeEvent }) => setVideoAreaWidth(nativeEvent.layout.width)}>
          {source ? (
            <View style={[styles.videoFrame, { width: videoWidth, height: videoWidth * 16 / 9 }]}>
            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls={false}
              allowsFullscreen
            />
            </View>
          ) : (
            <Text style={styles.unavailableText}>Vídeo ainda não disponível.</Text>
          )}
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
          <View style={[styles.progressThumb, { left: `${progress}%` }]} />
        </View>
        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controls}>
          <Pressable
            hitSlop={8}
            style={styles.skipButton}
            onPress={() => player.seekBy(-10)}
            accessibilityRole="button"
            accessibilityLabel="Voltar 10 segundos"
            disabled={!source}
          >
            <RotateCcw size={36} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.skipNumber}>10</Text>
          </Pressable>

          <Pressable
            hitSlop={8}
            style={styles.playButton}
            onPress={togglePlayback}
            accessibilityRole="button"
            accessibilityLabel={playing ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            disabled={!source}
          >
            {playing ? (
              <Pause size={28} color={COLORS.white} strokeWidth={2} fill={COLORS.white} />
            ) : (
              <Play size={28} color={COLORS.white} strokeWidth={2} fill={COLORS.white} />
            )}
          </Pressable>

          <Pressable
            hitSlop={8}
            style={styles.skipButton}
            onPress={() => player.seekBy(10)}
            accessibilityRole="button"
            accessibilityLabel="Avançar 10 segundos"
            disabled={!source}
          >
            <RotateCw size={36} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.skipNumber}>10</Text>
          </Pressable>
        </View>

        <View style={styles.navigation}>
          {onPrevious ? (
            <Pressable style={({ pressed }) => [styles.previousVideo, pressed && styles.pressed]} onPress={previousVideo} accessibilityRole="button">
              <ArrowLeft size={16} color={COLORS.primary} strokeWidth={2} />
              <Text style={styles.previousVideoText}>Vídeo anterior</Text>
            </Pressable>
          ) : null}
        <Pressable style={({ pressed }) => [styles.nextVideo, pressed && styles.pressed]} onPress={finishVideo} accessibilityRole="button">
          <Text style={styles.nextVideoText}>
            {isLastVideo ? 'Concluir aula ' : 'Próximo vídeo '}
          </Text>
          <ArrowRight size={16} color={COLORS.white} strokeWidth={2} />
        </Pressable>
        </View>
      </ScrollView>

      <MenuDrawer
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onNavigate={onNavigate}
        onLogout={() => {
          setMenuOpen(false);
          onLogout?.();
        }}
      />
    </View>
  );
}

function formatTime(value) {
  const seconds = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    height: 100,
    paddingTop: 28,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLogo: {
    width: 56,
    height: 56,
  },
  menuButton: {
    padding: 4,
  },
  titleSection: {
    marginBottom: 16,
    gap: 10,
  },
  titleText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.primary,
    fontSize: 20,
    lineHeight: 28,
  },
  partBadge: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    backgroundColor: 'rgba(2, 69, 124, 0.07)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  partText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: COLORS.primary,
    fontSize: 12,
    lineHeight: 18,
  },
  scroll: {
    flex: 1,
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 22,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  videoArea: {
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  videoFrame: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  unavailableText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: COLORS.primary,
    fontSize: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(2, 69, 124, 0.15)',
    borderRadius: 2,
    marginTop: 20,
    marginHorizontal: 4,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: COLORS.primary,
    marginLeft: -7,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    marginTop: 4,
  },
  skipButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  skipNumber: {
    position: 'absolute',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 10,
    color: COLORS.primary,
    top: 22,
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextVideo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
  },
  nextVideoText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 12,
    color: COLORS.white,
    flexShrink: 1,
    textAlign: 'center',
  },
  partRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  partCount: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.primary,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: COLORS.primary,
  },
  navigation: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(2, 69, 124, 0.12)',
  },
  previousVideo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(2, 69, 124, 0.2)',
  },
  previousVideoText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.primary,
    flexShrink: 1,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
  },
});
