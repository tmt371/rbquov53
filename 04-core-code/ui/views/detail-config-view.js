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
        // Sub-views are injected here
        k1LocationView,
        k2FabricView,
        k3OptionsView,
        k4AccessoriesView,
        k5AccessoriesView
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
        this.k4View = k4AccessoriesView;
        this.k5View = k5AccessoriesView;

        console.log("DetailConfigView Refactored as a Manager View.");
    }

    // --- Event Handlers that need to delegate to sub-views ---

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
                this.k4View.activate();
                break;
            case 'k5-tab':
                this.k5View.activate();
                break;
            default:
                break;
        }
        this.publish();
    }
    
    handleFocusModeRequest({ column }) {
        if (column === 'location') {
            this.k1View.handleFocusModeRequest();
            return;
        }
        if (column === 'fabric') {
            this.k2View.handleFocusModeRequest();
            return;
        }
    }
    
    handleLocationInputEnter({ value }) {
        this.k1View.handleLocationInputEnter({ value });
    }

    handlePanelInputBlur({ type, field, value }) {
        this.k2View.handlePanelInputBlur({ type, field, value });
    }

    handlePanelInputEnter() {
        this.k2View.handlePanelInputEnter();
    }

    handleSequenceCellClick({ rowIndex }) {
        const { activeEditMode } = this.uiService.getState();
        if (activeEditMode === 'K2_LF_SELECT' || activeEditMode === 'K2_LF_DELETE_SELECT') {
            this.k2View.handleSequenceCellClick({ rowIndex });
        }
    }

    handleLFEditRequest() {
        this.k2View.handleLFEditRequest();
    }

    handleLFDeleteRequest() {
        this.k2View.handleLFDeleteRequest();
    }
    
    handleToggleK3EditMode() {
        this.k3View.handleToggleK3EditMode();
    }

    handleBatchCycle({ column }) {
        this.k3View.handleBatchCycle({ column });
    }

    handleK4ModeChange({ mode }) {
        this.k4View.handleK4ModeChange({ mode });
    }

    handleK4ChainEnterPressed({ value }) {
        this.k4View.handleK4ChainEnterPressed({ value });
    }

    handleK5ModeChange({ mode }) {
        this.k5View.handleK5ModeChange({ mode });
    }

    handleK5CounterChanged({ accessory, direction }) {
        this.k5View.handleK5CounterChanged({ accessory, direction });
    }

    handleTableCellClick({ rowIndex, column }) {
        const { activeEditMode, k4ActiveMode, k5ActiveMode } = this.uiService.getState();
        
        if (k5ActiveMode) {
            this.k5View.handleTableCellClick({ rowIndex, column });
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
            this.k4View.handleTableCellClick({ rowIndex, column });
            return;
        }
    }
    
    initializePanelState() {
        this.k2View._updatePanelInputsState();
    }
}