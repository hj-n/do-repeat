import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Screen } from '@/components/screen';
import { TopBar } from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { SAMPLE_PEOPLE } from '@/data/sample-people';
import { cn } from '@/lib/utils';
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
    <Screen
      footer={
        <Button size="lg" disabled={!!error} onPress={save}>
          <Text>{t('editProfile.save')}</Text>
        </Button>
      }>
      <TopBar title={t('editProfile.title')} fallback="/profile" />
      <View className="gap-2">
        <Label nativeID="display-name">{t('editProfile.displayName')}</Label>
        <Input
          aria-labelledby="display-name"
          accessibilityLabel={t('editProfile.displayName')}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={profile.username}
          maxLength={30}
        />
      </View>
      <View className="gap-2">
        <Label nativeID="username">{t('editProfile.username')}</Label>
        <Input
          aria-labelledby="username"
          accessibilityLabel={t('editProfile.username')}
          aria-invalid={!!error}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          maxLength={20}
        />
        <Text className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}>
          {error ?? t('editProfile.usernameHint')}
        </Text>
      </View>
    </Screen>
  );
}
