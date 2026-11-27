import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { TopBar } from '@/components/top-bar';
import { Spacing } from '@/constants/theme';
import { SAMPLE_PEOPLE } from '@/data/sample-people';
import { useAppStore } from '@/store/app-store';

const USERNAME = /^[a-z0-9._]{3,20}$/;

/** 프로필 편집: 이름과 @아이디 */
export default function ProfileEditScreen() {
  const { t } = useTranslation();
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [username, setUsername] = useState(profile.username);

  const clean = username.trim().toLowerCase();
  const error = !USERNAME.test(clean)
    ? t('editProfile.usernameInvalid')
    : SAMPLE_PEOPLE.some((p) => p.username === clean)
      ? t('editProfile.usernameTaken')
      : null;

  const save = () => {
    if (error) return;
    updateProfile({ displayName: displayName.trim(), username: clean });
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  return (
    <Screen footer={<Button label={t('editProfile.save')} disabled={!!error} onPress={save} />}>
      <TopBar title={t('editProfile.title')} fallback="/profile" />
      <TextField
        label={t('editProfile.displayName')}
        value={displayName}
        onChangeText={setDisplayName}
        placeholder={profile.username}
        maxLength={30}
      />
      <View style={styles.field}>
        <TextField
          label={t('editProfile.username')}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
        />
        <AppText variant="caption" color={error ? 'danger' : 'textMuted'}>
          {error ?? t('editProfile.usernameHint')}
        </AppText>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  field: { gap: Spacing.sm },
});
