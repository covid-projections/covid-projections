import React from 'react';
import Banner from './Banner';
import { SurveyButton } from './Banner.style';
import ExternalLink from '../ExternalLink';

const renderButton = () => (
  <ExternalLink href="https://can386399.typeform.com/to/fCLv9bzl#source=org">
    <SurveyButton
      variant="contained"
      color="primary"
      disableRipple
      disableFocusRipple
    >
      Take our survey
    </SurveyButton>
  </ExternalLink>
);

const MESSAGE = `We’re a team of volunteers working to provide you with 
 the most useful COVID information. Please help us improve by taking 
 this short survey!`;

const FeedbackSurveyBanner: React.FC = () => (
  <Banner message={MESSAGE} renderButton={renderButton} />
);

export default FeedbackSurveyBanner;
