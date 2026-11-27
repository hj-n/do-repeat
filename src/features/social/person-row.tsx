import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/components/app-text';
import { Avatar } from '@/components/avatar';
import { Icon } from '@/components/icon';
import { Spacing } from '@/constants/theme';
import type { Person } from '@/data/sample-people';

/** 사람 한 줄: 동그라미, 이름, @아이디, 오른쪽에 버튼 */
export function PersonRow({ person, right }: { person: Person; right?: ReactNode }) {
  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="link"
        onPress={() => router.push({ pathname: '/user/[id]', params: { id: person.id } })}
        style={styles.who}>
        <Avatar name={person.displayName} />
        <View style={styles.names}>
          <View style={styles.nameLine}>
            <AppText variant="bodyStrong" numberOfLines={1}>
              {person.displayName}
            </AppText>
            {person.isPrivate ? <Icon name="lock" size={14} color="textMuted" /> : null}
          </View>
          <AppText variant="label" color="textMuted" numberOfLines={1} style={styles.regular}>
            @{person.username}
          </AppText>
        </View>
      </Pressable>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm },
  who: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  names: { flex: 1 },
  nameLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  regular: { fontWeight: '400' },
});
