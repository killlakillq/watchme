'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/sidebar';

export default function History() {
  const [isOpen, setIsOpen] = useState(true);

  return <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />;
}
