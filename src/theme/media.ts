type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Breakpoints = Record<Breakpoint, number>;

export const breakpoints: Breakpoints = {
    xs: 0,
    sm: 480,
    md: 768,
    lg: 1150,
    xl: 1300,
};
