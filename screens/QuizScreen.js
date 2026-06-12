import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronDown, Menu, X } from 'lucide-react-native';
import MenuDrawer from '../components/MenuDrawer';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
  cardImage: '#BFC3C8',
  correct: '#22C55E',
  wrong: '#EF4444',
};

const CARDS = [
  { id: '1', title: 'Como criar um\ncurrículo acertivo', image: require('../assets/fotoCurso1.jpg') },
  { id: '2', title: 'Como se conectar\ncom as pessoas certas', image: require('../assets/fotoCurso2.jpg') },
  { id: '3', title: 'Perfil Profissional', image: require('../assets/fotoCurso3.jpg') },
];

export default function QuizScreen({
  username = 'Ana Beatriz Arteiro Barreiro',
  onLogout,
  onNavigate,
  onHome,
  onSelectTopic,
  quizResults = {},
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmCard, setConfirmCard] = useState(null);
  const modalOpacity = useRef(new Animated.Value(0)).current;
  const modalScale = useRef(new Animated.Value(0.9)).current;

  const handleCardPress = (rawTitle) => {
    const key = rawTitle.replace(/\n/g, ' ');
    if (quizResults[key]) {
      setConfirmCard({ key, result: quizResults[key] });
      Animated.parallel([
        Animated.timing(modalOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
        Animated.spring(modalScale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 8 }),
      ]).start();
    } else {
      onSelectTopic?.(key);
    }
  };

  const closeModal = (cb) => {
    Animated.parallel([
      Animated.timing(modalOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(modalScale, { toValue: 0.9, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setConfirmCard(null);
      modalScale.setValue(0.9);
      cb?.();
    });
  };

  const handleRetry = () => {
    const topic = confirmCard?.key;
    closeModal(() => onSelectTopic?.(topic));
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

      <View style={styles.usernamePill}>
        <Text style={styles.usernameText}>{username}</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Você já respondeu:</Text>
        <View style={styles.cardsContainer}>
          {CARDS.map((card) => {
            const key = card.title.replace(/\n/g, ' ');
            return (
              <Card
                key={card.id}
                title={card.title}
                image={card.image}
                result={quizResults[key]}
                onPress={() => handleCardPress(card.title)}
              />
            );
          })}
        </View>

        <Pressable
          style={({ pressed }) => [styles.seeMoreButton, pressed && { opacity: 0.85 }]}
          onPress={() => {}}
        >
          <Text style={styles.seeMoreText}>Mostrar Mais</Text>
          <ChevronDown size={18} color={COLORS.primary} strokeWidth={2.5} />
        </Pressable>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => {}}>
        <ChevronDown size={26} color={COLORS.primary} />
      </Pressable>

      {confirmCard && (
        <Animated.View style={[styles.modalOverlay, { opacity: modalOpacity }]}>
          <Animated.View style={[styles.modalCard, { transform: [{ scale: modalScale }] }]}>
            <Pressable
              style={styles.modalClose}
              onPress={() => closeModal()}
              hitSlop={10}
            >
              <X size={20} color={COLORS.primary} strokeWidth={2.5} />
            </Pressable>

            <Text style={styles.modalTopic}>{confirmCard.key}</Text>
            <Text style={styles.modalLabel}>Sua pontuação anterior:</Text>

            <View style={[
              styles.modalScoreBadge,
              { backgroundColor: confirmCard.result.score / confirmCard.result.total >= 0.6 ? COLORS.correct : COLORS.wrong },
            ]}>
              <Text style={styles.modalScoreText}>
                {confirmCard.result.score}/{confirmCard.result.total}
              </Text>
            </View>

            <Text style={styles.modalQuestion}>Deseja responder novamente?</Text>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [styles.retryButton, pressed && { opacity: 0.85 }]}
                onPress={handleRetry}
              >
                <Text style={styles.retryButtonText}>Sim, responder novamente</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [styles.cancelButton, pressed && { opacity: 0.85 }]}
                onPress={() => closeModal()}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      )}

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

function Card({ title, onPress, result, image }) {
  const scoreColor = result
    ? result.score / result.total >= 0.6
      ? COLORS.correct
      : COLORS.wrong
    : null;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
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
      {result && (
        <View style={[styles.scoreBadge, { backgroundColor: scoreColor }]}>
          <Text style={styles.scoreBadgeText}>
            {result.score}/{result.total}
          </Text>
        </View>
      )}
      <View style={styles.cardBottom}>
        <Svg
          width="100%"
          height={32}
          viewBox="0 0 100 32"
          preserveAspectRatio="none"
          style={styles.cardWave}
        >
          <Path
            d="M0,32 L0,18 Q25,-2 50,16 T100,14 L100,32 Z"
            fill={COLORS.inputBg}
          />
        </Svg>
        <Text style={styles.cardTitle}>{title}</Text>
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
    paddingHorizontal: 28,
    paddingBottom: 120,
    alignSelf: 'center',
    maxWidth: 480,
    width: '100%',
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 18,
    marginLeft: 4,
  },
  cardsContainer: {
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
  scoreBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  scoreBadgeText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: COLORS.white,
  },
  cardBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 110,
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
    marginTop: 32,
  },
  seeMoreText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.primary,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    ...Platform.select({
      web: { boxShadow: '0 2px 6px rgba(0,0,0,0.15)' },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
      },
    }),
  },
  // Confirmation modal
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(2, 69, 124, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 360,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  modalClose: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  modalTopic: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 17,
    color: COLORS.primary,
    marginBottom: 16,
    lineHeight: 24,
  },
  modalLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: COLORS.link,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalScoreBadge: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 999,
    marginBottom: 18,
  },
  modalScoreText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 20,
    color: COLORS.white,
  },
  modalQuestion: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    gap: 10,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  retryButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.white,
    fontSize: 14,
  },
  cancelButton: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    paddingVertical: 13,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.primary,
    fontSize: 14,
  },
});
