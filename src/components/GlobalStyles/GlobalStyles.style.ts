import { createGlobalStyle } from 'styled-components';
import theme from 'assets/theme';

// TODO(pablo): We want to grab these from the ThemeProvider:
// color: ${props => props.theme.colors.interactiveBase} but TS
// complains if we do
// See https://github.com/styled-components/styled-components/issues/1589#issuecomment-578294784
const GlobalStyle = createGlobalStyle`
  a {
    color: ${theme.colors.interactiveBase};
  }

  a:hover {
    color: ${theme.colors.interactiveHover};
    text-decoration: underline;
  }
`;

export default GlobalStyle;
