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

const SKILLS = [
  { label: 'Currículo', progress: 50 },
  { label: 'Entrevista', progress: 72 },
  { label: 'Oratória', progress: 30 },
  { label: 'Linkedin', progress: 88 },
  { label: 'Perfil profissional', progress: 55 },
];

const averageProgress = Math.round(
  SKILLS.reduce((sum, s) => sum + s.progress, 0) / SKILLS.length
);

export default function ProgressScreen({
  username = 'Ana Beatriz Arteiro Barreiro',
  onLogout,
  onNavigate,
  onHome,
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
        <Text style={styles.sectionTitle}>
          Seu progresso nas competências
        </Text>

        <View style={styles.ringWrapper}>
          <ProgressRing percent={averageProgress} size={320} stroke={26} />
          <View pointerEvents="none" style={styles.ringCenter}>
            <Text style={styles.ringPercent}>{averageProgress}%</Text>
            <Text style={styles.ringLabel}>Progresso médio</Text>
          </View>
        </View>

        <View style={styles.skillsList}>
          {SKILLS.map((s, i) => (
            <View
              key={s.label}
              style={[styles.skillRow, i < SKILLS.length - 1 && styles.skillRowDivider]}
            >
              <Text style={styles.skillRowText}>{s.label}</Text>
              <Text style={styles.skillRowPercent}>{s.progress}%</Text>
            </View>
          ))}
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
  skillsList: {
    borderRadius: 18,
    paddingHorizontal: 20,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  skillRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#9aa5aa',
  },
  skillRowText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.primary,
  },
  skillRowPercent: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.link,
  },
});
