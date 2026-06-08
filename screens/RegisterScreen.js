import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ArrowLeft, AtSign, Eye, EyeOff, Lock, Unlock, User } from 'lucide-react-native';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
};

export default function RegisterScreen({ onLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={onLogin} hitSlop={8} style={styles.backButton}>
          <ArrowLeft size={26} color={COLORS.primary} />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>MENTOR ME</Text>
          <Text style={styles.subtitle}>Sua carreira em foco</Text>
        </View>

        <View style={styles.form}>
          <Field
            icon={<User size={22} color={COLORS.primary} />}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <Field
            icon={<AtSign size={22} color={COLORS.primary} />}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Field
            icon={<Unlock size={22} color={COLORS.primary} />}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            rightIcon={
              showPassword ? (
                <Eye size={20} color={COLORS.primary} />
              ) : (
                <EyeOff size={20} color={COLORS.primary} />
              )
            }
            onRightIconPress={() => setShowPassword((v) => !v)}
          />

          <Field
            icon={<Lock size={22} color={COLORS.primary} />}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            rightIcon={
              showConfirm ? (
                <Eye size={20} color={COLORS.primary} />
              ) : (
                <EyeOff size={20} color={COLORS.primary} />
              )
            }
            onRightIconPress={() => setShowConfirm((v) => !v)}
          />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.registerButton,
            pressed && styles.registerButtonPressed,
          ]}
          onPress={() => {}}
        >
          <Text style={styles.registerButtonText}>Cadastrar</Text>
        </Pressable>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Já possui conta? </Text>
          <Pressable onPress={onLogin}>
            <Text style={styles.loginLink}>Faça login</Text>
          </Pressable>
        </View>

        <View style={styles.logoWrapper}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({ icon, rightIcon, onRightIconPress, ...inputProps }) {
  return (
    <View style={styles.field}>
      <View style={styles.fieldIcon}>{icon}</View>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.primary}
        {...inputProps}
      />
      {rightIcon ? (
        <Pressable onPress={onRightIconPress} style={styles.fieldRightIcon}>
          {rightIcon}
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'stretch',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 4,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 36,
  },
  title: {
    fontFamily: 'PaytoneOne_400Regular',
    fontSize: 40,
    color: COLORS.primary,
    letterSpacing: 1,
  },
  subtitle: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 22,
    color: COLORS.primary,
    marginTop: 4,
  },
  form: {
    gap: 16,
    marginBottom: 40,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    height: 56,
    paddingHorizontal: 20,
  },
  fieldIcon: {
    marginRight: 12,
  },
  fieldRightIcon: {
    marginLeft: 12,
    padding: 4,
  },
  input: {
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 16,
    color: COLORS.primary,
    height: '100%',
    ...(Platform.OS === 'web' ? { outlineStyle: 'none' } : {}),
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  registerButtonPressed: {
    opacity: 0.85,
  },
  registerButtonText: {
    fontFamily: 'NATS_400Regular',
    fontSize: 30,
    color: COLORS.background,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  loginText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: '#000',
  },
  loginLink: {
    fontFamily: 'Montserrat_700Bold_Italic',
    fontSize: 15,
    color: COLORS.link,
    fontStyle: 'italic',
  },
  logoWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  logo: {
    width: 90,
    height: 90,
  },
});
