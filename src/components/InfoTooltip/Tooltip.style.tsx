import styled from 'styled-components';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { COLOR_MAP } from 'common/colors';
import { MarkdownBody } from 'components/Markdown';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import { withStyles } from '@material-ui/core/styles';
import theme from 'assets/theme';
import { materialSMBreakpoint } from 'assets/theme/sizes';

const TooltipWithStyles = withStyles({
  tooltip: {
    backgroundColor: 'black',
    color: 'white',
    fontSize: '.8125rem',
    lineHeight: '1.4',
    padding: '16px',
    [theme.breakpoints.down('xs')]: {
      padding: '16px 24px',
    },
  },
  arrow: {
    color: 'black',
  },
})(Tooltip);

export const StyledTooltip = styled(TooltipWithStyles).attrs(props => ({
  placement: 'bottom',
  arrow: true,
  interactive: true,
  TransitionComponent: Fade,
  'aria-describedby': 'notifications-desc',
  enterDelay: 0,
  enterTouchDelay: 0,
}))``;

export const InfoIcon = styled(InfoOutlinedIcon)<{ isOpen: boolean }>`
  color: ${({ isOpen }) =>
    isOpen ? COLOR_MAP.BLUE : COLOR_MAP.GRAY_BODY_COPY};
  cursor: pointer;
  margin-left: 0.5rem;
  height: 18px;
  width: 18px;
`;

export const StyledMarkdown = styled(MarkdownBody)`
  p,
  a {
    color: white;
    font-size: 0.8125rem;
    line-height: 1.4;
    margin: 0;
  }
`;

export const HiddenDiv = styled.div`
  clip-path: inset(100%);
  clip: rect(1px, 1px, 1px, 1px);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const DesktopOnly = styled.div`
  display: none;

  @media (min-width: ${materialSMBreakpoint}) {
    display: block;
  }
`;

export const MobileOnly = styled.div`
  @media (min-width: ${materialSMBreakpoint}) {
    display: none;
  }
`;