import React, { FC, InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface InputIconProps extends InputHTMLAttributes<HTMLInputElement> {
  iconStyles?: string;
  inputStyles?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const InputIcon: FC<InputIconProps> = ({
  iconStyles,
  inputStyles,
  placeholder,
  type,
  onChange
}) => (
  <>
    <Search className={cn('mw-50 text-zinc-700 absolute ml-2', iconStyles)} />
    <Input className={inputStyles} type={type} placeholder={placeholder} onChange={onChange} />
  </>
);
