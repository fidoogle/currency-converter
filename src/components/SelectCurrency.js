import React, { useEffect, useRef } from 'react'
import PropTypes from "prop-types";

const SelectCurrency = ({currency, setCurrency}) => {
    const refContainer = useRef(null);
    const change = event => setCurrency(event.target.value)

    useEffect(() => { //good for setting initial value
        setCurrency(refContainer.current.value)
    }, [currency]);

    return (
        <select onChange={change} ref={refContainer}>
            {currency && currency.map(o => 
                <option value={o.code} key={o.code}>{o.name} ({o.symbol_native})</option>
            )}
        </select>
    );
};

SelectCurrency.propTypes = {
    currency: PropTypes.arrayOf(PropTypes.object),
    setCurrency: PropTypes.func
}

export default SelectCurrency;