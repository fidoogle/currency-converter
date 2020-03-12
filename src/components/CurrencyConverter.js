import React, { useEffect, useState } from 'react'
import { fetchCommonCurrency, fetchRates } from '../services'
import SelectCurrency from './SelectCurrency'
import fx from 'money'

const ALLOW_CHARS = /[0-9]+/;
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
    const [currency, setCurrency] = useState(null); //common currency

    const [ratesError, setRatesError] = useState(null);
    const [ratesToError, setRatesToError] = useState(null);

    const [baseCurrency, setBaseCurrency] = useState(DEFAULT_CURRENCY);
    const [equivalentCurrency, setEquivalentCurrency] = useState(DEFAULT_CURRENCY);

    const [formattedAmount, setFormattedAmount] = useState('0.00');
    const [fromAmount, setFromAmount] = useState(0);
    const [toAmount, setToAmount] = useState(0);
 
    useEffect(() => {
        fetchCommonCurrency().then(
            p => {
                setCurrency(Object.values(p))
            },
            e => {
                //setCurrencyError(e)
            }
        )
    }, []);

    useEffect(() => {
        if (baseCurrency) {
            fetchRates(baseCurrency.code).then(
                p => {
                    fx.rates = p.rates
                    computeConversion()
                    setRatesError(null)
                },
                e => {
                    setRatesError(e)
                    setToAmount(0)
                }
            )
        }
    }, [baseCurrency.code])

    useEffect(() => {
        computeConversion()
    }, [equivalentCurrency.code])

    const pad = (number, length) => {
        let str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        const newStr = str.split('');
        newStr.splice(-2,0,'.')
        return newStr;
    }

    const updateConversion = (event) => {
        const amount = event.target.value
        setFromAmount(amount)
        setFormattedAmount(pad(amount, 3))
        computeConversion(amount)
    }

    const computeConversion = (val) => {
        const startAmount = val || fromAmount
        try {
            fx.base = baseCurrency.code
            setToAmount(fx(startAmount).from(baseCurrency.code).to(equivalentCurrency.code)/100)
            setRatesToError(null)
        } catch(e) {
            setToAmount(0)
            setRatesToError(e)
        }
    }

    const numbersOnly = (event) => {
        if (!ALLOW_CHARS.test(event.key)) {
            event.preventDefault();
        } 
    }

    const correctFormat = (val) => {//correct weird format inside input field
        if (typeof(val)==='object') {
            return val.join('')
        }
        return val
    }

    return (
        <div>
            <h2>Money Converter</h2>
            <hr/>
            <div className="box">
                Base Currency:
                <div className="mask">
                    <input 
                        type="text" 
                        className="user-input"
                        value={fromAmount}
                        onChange={updateConversion}
                        onKeyPress={numbersOnly}
                        />
                    <input 
                        type="text" 
                        className="user-sees"
                        onChange={()=>{}}
                        value={correctFormat(formattedAmount)}
                        />
                </div>
                <br/><br/>
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
                <br/>
                <SelectCurrency currency={currency} setCurrency={setEquivalentCurrency}/>
                {
                    equivalentCurrency && ratesToError && <div className="error">rates unvailable for: {equivalentCurrency.symbol} - {equivalentCurrency.symbol_native}</div>
                }
            </div>
        </div>
    );
};

export default CurrencyConverter