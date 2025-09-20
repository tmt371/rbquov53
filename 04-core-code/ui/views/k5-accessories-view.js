// File: 04-core-code/ui/views/k5-accessories-view.js

/**
 * @fileoverview A dedicated sub-view for handling all logic related to the K5 (Accessories) tab.
 */
export class K5AccessoriesView {
    constructor({ quoteService, uiService, calculationService, eventAggregator, publishStateChangeCallback }) {
        this.quoteService = quoteService;
        this.uiService = uiService;
        this.calculationService = calculationService;
        this.eventAggregator = eventAggregator;
        this.publish = publishStateChangeCallback;
        console.log("K5AccessoriesView Initialized.");
    }

    activate() {
        this.uiService.setVisibleColumns(['sequence', 'fabricTypeDisplay', 'location', 'winder', 'motor']);
    }

    handleK5ModeChange({ mode }) {
        const currentMode = this.uiService.getState().k5ActiveMode;
        const newMode = currentMode === mode ? null : mode;

        // --- Logic on EXITING a mode ---
        if (currentMode) {
            this._calculateAndStore(currentMode);
        }

        this.uiService.setK5ActiveMode(newMode);

        // --- Logic on ENTERING a new mode ---
        if (newMode) {
            const message = this._getHintMessage(newMode);
            this.eventAggregator.publish('showNotification', { message });

            // Special logic for auto-setting counts
            const items = this.quoteService.getItems();
            const hasMotor = items.some(item => !!item.motor);
            if (hasMotor) {
                if (newMode === 'remote' && this.uiService.getState().k5RemoteCount === 0) {
                    this.uiService.setK5Count('remote', 1);
                }
                if (newMode === 'charger' && this.uiService.getState().k5ChargerCount === 0) {
                    this.uiService.setK5Count('charger', 1);
                }
            }
        }

        this.publish();
    }

    handleTableCellClick({ rowIndex, column }) {
        const { k5ActiveMode } = this.uiService.getState();
        if (!k5ActiveMode || (column !== 'winder' && column !== 'motor')) return;

        const item = this.quoteService.getItems()[rowIndex];
        if (!item) return;

        const isActivatingWinder = k5ActiveMode === 'winder' && column === 'winder';
        const isActivatingMotor = k5ActiveMode === 'motor' && column === 'motor';

        if (isActivatingWinder) {
            if (item.motor) {
                this.eventAggregator.publish('showConfirmationDialog', {
                    message: '該捲簾已經設定為電動，確定要改為HD？',
                    buttons: [
                        { text: '確定', callback: () => this._toggleWinder(rowIndex, true) },
                        { text: '取消', className: 'secondary', callback: () => {} }
                    ]
                });
            } else {
                this._toggleWinder(rowIndex, false);
            }
        } else if (isActivatingMotor) {
            if (item.winder) {
                this.eventAggregator.publish('showConfirmationDialog', {
                    message: '該捲簾已經設定為HD，確定要改為電動？',
                    buttons: [
                        { text: '確定', callback: () => this._toggleMotor(rowIndex, true) },
                        { text: '取消', className: 'secondary', callback: () => {} }
                    ]
                });
            } else {
                this._toggleMotor(rowIndex, false);
            }
        }
    }
    
    handleK5CounterChanged({ accessory, direction }) {
        const state = this.uiService.getState();
        const counts = {
            remote: state.k5RemoteCount,
            charger: state.k5ChargerCount,
            cord: state.k5CordCount
        };
        let currentCount = counts[accessory];
        const newCount = direction === 'add' ? currentCount + 1 : Math.max(0, currentCount - 1);

        // Special logic for reducing to zero
        if (newCount === 0) {
            const items = this.quoteService.getItems();
            const hasMotor = items.some(item => !!item.motor);
            if (hasMotor && (accessory === 'remote' || accessory === 'charger')) {
                const accessoryName = accessory === 'remote' ? '遙控器' : '充電器';
                this.eventAggregator.publish('showConfirmationDialog', {
                    message: `系統偵測到有電動馬達，確定不要${accessoryName}？`,
                    buttons: [
                        { text: '確定不要', callback: () => {
                            this.uiService.setK5Count(accessory, 0);
                            this.publish();
                        }},
                        { text: '取消', className: 'secondary', callback: () => {} }
                    ]
                });
                return; // Prevent update until user confirms
            }
        }
        
        this.uiService.setK5Count(accessory, newCount);
        this.publish();
    }

    _toggleWinder(rowIndex, isConfirmed) {
        const item = this.quoteService.getItems()[rowIndex];
        const newValue = item.winder ? '' : 'HD';
        this.quoteService.updateWinderMotorProperty(rowIndex, 'winder', newValue);
        this.publish();
    }

    _toggleMotor(rowIndex, isConfirmed) {
        const item = this.quoteService.getItems()[rowIndex];
        const newValue = item.motor ? '' : 'Motor';
        this.quoteService.updateWinderMotorProperty(rowIndex, 'motor', newValue);
        this.publish();
    }
    
    _calculateAndStore(mode) {
        const items = this.quoteService.getItems();
        const state = this.uiService.getState();
        let price = 0;
        let count = 0;

        switch(mode) {
            case 'winder':
                price = this.calculationService.calculateWinderPrice(items);
                count = items.filter(item => item.winder === 'HD').length;
                this.uiService.setK5TotalPrice('winder', price);
                this.quoteService.updateAccessorySummary({ winder: { count, price } });
                break;
            case 'motor':
                price = this.calculationService.calculateMotorPrice(items);
                count = items.filter(item => !!item.motor).length;
                this.uiService.setK5TotalPrice('motor', price);
                this.quoteService.updateAccessorySummary({ motor: { count, price } });
                break;
            case 'remote':
                count = state.k5RemoteCount;
                price = this.calculationService.calculateRemotePrice(count);
                this.uiService.setK5TotalPrice('remote', price);
                this.quoteService.updateAccessorySummary({ remote: { type: 'standard', count, price } });
                break;
            case 'charger':
                count = state.k5ChargerCount;
                price = this.calculationService.calculateChargerPrice(count);
                this.uiService.setK5TotalPrice('charger', price);
                this.quoteService.updateAccessorySummary({ charger: { count, price } });
                break;
            case 'cord':
                count = state.k5CordCount;
                price = this.calculationService.calculateCordPrice(count);
                this.uiService.setK5TotalPrice('cord', price);
                this.quoteService.updateAccessorySummary({ cord3m: { count, price } });
                break;
        }
    }

    _getHintMessage(mode) {
        const hints = {
            winder: '請點擊第二表 Winder 欄位下的儲存格以設定 HD。',
            motor: '請點擊第二表 Motor 欄位下的儲存格以設定 Motor。',
            remote: '請點擊 + 或 - 來增加或減少遙控器的數量。',
            charger: '請點擊 + 或 - 來增加或減少充電器的數量。',
            cord: '請點擊 + 或 - 來增加或減少延長線的數量。'
        };
        return hints[mode] || '請進行您的設定。';
    }
}