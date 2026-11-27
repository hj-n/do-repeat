import Constants from 'expo-constants';
import { router } from 'expo-router';
import { Fragment, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Platform, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Divider } from '@/components/divider';
import { OptionRow } from '@/components/option-row';
import { Screen } from '@/components/screen';
import { Segmented } from '@/components/segmented';
import { TopBar } from '@/components/top-bar';
import { Spacing } from '@/constants/theme';
import { SAMPLE_FOLLOWER_IDS } from '@/data/sample-people';
import { PreviewPositionControl } from '@/features/check-in/preview-position-control';
import { useTheme } from '@/hooks/use-theme';
import { deviceLanguage, type LanguageSetting } from '@/i18n';
import { useAppStore, type Visibility } from '@/store/app-store';

const SAMPLE_DAYS = 12;

/** 설정: 공개, 언어, 개발용 */
export default function SettingsScreen() {
  const theme = useTheme();
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

  const visibilityOptions: { value: Visibility; label: string }[] = [
    { value: 'public', label: t('profile.public') },
    { value: 'private', label: t('profile.private') },
  ];
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
        <View style={styles.row}>
          <View style={styles.flex}>
            <AppText>{t('settings.privateAccount')}</AppText>
            <AppText variant="caption" color="textMuted">
              {profile.isPrivate && hasIncoming
                ? t('settings.publicAcceptsRequests')
                : profile.isPrivate
                  ? t('settings.privateAccountNote')
                  : t('settings.publicAccountNote')}
            </AppText>
          </View>
          <Switch
            accessibilityLabel={t('settings.privateAccount')}
            value={profile.isPrivate}
            onValueChange={(isPrivate) => updateProfile({ isPrivate })}
            trackColor={{ false: theme.surfaceMuted, true: theme.text }}
            thumbColor={theme.background}
            // 웹(react-native-web)은 켜진 상태의 동그라미 색을 따로 받아요
            {...(Platform.OS === 'web' ? ({ activeThumbColor: theme.background } as object) : {})}
          />
        </View>
        {(
          [
            ['checkInVisibility', t('settings.checkInPosts')],
            ['milestoneVisibility', t('settings.milestonePosts')],
          ] as const
        ).map(([key, label]) => (
          <Fragment key={key}>
            <Divider />
            <View style={styles.row}>
              <AppText style={styles.flex}>{label}</AppText>
              <Segmented<Visibility>
                accessibilityLabel={label}
                value={profile[key]}
                onChange={(value) => updateProfile({ [key]: value })}
                options={visibilityOptions}
              />
            </View>
          </Fragment>
        ))}
      </Section>

      <Section title={t('settings.language')}>
        {languages.map((option, i) => (
          <Fragment key={option.value}>
            {i > 0 ? <Divider /> : null}
            <OptionRow
              tone="neutral"
              title={option.label}
              selected={option.value === language}
              onPress={() => setLanguage(option.value)}
            />
          </Fragment>
        ))}
      </Section>

      <Section title={t('settings.devTools')}>
        <PreviewPositionControl />
        <View style={styles.tools}>
          {tools.map((tool) => (
            <Button
              key={tool.label}
              kind="text"
              tone="neutral"
              label={tool.label}
              disabled={tool.disabled}
              onPress={() => {
                tool.run();
                setDone(tool.label);
              }}
            />
          ))}
          {confirmReset ? (
            <View style={styles.confirm}>
              <AppText variant="bodyStrong">{t('settings.resetConfirm')}</AppText>
              <Button kind="text" tone="neutral" label={t('settings.resetNo')} onPress={() => setConfirmReset(false)} />
              <Button
                kind="text"
                tone="neutral"
                label={t('settings.resetYes')}
                onPress={() => {
                  resetAll();
                  router.replace('/onboarding');
                }}
              />
            </View>
          ) : (
            <Button kind="text" tone="neutral" label={t('settings.reset')} onPress={() => setConfirmReset(true)} />
          )}
          {done ? (
            <AppText variant="caption" color="textMuted">
              {t('settings.toolDone', { tool: done })}
            </AppText>
          ) : null}
        </View>
      </Section>

      <AppText variant="caption" color="textMuted" style={styles.version}>
        {t('settings.version', { version: Constants.expoConfig?.version ?? '' })}
      </AppText>
    </Screen>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText variant="label" color="textMuted">
        {title}
      </AppText>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.xs },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, paddingVertical: Spacing.md },
  flex: { flex: 1, gap: 2 },
  tools: { gap: Spacing.xs, paddingTop: Spacing.md },
  confirm: { flexDirection: 'row', alignItems: 'center', gap: Spacing.lg, flexWrap: 'wrap' },
  version: { textAlign: 'center', paddingTop: Spacing.lg },
});
