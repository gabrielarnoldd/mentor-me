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
  { id: '3', title: 'De bom dia a bom dia,\na sua imagem se cria' },
];

export default function HomeScreen({
  username = '(usuário)',
  onLogout,
  onNavigate,
  onPlayVideo,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.flex}>
      <View style={styles.header}>
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.welcomePill}>
          <Text style={styles.welcomeText}>Bem-vindo, {username}</Text>
        </View>
        {CARDS.map((card) => (
          <Card
            key={card.id}
            title={card.title}
            onPress={() => onPlayVideo?.(card.title.replace(/\n/g, ' '))}
          />
        ))}
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
    fontSize: 18,
  },
  scroll: {
    flex: 1,
    marginTop: 32,
  },
  scrollContent: {
    paddingHorizontal: 32,
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
