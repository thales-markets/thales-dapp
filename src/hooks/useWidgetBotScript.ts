import { useEffect } from 'react';
import { ThemeInterface } from 'types/ui';

const useWidgetBotScript = (preventWidgetLoad: boolean, theme: ThemeInterface) => {
    useEffect(() => {
        if (preventWidgetLoad || (window as any).crate) {
            return;
        }

        const script = document.createElement('script');

        script.src = 'https://cdn.jsdelivr.net/npm/@widgetbot/crate@3';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            new (window as any).Crate({
                server: '906484044915687464',
                channel: '907009541965742080',
                css: `
                    .button {
                        background-color: ${theme.background.secondary};
                        box-shadow: none;
                    }
                    @media (max-width: 950px) {
                        &:not(.open) .button {
                            margin-bottom: 25px;
                            width: 45px;
                            height: 45px;
                        }
                    }
              `,
            });
        };

        document.body.appendChild(script);

        return () => {
            // clean up the script when the component in unmounted
            document.body.removeChild(script);
        };
    }, [preventWidgetLoad, theme]);
};

export default useWidgetBotScript;
