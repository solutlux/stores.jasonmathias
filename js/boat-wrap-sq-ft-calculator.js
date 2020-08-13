window.calculatorData = {
    sqFtPrice: 7, // $7 sq/ft
    optionSetContainerSelector: 'div[data-product-option-change]',
    dropdownLabelContent: 'Prices',
    hulkLengthLabelContent: 'Side of boat (hull) Total Length (inches)',
    hulkWidthLabelContent: 'Side of boat (hull) Total Width (inches)',
    narrowWidthLabelContent: 'Side of boat (hull) Narrow Width (inches)',
    transomLengthLabelContent: 'Transom (back) Total Length (inches)',
    transomWidthLabelContent: 'Transom (back) Total Width (inches)',
    addonsLabelContent: 'Add boat name',
    boatNameLabelContent: 'Boat name',
    logoLabelContent: 'Logo',
    yearLabelContent: 'Year',
    hulkLengthMinimumValue : 96,
    hulkLengthMaximumValue : 720,
    hulkWidthMinimumValue : 12,
    hulkWidthMaximumValue : 120,
    transomLengthMinimumValue : 0,
    transomLengthMaximumValue : 360,
    transomWidthMinimumValue : 0,
    transomWidthMaximumValue : 60,
    yearMinimumValue : 1950
};

class SquareCalculator {
    constructor(data) {
        this._optionSetContainerSelector = data.optionSetContainerSelector;

        this._addonsLabelContent = data.addonsLabelContent;
        this._boatNameLabelContent = data.boatNameLabelContent;
        this._logoLabelContent = data.logoLabelContent;
        this._yearLabelContent = data.yearLabelContent;

        this._dropdownLabelContent = data.dropdownLabelContent;
        this._hulkLengthLabelContent = data.hulkLengthLabelContent;
        this._hulkWidthLabelContent = data.hulkWidthLabelContent;
        this._transomLengthLabelContent = data.transomLengthLabelContent;
        this._transomWidthLabelContent = data.transomWidthLabelContent;
        this._narrowWidthLabelContent = data.narrowWidthLabelContent;

        this._hulkLengthMinimumValue = data.hulkLengthMinimumValue;
        this._hulkLengthMaximumValue = data.hulkLengthMaximumValue;
        this._hulkWidthMinimumValue = data.hulkWidthMinimumValue;
        this._hulkWidthMaximumValue = data.hulkWidthMaximumValue;
        this._transomLengthMinimumValue = data.transomLengthMinimumValue;
        this._transomLengthMaximumValue = data.transomLengthMaximumValue;
        this._transomWidthMinimumValue = data.transomWidthMinimumValue;
        this._transomWidthMaximumValue = data.transomWidthMaximumValue;

        this._yearMinimumValue = data.yearMinimumValue;
        this._yearMaximumValue = new Date().getFullYear();

        this._sqFtPrice = data.sqFtPrice;

        this._isActive = false;
        this._optionSetContainer = null;
        this._hulkLengthElement = null;
        this._hulkWidthElement = null;
        this._transomLengthElement = null;
        this._transomWidthElement = null;
        this._addonElement = null;
        this._dropDowns = [];
        this._event = new Event('change');

        this._calculateBound = this._calculate.bind(this);
        this._addonBound = this._addonSwitch.bind(this);
    }

    init(elements) {
        this._isActive = true;
        [this._optionSetContainer, this._hulkLengthElement, this._hulkWidthElement, this._transomLengthElement, this._transomWidthElement, ...this._dropDowns] = elements;

        this._hideDropDowns();
        this._hulkLengthElement.addEventListener('change', this._calculateBound);
        this._hulkWidthElement.addEventListener('change', this._calculateBound);
        this._transomLengthElement.addEventListener('change', this._calculateBound);
        this._transomWidthElement.addEventListener('change', this._calculateBound);

        this._hulkLengthElement.min = this._hulkLengthMinimumValue;
        this._hulkLengthElement.max = this._hulkLengthMaximumValue;
        this._hulkWidthElement.min = this._hulkWidthMinimumValue;
        this._hulkWidthElement.max = this._hulkWidthMaximumValue;

        this._transomLengthElement.min = this._transomLengthMinimumValue;
        this._transomLengthElement.max = this._transomLengthMaximumValue;
        this._transomWidthElement.min = this._transomWidthMinimumValue;
        this._transomWidthElement.max = this._transomWidthMaximumValue;

        this._calculate();
        this._addon();

        //document.querySelector('#form-action-addToCart').value = '7 Add To Cart';

    }

    destroy() {
        this._hulkLengthElement.removeEventListener('change', this._calculateBound);
        this._hulkWidthElement.removeEventListener('change', this._calculateBound);
        this._transomLengthElement.removeEventListener('change', this._calculateBound);
        this._transomWidthElement.removeEventListener('change', this._calculateBound);

        this._isActive = false;
        [this._optionSetContainer, this._hulkLengthElement, this._hulkWidthElement, this._transomLengthElement, this._transomWidthElement]
            .forEach(element => element = null);
        this._dropDowns = [];

        this._addonElement.removeEventListener('change', this._addonBound);
        this._addonElement = null;
    }

    _addon() {
        //addon switch
        this._addonLabel = this.getLabelElement(this._optionSetContainer, this._addonsLabelContent);
        if (this._addonLabel) {
            this._addonElement = this._addonLabel.map(labelElement => labelElement.parentNode.querySelector('input[type="checkbox"]'));

            if (this._addonElement) {
                this._addonElement = this._addonElement[0];
                this._addonElement.addEventListener('change', this._addonBound);
                this._addonSwitch();
            }
            this._addonLabel[0].innerHTML += '<small>Optional</small>';
        }

        const yearElement = this.getFieldsByLabel(this._optionSetContainer, this._yearLabelContent);
        if (yearElement.length > 0) {
            yearElement[0].min = this._yearMinimumValue;
            yearElement[0].max = this._yearMaximumValue;
        }

        //add headers
        const formObject = document.querySelector('form[data-cart-item-add]');
        if (formObject) {
            const faqLink = document.createElement('a');
            faqLink.href = '/boat-wraps-faq';
            faqLink.innerText = 'FAQ';
            faqLink.className = 'blocked';

            const measureLink = document.createElement('a');
            measureLink.href = '/boat-measurements';
            measureLink.className = 'blocked';
            measureLink.innerText = 'How to measure boat';

            const wrapHeader = document.createElement('h4');
            wrapHeader.innerText = 'Fine art vinyl wrap as seen in image';

            formObject.insertBefore(wrapHeader, this._optionSetContainer);
            formObject.insertBefore(measureLink, this._optionSetContainer);
            formObject.insertBefore(faqLink, this._optionSetContainer);
        }

        const transomLengthLabel = this.getLabelElement(this._optionSetContainer, this._transomLengthLabelContent)[0];
        if (transomLengthLabel) {
            transomLengthLabel.innerHTML += '<small>Optional</small>';
        }
        const transomWidthLabel = this.getLabelElement(this._optionSetContainer, this._transomWidthLabelContent)[0];
        if (transomWidthLabel) {
            transomWidthLabel.innerHTML += '<small>Optional</small>';
        }

        /*
        const narrowWidthLabel = this.getLabelElement(this._optionSetContainer, this._narrowWidthLabelContent)[0];
        if (narrowWidthLabel) {
            narrowWidthLabel.innerHTML += '<small>Optional</small>';
        }
        */

    }

    _addonSwitch() {
        const boatNameElement = [...this._optionSetContainer.querySelectorAll('label')]
            .filter(element => element.textContent.includes(this._boatNameLabelContent))
            .map(labelElement => labelElement.parentNode);
        if (boatNameElement) {
            if (this._addonElement.checked) {
                boatNameElement[0].style.display = 'block';
            } else {
                boatNameElement[0].style.display = 'none';
            }
        }
        const logoElement = [...this._optionSetContainer.querySelectorAll('label')]
            .filter(element => element.textContent.includes(this._logoLabelContent))
            .map(labelElement => labelElement.parentNode);
        if (logoElement) {
            if (this._addonElement.checked) {
                logoElement[0].style.display = 'block';
            } else {
                logoElement[0].style.display = 'none';
            }
        }
    }

    _calculate() {
        const coefHulk = this._hulkWidthElement.value > 30 ? 2 : 1;
        const coefTransom = 1;//this._transomWidthElement.value > 30 ? 2 : 1;

        const ftHulkLength = Math.ceil(this._hulkLengthElement.value / 12);
        const ftHulk5ft = Math.ceil(this._hulkWidthElement.value / 60);
        const ftTransomLength = Math.ceil(this._transomLengthElement.value / 12);
        const ftTransom5ft = Math.ceil(this._transomWidthElement.value / 60);

        const hulkPrice = ftHulkLength * ftHulk5ft * 5 * coefHulk * this._sqFtPrice;
        const transomPrice = ftTransomLength * ftTransom5ft * 5 * coefTransom * this._sqFtPrice;

        //console.log(hulkPrice + '+' + transomPrice + '=' + (hulkPrice + transomPrice));

        const item = this._getNearestItem(hulkPrice + transomPrice);
        if (item) {
            item.selected = true;
            item.dispatchEvent(this._event);
        }
    }

    _getNearestItem(price) {
        let result = false
        for (let dropDown = 0; dropDown < this._dropDowns.length; dropDown++) {
            if (this._dropDowns[dropDown].length > 0) {
                this._dropDowns[dropDown][0].selected = true;
            }
            for (let option = 0; option < this._dropDowns[dropDown].length; option++) {
                if (this._dropDowns[dropDown][option].text == price) {
                    result = this._dropDowns[dropDown][option];
                }
            }
        }
        return result;
    }

    get isActive() {
        return this._isActive;
    }

    getObservableElements() {
        const optionSetContainer = document.querySelector(this._optionSetContainerSelector);
        if (!optionSetContainer) {
            return false;
        }

        const dropDowns = this.getFieldsByLabel(optionSetContainer, this._dropdownLabelContent);
        const hulkLengthElement = this.getFieldsByLabel(optionSetContainer, this._hulkLengthLabelContent)[0];
        const hulkWidthElement = this.getFieldsByLabel(optionSetContainer, this._hulkWidthLabelContent)[0];
        const transomLengthElement = this.getFieldsByLabel(optionSetContainer, this._transomLengthLabelContent)[0];
        const transomWidthElement = this.getFieldsByLabel(optionSetContainer, this._transomWidthLabelContent)[0];


        return [optionSetContainer, hulkLengthElement, hulkWidthElement, transomLengthElement, transomWidthElement, ...dropDowns];
    }

    getLabelElement(container, label) {
        const labels = [...container.querySelectorAll(`label`)]
            .filter(element => element.textContent.includes(label));
        return labels.length ? labels : [null]; //the script should not be initialized if there is no dropdown
    };

    getFieldsByLabel(container, label) {
        const fields = this. getLabelElement(container, label).map(labelElement => labelElement.parentNode.querySelector('select') ||
                labelElement.parentNode.querySelector('input')
            );
        return fields.length ? fields : [null]; //the script should not be initialized if there is no dropdown
    };

    _hideDropDowns() {
        this._dropDowns.forEach(element => element.closest('.form-field').style.display ='none');
    }
}

const squareCalculatorHandler = new SquareCalculator(window.calculatorData);

const checkAllFieldsAndInit = () => {
    const elements = squareCalculatorHandler.getObservableElements();
    const areAllElementsPresent = elements && elements.every(element => element);
    return areAllElementsPresent
        ? !squareCalculatorHandler.isActive && squareCalculatorHandler.init(elements)
        : squareCalculatorHandler.isActive && squareCalculatorHandler.destroy();
};

const setCalculatorObserver = () => {
    const documentObserver = new MutationObserver((mutation) => checkAllFieldsAndInit());
    documentObserver.observe(document.documentElement, {childList: true, subtree: true})
};


window.addEventListener('DOMContentLoaded', () => {
    checkAllFieldsAndInit();
    setCalculatorObserver();
});