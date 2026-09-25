import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  BarChart3,
  LogOut,
  MessageCircleQuestion,
  MonitorPlay,
  UserCircle,
  X,
} from 'lucide-react-native';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
};

const ITEMS = [
  { id: 'perfil', label: 'Perfil', Icon: UserCircle, screen: 'profile' },
  { id: 'quiz', label: 'Quizzes', Icon: MessageCircleQuestion, screen: 'quiz' },
  { id: 'progresso', label: 'Progresso', Icon: BarChart3, screen: 'progress' },
  { id: 'video', label: 'Vídeo-aulas', Icon: MonitorPlay, screen: 'home' },
];

export default function MenuDrawer({ visible, onClose, onNavigate, onLogout }) {
  if (!visible) return null;

  return (
    <View style={[styles.overlay, { pointerEvents: 'box-none' }]}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.drawer}>
        <View style={styles.drawerHeader}>
          <Text style={styles.subtitle}>Sua carreira em foco</Text>
          <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
            <X size={16} color={COLORS.background} strokeWidth={2} />
          </Pressable>
        </View>

        <View style={styles.menuList}>
          {ITEMS.map(({ id, label, Icon, screen }, index) => (
            <View key={id}>
              <Pressable
                style={({ pressed }) => [
                  styles.menuItem,
                  pressed && styles.menuItemPressed,
                ]}
                onPress={() => {
                  onClose?.();
                  if (screen) onNavigate?.(screen);
                }}
              >
                <View style={styles.iconWrap}>
                  <Icon size={18} color={COLORS.primary} strokeWidth={2} />
                </View>
                <Text style={styles.menuLabel}>{label}</Text>
              </Pressable>
              {index < ITEMS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          <Pressable
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && styles.menuItemPressed,
            ]}
            onPress={onLogout}
            hitSlop={12}
          >
            <View style={styles.logoutIconWrap}>
              <LogOut size={18} color={COLORS.primary} strokeWidth={2} />
            </View>
            <Text style={styles.logoutLabel}>Sair</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    zIndex: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2,69,124,0.25)',
  },
  drawer: {
    width: '76%',
    maxWidth: 320,
    backgroundColor: COLORS.primary,
    paddingTop: 32,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  subtitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    letterSpacing: 0.2,
    color: COLORS.background,
    opacity: 0.85,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuItemPressed: {
    opacity: 0.6,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,253,253,0.12)',
  },
  footer: {
    paddingBottom: 28,
  },
  footerDivider: {
    height: 1,
    backgroundColor: 'rgba(255,253,253,0.12)',
    marginBottom: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  logoutIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  logoutLabel: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: COLORS.white,
  },
});
