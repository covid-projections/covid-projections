import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {
  FacebookShareButton,
  TwitterShareButton,
  FacebookIcon,
  TwitterIcon,
} from 'react-share';
import {
  CopyLinkButton,
  SocialButtonsContainer,
  SocialShareButton,
} from './ShareButtons.style';
import { SocialButton } from 'components/ShareButtons/ShareButtons.style';
import EmbedPreview from 'components/ShareBlock/EmbedPreview';
import { Region } from 'common/regions';

const SocialButtons = ({
  iconSize,
  shareURL,
  shareQuote,
  region,
  hideSocialButtons,
  showEmbedButton,
}: {
  iconSize: number;
  shareURL: string;
  shareQuote: string;
  region: Region;
  hideSocialButtons: () => void;
  showEmbedButton?: boolean;
}) => {
  const url = shareURL || 'https://covidactnow.org/';
  const quote =
    shareQuote ||
    'I’m keeping track of the latest COVID data and risk levels with @CovidActNow. What does your community look like?';
  const hashtag = 'COVIDActNow';

  const [copyLinkButtonTextA, setCopyLinkButtonTextA] = useState('Copy');
  const [copyLinkButtonTextB, setCopyLinkButtonTextB] = useState('Link');

  const iconProps = {
    size: iconSize,
    round: false,
    fill: 'auto',
  };

  const buttonProps = {
    disableElevation: true,
    variant: 'contained',
  };

  const [showEmbedPreviewModal, setShowEmbedPreviewModal] = useState(false);

  function closeShareButtonGroup() {
    setTimeout(() => hideSocialButtons(), 1000);
  }

  return (
    <SocialButtonsContainer>
      {showEmbedButton && (
        <SocialShareButton variant="contained" color="#007fb1">
          <SocialButton onClick={() => setShowEmbedPreviewModal(true)}>
            Embed
          </SocialButton>
          <EmbedPreview
            open={showEmbedPreviewModal}
            onClose={() => {
              setShowEmbedPreviewModal(false);
              closeShareButtonGroup();
            }}
            region={region}
          />
        </SocialShareButton>
      )}
      <CopyToClipboard
        text={url}
        onCopy={() => {
          setCopyLinkButtonTextA('Copied!');
          setCopyLinkButtonTextB('');
        }}
      >
        <SocialShareButton
          {...buttonProps}
          color="#007fb1"
          onClick={closeShareButtonGroup}
        >
          <CopyLinkButton>
            {copyLinkButtonTextA}
            <br />
            {copyLinkButtonTextB}
          </CopyLinkButton>
        </SocialShareButton>
      </CopyToClipboard>
      <SocialShareButton
        {...buttonProps}
        color="#00acee"
        onClick={closeShareButtonGroup}
      >
        <TwitterShareButton url={url} hashtags={[hashtag]} title={quote}>
          <TwitterIcon {...iconProps} />
        </TwitterShareButton>
      </SocialShareButton>
      <SocialShareButton
        {...buttonProps}
        color="#3b5998"
        onClick={closeShareButtonGroup}
      >
        <FacebookShareButton url={url} quote={quote}>
          <FacebookIcon {...iconProps} />
        </FacebookShareButton>
      </SocialShareButton>
    </SocialButtonsContainer>
  );
};

export default SocialButtons;
