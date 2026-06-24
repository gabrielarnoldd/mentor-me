import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Menu } from 'lucide-react-native';
import MenuDrawer from '../components/MenuDrawer';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
};

export default function ProgressScreen({
  username = '(usuário)',
  videoProgress = { watchedCount: 0, totalVideos: 0, videos: [] },
  onRefreshProgress,
  onLogout,
  onNavigate,
  onHome,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const watchedPercent = videoProgress.totalVideos
    ? Math.round((videoProgress.watchedCount / videoProgress.totalVideos) * 100)
    : 0;

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

      <View style={styles.usernamePill}>
        <Text style={styles.usernameText}>{username}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScrollBeginDrag={onRefreshProgress}
      >
        <View style={styles.videoSummary}>
          <Text style={styles.videoSummaryNumber}>
            {videoProgress.watchedCount}/{videoProgress.totalVideos}
          </Text>
          <Text style={styles.videoSummaryLabel}>videos assistidos</Text>
        </View>

        <Text style={styles.sectionTitle}>
          Seu progresso nos vídeos
        </Text>

        <View style={styles.ringWrapper}>
          <ProgressRing percent={watchedPercent} size={320} stroke={26} />
          <View pointerEvents="none" style={styles.ringCenter}>
            <Text style={styles.ringPercent}>{watchedPercent}%</Text>
            <Text style={styles.ringLabel}>Concluído</Text>
          </View>
        </View>

        {videoProgress.videos?.length ? (
          <View style={styles.videoList}>
            {videoProgress.videos.map((video, index) => (
              <View
                key={video.id}
                style={[styles.videoRow, index < videoProgress.videos.length - 1 && styles.skillRowDivider]}
              >
                <Text style={styles.videoRowTitle}>{video.title}</Text>
                <Text style={styles.videoRowStatus}>{video.watched ? 'Assistido' : 'Nao assistido'}</Text>
              </View>
            ))}
          </View>
        ) : null}
        {!videoProgress.videos?.length && (
          <Text style={styles.emptyText}>Nenhum vídeo encontrado</Text>
        )}
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

function ProgressRing({ percent, size = 200, stroke = 18 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - percent / 100);
  const center = size / 2;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={COLORS.inputBg}
        strokeWidth={stroke}
        fill="none"
      />
      <Circle
        cx={center}
        cy={center}
        r={radius}
        stroke={COLORS.primary}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform={`rotate(-90 ${center} ${center})`}
      />
    </Svg>
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
  usernamePill: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 24,
    paddingRight: 32,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    marginTop: 24,
  },
  usernameText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.white,
    fontSize: 17,
  },
  scroll: {
    flex: 1,
    marginTop: 18,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 60,
    alignSelf: 'center',
    maxWidth: 480,
    width: '100%',
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  videoSummary: {
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  videoSummaryNumber: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 34,
    color: COLORS.primary,
    lineHeight: 38,
  },
  videoSummaryLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.link,
  },
  ringWrapper: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 1,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 36,
    position: 'relative',
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringPercent: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 64,
    color: COLORS.primary,
    lineHeight: 68,
  },
  ringLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 18,
    color: COLORS.link,
    marginTop: 6,
  },
  videoList: {
    borderRadius: 18,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  videoRow: {
    paddingVertical: 14,
    gap: 4,
  },
  videoRowTitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.primary,
    lineHeight: 18,
  },
  videoRowStatus: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: COLORS.link,
  },
  skillRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#9aa5aa',
  },
  emptyText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.primary,
    textAlign: 'center',
  },
});
