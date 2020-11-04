import React, { Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import * as Styles from './SidebarContents.style';

interface TocItem {
  label: string;
  to: string;
  items?: TocItem[];
}

function getHash(item: TocItem) {
  const parts = item.to.split('#');
  return parts.length > 1 ? parts[1] : '';
}

const SidebarContents: React.FC<{ items: TocItem[] }> = ({ items }) => {
  const { hash, pathname } = useLocation();

  /**
   * Disable highlighting based on scroll position when the user is on
   * a hash link or when the child item belongs to a different page
   */
  function highlightItem(topLevelItem: TocItem): boolean {
    return !hash && topLevelItem.to === pathname;
  }

  return (
    <nav>
      <Styles.TopLevelList>
        {items.map(topLevelItem => (
          <li key={topLevelItem.to}>
            <Fragment>
              <Styles.TopLevelLink to={topLevelItem.to}>
                {topLevelItem.label}
              </Styles.TopLevelLink>
              {topLevelItem.items && (
                <Styles.InnerList
                  items={topLevelItem.items.map(getHash)}
                  currentClassName={highlightItem(topLevelItem) ? 'active' : ''}
                >
                  {topLevelItem.items.map(childItem => (
                    <li key={childItem.to}>
                      <Styles.InnerLevelLink to={childItem.to}>
                        {childItem.label}
                      </Styles.InnerLevelLink>
                    </li>
                  ))}
                </Styles.InnerList>
              )}
            </Fragment>
          </li>
        ))}
      </Styles.TopLevelList>
    </nav>
  );
};

export default SidebarContents;
