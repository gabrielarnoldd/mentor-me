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
  { id: 'quiz', label: 'Quiz', Icon: MessageCircleQuestion, screen: 'quiz' },
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
          <Pressable
            onPress={onClose}
            hitSlop={12}
            style={styles.closeButton}
          >
            <X size={18} color={COLORS.background} strokeWidth={2.5} />
          </Pressable>
        </View>

        <View style={styles.menuList}>
          {ITEMS.map(({ id, label, Icon, screen }) => (
            <Pressable
              key={id}
              style={({ pressed }) => [
                styles.menuItem,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                onClose?.();
                if (screen) onNavigate?.(screen);
              }}
            >
              <Icon size={22} color={COLORS.primary} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>{label}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          style={styles.logoutButton}
          onPress={onLogout}
          hitSlop={12}
        >
          <LogOut size={28} color={COLORS.background} />
        </Pressable>
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
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  drawer: {
    width: '72%',
    maxWidth: 340,
    backgroundColor: COLORS.primary,
    paddingTop: 28,
    paddingBottom: 28,
    paddingLeft: 16,
    paddingRight: 18,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  subtitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 16,
    color: COLORS.background,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuList: {
    gap: 14,
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    paddingVertical: 12,
    paddingLeft: 16,
    paddingRight: 24,
  },
  menuItemPressed: {
    opacity: 0.8,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 18,
    color: COLORS.primary,
  },
  logoutButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
});
