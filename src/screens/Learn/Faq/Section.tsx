import React, { Fragment } from 'react';
import { SectionName, ItemName, ItemsContainer } from '../Learn.style';
import { MarkdownContent } from 'components/Markdown';
import { FaqSection, Question } from 'cms-content/learn';
import SmallShareButtons from 'components/SmallShareButtons';
import { trackEvent, EventAction, EventCategory } from 'components/Analytics';
import urlJoin from 'url-join';

const Section = (props: { section: FaqSection }) => {
  const { section } = props;
  const trackShareFacebook = () =>
    trackEvent(EventCategory.FAQ, EventAction.SHARE, 'facebook');
  const trackShareTwitter = () =>
    trackEvent(EventCategory.FAQ, EventAction.SHARE, 'twitter');
  const trackCopyLink = () =>
    trackEvent(EventCategory.FAQ, EventAction.COPY_LINK, 'FAQ');
  return (
    <Fragment>
      <SectionName id={section.sectionId}>{section.sectionTitle}</SectionName>
      <ItemsContainer>
        {section.questions.map((question: Question, i: number) => (
          <Fragment key={`faq-question-${i}`}>
            <ItemName id={question.questionId}>{question.question}</ItemName>
            <MarkdownContent source={question.answer} />
            <SmallShareButtons
              shareUrl={urlJoin(
                'https://covidactnow.org',
                'faq',
                `#${question.questionId}`,
              )}
              shareQuote={`${question.question} @CovidActNow breaks down my top COVID questions. Learn more:`}
              onCopyLink={trackCopyLink}
              onShareOnFacebook={trackShareFacebook}
              onShareOnTwitter={trackShareTwitter}
            />
          </Fragment>
        ))}
      </ItemsContainer>
    </Fragment>
  );
};

export default Section;
