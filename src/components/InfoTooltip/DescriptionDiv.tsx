/**
 * Used to make tooltips accessible. This hidden div contains a description of the
 * tooltip's content.
 * The div's ID ("tooltip-description") is referenced by the tooltip's aria-describedby attribute.
 * https://inclusive-components.design/tooltips-toggletips/
 */

import React from 'react';
import { HiddenDiv } from './Tooltip.style';

const DescriptionDiv: React.FC<{
  description: string;
}> = ({ description }) => {
  return (
    <HiddenDiv role="tooltip" id="tooltip-description">
      {description}
    </HiddenDiv>
  );
};

export default DescriptionDiv;