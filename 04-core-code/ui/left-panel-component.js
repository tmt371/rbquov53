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
        
        // K4 Panel (Drive & Accessories)
        // Note: These elements are now visually in the K4 tab
        this.k5WinderDisplay = document.getElementById('k5-display-winder');
        this.k5MotorDisplay = document.getElementById('k5-display-motor');
        this.k5RemoteDisplay = document.getElementById('k5-display-remote');
        this.k5ChargerDisplay = document.getElementById('k5-display-charger');
        this.k5CordDisplay = document.getElementById('k5-display-cord');

        // K5 Panel (New Layout)
        this.k5DualTotalDisplay = document.getElementById('k4-dual-price-display'); // Note: ID is from old K4
        this.k5ChainLengthDisplay = document.getElementById('k4-input-display'); // Note: ID is from old K4
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
            'k1-tab': 'var(--k1-bg-color)',
            'k2-tab': 'var(--k2-bg-color)',
            'k3-tab': 'var(--k3-bg-color)',
            'k4-tab': 'var(--k5-bg-color)', // Swapped color
            'k5-tab': 'var(--k4-bg-color)', // Swapped color
        };
        this.panelElement.style.backgroundColor = panelBgColors[activeTabId] || 'var(--k1-bg-color)';
    }

    _updatePanelButtonStates(uiState, quoteData) {
        const { 
            activeEditMode, locationInputValue, lfModifiedRowIndexes, 
            k4ActiveMode, k4DualPrice, targetCell, chainInputValue,
            k5WinderTotalPrice, k5MotorTotalPrice, k5RemoteTotalPrice, k5ChargerTotalPrice,
            accessoriesSum
        } = uiState;
        const { rollerBlindItems } = quoteData;

        // Helper to format price strings
        const formatPrice = (price) => (typeof price === 'number') ? `$${price.toFixed(2)}` : '';

        // --- K1-K3 (No Changes) ---
        // (Code for K1-K3 remains the same)

        // --- K4 Panel (Now Drive/Accessories) ---
        // This section renders the totals in the K4 tab's display boxes
        if (this.k5WinderDisplay) this.k5WinderDisplay.value = formatPrice(k5WinderTotalPrice);
        if (this.k5MotorDisplay) this.k5MotorDisplay.value = formatPrice(k5MotorTotalPrice);
        if (this.k5RemoteDisplay) this.k5RemoteDisplay.value = formatPrice(k5RemoteTotalPrice);
        if (this.k5ChargerDisplay) this.k5ChargerDisplay.value = formatPrice(k5ChargerTotalPrice);

        // --- K5 Panel (New Summary Layout) ---
        // This section renders the read-only values and the final sum in the K5 tab
        if (this.k5DualTotalDisplay) {
            // This element's value is just the price, not a complex object
            this.k5DualTotalDisplay.value = formatPrice(k4DualPrice);
        }
        if (this.k5ChainLengthDisplay) {
             // For chain, we show the input value during edit, or the stored value
            const activeItem = (k4ActiveMode === 'chain' && targetCell) ? rollerBlindItems[targetCell.rowIndex] : null;
            this.k5ChainLengthDisplay.value = (activeItem) ? chainInputValue : '';
             this.k5ChainLengthDisplay.placeholder = (k4ActiveMode === 'chain') ? 'Length...' : '';
        }

        // Render the read-only totals fetched from K4's state
        if (this.k5WinderReadonlyDisplay) this.k5WinderReadonlyDisplay.value = formatPrice(k5WinderTotalPrice);
        if (this.k5MotorReadonlyDisplay) this.k5MotorReadonlyDisplay.value = formatPrice(k5MotorTotalPrice);
        if (this.k5RemoteReadonlyDisplay) this.k5RemoteReadonlyDisplay.value = formatPrice(k5RemoteTotalPrice);
        if (this.k5ChargerReadonlyDisplay) this.k5ChargerReadonlyDisplay.value = formatPrice(k5ChargerTotalPrice);
        
        // Render the final accessories sum
        if (this.accessoriesSumDisplay) {
            this.accessoriesSumDisplay.value = formatPrice(accessoriesSum);
        }
    }
}