import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Segmented } from '@/components/segmented';
import { Spacing } from '@/constants/theme';
import { usePreviewPosition, type PreviewPosition } from '@/lib/preview-location';

/** 웹 미리보기 전용: 위치 인증이 장소 안/밖에서 일어나는 척하게 바꿉니다. 폰에서는 안 보여요. */
export function PreviewPositionControl({ onChange }: { onChange?: (p: PreviewPosition) => void }) {
  const { t } = useTranslation();
  const preview = usePreviewPosition();
  if (!preview) return null;

  return (
    <View style={styles.wrap}>
      <AppText variant="label" color="textMuted">
        {t('settings.previewLocation')}
      </AppText>
      <Segmented<PreviewPosition>
        accessibilityLabel={t('settings.previewLocation')}
        value={preview.position}
        onChange={(p) => {
          preview.setPosition(p);
          onChange?.(p);
        }}
        options={[
          { value: 'inside', label: t('settings.previewInside') },
          { value: 'outside', label: t('settings.previewOutside') },
        ]}
      />
      <AppText variant="caption" color="textMuted">
        {t('settings.previewNote')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: Spacing.sm },
});
