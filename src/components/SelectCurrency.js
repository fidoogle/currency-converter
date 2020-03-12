import React, { useEffect } from 'react'
import PropTypes from "prop-types";

const SelectCurrency = ({currency, setCurrency}) => {
    const change = event => {
        setCurrency(JSON.parse(event.target.value))
    }

    useEffect(() => { //good for setting initial value
        if (currency) {
            setCurrency(currency[0])
        }
    }, [currency]);

    return (
        <select onChange={change}>
            {currency && currency.map(o => 
                <option value={JSON.stringify(o)} key={o.code}>{o.name} ({o.symbol_native})</option>
            )}
        </select>
    );
};

SelectCurrency.propTypes = {
    currency: PropTypes.arrayOf(PropTypes.object),
    setCurrency: PropTypes.func
}

export default SelectCurrency;