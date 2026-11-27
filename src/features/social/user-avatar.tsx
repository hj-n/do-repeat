import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

/** 사람 사진 대신 이름 첫 글자 (shadcn Avatar + Fallback) */
export function UserAvatar({ name, className, textClassName }: { name: string; className?: string; textClassName?: string }) {
  return (
    <Avatar alt={name} className={cn('size-9', className)}>
      <AvatarFallback className="bg-primary/10">
        <Text className={cn('text-primary text-sm font-bold', textClassName)}>{(name.trim()[0] ?? '?').toUpperCase()}</Text>
      </AvatarFallback>
    </Avatar>
  );
}
