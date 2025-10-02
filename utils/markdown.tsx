import React from 'react';
import { assertString } from './assertString';

export const parseInlineMarkdown = (text: unknown) => {
  const safeText = assertString('parseInlineMarkdown', text);
  if (!safeText) return null;
  
  const parts = safeText.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (typeof part !== 'string') return null;
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
};

export const SafeText = ({ value }: { value: unknown }) => {
  return <>{assertString('SafeText', value)}</>;
};
