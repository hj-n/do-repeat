import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { usePreviewPosition, type PreviewPosition } from '@/lib/preview-location';

/** 웹 미리보기 전용: 위치 인증이 장소 안/밖에서 일어나는 척하게 바꿉니다. 폰에서는 안 보여요. */
export function PreviewPositionControl({ onChange }: { onChange?: (p: PreviewPosition) => void }) {
  const { t } = useTranslation();
  const preview = usePreviewPosition();
  if (!preview) return null;

  return (
    <View className="gap-2">
      <Label>{t('settings.previewLocation')}</Label>
      <ToggleGroup
        type="single"
        variant="outline"
        size="sm"
        className="self-start"
        accessibilityLabel={t('settings.previewLocation')}
        value={preview.position}
        onValueChange={(value) => {
          if (value !== 'inside' && value !== 'outside') return;
          preview.setPosition(value);
          onChange?.(value);
        }}>
        <ToggleGroupItem value="inside" aria-label={t('settings.previewInside')} isFirst className="flex-none px-3">
          <Text numberOfLines={1}>{t('settings.previewInside')}</Text>
        </ToggleGroupItem>
        <ToggleGroupItem value="outside" aria-label={t('settings.previewOutside')} isLast className="flex-none px-3">
          <Text numberOfLines={1}>{t('settings.previewOutside')}</Text>
        </ToggleGroupItem>
      </ToggleGroup>
      <Text variant="muted" className="text-xs">
        {t('settings.previewNote')}
      </Text>
    </View>
  );
}
