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

let ChartReady = false;
let PieComponent = null;
if (Platform.OS === 'web') {
  const { Pie } = require('react-chartjs-2');
  const { Chart, ArcElement } = require('chart.js');
  Chart.register(ArcElement);
  PieComponent = Pie;
  ChartReady = true;
}

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
          Este é seu nível de progresso nas competências avaliadas:
        </Text>

        <View style={styles.chartWrapper}>
          <PieChart percent={averageProgress} />
          <View pointerEvents="none" style={styles.chartCenter}>
            <Text style={styles.chartCenterText}>
              Progresso médio{'\n'}das habilidades
            </Text>
          </View>
          <Svg
            width={50}
            height={50}
            viewBox="0 0 50 50"
            style={styles.chartArrow}
            pointerEvents="none"
          >
            <Path
              d="M4 38 Q 18 14, 44 8"
              stroke={COLORS.primary}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
            <Path
              d="M44 8 L 36 6 M44 8 L 40 16"
              stroke={COLORS.primary}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
          </Svg>
        </View>

        <View style={styles.skillsList}>
          {SKILLS.map((s) => (
            <SkillCard key={s.label} label={s.label} progress={s.progress} />
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

function PieChart({ percent }) {
  if (!ChartReady || !PieComponent) {
    return <FallbackPie percent={percent} />;
  }
  const data = {
    datasets: [
      {
        data: [percent, 100 - percent],
        backgroundColor: [COLORS.primary, COLORS.inputBg],
        borderWidth: 0,
        hoverOffset: 0,
      },
    ],
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 600 },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };
  return (
    <View style={styles.chartCanvas}>
      <PieComponent data={data} options={options} />
    </View>
  );
}

function FallbackPie({ percent }) {
  const r = 110;
  const cx = 130;
  const cy = 130;
  const angle = (percent / 100) * 2 * Math.PI;
  const x = cx + r * Math.sin(angle);
  const y = cy - r * Math.cos(angle);
  const largeArc = percent > 50 ? 1 : 0;
  const pathPrimary = `M ${cx} ${cy} L ${cx} ${cy - r} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y} Z`;
  return (
    <Svg width={260} height={260} viewBox="0 0 260 260">
      <Path d={`M ${cx} ${cy} m -${r} 0 a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 -${r * 2} 0`} fill={COLORS.inputBg} />
      <Path d={pathPrimary} fill={COLORS.primary} />
    </Svg>
  );
}

function SkillCard({ label, progress }) {
  return (
    <View style={styles.skillCard}>
      <View style={styles.skillCardHeader}>
        <Text style={styles.skillLabel}>{label}</Text>
        <Text style={styles.skillPercent}>{progress}%</Text>
      </View>
      <View style={styles.skillTrack}>
        <View style={[styles.skillFill, { width: `${progress}%` }]} />
      </View>
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
  },
  chartWrapper: {
    width: 260,
    height: 260,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 28,
    position: 'relative',
  },
  chartCanvas: {
    width: 260,
    height: 260,
  },
  chartCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartCenterText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.background,
    textAlign: 'center',
    lineHeight: 24,
  },
  chartArrow: {
    position: 'absolute',
    top: 30,
    left: 60,
  },
  skillsList: {
    gap: 14,
  },
  skillCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  skillCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  skillLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.primary,
  },
  skillPercent: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.link,
  },
  skillTrack: {
    height: 10,
    borderRadius: 999,
    backgroundColor: COLORS.background,
    overflow: 'hidden',
  },
  skillFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: COLORS.primary,
  },
});
