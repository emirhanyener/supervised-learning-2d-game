const learning_rate = 0.8;

function activation_function(value){
    //return (1 / (1 + Math.exp(value * (-1))));
    //return Math.tanh(value);
    return value >= 0 ? 1 : -1;
}

class Neuron{
    constructor(){
        this.value = 0;
        this.weights = [];
        this.bias = 0;
    }

    random(weight_num){
        for(let i = 0; i < weight_num; i++){
            this.weights[i] = (Math.random() * 2 - 1) / 10;
        }
    }
}

class Layer{
    constructor(id){
        this.id = id;
        this.neurons = [];
    }

    add_neuron(neuron_num, weight_num){
        for(let i = 0; i < neuron_num; i++){
            let neuron = new Neuron();
            neuron.random(weight_num);
            this.neurons[i] = neuron;
        }
    }
}

class Network{
    constructor(){
        this.layers = [];
    }

    add_layer(values){
        for(let i = 0; i < values.length; i++){
            this.layers[i] = new Layer(i);
            if(i == 0)
                this.layers[i].add_neuron(values[i], 0);

            for(let j = 0; j < values[i]; j++){
                this.layers[i].add_neuron(values[i], values[i - 1]);
            }
        }
    }

    calculate(values){
        for(let i = 0; i < values.length; i++){
            this.layers[0].neurons[i].value = values[i];
        }
        let sum = 0;
        for(let n = 1; n < this.layers.length; n++){
            for(let i = 0; i < this.layers[n].neurons.length; i++){
                sum = 0;
                for(let j = 0; j < this.layers[n - 1].neurons.length; j++){
                    sum += this.layers[n - 1].neurons[j].value * this.layers[n].neurons[i].weights[j];
                }
                sum += this.layers[n].neurons[i].bias;
                this.layers[n].neurons[i].value = activation_function(sum);
            }
        }
    }

    next(values){
        for(let i = 0; i < values.length; i++){
            this.layers[0].neurons[i].value = values[i];
        }
        let target = [activation_function(values[0] - values[2]), activation_function(values[1] - values[3])];
        for(let n = 1; n < this.layers.length - 2; n++){
            for(let i = 0; i < this.layers[n].neurons.length; i++){
                for(let j = 0; j < this.layers[n].neurons[i].weights.length; j++){
                    if(this.layers[this.layers.length - 1].neurons[i].value != target[i])
                        this.layers[n].neurons[i].weights[j] += learning_rate * targets[i % 2];
                }
            }
        }
    }
}