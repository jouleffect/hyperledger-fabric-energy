'use strict';

const State = require('./../ledger-api/state.js');

const cpState = {
    EROGATA: 1,
    INTERROTTA: 2
};

class Energy extends State {

    constructor(obj) {
        super(Energy.getClass(), [obj.potenza, obj.energyNumber]);
        Object.assign(this, obj);
    }
    
    setErogata() {
        this.currentState = cpState.EROGATA;
    }

    setInterrotta() {
        this.currentState = cpState.INTERROTTA;
    }

    
    isErogata() {
        return this.currentState === cpState.EROGATA;
    }

    isInterrotta() {
        return this.currentState === cpState.INTERROTTA;
    }
   

    static fromBuffer(buffer) {
        return Energy.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**     
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, Energy);
    }

    
    static createInstance(energyNumber, data, potenza) {
        return new Energy({energyNumber, data, potenza });
    }

    static getClass() {
        return 'org.energynet.Energy';
    }
}

module.exports = Energy;
