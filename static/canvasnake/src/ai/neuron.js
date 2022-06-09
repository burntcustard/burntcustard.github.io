
import * as func from './functions.js';


export function Neuron(weights, genomeLocation, activFunc = func.softsign) {
    this.weights = weights;  // E.g. [0.5, 0.4, -0.3]
    this.genomeLocation = genomeLocation;
    this.inputs = new Float32Array(Math.max(1, weights.length - 1));
    this.activationFunction = activFunc;
    this.output = null;
    this.maxOutput = null;
    this.maxOutputPos = 0;
    this.maxOutputNeg = 0;
    this.maxOutputRng = 0;
    this.avgOutput = 0;
}

Neuron.prototype.activate = function(inputs) {

    let netInput = 0;
    this.inputs.set(inputs);

    if (this.inputs.length > 1) {
        for (let i = 1; i < this.weights.length; i++) {
            netInput += this.weights[i] * this.inputs[i-1];
        }
        // Add bias:
        netInput += this.weights[0];
    } else {
        netInput = this.inputs[0];
    }

    //neuron.outputPreAct = Math.round(netInput * 1e2) / 1e2;
    if (this.activationFunction) {
        netInput = this.activationFunction(netInput);
    }

    // this.output is just set for viewing, the return value is actually used:
    this.output = Math.round(netInput * 1e2) / 1e2;
    if (Math.abs(this.output) > Math.abs(this.maxOutput)) {
        this.maxOutput = Math.round(netInput * 1e2) / 1e2;
    }
    if (this.output > this.maxOutputPos) {
        this.maxOutputPos = this.output;
    }
    if (this.output < this.maxOutputNeg) {
        this.maxOutputNeg = this.output;
    }
    if (this.maxOutputPos - this.maxOutputNeg > this.maxOutputRng) {
        this.maxOutputRng = this.maxOutputPos - this.maxOutputNeg;
    }
    this.avgOutput += this.output;
    this.avgOutput = Math.round(this.avgOutput * 1e2) / 1e2;

    return netInput;
};
