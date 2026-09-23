import { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ArrowRight,
  Menu,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
} from 'lucide-react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import MenuDrawer from '../components/MenuDrawer';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
  placeholder: '#BFC3C8',
};

export default function VideoPlayerScreen({
  title = 'Vídeo',
  source,
  isLastVideo = false,
  onLogout,
  onNavigate,
  onHome,
  onFinish,
}) {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const player = useVideoPlayer(source || null, (nextPlayer) => {
    nextPlayer.timeUpdateEventInterval = 0.25;
    if (source) nextPlayer.play();
  });
  const progress = duration > 0 ? Math.max(0, Math.min(100, (currentTime / duration) * 100)) : 0;

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);

    const playingSubscription = player.addListener('playingChange', ({ isPlaying }) => {
      setPlaying(isPlaying);
    });
    const timeSubscription = player.addListener('timeUpdate', ({ currentTime: nextTime }) => {
      setCurrentTime(nextTime);
      setDuration(player.duration || 0);
    });

    return () => {
      playingSubscription.remove();
      timeSubscription.remove();
    };
  }, [player]);

  const togglePlayback = () => {
    if (!source) return;
    if (playing) player.pause();
    else player.play();
  };

  const finishVideo = () => {
    player.pause();
    onFinish?.();
  };

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
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

      <View style={styles.titlePill}>
        <Text style={styles.titleText}>{title}</Text>
      </View>

      <View style={styles.body}>
        <View style={styles.videoArea}>
          {source ? (
            <VideoView
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls={false}
              allowsFullscreen
            />
          ) : (
            <Text style={styles.unavailableText}>Vídeo ainda não disponível.</Text>
          )}
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
          <View style={[styles.progressThumb, { left: `${progress}%` }]} />
        </View>

        <View style={styles.controls}>
          <Pressable
            hitSlop={8}
            style={styles.skipButton}
            onPress={() => player.seekBy(-10)}
            disabled={!source}
          >
            <RotateCcw size={44} color={COLORS.primary} strokeWidth={2.2} />
            <Text style={styles.skipNumber}>10</Text>
          </Pressable>

          <Pressable
            hitSlop={8}
            style={styles.playButton}
            onPress={togglePlayback}
            disabled={!source}
          >
            {playing ? (
              <Pause size={36} color={COLORS.primary} strokeWidth={2.2} fill={COLORS.primary} />
            ) : (
              <Play size={36} color={COLORS.primary} strokeWidth={2.2} fill={COLORS.primary} />
            )}
          </Pressable>

          <Pressable
            hitSlop={8}
            style={styles.skipButton}
            onPress={() => player.seekBy(10)}
            disabled={!source}
          >
            <RotateCw size={44} color={COLORS.primary} strokeWidth={2.2} />
            <Text style={styles.skipNumber}>10</Text>
          </Pressable>
        </View>

        <Pressable style={styles.nextVideo} hitSlop={8} onPress={finishVideo}>
          <Text style={styles.nextVideoText}>
            {isLastVideo ? 'Concluir aula ' : 'Próximo vídeo '}
          </Text>
          <ArrowRight size={18} color={COLORS.primary} strokeWidth={2.5} />
        </Pressable>
      </View>

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
  titlePill: {
    backgroundColor: COLORS.inputBg,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 24,
    paddingRight: 32,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    marginTop: 24,
  },
  titleText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.primary,
    fontSize: 17,
  },
  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 22,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  videoArea: {
    flex: 1,
    backgroundColor: COLORS.placeholder,
    borderRadius: 8,
    minHeight: 280,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  unavailableText: {
    fontFamily: 'Montserrat_600SemiBold',
    color: COLORS.primary,
    fontSize: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginTop: 22,
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
    gap: 28,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextVideo: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingVertical: 4,
  },
  nextVideoText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.primary,
  },
});
