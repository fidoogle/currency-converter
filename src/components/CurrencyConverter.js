import React, { useEffect, useState } from 'react'
import { fetchCommonCurrency, fetchRates } from '../services'
import SelectCurrency from './SelectCurrency'
import CircularProgress from '@material-ui/core/CircularProgress'
import fx from 'money'

const DEFAULT_CURRENCY = {
    "symbol": "$",
    "name": "US Dollar",
    "symbol_native": "$",
    "decimal_digits": 2,
    "rounding": 0,
    "code": "USD",
    "name_plural": "US dollars"
}

const CurrencyConverter = () => {
    const [pending, setPending] = useState(false);

    const [currency, setCurrency] = useState(null);
    const [currencyError, setCurrencyError] = useState(null);

    const [ratesError, setRatesError] = useState(null);
    const [ratesToError, setRatesToError] = useState(null);

    const [baseCurrency, setBaseCurrency] = useState(DEFAULT_CURRENCY);
    const [equivalentCurrency, setEquivalentCurrency] = useState(DEFAULT_CURRENCY);

    const [fromAmount, setFromAmount] = useState(0);
    const [toAmount, setToAmount] = useState(0);
 
    useEffect(() => {
        fetchCommonCurrency().then(
            p => {
                setCurrency(Object.values(p))
            },
            e => {
                setPending(false)
                setCurrencyError(e)
            }
        )
    }, []);

    useEffect(() => {
        if (baseCurrency) {
            setPending(true)
            fetchRates(baseCurrency.code).then(
                p => {
                    fx.rates = p.rates
                    computeConversion()
                    setPending(false)
                    setRatesError(null)
                },
                e => {
                    setRatesError(e)
                    setToAmount(0)
                    setPending(false)
                }
            )
        }
    }, [baseCurrency.code])

    useEffect(() => {
        computeConversion()
    }, [equivalentCurrency.code])

    const updateConversion = (event) => {
        setFromAmount(event.target.value)
        computeConversion(event.target.value)
    }

    const computeConversion = (val) => {
        const startAmount = val || fromAmount
        try {
            fx.base = baseCurrency.code
            setToAmount(fx(startAmount).from(baseCurrency.code).to(equivalentCurrency.code))
            setRatesToError(null)
        } catch(e) {
            setToAmount(0)
            setRatesToError(e)
        }
    }

    return (
        <div>
            <h2>Money Converter</h2>
            <hr/>
            <div className="box">
                Base Currency:
                <input 
                    type="text" 
                    className="right-align" 
                    placeholder="from amount"
                    onChange={updateConversion}
                    />
                <SelectCurrency currency={currency} setCurrency={setBaseCurrency}/>
                {
                    baseCurrency && ratesError && <div className="error">rates unvailable for: {baseCurrency.symbol} - {baseCurrency.symbol_native}</div>
                }
            </div>
            
            <div className="box">
                Equivalent Currency:
                <input 
                    type="text" 
                    className="right-align" 
                    value={toAmount} 
                    readOnly/>
                <SelectCurrency currency={currency} setCurrency={setEquivalentCurrency}/>
                {
                    equivalentCurrency && ratesToError && <div className="error">rates unvailable for: {equivalentCurrency.symbol} - {equivalentCurrency.symbol_native}</div>
                }
            </div>
        </div>
    );
};

export default CurrencyConverter