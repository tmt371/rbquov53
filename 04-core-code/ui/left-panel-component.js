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

        // --- DOM Element References ---
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
        
        // K4 Panel (Drive & Accessories) - Uses old K5 IDs
        this.k4WinderButton = document.getElementById('btn-k5-winder');
        this.k4MotorButton = document.getElementById('btn-k5-motor');
        this.k4RemoteButton = document.getElementById('btn-k5-remote');
        this.k4ChargerButton = document.getElementById('btn-k5-charger');
        this.k4CordButton = document.getElementById('btn-k5-3m-cord');
        this.k4WinderDisplay = document.getElementById('k5-display-winder');
        this.k4MotorDisplay = document.getElementById('k5-display-motor');
        this.k4RemoteDisplay = document.getElementById('k5-display-remote');
        this.k4ChargerDisplay = document.getElementById('k5-display-charger');
        this.k4CordDisplay = document.getElementById('k5-display-cord');
        this.k4RemoteAddBtn = document.getElementById('btn-k5-remote-add');
        this.k4RemoteSubtractBtn = document.getElementById('btn-k5-remote-subtract');
        this.k4RemoteCountDisplay = document.getElementById('k5-display-remote-count');
        this.k4ChargerAddBtn = document.getElementById('btn-k5-charger-add');
        this.k4ChargerSubtractBtn = document.getElementById('btn-k5-charger-subtract');
        this.k4ChargerCountDisplay = document.getElementById('k5-display-charger-count');
        this.k4CordAddBtn = document.getElementById('btn-k5-cord-add');
        this.k4CordSubtractBtn = document.getElementById('btn-k5-cord-subtract');
        this.k4CordCountDisplay = document.getElementById('k5-display-cord-count');
        this.k4TotalDisplay = document.getElementById('k5-display-total');

        // K5 Panel (Summary / Dual / Chain) - Uses old K4 IDs and new IDs
        this.k5DualButton = document.getElementById('btn-k4-dual');
        this.k5ChainButton = document.getElementById('btn-k4-chain');
        this.k5DualTotalDisplay = document.getElementById('k4-dual-price-display');
        this.k5ChainLengthDisplay = document.getElementById('k4-input-display');
        this.k5WinderReadonlyDisplay = document.getElementById('k5-winder-readonly-display');
        this.k5MotorReadonlyDisplay = document.getElementById('k5-motor-readonly-display');
        this.k5RemoteReadonlyDisplay = document.getElementById('k5-remote-readonly-display');
        this.k5ChargerReadonlyDisplay = document.getElementById('k5-charger-readonly-display');
        this.accessoriesSumDisplay = document.getElementById('accessories-sum-display');

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
            button.disabled = isInEditMode && !isThisButtonActive;
        });

        this.tabContents.forEach(content => {
            const isThisContentActive = activeContentTarget && `#${content.id}` === activeContentTarget;
            content.classList.toggle('active', isThisContentActive);
        });
        
        const panelBgColors = {
            'k1-tab': 'var(--k1-bg-color)', 'k2-tab': 'var(--k2-bg-color)',
            'k3-tab': 'var(--k3-bg-color)', 'k4-tab': 'var(--k5-bg-color)',
            'k5-tab': 'var(--k4-bg-color)',
        };
        this.panelElement.style.backgroundColor = panelBgColors[activeTabId] || 'var(--k1-bg-color)';
    }

    _updatePanelButtonStates(uiState, quoteData) {
        const { 
            activeEditMode, locationInputValue, lfModifiedRowIndexes, 
            k4ActiveMode, k4DualPrice, targetCell, chainInputValue,
            k5ActiveMode, k5RemoteCount, k5ChargerCount, k5CordCount,
            k5WinderTotalPrice, k5MotorTotalPrice, k5RemoteTotalPrice, k5ChargerTotalPrice, k5CordTotalPrice,
            k5GrandTotal, accessoriesSum
        } = uiState;
        const { rollerBlindItems } = quoteData;
        const formatPrice = (price) => (typeof price === 'number') ? `$${price.toFixed(2)}` : '';

        // --- K1 Location Input State ---
        if (this.locationButton) this.locationButton.classList.toggle('active', activeEditMode === 'K1');
        if (this.locationInput) {
            const isLocationActive = activeEditMode === 'K1';
            this.locationInput.disabled = !isLocationActive;
            this.locationInput.classList.toggle('active', isLocationActive);
            if (this.locationInput.value !== locationInputValue) this.locationInput.value = locationInputValue;
        }
        
        // --- K2 Button Active/Disabled States ---
        const isFCMode = activeEditMode === 'K2';
        const isLFSelectMode = activeEditMode === 'K2_LF_SELECT';
        const isLFDeleteMode = activeEditMode === 'K2_LF_DELETE_SELECT';
        const isAnyK2ModeActive = isFCMode || isLFSelectMode || isLFDeleteMode;
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

        // --- K4 Panel (Drive & Accessories) Rendering ---
        const k4Buttons = [
            { el: this.k4WinderButton, mode: 'winder' }, { el: this.k4MotorButton, mode: 'motor' },
            { el: this.k4RemoteButton, mode: 'remote' }, { el: this.k4ChargerButton, mode: 'charger' },
            { el: this.k4CordButton, mode: 'cord' }
        ];
        const isAnyK4ModeActive = k5ActiveMode !== null;
        k4Buttons.forEach(({ el, mode }) => {
            if (el) {
                const isActive = k5ActiveMode === mode;
                el.classList.toggle('active', isActive);
                el.disabled = isAnyK4ModeActive && !isActive;
            }
        });
        if (this.k4WinderDisplay) this.k4WinderDisplay.value = formatPrice(k5WinderTotalPrice);
        if (this.k4MotorDisplay) this.k4MotorDisplay.value = formatPrice(k5MotorTotalPrice);
        if (this.k4RemoteDisplay) this.k4RemoteDisplay.value = formatPrice(k5RemoteTotalPrice);
        if (this.k4ChargerDisplay) this.k4ChargerDisplay.value = formatPrice(k5ChargerTotalPrice);
        if (this.k4CordDisplay) this.k4CordDisplay.value = formatPrice(k5CordTotalPrice);
        if (this.k4RemoteCountDisplay) this.k4RemoteCountDisplay.value = k5RemoteCount;
        if (this.k4RemoteAddBtn) this.k4RemoteAddBtn.disabled = k5ActiveMode !== 'remote';
        if (this.k4RemoteSubtractBtn) this.k4RemoteSubtractBtn.disabled = k5ActiveMode !== 'remote';
        if (this.k4ChargerCountDisplay) this.k4ChargerCountDisplay.value = k5ChargerCount;
        if (this.k4ChargerAddBtn) this.k4ChargerAddBtn.disabled = k5ActiveMode !== 'charger';
        if (this.k4ChargerSubtractBtn) this.k4ChargerSubtractBtn.disabled = k5ActiveMode !== 'charger';
        if (this.k4CordCountDisplay) this.k4CordCountDisplay.value = k5CordCount;
        if (this.k4CordAddBtn) this.k4CordAddBtn.disabled = k5ActiveMode !== 'cord';
        if (this.k4CordSubtractBtn) this.k4CordSubtractBtn.disabled = k5ActiveMode !== 'cord';
        if (this.k4TotalDisplay) this.k4TotalDisplay.value = formatPrice(k5GrandTotal);

        // --- K5 Panel (Summary / Dual / Chain) Rendering ---
        const isAnyK5ModeActive = k4ActiveMode !== null;
        if (this.k5DualButton) {
            this.k5DualButton.classList.toggle('active', k4ActiveMode === 'dual');
            this.k5DualButton.disabled = isAnyK5ModeActive && k4ActiveMode !== 'dual';
        }
        if (this.k5ChainButton) {
            this.k5ChainButton.classList.toggle('active', k4ActiveMode === 'chain');
            this.k5ChainButton.disabled = isAnyK5ModeActive && k4ActiveMode !== 'chain';
        }
        if (this.k5DualTotalDisplay) this.k5DualTotalDisplay.textContent = formatPrice(k4DualPrice);
        if (this.k5ChainLengthDisplay) {
            const isChainInputActive = k4ActiveMode === 'chain' && targetCell && targetCell.column === 'chain';
            this.k5ChainLengthDisplay.classList.toggle('active', isChainInputActive);
            this.k5ChainLengthDisplay.value = isChainInputActive ? chainInputValue : '';
        }
        if (this.k5WinderReadonlyDisplay) this.k5WinderReadonlyDisplay.value = formatPrice(k5WinderTotalPrice);
        if (this.k5MotorReadonlyDisplay) this.k5MotorReadonlyDisplay.value = formatPrice(k5MotorTotalPrice);
        if (this.k5RemoteReadonlyDisplay) this.k5RemoteReadonlyDisplay.value = formatPrice(k5RemoteTotalPrice);
        if (this.k5ChargerReadonlyDisplay) this.k5ChargerReadonlyDisplay.value = formatPrice(k5ChargerTotalPrice);
        if (this.accessoriesSumDisplay) this.accessoriesSumDisplay.value = formatPrice(accessoriesSum);
    }
}