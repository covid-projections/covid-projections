import React, { Fragment, useState } from 'react';
import {
  BreadcrumbsContainer,
  SectionName,
  LearnHeading1,
  LastUpdatedDate,
} from '../Learn.style';
import AppMetaTags from 'components/AppMetaTags/AppMetaTags';
import { MarkdownContent } from 'components/Markdown';
import { EventCategory } from 'components/Analytics';
import PageContent from 'components/PageContent';
import { glossaryContent, Term } from 'cms-content/learn/glossary';
import { learnPages } from 'cms-content/learn';
import Breadcrumbs from 'components/Breadcrumbs';
import { Anchor } from 'components/TableOfContents';
import { formatMetatagDate, formatNumericalDate } from 'common/utils';
import ScrollToTopButton from 'components/SharedComponents/ScrollToTopButton';
import { useScrollToTopButton } from 'common/hooks';
import Footer from 'screens/Learn/Footer/Footer';
import ExternalLink from 'components/ExternalLink';

function getGlossaryFooter(): React.ReactElement {
  return (
    <Fragment>
      *Created in collaboration with COVID Explained, a team of researchers from
      Brown University, Harvard Medical School, Massachusetts Institute of
      Technology and Massachusetts General Hospital. Learn more at{' '}
      <ExternalLink href="https://explaincovid.org/about">
        explaincovid.org/about
      </ExternalLink>
    </Fragment>
  );
}

const Glossary: React.FC = () => {
  const {
    header,
    intro,
    lastUpdatedDate,
    terms,
    metadataTitle,
    metadataDescription,
  } = glossaryContent;

  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const showScrollToTopButton = useScrollToTopButton(
    showScrollToTop,
    setShowScrollToTop,
  );

  const date = formatMetatagDate();

  return (
    <Fragment>
      <AppMetaTags
        canonicalUrl="/glossary"
        pageTitle={metadataTitle}
        pageDescription={`${date} ${metadataDescription}`}
      />
      <PageContent sidebarItems={learnPages}>
        <BreadcrumbsContainer>
          <Breadcrumbs item={{ to: '/learn', label: 'Learn' }} />
        </BreadcrumbsContainer>
        <LearnHeading1>{header}</LearnHeading1>
        {intro && <MarkdownContent source={intro} />}
        <LastUpdatedDate>
          Last updated {formatNumericalDate(lastUpdatedDate)}
        </LastUpdatedDate>
        {terms.map((term: Term, i: number) => (
          <Fragment key={`glossary-term-${i}`}>
            <Anchor id={term.termId} />
            <SectionName>{term.term}</SectionName>
            <MarkdownContent source={term.definition} />
          </Fragment>
        ))}
        <Footer pageSpecificCopy={getGlossaryFooter()} />
        <ScrollToTopButton
          showButton={showScrollToTopButton}
          analyticsCategory={EventCategory.GLOSSARY}
        />
      </PageContent>
    </Fragment>
  );
};

export default Glossary;
