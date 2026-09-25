import { useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronDown, Menu, Play, Clock, Calendar } from 'lucide-react-native';
import MenuDrawer from '../components/MenuDrawer';
import useNativeLayout from '../components/useNativeLayout';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
  cardImage: '#BFC3C8',
};

const VIDEO_IMAGES = {
  curriculo: require('../assets/fotoCurso1.jpg'),
  conexoes: require('../assets/fotoCurso2.jpg'),
  'imagem-profissional': require('../assets/fotoCurso4.jpg'),
};

function formatDuration(seconds = 0) {
  const safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = String(safeSeconds % 60).padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function HomeScreen({
  username = '(usuário)',
  videos = [],
  onLogout,
  onNavigate,
  onPlayVideo,
}) {
  const nativeLayout = useNativeLayout();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const INITIAL_VISIBLE = 2;
  const visibleVideos = showAll ? videos : videos.slice(0, INITIAL_VISIBLE);

  return (
    <View style={styles.flex}>
      <View style={[styles.header, nativeLayout.headerStyle]}>
        <Image
          source={require('../assets/logo-sistema.png')}
          style={styles.headerLogo}
          resizeMode="contain"
        />
        <Pressable
          onPress={() => setMenuOpen(true)}
          hitSlop={12}
          style={styles.menuButton}
        >
          <Menu size={32} color={COLORS.inputBg} />
        </Pressable>
      </View>

      <ScrollView {...nativeLayout.scrollProps}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomePill}>
          <Text style={styles.welcomeText}>Bem-vindo, {username}</Text>
        </View>
        {visibleVideos.map((video) => (
          <Card
            nativeCardStyle={nativeLayout.homeCardStyle}
            key={video.id}
            title={video.title}
            duration={formatDuration(video.duration_seconds)}
            videoCount={video.video_count}
            date={formatDate(video.created_at)}
            image={VIDEO_IMAGES[video.id]}
            onPress={() => onPlayVideo?.(video)}
          />
        ))}
        {!videos.length && (
          <Text style={styles.emptyText}>Nenhum vídeo disponível</Text>
        )}

        {videos.length > INITIAL_VISIBLE && (
          <Pressable
            style={({ pressed }) => [styles.seeMoreButton, pressed && { opacity: 0.85 }]}
            onPress={() => setShowAll((prev) => !prev)}
          >
            <Text style={styles.seeMoreText}>{showAll ? 'Mostrar Menos' : 'Mostrar Mais'}</Text>
            <ChevronDown
              size={18}
              color={COLORS.primary}
              strokeWidth={2.5}
              style={showAll && styles.seeMoreIconUp}
            />
          </Pressable>
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

function Card({ nativeCardStyle, title, duration, videoCount, date, image, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        nativeCardStyle,
        image && styles.cardWithImage,
        pressed && { opacity: 0.85 },
      ]}
    >
      {image && (
        <>
          <Image source={image} style={styles.cardImageFill} resizeMode="cover" />
          <View style={styles.cardImageShade} />
        </>
      )}

      <View style={styles.playOverlay}>
        <View style={styles.playBadge}>
          <Play size={22} color={COLORS.white} fill={COLORS.white} />
        </View>
      </View>

      <View style={styles.cardBottom}>
        <View pointerEvents="none" style={styles.cardWave}>
          <Svg
            width="100%"
            height={32}
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
        >
            <Path
              d="M0,32 L0,18 Q25,-2 50,16 T100,14 L100,32 Z"
              fill={COLORS.inputBg}
            />
          </Svg>
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaItem}>
            <Clock size={13} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.metaText}>{duration} no total</Text>
          </View>
          <Text style={styles.metaText}>·</Text>
          <Text style={styles.metaText}>{videoCount} {videoCount === 1 ? 'vídeo' : 'vídeos'}</Text>
        </View>
        {date ? (
          <View style={[styles.metaItem, styles.dateRow]}>
            <Calendar size={13} color={COLORS.primary} strokeWidth={2} />
            <Text style={styles.metaText}>{date}</Text>
          </View>
        ) : null}
      </View>
    </Pressable>
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
  welcomePill: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 28,
    paddingRight: 28,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
  },
  welcomeText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.white,
    fontSize: 17  ,
  },
  scroll: {
    flex: 1,
    marginTop: 24,
  },
  scrollContent: {
    paddingBottom: 120,
    gap: 24,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    height: 220,
    borderRadius: 24,
    backgroundColor: COLORS.cardImage,
    overflow: 'hidden',
  },
  cardWithImage: {
    backgroundColor: '#000',
    height: 320,
  },
  cardImageFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  cardImageShade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 124,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  playBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(2, 69, 124, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 124,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  cardWave: {
    position: 'absolute',
    top: -31,
    left: 0,
    right: 0,
  },
  cardTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.primary,
    lineHeight: 24,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 12,
    color: COLORS.primary,
  },
  dateRow: {
    marginTop: 4,
  },
  emptyText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.primary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  seeMoreText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.primary,
  },
  seeMoreIconUp: {
    transform: [{ rotate: '180deg' }],
  },
});
