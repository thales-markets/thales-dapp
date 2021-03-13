import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Message } from 'semantic-ui-react';

type DatePickerProps = ReactDatePickerProps & {
    errorMessage?: React.ReactNode;
};

export const DatePicker: FC<DatePickerProps> = ({ errorMessage, ...rest }) => {
    const { t } = useTranslation();

    return (
        <div>
            <ReactDatePicker
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText={t('common.select-date')}
                autoComplete="off"
                {...rest}
            />
            {errorMessage != null && <Message negative>{errorMessage}</Message>}
        </div>
    );
};

export default DatePicker;
