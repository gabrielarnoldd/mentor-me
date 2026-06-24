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
import { ArrowLeft, Eye, EyeOff, Lock, Mail, ShieldCheck, Unlock } from 'lucide-react-native';

const COLORS = {
  white: '#FFFDFD',
  background: '#D7E8EF',
  inputBg: '#98CBDC',
  link: '#028BBF',
  primary: '#02457C',
};

export default function ForgotPasswordScreen({ onRequestCode, onResetPassword, onFinish, onBack }) {
  const [step, setStep] = useState('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('Informe seu e-mail para receber um código de verificação.');

  const handleRequestCode = async () => {
    if (!email) {
      setError('Informe seu e-mail');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const result = await onRequestCode?.(email);
      setStep('reset');
      if (result?.devCode) {
        setInfo(`Seu código de verificação: ${result.devCode}`);
      } else {
        setInfo(result?.message || 'Um código de verificação foi enviado para o e-mail cadastrado.');
      }
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    if (!code || !newPassword || !confirmPassword) {
      setError('Preencha todos os campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await onResetPassword?.({ email, code, password: newPassword });
      onFinish?.();
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={onBack} hitSlop={8} style={styles.backButton}>
          <ArrowLeft size={26} color={COLORS.primary} />
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.title}>MENTOR ME</Text>
          <Text style={styles.subtitle}>Sua carreira em foco</Text>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoText}>{info}</Text>
        </View>

        <View style={styles.form}>
          {step === 'request' ? (
            <Field
              icon={<Mail size={22} color={COLORS.primary} />}
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          ) : (
            <>
              <Field
                icon={<ShieldCheck size={22} color={COLORS.primary} />}
                value={code}
                onChangeText={setCode}
                placeholder="Código de verificação"
                keyboardType="number-pad"
              />

              <Field
                icon={<Unlock size={22} color={COLORS.primary} />}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Nova senha"
                secureTextEntry={!showNew}
                rightIcon={
                  showNew ? (
                    <Eye size={20} color={COLORS.primary} />
                  ) : (
                    <EyeOff size={20} color={COLORS.primary} />
                  )
                }
                onRightIconPress={() => setShowNew((v) => !v)}
              />

              <Field
                icon={<Lock size={22} color={COLORS.primary} />}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirmar senha"
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
            </>
          )}
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Pressable
          style={({ pressed }) => [
            styles.finishButton,
            pressed && styles.finishButtonPressed,
          ]}
          onPress={step === 'request' ? handleRequestCode : handleFinish}
          disabled={loading}
        >
          <Text style={styles.finishButtonText}>
            {loading
              ? 'Aguarde...'
              : step === 'request'
                ? 'Enviar código'
                : 'Finalizar'}
          </Text>
        </Pressable>

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
    paddingTop: 80,
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
    marginBottom: 28,
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
  infoBanner: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginBottom: 48,
  },
  infoText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
    color: COLORS.primary,
    textAlign: 'center',
  },
  form: {
    gap: 18,
    marginBottom: 48,
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
  finishButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
  },
  finishButtonPressed: {
    opacity: 0.85,
  },
  finishButtonText: {
    fontFamily: 'NATS_400Regular',
    fontSize: 30,
    color: COLORS.background,
  },
  errorText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 14,
    color: '#DC2626',
    marginBottom: 16,
    textAlign: 'center',
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
