import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type TextTabsProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: { value: T; label: string }[];
};

/** shadcn Tabs를 글자만 보이게 쓴 것: 고른 탭은 굵고 진하게, 나머지는 회색 (상자 없이) */
export function TextTabs<T extends string>({ value, onValueChange, options }: TextTabsProps<T>) {
  return (
    <Tabs value={value} onValueChange={(v) => onValueChange(v as T)}>
      <TabsList className="h-auto gap-5 bg-transparent p-0">
        {options.map((option) => (
          <TabsTrigger
            key={option.value}
            value={option.value}
            className="border-0 bg-transparent px-0 py-1 shadow-none dark:bg-transparent">
            <Text className={cn('text-base', option.value === value ? 'text-foreground font-bold' : 'text-muted-foreground font-medium')}>
              {option.label}
            </Text>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
