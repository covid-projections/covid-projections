import React from 'react';
import { Chevron } from './Shared.style';
import TextAndIconWithSpecialWrapping from 'components/TextAndIconWithSpecialWrapping/TextAndIconWithSpecialWrapping';

const LabelWithChevron: React.FC<{ text: string }> = ({ text }) => {
  return <TextAndIconWithSpecialWrapping text={text} icon={<Chevron />} />;
};

export default LabelWithChevron;
