import React, { useState } from 'react';
import { ClickAwayListener } from '@material-ui/core';
import { v4 as uuidv4 } from 'uuid';
import { ListButton, ListContainer, DropdownWrapper } from './Dropdown.style';
import MenuButton from './MenuButton';
import { EventCategory, EventAction, trackEvent } from 'components/Analytics';

const Dropdown: React.FC<{
  menuLabel: string;
  itemLabels: string[];
  onSelect: (itemIndex: number) => void;
  buttonSelectionLabel: string;
  maxWidth: number;
}> = ({ menuLabel, itemLabels, onSelect, buttonSelectionLabel, maxWidth }) => {
  const [open, setOpen] = useState(false);

  const handleMenuButtonClick = () => {
    if (!open) {
      trackEvent(
        EventCategory.EXPLORE,
        EventAction.CLICK,
        `Open menu: ${menuLabel}`,
      );
    }
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const menuId = uuidv4();

  return (
    <ClickAwayListener onClickAway={() => setOpen(false)}>
      <DropdownWrapper $maxWidth={maxWidth}>
        <MenuButton
          onClick={handleMenuButtonClick}
          open={open}
          menuLabel={menuLabel}
          buttonLabel={buttonSelectionLabel}
          ariaControlsId={menuId}
        />
        <ListContainer $open={open} $maxWidth={maxWidth}>
          {itemLabels.map((label: string, i: number) => {
            return (
              <ListButton
                key={`Menu item: ${label}`}
                $maxWidth={maxWidth}
                onClick={() => {
                  onSelect(i);
                  trackEvent(
                    EventCategory.EXPLORE,
                    EventAction.CLICK,
                    `${menuLabel}: ${label}`,
                  );
                  handleClose();
                }}
              >
                {label}
              </ListButton>
            );
          })}
        </ListContainer>
      </DropdownWrapper>
    </ClickAwayListener>
  );
};

export default Dropdown;
