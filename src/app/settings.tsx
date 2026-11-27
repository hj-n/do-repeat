import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Fragment, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, View } from 'react-native';

import { Screen } from '@/components/screen';
import { TopBar } from '@/components/top-bar';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SAMPLE_FOLLOWER_IDS } from '@/data/sample-people';
import { PreviewPositionControl } from '@/features/check-in/preview-position-control';
import { deviceLanguage, type LanguageSetting } from '@/i18n';
import { cn } from '@/lib/utils';
import { useAppStore, type Visibility } from '@/store/app-store';

const SAMPLE_DAYS = 12;

/** 설정: 공개, 언어, 개발용. 색 없이 굵기와 체크로만 표시해요 */
export default function SettingsScreen() {
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const hasHabits = useAppStore((s) => s.habits.length > 0);
  const hasIncoming = useAppStore((s) => s.social.incoming.length > 0);
  const hasOutgoing = useAppStore((s) => s.social.outgoing.length > 0);
  const fillSampleHistory = useAppStore((s) => s.fillSampleHistory);
  const receiveSampleFollows = useAppStore((s) => s.receiveSampleFollows);
  const acceptOutgoingRequests = useAppStore((s) => s.acceptOutgoingRequests);
  const resetAll = useAppStore((s) => s.resetAll);
  const [done, setDone] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const languages: { value: LanguageSetting; label: string }[] = [
    { value: 'system', label: t('settings.languageSystemCurrent', { language: t(`language.${deviceLanguage()}`) }) },
    { value: 'en', label: t('language.en') },
    { value: 'ko', label: t('language.ko') },
  ];
  const tools: { label: string; disabled?: boolean; run: () => void }[] = [
    { label: t('settings.fillSample', { count: SAMPLE_DAYS }), disabled: !hasHabits, run: () => fillSampleHistory(SAMPLE_DAYS) },
    { label: t('settings.receiveFollows'), run: () => receiveSampleFollows(SAMPLE_FOLLOWER_IDS) },
    { label: t('settings.acceptOutgoing'), disabled: !hasOutgoing, run: acceptOutgoingRequests },
  ];

  return (
    <Screen>
      <TopBar title={t('settings.title')} fallback="/profile" />

      <Section title={t('settings.privacy')}>
        <View className="flex-row items-center gap-4 py-3">
          <View className="flex-1 gap-0.5">
            <Label nativeID="private-account" onPress={() => updateProfile({ isPrivate: !profile.isPrivate })}>
              {t('settings.privateAccount')}
            </Label>
            <Text variant="muted" className="text-xs">
              {profile.isPrivate && hasIncoming
                ? t('settings.publicAcceptsRequests')
                : profile.isPrivate
                  ? t('settings.privateAccountNote')
                  : t('settings.publicAccountNote')}
            </Text>
          </View>
          <Switch
            aria-labelledby="private-account"
            accessibilityLabel={t('settings.privateAccount')}
            checked={profile.isPrivate}
            onCheckedChange={(isPrivate) => updateProfile({ isPrivate })}
            className={cn(profile.isPrivate && 'bg-foreground')}
          />
        </View>
        {(
          [
            ['checkInVisibility', t('settings.checkInPosts')],
            ['milestoneVisibility', t('settings.milestonePosts')],
          ] as const
        ).map(([key, label]) => (
          <Fragment key={key}>
            <Separator />
            <View className="flex-row items-center gap-4 py-3">
              <Text className="flex-1">{label}</Text>
              <ToggleGroup
                type="single"
                variant="outline"
                size="sm"
                accessibilityLabel={label}
                value={profile[key]}
                onValueChange={(value) => {
                  if (value === 'public' || value === 'private') updateProfile({ [key]: value as Visibility });
                }}>
                <ToggleGroupItem value="public" aria-label={t('profile.public')} isFirst>
                  <Text>{t('profile.public')}</Text>
                </ToggleGroupItem>
                <ToggleGroupItem value="private" aria-label={t('profile.private')} isLast>
                  <Text>{t('profile.private')}</Text>
                </ToggleGroupItem>
              </ToggleGroup>
            </View>
          </Fragment>
        ))}
      </Section>

      <Section title={t('settings.language')}>
        <RadioGroup value={language} onValueChange={(v) => setLanguage(v as LanguageSetting)} className="gap-0">
          {languages.map((option, i) => (
            <Fragment key={option.value}>
              {i > 0 ? <Separator /> : null}
              <Pressable onPress={() => setLanguage(option.value)} className="flex-row items-center gap-4 py-3.5">
                <View className="flex-1">
                  <Label
                    nativeID={`lang-${option.value}`}
                    onPress={() => setLanguage(option.value)}
                    className={cn('text-base', option.value === language ? 'font-bold' : 'font-normal')}>
                    {option.label}
                  </Label>
                </View>
                <RadioGroupItem
                  value={option.value}
                  aria-labelledby={`lang-${option.value}`}
                  accessibilityLabel={option.label}
                  indicatorClassName="bg-foreground"
                />
              </Pressable>
            </Fragment>
          ))}
        </RadioGroup>
      </Section>

      <Section title={t('settings.devTools')}>
        <PreviewPositionControl />
        <View className="items-start gap-1 pt-3">
          {tools.map((tool) => (
            <Button
              key={tool.label}
              variant="link"
              className="h-auto px-0 py-1.5"
              disabled={tool.disabled}
              onPress={() => {
                tool.run();
                setDone(tool.label);
              }}>
              <Text className="text-foreground">{tool.label}</Text>
            </Button>
          ))}
          {confirmReset ? (
            <View className="flex-row flex-wrap items-center gap-4 py-1.5">
              <Text className="font-semibold">{t('settings.resetConfirm')}</Text>
              <Button variant="link" className="h-auto px-0" onPress={() => setConfirmReset(false)}>
                <Text className="text-foreground">{t('settings.resetNo')}</Text>
              </Button>
              <Button
                variant="link"
                className="h-auto px-0"
                onPress={() => {
                  resetAll();
                  router.replace('/onboarding');
                }}>
                <Text className="text-foreground">{t('settings.resetYes')}</Text>
              </Button>
            </View>
          ) : (
            <Button variant="link" className="h-auto px-0 py-1.5" onPress={() => setConfirmReset(true)}>
              <Text className="text-foreground">{t('settings.reset')}</Text>
            </Button>
          )}
          {done ? (
            <Text variant="muted" className="text-xs">
              {t('settings.toolDone', { tool: done })}
            </Text>
          ) : null}
        </View>
      </Section>

      <Text variant="muted" className="pt-4 text-center text-xs">
        {t('settings.version', { version: Constants.expoConfig?.version ?? '' })}
      </Text>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View className="gap-1">
      <Text variant="muted" className="font-medium">
        {title}
      </Text>
      <View>{children}</View>
    </View>
  );
}
