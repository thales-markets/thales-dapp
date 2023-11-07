import { ScreenSizeBreakpoint } from 'enums/ui';

export const isMobile = () => window.innerWidth <= ScreenSizeBreakpoint.SMALL;
