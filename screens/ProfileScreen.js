import { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  LogOut,
  Menu,
  Pencil,
  User,
} from 'lucide-react-native';
import MenuDrawer from '../components/MenuDrawer';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
  cardImage: '#BFC3C8',
};

const HISTORY = [
  { id: '1', title: 'Entrevistas' },
  { id: '2', title: 'Portifólios' },
  { id: '3', title: 'Perfil\nProfissional' },
];

export default function ProfileScreen({ onLogout, onNavigate, onHome }) {
  const [name, setName] = useState('Ana Beatriz Arteiro Barreiro');
  const [email, setEmail] = useState('anabeatrizarteiro@gmail.com');
  const [username, setUsername] = useState('@aanabarreiro');
  const [password, setPassword] = useState('**********');
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <User size={86} color={COLORS.inputBg} strokeWidth={2} />
          </View>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarBadgePlus}>+</Text>
          </View>
        </View>

        <View style={styles.form}>
          <EditField value={name} onChangeText={setName} />
          <EditField
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <EditField
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <EditField value={password} onChangeText={setPassword} />
        </View>

        <Text style={styles.sectionTitle}>Você já assistiu:</Text>

        <View style={styles.historyRow}>
          {HISTORY.map((item) => (
            <HistoryCard key={item.id} title={item.title} />
          ))}
        </View>
      </ScrollView>

      <Pressable
        style={styles.logoutFloat}
        onPress={onLogout}
        hitSlop={12}
      >
        <LogOut size={28} color={COLORS.primary} />
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

function EditField({ ...inputProps }) {
  return (
    <View style={styles.fieldRow}>
      <View style={styles.field}>
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.primary}
          {...inputProps}
        />
      </View>
      <Pressable style={styles.editButton} hitSlop={8}>
        <Pencil size={20} color={COLORS.primary} strokeWidth={2.2} />
      </Pressable>
    </View>
  );
}

function HistoryCard({ title }) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyCardBottom}>
        <Svg
          width="100%"
          height={22}
          viewBox="0 0 100 22"
          preserveAspectRatio="none"
          style={styles.historyWave}
        >
          <Path
            d="M0,22 L0,12 Q25,-2 50,10 T100,8 L100,22 Z"
            fill={COLORS.inputBg}
          />
        </Svg>
        <Text style={styles.historyTitle}>{title}</Text>
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 24,
    paddingBottom: 100,
    alignItems: 'stretch',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  avatarWrapper: {
    alignSelf: 'center',
    marginBottom: 28,
    width: 170,
    height: 170,
  },
  avatar: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary,
    borderWidth: 3,
    borderColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgePlus: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 24,
    lineHeight: 24,
    color: COLORS.inputBg,
  },
  form: {
    gap: 14,
    marginBottom: 28,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  field: {
    flex: 1,
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    height: 50,
    paddingHorizontal: 22,
    justifyContent: 'center',
  },
  input: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: COLORS.primary,
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  editButton: {
    padding: 4,
  },
  sectionTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 18,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  historyCard: {
    flex: 1,
    height: 110,
    borderRadius: 14,
    backgroundColor: COLORS.cardImage,
    overflow: 'hidden',
  },
  historyCardBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 50,
    backgroundColor: COLORS.inputBg,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  historyWave: {
    position: 'absolute',
    top: -21,
    left: 0,
    right: 0,
  },
  historyTitle: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 13,
    color: COLORS.primary,
    lineHeight: 16,
  },
  logoutFloat: {
    position: 'absolute',
    right: 24,
    bottom: 20,
    padding: 6,
  },
});
