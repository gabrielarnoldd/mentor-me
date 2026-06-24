import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Svg, { Path } from 'react-native-svg';
import {
  LogOut,
  Menu,
  Pencil,
  User,
} from 'lucide-react-native';
import MenuDrawer from '../components/MenuDrawer';
import { API_BASE_URL } from '../api';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
  cardImage: '#BFC3C8',
};

export default function ProfileScreen({
  currentUser,
  videoProgress = { videos: [] },
  onUpdateProfile,
  onUploadProfilePhoto,
  loading,
  error,
  onLogout,
  onNavigate,
  onHome,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPassword('');
      setSuccessMessage('');
    }
  }, [currentUser]);

  const profilePhotoUri = currentUser?.profile_photo_url
    ? currentUser.profile_photo_url.startsWith('http')
      ? currentUser.profile_photo_url
      : `${API_BASE_URL}${currentUser.profile_photo_url}`
    : '';
  const watchedVideos = videoProgress.videos?.filter((video) => video.watched) || [];

  const pickProfilePhoto = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissao necessaria', 'Permita acesso as fotos para escolher sua foto de perfil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });

      if (result.canceled || !result.assets?.[0]) {
        return;
      }

      await onUploadProfilePhoto?.(result.assets[0]);
      setSuccessMessage('Foto de perfil atualizada com sucesso');
    } catch (uploadError) {
      setSuccessMessage('');
    }
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

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={({ pressed }) => [styles.avatarWrapper, pressed && { opacity: 0.9 }]}
          onPress={pickProfilePhoto}
          disabled={loading}
        >
          <View style={styles.avatar}>
            {profilePhotoUri ? (
              <Image source={{ uri: profilePhotoUri }} style={styles.avatarImage} resizeMode="cover" />
            ) : (
              <User size={86} color={COLORS.inputBg} strokeWidth={2} />
            )}
          </View>
          <View style={styles.avatarBadge}>
            <Text style={styles.avatarBadgePlus}>+</Text>
          </View>
        </Pressable>

        <View style={styles.form}>
          <EditField
            value={name}
            onChangeText={setName}
            placeholder="Nome completo"
          />
          <EditField
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <EditField
            value={password}
            onChangeText={setPassword}
            placeholder="Nova senha"
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {successMessage ? <Text style={styles.successText}>{successMessage}</Text> : null}
          <Pressable
            style={({ pressed }) => [styles.saveButton, pressed && { opacity: 0.85 }]}
            onPress={async () => {
              try {
                await onUpdateProfile?.({ name, email, password: password || undefined });
                setSuccessMessage('Perfil atualizado com sucesso');
                setPassword('');
              } catch (updateError) {
                setSuccessMessage('');
              }
            }}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>{loading ? 'Salvando...' : 'Salvar alterações'}</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Você já assistiu:</Text>

        {watchedVideos.length ? (
          <View style={styles.historyRow}>
            {watchedVideos.map((video) => (
              <HistoryCard key={video.id} title={video.title} />
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>Nenhum vídeo assistido ainda</Text>
        )}
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
  saveButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
    color: COLORS.white,
  },
  successText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#16A34A',
    marginTop: 10,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#DC2626',
    marginTop: 10,
    textAlign: 'center',
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
    flexWrap: 'wrap',
    gap: 10,
  },
  historyCard: {
    flexBasis: '31%',
    flexGrow: 1,
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
    fontSize: 12,
    color: COLORS.primary,
    lineHeight: 16,
  },
  emptyText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
  },
  logoutFloat: {
    position: 'absolute',
    right: 24,
    bottom: 20,
    padding: 6,
  },
});
