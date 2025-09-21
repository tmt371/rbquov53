// File: 04-core-code/ui/left-panel-component.js

/**
 * @fileoverview A dedicated component for managing and rendering the Left Panel UI.
 */
export class LeftPanelComponent {
    constructor(panelElement) {
        if (!panelElement) {
            throw new Error("Panel element is required for LeftPanelComponent.");
        }
        this.panelElement = panelElement;

        // --- DOM Element References within the Left Panel ---
        // K1 Panel
        this.locationButton = document.getElementById('btn-focus-location');
        this.locationInput = document.getElementById('location-input-box');
        
        // K2 Panel
        this.fabricColorButton = document.getElementById('btn-focus-fabric');
        this.lfButton = document.getElementById('btn-light-filter');
        this.lfDelButton = document.getElementById('btn-lf-del');

        // K3 Panel
        this.k3EditButton = document.getElementById('btn-k3-edit');
        this.k3OverButton = document.getElementById('btn-batch-cycle-over');
        this.k3OiButton = document.getElementById('btn-batch-cycle-oi');
        this.k3LrButton = document.getElementById('btn-batch-cycle-lr');
        
        // K4 Panel
        this.k4InputDisplay = document.getElementById('k4-input-display');
        this.k4DualButton = document.getElementById('btn-k4-dual');
        this.k4ChainButton = document.getElementById('btn-k4-chain');
        this.k4DualPriceValue = document.querySelector('#k4-dual-price-display .price-value');

        // K5 Panel
        this.k5WinderButton = document.getElementById('btn-k5-winder');
        this.k5MotorButton = document.getElementById('btn-k5-motor');
        this.k5RemoteButton = document.getElementById('btn-k5-remote');
        this.k5ChargerButton = document.getElementById('btn-k5-charger');
        this.k5CordButton = document.getElementById('btn-k5-3m-cord');
        
        this.k5WinderDisplay = document.getElementById('k5-display-winder');
        this.k5MotorDisplay = document.getElementById('k5-display-motor');
        this.k5RemoteDisplay = document.getElementById('k5-display-remote');
        this.k5ChargerDisplay = document.getElementById('k5-display-charger');
        this.k5CordDisplay = document.getElementById('k5-display-cord');

        this.k5RemoteAddBtn = document.getElementById('btn-k5-remote-add');
        this.k5RemoteSubtractBtn = document.getElementById('btn-k5-remote-subtract');
        this.k5RemoteCountDisplay = document.getElementById('k5-display-remote-count');
        this.k5ChargerAddBtn = document.getElementById('btn-k5-charger-add');
        this.k5ChargerSubtractBtn = document.getElementById('btn-k5-charger-subtract');
        this.k5ChargerCountDisplay = document.getElementById('k5-display-charger-count');
        this.k5CordAddBtn = document.getElementById('btn-k5-cord-add');
        this.k5CordSubtractBtn = document.getElementById('btn-k5-cord-subtract');
        this.k5CordCountDisplay = document.getElementById('k5-display-cord-count');

        this.k5TotalDisplay = document.getElementById('k5-display-total'); // [NEW] Get total display element

        this.tabButtons = this.panelElement.querySelectorAll('.tab-button');
        this.tabContents = this.panelElement.querySelectorAll('.tab-content');
        
        console.log("LeftPanelComponent Initialized.");
    }

    render(uiState, quoteData) {
        this._updateTabStates(uiState);
        this._updatePanelButtonStates(uiState, quoteData);
    }

    _updateTabStates(uiState) {
        const { activeEditMode, activeTabId, k4ActiveMode, k5ActiveMode } = uiState;
        const isInEditMode = activeEditMode !== null || k4ActiveMode !== null || k5ActiveMode !== null;

        const activeTabButton = document.getElementById(activeTabId);
        const activeContentTarget = activeTabButton ? activeTabButton.dataset.tabTarget : null;

        this.tabButtons.forEach(button => {
            const isThisButtonActive = button.id === activeTabId;
            button.classList.toggle('active', isThisButtonActive);
            // Disable other tabs if any edit mode is active
            button.disabled = isInEditMode && !isThisButtonActive;
        });

        this.tabContents.forEach(content => {
            const isThisContentActive = activeContentTarget && `#${content.id}` === activeContentTarget;
            content.classList.toggle('active', isThisContentActive);
        });
        
        const panelBgColors = {
            'k1-tab': 'var(--k1-bg-color)',
            'k2-tab': 'var(--k2-bg-color)',
            'k3-tab': 'var(--k3-bg-color)',
            'k4-tab': 'var(--k4-bg-color)',
            'k5-tab': 'var(--k5-bg-color)',
        };
        this.panelElement.style.backgroundColor = panelBgColors[activeTabId] || 'var(--k1-bg-color)';
    }

    _updatePanelButtonStates(uiState, quoteData) {
        const { 
            activeEditMode, locationInputValue, lfModifiedRowIndexes, 
            k4ActiveMode, k4DualPrice, targetCell, chainInputValue,
            k5ActiveMode, k5RemoteCount, k5ChargerCount, k5CordCount,
            k5WinderTotalPrice, k5MotorTotalPrice, k5RemoteTotalPrice, k5ChargerTotalPrice, k5CordTotalPrice,
            k5GrandTotal // [NEW] Get grand total from state
        } = uiState;
        const { rollerBlindItems } = quoteData;

        // --- K1 Location Input State ---
        if (this.locationInput) {
            const isLocationActive = activeEditMode === 'K1';
            this.locationInput.disabled = !isLocationActive;
            this.locationInput.classList.toggle('active', isLocationActive);
            if (this.locationInput.value !== locationInputValue) {
                this.locationInput.value = locationInputValue;
            }
        }
        
        // --- K2 Button Active/Disabled States ---
        const isFCMode = activeEditMode === 'K2';
        const isLFSelectMode = activeEditMode === 'K2_LF_SELECT';
        const isLFDeleteMode = activeEditMode === 'K2_LF_DELETE_SELECT';
        const isAnyK2ModeActive = isFCMode || isLFSelectMode || isLFDeleteMode;

        if (this.locationButton) this.locationButton.classList.toggle('active', activeEditMode === 'K1');
        if (this.fabricColorButton) this.fabricColorButton.classList.toggle('active', isFCMode);
        if (this.lfButton) this.lfButton.classList.toggle('active', isLFSelectMode);
        if (this.lfDelButton) this.lfDelButton.classList.toggle('active', isLFDeleteMode);

        const hasBO1 = rollerBlindItems.some(item => item.fabricType === 'BO1');
        const hasLFModified = lfModifiedRowIndexes.size > 0;

        if (this.locationButton) this.locationButton.disabled = isAnyK2ModeActive;
        if (this.fabricColorButton) this.fabricColorButton.disabled = activeEditMode !== null && !isFCMode;
        if (this.lfButton) this.lfButton.disabled = (activeEditMode !== null && !isLFSelectMode) || !hasBO1;
        if (this.lfDelButton) this.lfDelButton.disabled = (activeEditMode !== null && !isLFDeleteMode) || !hasLFModified;

        // --- K3 Button Active/Disabled States ---
        const isK3EditMode = activeEditMode === 'K3';
        if (this.k3EditButton) {
            this.k3EditButton.classList.toggle('active', isK3EditMode);
            this.k3EditButton.disabled = activeEditMode !== null && !isK3EditMode;
        }
        const k3SubButtonsDisabled = !isK3EditMode;
        if (this.k3OverButton) this.k3OverButton.disabled = k3SubButtonsDisabled;
        if (this.k3OiButton) this.k3OiButton.disabled = k3SubButtonsDisabled;
        if (this.k3LrButton) this.k3LrButton.disabled = k3SubButtonsDisabled;

        // --- K4 Button Active/Disabled States ---
        if (this.k4DualButton) {
            const isDisabled = k4ActiveMode !== null && k4ActiveMode !== 'dual';
            this.k4DualButton.classList.toggle('active', k4ActiveMode === 'dual');
            this.k4DualButton.disabled = isDisabled;
        }
        if (this.k4ChainButton) {
            const isDisabled = k4ActiveMode !== null && k4ActiveMode !== 'chain';
            this.k4ChainButton.classList.toggle('active', k4ActiveMode === 'chain');
            this.k4ChainButton.disabled = isDisabled;
        }
        
        // --- K4 Input and Price Display ---
        if (this.k4InputDisplay) {
            const isChainInputActive = k4ActiveMode === 'chain' && targetCell && targetCell.column === 'chain';
            this.k4InputDisplay.disabled = !isChainInputActive;
            this.k4InputDisplay.classList.toggle('active', isChainInputActive);
            if (this.k4InputDisplay.value !== chainInputValue) {
                this.k4InputDisplay.value = chainInputValue;
            }
        }
        if (this.k4DualPriceValue) {
            const newText = (typeof k4DualPrice === 'number') ? `$${k4DualPrice.toFixed(2)}` : '';
            if (this.k4DualPriceValue.textContent !== newText) {
                this.k4DualPriceValue.textContent = newText;
            }
        }

        // --- K5 Button, Display, and Counter States ---
        const k5Buttons = [
            { el: this.k5WinderButton, mode: 'winder' },
            { el: this.k5MotorButton, mode: 'motor' },
            { el: this.k5RemoteButton, mode: 'remote' },
            { el: this.k5ChargerButton, mode: 'charger' },
            { el: this.k5CordButton, mode: 'cord' }
        ];
        
        const isAnyK5ModeActive = k5ActiveMode !== null;
        k5Buttons.forEach(({ el, mode }) => {
            if (el) {
                const isActive = k5ActiveMode === mode;
                el.classList.toggle('active', isActive);
                el.disabled = isAnyK5ModeActive && !isActive;
            }
        });

        const formatPrice = (price) => (typeof price === 'number') ? `$${price.toFixed(2)}` : '';
        if (this.k5WinderDisplay) this.k5WinderDisplay.value = formatPrice(k5WinderTotalPrice);
        if (this.k5MotorDisplay) this.k5MotorDisplay.value = formatPrice(k5MotorTotalPrice);
        if (this.k5RemoteDisplay) this.k5RemoteDisplay.value = formatPrice(k5RemoteTotalPrice);
        if (this.k5ChargerDisplay) this.k5ChargerDisplay.value = formatPrice(k5ChargerTotalPrice);
        if (this.k5CordDisplay) this.k5CordDisplay.value = formatPrice(k5CordTotalPrice);

        if (this.k5RemoteCountDisplay) this.k5RemoteCountDisplay.value = k5RemoteCount;
        const remoteBtnsDisabled = k5ActiveMode !== 'remote';
        if (this.k5RemoteAddBtn) this.k5RemoteAddBtn.disabled = remoteBtnsDisabled;
        if (this.k5RemoteSubtractBtn) this.k5RemoteSubtractBtn.disabled = remoteBtnsDisabled;

        if (this.k5ChargerCountDisplay) this.k5ChargerCountDisplay.value = k5ChargerCount;
        const chargerBtnsDisabled = k5ActiveMode !== 'charger';
        if (this.k5ChargerAddBtn) this.k5ChargerAddBtn.disabled = chargerBtnsDisabled;
        if (this.k5ChargerSubtractBtn) this.k5ChargerSubtractBtn.disabled = chargerBtnsDisabled;

        if (this.k5CordCountDisplay) this.k5CordCountDisplay.value = k5CordCount;
        const cordBtnsDisabled = k5ActiveMode !== 'cord';
        if (this.k5CordAddBtn) this.k5CordAddBtn.disabled = cordBtnsDisabled;
        if (this.k5CordSubtractBtn) this.k5CordSubtractBtn.disabled = cordBtnsDisabled;

        // [NEW] Render K5 Grand Total
        if (this.k5TotalDisplay) {
            this.k5TotalDisplay.value = formatPrice(k5GrandTotal);
        }
    }
}