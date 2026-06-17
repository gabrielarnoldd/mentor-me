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
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react-native';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
};

export default function LoginScreen({ onLogin, onForgotPassword, onRegister, loading, error }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>MENTOR ME</Text>
          <Text style={styles.subtitle}>Sua carreira em foco</Text>
        </View>

        <View style={styles.form}>
          <Field
            icon={<Mail size={22} color={COLORS.primary} />}
            value={email}
            onChangeText={setEmail}
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Field
            icon={<Lock size={22} color={COLORS.primary} />}
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
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
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <Pressable
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
          ]}
          onPress={() => onLogin?.({ email, password })}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>

        <View style={styles.links}>
          <Pressable onPress={onForgotPassword}>
            <Text style={styles.forgotLink}>Esqueci minha senha</Text>
          </Pressable>
          <View style={styles.signupRow}>
            <Text style={styles.signupText}>Não possui conta? </Text>
            <Pressable onPress={onRegister}>
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </Pressable>
          </View>
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

function Field({
  icon,
  rightIcon,
  onRightIconPress,
  ...inputProps
}) {
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
    paddingTop: 80,
    paddingBottom: 40,
    alignItems: 'stretch',
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
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
    gap: 18,
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
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  loginButtonPressed: {
    opacity: 0.85,
  },
  loginButtonText: {
    fontFamily: 'NATS_400Regular',
    fontSize: 30,
    color: COLORS.background,
  },
  links: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 36,
  },
  forgotLink: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 15,
    color: COLORS.link,
  },
  signupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 15,
    color: '#000',
  },
  signupLink: {
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
  errorText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 10,
    textAlign: 'center',
  },
  },
});
