const LEARNING_RATE = 0.3;
const MOMENTUM = 0.1;

//hyperbolic tangent activation function
function activation_function(value){
    return Math.tanh(value); 
}

//activation function derivative
function deactivation_funtion(value){
    return (1 - Math.pow(value, 2)); //1 - tanh ^ 2
}

//single neuron class struct
class Neuron{
    constructor(){
        this.value = 0;
        this.weights = [];
        this.change = [];
    }

    //init neuron
    init(weight_num){
        for(let i = 0; i < weight_num; i++){
            this.weights[i] = (Math.random() * 2 - 1) / 10;
        }
        for(let i = 0; i < weight_num; i++){
            this.change[i] = 0;
        }
    }
}

//neurons class struct
class Layer{
    constructor(id){
        this.id = id;
        this.neurons = [];
    }

    //add new neuron
    add_neuron(neuron_num, weight_num){
        for(let i = 0; i < neuron_num; i++){
            let neuron = new Neuron();
            neuron.init(weight_num);
            this.neurons[i] = neuron;
        }
    }
}

//layers class struct
class Network{
    constructor(){
        this.layers = [];
    }

    //add new layer
    add_layer(values){
        for(let i = 0; i < values.length; i++){
            this.layers[i] = new Layer(i);
            if(i == 0){
                this.layers[i].add_neuron(values[i], 0);
            }

            for(let j = 0; j < values[i]; j++){
                this.layers[i].add_neuron(values[i], values[i - 1]);
            }
        }
    }

    //calculate neurons and weights 
    calculate(inputs){
        for(let i = 0; i < inputs.length; i++){
            this.layers[0].neurons[i].value = inputs[i];
        }
        let sum = 0;
        for(let n = 1; n < this.layers.length; n++){
            for(let i = 0; i < this.layers[n].neurons.length; i++){
                sum = 0;
                for(let j = 0; j < this.layers[n - 1].neurons.length; j++){
                    sum += this.layers[n - 1].neurons[j].value * this.layers[n].neurons[i].weights[j];
                }
                this.layers[n].neurons[i].value = activation_function(sum);
            }
        }
    }

    //backpropagation
    next(){
        let targets = [activation_function(this.layers[0].neurons[1].value - this.layers[0].neurons[0].value), activation_function(this.layers[0].neurons[3].value - this.layers[0].neurons[2].value)];
        let deltas = [];
        let error = 0;

        for(let i = 0; i < this.layers.length - 1; i++){
            deltas.push([]);
        }

        for(let n = 0; n < this.layers[this.layers.length - 1].neurons.length; n++){
            deltas[deltas.length - 1].push(deactivation_funtion(this.layers[this.layers.length - 1].neurons[n].value) * (targets[n] - this.layers[this.layers.length - 1].neurons[n].value));
        }
        
        for(let l = this.layers.length - 2; l > 0; l--){
            for(let n = 0; n < this.layers[l].neurons.length; n++){
                error = 0;
                for(let j = 0; j < this.layers[l + 1].neurons.length; j++){
                    error += deltas[l][j] * this.layers[l + 1].neurons[j].weights[n];
                }
                deltas[l - 1].push(deactivation_funtion(this.layers[l].neurons[n].value) * error);
            }
        }

        for(let l = this.layers.length - 1; l > 0; l--){
            for(let n = 0; n < this.layers[l].neurons.length; n++){
                for(let w = 0; w < this.layers[l].neurons[n].weights.length; w++){
                    let change = deltas[l - 1][n] * this.layers[l - 1].neurons[w].value;
                    this.layers[l].neurons[n].weights[w] += LEARNING_RATE * change + MOMENTUM * this.layers[l].neurons[n].change[w];
                    this.layers[l].neurons[n].change[w] = change;
                }
            }
        }
    }
}