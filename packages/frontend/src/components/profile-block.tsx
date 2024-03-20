import React, { FC } from 'react';
import { Ellipsis } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileBlockProps {
  className?: string;
}

const ProfileBlock: FC<ProfileBlockProps> = ({ className }) => {
  const classNames = ['text-white', 'border', 'p-2', 'rounded', 'flex', className];

  return (
    <div className={classNames.join(' ')}>
      <Avatar className="w-10 h-10">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="ml-2 mt-2">
        <p>Guest</p>
      </div>
      <div className="ml-28 mt-2">
        <Ellipsis />
      </div>
    </div>
  );
};

export default ProfileBlock;
