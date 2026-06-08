import { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { ChevronDown, Menu } from 'lucide-react-native';
import MenuDrawer from '../components/MenuDrawer';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
  cardImage: '#BFC3C8',
};

const CARDS = [
  { id: '1', title: 'Como criar um\ncurrículo acertivo' },
  { id: '2', title: 'Como se conectar\ncom as pessoas certas' },
  { id: '3', title: 'Perfil Profissional' },
];

export default function QuizScreen({
  username = 'Ana Beatriz Arteiro Barreiro',
  onLogout,
  onNavigate,
  onHome,
  onSelectTopic,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          {CARDS.map((card) => (
            <Card
              key={card.id}
              title={card.title}
              onPress={() => onSelectTopic?.(card.title.replace(/\n/g, ' '))}
            />
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [styles.seeMoreButton, pressed && { opacity: 0.85 }]}
          onPress={() => {}}
        >
          <Text style={styles.seeMoreText}>Resolver Mais</Text>
          <ChevronDown size={18} color={COLORS.primary} strokeWidth={2.5} />
        </Pressable>
      </ScrollView>

      <Pressable style={styles.fab} onPress={() => {}}>
        <ChevronDown size={26} color={COLORS.primary} />
      </Pressable>

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

function Card({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}
    >
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
    marginTop: 4,
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
});
