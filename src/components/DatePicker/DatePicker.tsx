import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ReactDatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type DatePickerProps = ReactDatePickerProps & {
    errorMessage?: React.ReactNode;
};

const DatePicker: FC<DatePickerProps> = ({ errorMessage, ...rest }) => {
    const { t } = useTranslation();

    return (
        <div>
            <ReactDatePicker
                dateFormat="MMM d, yyyy h:mm aa"
                placeholderText={t('common.select-date')}
                autoComplete="off"
                {...rest}
            />
            {errorMessage != null && <div>{errorMessage}</div>}
        </div>
    );
};

export default DatePicker;
