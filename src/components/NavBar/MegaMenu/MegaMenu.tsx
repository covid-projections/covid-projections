import React from 'react';
import Fade from '@material-ui/core/Fade';
import { StyledMegaMenu } from './MegaMenu.style';
import MenuContent from 'components/MenuContent';
import { trackEvent, EventCategory, EventAction } from 'components/Analytics';
import { LockBodyScroll } from 'components/Dialogs';
import { useBreakpoint } from 'common/hooks';

const MegaMenu: React.FC<{
  open: boolean;
  closeMenu: () => void;
  onMouseLeave: (e: React.MouseEvent<{}>) => void;
}> = ({ open, closeMenu, onMouseLeave }) => {
  const isMobile = useBreakpoint(800);

  const onClick = (label: string) => {
    closeMenu();
    trackEvent(EventCategory.TOP_NAVBAR, EventAction.NAVIGATE, label);
  };

  return (
    <>
      {isMobile && open && <LockBodyScroll />}
      <Fade in={open} timeout={0}>
        <StyledMegaMenu role="navigation" onMouseLeave={onMouseLeave}>
          <MenuContent onClick={onClick} />
        </StyledMegaMenu>
      </Fade>
    </>
  );
};

export default MegaMenu;
