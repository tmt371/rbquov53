// File: 04-core-code/ui/views/detail-config-view.js

/**
 * @fileoverview A "Manager" view that delegates logic to specific sub-views for each tab.
 */
export class DetailConfigView {
    constructor({ 
        quoteService, 
        uiService, 
        calculationService, 
        eventAggregator, 
        publishStateChangeCallback,
        // Injected views with semantic names
        dualChainView,
        driveAccessoriesView,
        k1LocationView,
        k2FabricView,
        k3OptionsView,
    }) {
        this.quoteService = quoteService;
        this.uiService = uiService;
        this.calculationService = calculationService;
        this.eventAggregator = eventAggregator;
        this.publish = publishStateChangeCallback;

        // Store instances of sub-views
        this.k1View = k1LocationView;
        this.k2View = k2FabricView;
        this.k3View = k3OptionsView;
        this.dualChainView = dualChainView;
        this.driveAccessoriesView = driveAccessoriesView;

        console.log("DetailConfigView Refactored as a Manager View.");
    }

    _updateK5AccessoriesSum() {
        const state = this.uiService.getState();
        const prices = {
            dual: state.k4DualPrice,
            winder: state.k5WinderTotalPrice,
            motor: state.k5MotorTotalPrice,
            remote: state.k5RemoteTotalPrice,
            charger: state.k5ChargerTotalPrice
        };
        const sum = this.calculationService.calculateAccessoriesSum(prices);
        this.uiService.setAccessoriesSum(sum);
    }

    activateTab(tabId) {
        this.uiService.setActiveTab(tabId);

        switch (tabId) {
            case 'k1-tab':
                this.k1View.activate();
                break;
            case 'k2-tab':
                this.k2View.activate();
                this.k2View._updatePanelInputsState();
                break;
            case 'k3-tab':
                this.k3View.activate();
                break;
            case 'k4-tab': 
                this.driveAccessoriesView.activate();
                break;
            case 'k5-tab': 
                // First, trigger a silent recalculation of K4 prices to ensure data is fresh
                this.driveAccessoriesView._recalculateAllK5Prices();
                // Then, calculate the sum for the K5 display
                this._updateK5AccessoriesSum();
                // Finally, activate the K5 (dual/chain) view
                this.dualChainView.activate();
                break;
            default:
                break;
        }
        this.publish();
    }
    
    // ... (Event handlers for K1, K2, K3 remain the same) ...

    handleDualChainModeChange({ mode }) {
        this.dualChainView.handleModeChange({ mode });
        // After interaction, recalculate the sum
        this._updateK5AccessoriesSum();
        this.publish();
    }

    handleChainEnterPressed({ value }) {
        this.dualChainView.handleChainEnterPressed({ value });
        // After interaction, recalculate the sum
        this._updateK5AccessoriesSum();
        this.publish();
    }

    handleDriveModeChange({ mode }) {
        this.driveAccessoriesView.handleModeChange({ mode });
    }

    handleAccessoryCounterChange({ accessory, direction }) {
        this.driveAccessoriesView.handleCounterChange({ accessory, direction });
    }

    handleTableCellClick({ rowIndex, column }) {
        const { activeEditMode, k4ActiveMode, k5ActiveMode } = this.uiService.getState();
        
        if (k5ActiveMode) {
            this.driveAccessoriesView.handleTableCellClick({ rowIndex, column });
            return;
        }

        if (activeEditMode === 'K1') {
            this.k1View.handleTableCellClick({ rowIndex });
            return;
        }
        
        if (activeEditMode === 'K3') {
            this.k3View.handleTableCellClick({ rowIndex, column });
            return;
        }

        if (k4ActiveMode) {
            this.dualChainView.handleTableCellClick({ rowIndex, column });
            // After interaction, recalculate the sum
            this._updateK5AccessoriesSum();
            this.publish();
            return;
        }
    }
}