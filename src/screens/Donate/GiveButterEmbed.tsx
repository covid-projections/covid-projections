import React from 'react';
import { EmbedWrapper } from 'screens/Donate/Donate.style';

const GiveButterEmbed: React.FC<{ embedUrl: string }> = ({ embedUrl }) => {
  return (
    <EmbedWrapper>
      <iframe
        title="Donate to Covid Act Now on GiveButter"
        src={embedUrl}
        width="100%"
        height="100%"
        style={{ maxWidth: '601px' }}
        name="givebutter"
        frameBorder="0"
        scrolling="auto"
        seamless
        data-allowPaymentRequest
      ></iframe>
      <script src="https://givebutter.com/js/widget.js"></script>
    </EmbedWrapper>
  );
};

export default GiveButterEmbed;
