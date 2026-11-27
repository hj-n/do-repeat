import Constants from 'expo-constants';
import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Switch, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Button } from '@/components/button';
import { Segmented } from '@/components/segmented';
import { Screen } from '@/components/screen';
import { TopBar } from '@/components/top-bar';
import { Radius, Spacing } from '@/constants/theme';
import { SAMPLE_FOLLOWER_IDS } from '@/data/sample-people';
import { PreviewPositionControl } from '@/features/check-in/preview-position-control';
import { useTheme } from '@/hooks/use-theme';
import { deviceLanguage, type LanguageSetting } from '@/i18n';
import { useAppStore, type Visibility } from '@/store/app-store';

const SAMPLE_DAYS = 12;

/** 설정: 공개 범위, 언어, 개발용 도구 */
export default function SettingsScreen() {
  const theme = useTheme();
  const { t } = useTranslation();
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const fillSampleHistory = useAppStore((s) => s.fillSampleHistory);
  const resetAll = useAppStore((s) => s.resetAll);
  const hasHabits = useAppStore((s) => s.habits.length > 0);
  const profile = useAppStore((s) => s.profile);
  const updateProfile = useAppStore((s) => s.updateProfile);
  const hasIncoming = useAppStore((s) => s.social.incoming.length > 0);
  const hasOutgoing = useAppStore((s) => s.social.outgoing.length > 0);
  const acceptOutgoingRequests = useAppStore((s) => s.acceptOutgoingRequests);
  const receiveSampleFollows = useAppStore((s) => s.receiveSampleFollows);
  const visibilityOptions: { value: Visibility; label: string }[] = [
    { value: 'public', label: t('profile.public') },
    { value: 'private', label: t('profile.private') },
  ];
  const [filled, setFilled] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const options: { value: LanguageSetting; label: string }[] = [
    {
      value: 'system',
      label: t('settings.languageSystemCurrent', { language: t(`language.${deviceLanguage()}`) }),
    },
    { value: 'en', label: t('language.en') },
    { value: 'ko', label: t('language.ko') },
  ];

  return (
    <Screen>
      <TopBar title={t('settings.title')} fallback="/profile" />

      <View style={styles.section}>
        <AppText variant="label" color="textMuted">
          {t('settings.privacy')}
        </AppText>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={styles.row}>
            <View style={styles.rowLabel}>
              <AppText>{t('settings.privateAccount')}</AppText>
              <AppText variant="caption" color="textMuted">
                {profile.isPrivate ? t('settings.privateAccountNote') : t('settings.publicAccountNote')}
              </AppText>
              {profile.isPrivate && hasIncoming ? (
                <AppText variant="caption" color="accent">
                  {t('settings.publicAcceptsRequests')}
                </AppText>
              ) : null}
            </View>
            <Switch
              accessibilityLabel={t('settings.privateAccount')}
              value={profile.isPrivate}
              onValueChange={(isPrivate) => updateProfile({ isPrivate })}
              trackColor={{ false: theme.surfaceMuted, true: theme.accent }}
              thumbColor={theme.surface}
            />
          </View>
          {(
            [
              ['checkInVisibility', t('settings.checkInPosts')],
              ['milestoneVisibility', t('settings.milestonePosts')],
            ] as const
          ).map(([key, label]) => (
            <View key={key} style={[styles.row, { borderTopWidth: 1, borderTopColor: theme.border }]}>
              <AppText style={styles.rowLabel}>{label}</AppText>
              <Segmented<Visibility>
                accessibilityLabel={label}
                value={profile[key]}
                onChange={(value) => updateProfile({ [key]: value })}
                options={visibilityOptions}
              />
            </View>
          ))}
        </View>
        <AppText variant="caption" color="textMuted">
          {t('settings.postPrivateNote')}
        </AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="label" color="textMuted">
          {t('settings.language')}
        </AppText>
        <View style={[styles.group, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          {options.map((option, index) => {
            const selected = option.value === language;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected }}
                onPress={() => setLanguage(option.value)}
                style={[
                  styles.row,
                  index > 0 && { borderTopWidth: 1, borderTopColor: theme.border },
                ]}>
                <AppText style={styles.rowLabel}>{option.label}</AppText>
                <View style={[styles.radio, { borderColor: selected ? theme.accent : theme.border }]}>
                  {selected ? <View style={[styles.radioDot, { backgroundColor: theme.accent }]} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <AppText variant="label" color="textMuted">
          {t('settings.devTools')}
        </AppText>
        <View style={[styles.group, styles.tools, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <PreviewPositionControl />
          <Button
            kind="secondary"
            label={t('settings.fillSample', { count: SAMPLE_DAYS })}
            disabled={!hasHabits}
            onPress={() => {
              fillSampleHistory(SAMPLE_DAYS);
              setFilled(true);
            }}
          />
          <Button
            kind="secondary"
            label={t('settings.receiveFollows')}
            onPress={() => receiveSampleFollows(SAMPLE_FOLLOWER_IDS)}
          />
          <Button
            kind="secondary"
            label={t('settings.acceptOutgoing')}
            disabled={!hasOutgoing}
            onPress={acceptOutgoingRequests}
          />
          {filled ? (
            <AppText variant="label" color="accent">
              {t('settings.fillSampleDone', { count: SAMPLE_DAYS })}
            </AppText>
          ) : null}
          {confirmReset ? (
            <View style={[styles.confirm, { backgroundColor: theme.dangerSoft }]}>
              <AppText variant="bodyStrong" color="danger">
                {t('settings.resetConfirm')}
              </AppText>
              <View style={styles.confirmButtons}>
                <View style={styles.flex}>
                  <Button kind="secondary" label={t('settings.resetNo')} onPress={() => setConfirmReset(false)} />
                </View>
                <View style={styles.flex}>
                  <Button
                    label={t('settings.resetYes')}
                    onPress={() => {
                      resetAll();
                      router.replace('/onboarding');
                    }}
                  />
                </View>
              </View>
            </View>
          ) : (
            <Button kind="secondary" label={t('settings.reset')} onPress={() => setConfirmReset(true)} />
          )}
        </View>
      </View>

      <AppText variant="caption" color="textMuted" style={styles.version}>
        {t('settings.version', { version: Constants.expoConfig?.version ?? '' })}
      </AppText>
    </Screen>
  );
}

const styles = StyleSheet.create({
  section: { gap: Spacing.sm },
  group: { borderWidth: 1, borderRadius: Radius.lg, overflow: 'hidden' },
  tools: { padding: Spacing.lg, gap: Spacing.md },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
    gap: Spacing.md,
  },
  rowLabel: { flex: 1 },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  confirm: { borderRadius: Radius.md, padding: Spacing.lg, gap: Spacing.md },
  confirmButtons: { flexDirection: 'row', gap: Spacing.sm },
  flex: { flex: 1 },
  version: { textAlign: 'center' },
});
