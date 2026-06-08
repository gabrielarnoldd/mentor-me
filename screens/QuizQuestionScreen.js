import { useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
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
  cardImage: '#BFC3C8',
  correct: '#22C55E',
  wrong: '#EF4444',
};

const QUESTIONS = [
  { text: 'Devo colocar uma foto\nminha no meu currículo?', answer: 'no' },
  { text: 'Devo incluir todas as\nminhas experiências?', answer: 'yes' },
  { text: 'O currículo deve passar\nde uma página?', answer: 'no' },
  { text: 'Devo listar hobbies no\ncurrículo?', answer: 'no' },
  { text: 'Vale a pena incluir\nidiomas em qualquer nível?', answer: 'no' },
  { text: 'Devo personalizar o\ncurrículo para cada vaga?', answer: 'yes' },
  { text: 'É importante incluir\nreferências profissionais?', answer: 'no' },
  { text: 'Devo mencionar pretensão\nsalarial no currículo?', answer: 'no' },
  { text: 'Preciso atualizar o\ncurrículo regularmente?', answer: 'yes' },
  { text: 'Vale a pena pedir\nfeedback sobre o currículo?', answer: 'yes' },
];

const FEEDBACK_MS = 900;

export default function QuizQuestionScreen({
  topic = 'Quiz',
  onFinish,
  onLogout,
  onNavigate,
  onHome,
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const scaleYes = useRef(new Animated.Value(1)).current;
  const scaleNo = useRef(new Animated.Value(1)).current;

  const current = QUESTIONS[index];

  const handleAnswer = (choice) => {
    if (selected) return;
    setSelected(choice);

    const anim = choice === 'yes' ? scaleYes : scaleNo;
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.06, duration: 130, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1, duration: 130, useNativeDriver: true }),
    ]).start();

    setTimeout(() => {
      setSelected(null);
      if (index + 1 >= QUESTIONS.length) {
        setIndex(0);
        onFinish?.();
      } else {
        setIndex((i) => i + 1);
      }
    }, FEEDBACK_MS);
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

      <View style={styles.topicPill}>
        <Text style={styles.topicText}>{topic}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.question}>{current.text}</Text>

        <View style={styles.cardsContainer}>
          <AnswerCard
            label="SIM"
            variant="yes"
            correct={current.answer === 'yes'}
            selected={selected}
            scale={scaleYes}
            onPress={() => handleAnswer('yes')}
          />
          <AnswerCard
            label="Não"
            variant="no"
            correct={current.answer === 'no'}
            selected={selected}
            scale={scaleNo}
            onPress={() => handleAnswer('no')}
          />
        </View>

        <Text style={styles.progress}>
          {index + 1}/{QUESTIONS.length}
        </Text>
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

function AnswerCard({ label, variant, correct, selected, scale, onPress }) {
  const isAnswered = selected !== null;
  const baseColor = variant === 'yes' ? COLORS.inputBg : COLORS.primary;
  const baseText = variant === 'yes' ? COLORS.primary : COLORS.background;

  const bottomColor = isAnswered
    ? correct
      ? COLORS.correct
      : COLORS.wrong
    : baseColor;
  const textColor = isAnswered ? COLORS.white : baseText;

  return (
    <Pressable onPress={onPress} disabled={isAnswered} style={styles.cardPressable}>
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={[styles.cardBottom, { backgroundColor: bottomColor }]}>
          <Svg
            width="100%"
            height={32}
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            style={styles.cardWave}
          >
            <Path
              d="M0,32 L0,18 Q25,-2 50,16 T100,14 L100,32 Z"
              fill={bottomColor}
            />
          </Svg>
          <Text style={[styles.cardLabel, { color: textColor }]}>{label}</Text>
        </View>
      </Animated.View>
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
  topicPill: {
    backgroundColor: COLORS.inputBg,
    alignSelf: 'flex-start',
    paddingVertical: 12,
    paddingLeft: 24,
    paddingRight: 32,
    borderTopRightRadius: 999,
    borderBottomRightRadius: 999,
    marginTop: 24,
  },
  topicText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.primary,
    fontSize: 16,
  },
  body: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  question: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 30,
  },
  cardsContainer: {
    gap: 18,
    width: '100%',
    alignItems: 'center',
    flex: 1,
  },
  cardPressable: {
    width: '100%',
    maxWidth: 300,
  },
  card: {
    width: '100%',
    height: 170,
    borderRadius: 18,
    backgroundColor: COLORS.cardImage,
    overflow: 'hidden',
  },
  cardBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardWave: {
    position: 'absolute',
    top: -31,
    left: 0,
    right: 0,
  },
  cardLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 22,
  },
  progress: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.primary,
    marginTop: 8,
  },
});
